---
title: SQL Server 2014 でデータベースミラーリングを構成する
date: 2016-12-31
author: jinna-i
tags: [Windows Server, SQL Server, データベース, Windows]
---

こんにちは、じんないです。

今回はMicrosoft SQL Server 2014 で[データベースミラーリング](https://msdn.microsoft.com/ja-jp/library/ms189852(v=sql.120).aspx)を構成する手順を紹介します。

最近ではSQL Serverの可用性を高める方法として、[AlwaysOn可用性グループ](https://msdn.microsoft.com/ja-jp/library/hh510230(v=sql.120).aspx)や[AlwaysOnフェールオーバークラスターインスタンス(FCI)](https://msdn.microsoft.com/ja-jp/library/ms189134(v=sql.120).aspx)などが主流かと思います。

しかしながら、Enterpriseライセンスが必要であったり、共有ストレージが必要だったりと制限事項が多いのも事実です。

将来的に廃止予定のミラーリングですが、まだまだ出番もあるかと思いますので、ここに記しておきます。

AlwaysOn可用性グループとAlwaysOn FCIについては[こちらで詳しく](http://www.slideshare.net/masayukiozawa/always-on-29859575)紹介されています。

## 想定環境
プリンシパルサーバー、ミラーサーバー、ミラーリング監視サーバーの3台から構成され、自動フェールオーバーができる環境を構築します。
※自動フェールオーバーが不要な場合は、ミラーリング監視サーバーは必要ありません。
また、OSはすべてWindows Server 2012 R2を使用します。

<img src="images/sqlserver-database-mirroring-1.png" alt="" width="753" height="361" class="alignnone size-full wp-image-3476" />

## 前提
* プリンシパルサーバーとミラーサーバーに**SQL Server Standard Edition**以上がインストールされている。
※同じエディションじゃないとだめです。
* ミラーリング監視サーバーに**SQL Server Express Edition**以上がインストールされている。  
* プリンシパルサーバーにミラーリングしたいデータベースが作成されている。
* 全サーバーでリモート接続の設定が完了している。
リモートの設定ができてない場合は、以下を実施してください。
### リモート接続設定(全サーバー)

* **ファイアウォールの例外設定**

以下のポートを開放します。
|種類|プロトコル|ポート|
|:--:|:--:|:--:|
|ポート|TCP|1433|
|ポート|TCP|5022|
|ポート|UDP|1434|

* **サーバーのプロパティを確認**
Microsoft SQL Server Management Studioを起動し、サーバーのプロパティを起動します。
左ペインの「接続」から「このサーバーへのリモート接続を許可する」に**チェックが入っている**ことを確認します。
<img src="images/sqlserver-database-mirroring-2.png" alt="" width="562" height="505" class="alignnone size-full wp-image-3460" />

* **TCP/IPを有効化**
Sql Server Configuration Managerを起動し、「SQL Serverネットワークの構成」>「MSSQLSERVERのプロトコル」より「TCP/IP」が**有効**になっていることを確認します。
**<span style="color:red;">Express Editionはデフォルトが無効になっているので注意してください。</span>**
<img src="images/sqlserver-database-mirroring-3.png" alt="" width="538" height="199" class="alignnone size-full wp-image-3468" />

## データベースのバックアップを取得
**【プリンシパル側で実施】**
### 復旧モデルの確認
ミラーリングには**完全復旧モデル**を使用するデータベースでないといけません。
**単純**や**一括ログ**復旧モデルではミラーリングがサポートされていないので注意が必要です。

対象のデータベースを右クリックし、「プロパティ」を起動。

左ペインの「オプション」をクリックし、復旧モデルを確認。
「完全」以外であれば、変更しておきます。
<img src="images/sqlserver-database-mirroring-4.png" alt="" width="562" height="479" class="alignnone size-full wp-image-3464" />

### バックアップは2つ必要
バックアップには**完全**と**トランザクションログ**の2種類が必要です。

対象のデータベースを右クリックし、「タスク」 > 「バックアップ」の順にクリック。
<img src="images/sqlserver-database-mirroring-5.png" alt="" width="577" height="350" class="alignnone size-full wp-image-3469" />

バックアップの種類で「完全」を選択し、「OK」をクリック。
<img src="images/sqlserver-database-mirroring-6.png" alt="" width="556" height="407" class="alignnone size-full wp-image-3470" />

ダイアログが出るので、「OK」をクリック。
<img src="images/sqlserver-database-mirroring-7.png" alt="" width="495" height="108" class="alignnone size-full wp-image-3473" />

同様の手順で「トランザクションログ」もバックアップを取得します。
このとき、バックアップ先を確認しておきましょう。
<img src="images/sqlserver-database-mirroring-8.png" alt="" width="554" height="405" class="alignnone size-full wp-image-3471" />

確認したディレクトリにバックアップが作成されていることを確認します。
※「完全」と「トランザクションログ」の2つをバックアップしましたが、作成されるファイルは1つです。
<img src="images/sqlserver-database-mirroring-9.png" alt="" width="559" height="418" class="alignnone size-full wp-image-3421" />

このファイルをコピーし、ミラーサーバーの同じディレクトリに格納します。

## バックアップから復元
**【ミラー側で実施】**

左ペインの「データベース」を右クリックし、「データベースの復元」をクリック。
<img src="images/sqlserver-database-mirroring-10.png" alt="" width="618" height="397" class="alignnone size-full wp-image-3424" />

「デバイス」を選択し、右側の「...」をクリック。
<img src="images/sqlserver-database-mirroring-11.png" alt="" width="613" height="504" class="alignnone size-full wp-image-3427" />

「追加」をクリック。
<img src="images/sqlserver-database-mirroring-12.png" alt="" width="507" height="374" class="alignnone size-full wp-image-3428" />

先ほどプリンシパルからコピーしてきたバックアップファイルを選択し、「OK」をクリック。
<img src="images/sqlserver-database-mirroring-13.png" alt="" width="550" height="373" class="alignnone size-full wp-image-3429" />

ちゃんと**完全**と**トランザクションログ**が含まれていることを確認します。
<img src="images/sqlserver-database-mirroring-14.png" alt="" width="571" height="469" class="alignnone size-full wp-image-3430" />

左ペインの「オプション」から復旧状態を**「RESTORE WITH NORECOVERY」**に変更し、「OK」をクリック。
<img src="images/sqlserver-database-mirroring-15.png" alt="" width="567" height="468" class="alignnone size-full wp-image-3432" />

ダイアログがでるので、「OK」をクリック。
<img src="images/sqlserver-database-mirroring-16.png" alt="" width="364" height="171" class="alignnone size-full wp-image-3433" />

復元が完了すると、こんな表示になります。
<img src="images/sqlserver-database-mirroring-17.png" alt="" width="487" height="335" class="alignnone size-full wp-image-3434" />

## ミラーリング設定
**【プリンシパル側で実施】**

対象のデータベースを右クリックし、「タスク」 > 「ミラー」の順にクリック。
<img src="images/sqlserver-database-mirroring-18.png" alt="" width="576" height="410" class="alignnone size-full wp-image-3437" />

「セキュリティの構成」をクリック。
<img src="images/sqlserver-database-mirroring-19.png" alt="" width="557" height="504" class="alignnone size-full wp-image-3438" />

ウィザードが起動します。「次へ」をクリック。
<img src="images/sqlserver-database-mirroring-20.png" alt="" width="500" height="454" class="alignnone size-full wp-image-3439" />

今回はミラーリング監視サーバーも構成するので、「はい」を選択して「次へ」をクリック。
<img src="images/sqlserver-database-mirroring-21.png" alt="" width="500" height="452" class="alignnone size-full wp-image-3440" />

「ミラーリング監視サーバー インスタンス」にチェックが入っていることを確認し、「次へ」をクリック。
<img src="images/sqlserver-database-mirroring-22.png" alt="" width="504" height="452" class="alignnone size-full wp-image-3441" />

「次へ」をクリック。
<img src="images/sqlserver-database-mirroring-23.png" alt="" width="501" height="452" class="alignnone size-full wp-image-3442" />

ミラーサーバーインスタンスを選択。
<img src="images/sqlserver-database-mirroring-24.png" alt="" width="500" height="452" class="alignnone size-full wp-image-3446" />

「接続」をクリック。
<img src="images/sqlserver-database-mirroring-25.png" alt="" width="427" height="300" class="alignnone size-full wp-image-3444" />

「次へ」をクリック。
<img src="images/sqlserver-database-mirroring-26.png" alt="" width="500" height="450" class="alignnone size-full wp-image-3445" />

同様に、ミラーリング監視サーバーインスタンスを選択し、接続できたら「次へ」をクリック。
<img src="images/sqlserver-database-mirroring-27.png" alt="" width="499" height="451" class="alignnone size-full wp-image-3448" />

ここは空白でもOK。「次へ」をクリック。
<img src="images/sqlserver-database-mirroring-28.png" alt="" width="495" height="454" class="alignnone size-full wp-image-3449" />

内容を確認して「完了」をクリック。
<img src="images/sqlserver-database-mirroring-29.png" alt="" width="500" height="451" class="alignnone size-full wp-image-3450" />

エンドポイントの構成に完了したら、「閉じる」をクリック。
<img src="images/sqlserver-database-mirroring-30.png" alt="" width="498" height="452" class="alignnone size-full wp-image-3451" />

ダイアログが表示されるので、「ミラーリングの開始」をクリック。
<img src="images/sqlserver-database-mirroring-31.png" alt="" width="557" height="251" class="alignnone size-full wp-image-3452" />

状態が「同期完了：データベースは完全に同期されています」となればミラーリングは成功。「OK」をクリックして終了します。
※「同期中」となった場合は、しばらくしてから「最新の情報に更新」をクリックしてみてください。
<img src="images/sqlserver-database-mirroring-32.png" alt="" width="556" height="503" class="alignnone size-full wp-image-3453" />

### ミラーリング開始中にエラーが発生した場合 (SQL Server エラー 1418)

ミラーリング中に以下のようなエラーが発生する場合があります。
**データベース <データベース名> のAlterに失敗しました。**
<img src="images/sqlserver-database-mirroring-33.png" alt="" width="621" height="257" class="alignnone size-full wp-image-3500" />

[マイクロソフトのWebページ(MSSQLSERVER_1418)](https://msdn.microsoft.com/ja-jp/library/aa337361.aspx)を見て、ネットワーク系かなと思いファイアウォールを無効にしてみたり、サービスアカウントの権限を変更してみたりしましたが、一向に解決する様子もなく。。。
結局は、**ミラサーバーでバックアップから復元時に「RESTORE WITH <span style="color:red;">NO</span>RECOVERY」を選択し忘れていたことが原因**でした。

**<span style="color:red;">NO</span>**を見逃してはいけません。



## 自動フェールオーバーのテスト
さて、ミラーリング監視サーバーがちゃんと仕事をしているのか、チェックしてみたいと思います。

プリンシパルサーバーを以下のような方法でダウンさせます。

* MSSSQLSERVERのサービスを停止する
* LANケーブルをブチ抜く
* シャットダウンする

ミラーサーバーの状態を更新し、「プリンシパル/接続解除」と出ればOKです。
<img src="images/sqlserver-database-mirroring-34.png" alt="" width="529" height="323" class="alignnone size-full wp-image-3455" />

また、イベントログにも以下のように自動フェールオーバーが行われたと出力されます。
<img src="images/sqlserver-database-mirroring-35.png" alt="" width="545" height="379" class="alignnone size-full wp-image-3456" />

## あとがき
どうでしょう、うまくミラーリングできたでしょうか。
ポイントさえ押さえておけば問題なくミラーリングできるとかと思います。

ミラーリングされたデータベースを利用する際は[こちらのWebページ](https://technet.microsoft.com/ja-jp/library/ms366348(v=sql.105).aspx)を参考にしてください。
また、プリンシパルサーバーに障害が発生して接続できないときに、自動的にミラーサーバー(実際にはプリンシパルに昇格)に接続したいと思います。
その場合は、接続文字列の"Failover Partner属性"にミラーサーバーを指定すると良いでしょう。
接続試行で失敗する場合は以下を参考にしてみてください。
[イニシャル パートナーがダウンしている場合、フェールオーバー パートナーに接続できる確率を高める方法](https://blogs.msdn.microsoft.com/jpsql/2012/08/29/ado-netsnac/)

ではまた。