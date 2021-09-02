---
title: Redmine チケットと注記データをデータベースに直接インポートする
date: 2017-04-18
author: kenzauros
tags: [Redmine, CentOS, PostgreSQL, Web]
---

弊社では一部の社内サービスに **Redmine** を利用していますが、つい先日ストレージ障害でサーバーの再構築を余儀なくされ、前回のバックアップ以降のデータが欠如した状態に陥りました。

ということで、メールや Slack の通知に残るチケットや注記の断片をピックアップして、再度インポートするという少々面倒な作業を行うことになりました。

## チケット復元方法の検討

チケットの挿入方法としては下記の 3 つの方法が考えられます。

1. [CSV インポート](http://blog.redmine.jp/articles/3_2/csv-import/)
1. [REST API による登録](http://blog.redmine.jp/articles/redmine-ticket-ikkatsu/)
1. データベースに直接登録

1 は Redmine の標準機能です。 2 は自前でツールを作るか、 [Redmineチケット★一括★](http://www.vector.co.jp/soft/winnt/util/se503347.html) のようなソフトを利用することになります。

これらはいずれも元々 Redmine に内蔵されている機能なので安心感はあります。ただ、チケット自体は作成できても、注記を追加することができないため、今回の目的には沿いませんでした。

また、チケットの番号も従来と同じに戻したいので、結局のところ、データベースに直接挿入するのが楽だと判断しました。

今回はサーバーのタイムスタンプが古い状態で、それ以後に追加されたチケットや注記のデータをデータベースに直接挿入する方法をまとめておきます。

## データベースに外部からログインできるように設定

Redmine のデータベースは **PostgreSQL** でした。素直に `psql` で操作してもいいのですが、いろいろ見ながらデータを操作することを考えるとクライアントツールから接続できたほうが便利です。

PostgresSQL は初期設定で外部ホストからの接続を受け付けませんので、まずそれを設定変更します。

ちなみに今回のサーバーは **CentOS 7** です。

### postgresql.conf の編集

まず、外部向けの TCP ポートでリッスンするように設定します。

設定ファイル `postgresql.conf` を開きます。

```
# vi /var/lib/pgsql/data/postgresql.conf
```

`listen_addresses` と `port` のコメントアウトを解除して、下記のように設定します。

```
listen_addresses = '*'
port = 5432
```

### pg_hba.conf の編集

`pg_hba.conf` を編集して、外部ホストからの接続を受け付けるようにします。

```
# vi /var/lib/pgsql/data/pg_hba.conf
```

次の 1 行を最終行に追加します。

```
host all all 192.168.1.0/24 trust
```

`192.168.1.0/24` は接続を受け付けるホストのネットワークを指定しますので、適宜修正してください。

この記述でこのネットワークからであれば **すべてのユーザーですべてのデータベースにアクセスできる** ようになります。非常にデンジャラスな設定なので、メンテが終了したら、設定を解除しましょう。

### PostgreSQL の再起動

設定ファイルの編集が終わったら再起動しておきます。

```
# systemctl restart postgresql
```

### ファイアウォールのポート解放

まだこのままでは接続できないので、**ファイアウォールで PostgreSQL のポートを開放**します。

デフォルトでポスグレの設定ファイルが firewalld に含まれているので、 `add-service` で `postgresql` を指定するだけで設定できます。

設定が完了したら firewalld を再起動しておきます。

```
# firewall-cmd --add-service=postgresql --zone=public --permanent
# firewall-cmd --list-services --zone=public --permanent
# systemctl restart firewalld
```

## データベース構造の確認

### とりあえずググる

Redmine の ER 図を書いてくださっている先人の方々がいらっしゃるのですが、細かいことを書いておられる人は少なかったです。

下記の記事は機能ごとにどのようなテーブルにレコードが生成されるかをまとめてあるので、役に立ちました。記事自体は 8 年前と古いですが、構造は変わっていないようなので問題ありません。

* [Redmine の ERD を描いてみました - kiwamu日記](http://d.hatena.ne.jp/kiwamu/20090824/1251123971)

### チケットに関係するテーブル

チケットに関係する主なデータテーブルは下記の通りです。

| テーブル名 | 説明 |
| --------- | ---- |
| issues | チケット |
| journals | チケットの変更記録（注記もここ） |
| journal_details | 変更記録の詳細 |
| attachments | 添付ファイルの情報 |

とりあえず **issues テーブル**が中心になるので、これにレコードを追加して、その id で journals や attachments を追加していくことになります。

## データの追加

### issues テーブル

エクセルなどでデータを作成し、 issues テーブルにデータを挿入します。今回は Excel ファイルからの登録に Navicat Premium を使用しました。

issues テーブルのカラム定義は下記の通りです。トラッカーやプロジェクトなど外部キーになっている ID はそれぞれのテーブルの ID を事前に調べておき、数値で指定しておきます。

| カラム | 説明 |
| ------ | ---- |
| id | チケットID                   |
| tracker_id | トラッカーのID       |
| project_id | プロジェクトID       |
| subject | 題名                     |
| description | 説明                 |
| due_date | 期日                 |
| category_id | カテゴリーID         |
| status_id | ステータスID         |
| assined_to_id | 担当者ID         |
| priority_id | 優先度ID             |
| fixed_version_id | バージョンID |
| author_id | チケット作成者ID     |
| lock_version |                  |
| created_on | 作成日               |
| updated_on | 更新日               |
| start_date | 開始日               |
| done_ratio | 進捗率               |
| estimated_hours | 予定工数         |
| parent_id | 親チケットID         |
| root_id | ルートチケットID         |
| lft |                              |
| rgt |                              |
| is_private | プライベートフラグ   |
| closed_on | 終了日               |

### journals テーブル

注記は journals テーブルの 1 レコードとして登録します。

`notes` に注記内容を記述します。

チケットに対する注記の場合は `journalized_type` は常に `'Issue'` 、 `journalized_id` にチケット ID を指定します。


| カラム | 説明 |
| ------ | ---- |
|id              ||
|journalized_id  |チケットのID|
|journalized_type|記録元のデータ (チケットの場合は `Issue` を指定)|
|user_id         |ユーザーID|
|notes           |注記の内容|
|created_on      |日付|


### テーブルのシーケンスを最新に進める

手動で追加したテーブルについてシーケンスを進めておきます。ただこの手順は必要ないかもしれませんので、不要な場合はスキップしてください。

```
SELECT setval('issues_id_seq'::regclass, 12345);
SELECT setval('journals_id_seq'::regclass, 123456);
```

### 添付ファイル

添付ファイルについては `attachements` テーブルが情報を格納する器ですが、ファイルそのものは files ディレクトリに格納されます。

このため GUI から通常の手順でファイルを添付したあと、 journals からアップロード履歴を消し、 `attachements` のアップロード日時を変更する、という方法をとりました。

## あとがき

完全な手順ではないですが、 Redmine でトラブった方の助けになれば幸いです。
