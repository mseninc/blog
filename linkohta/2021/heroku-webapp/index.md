---
title: 【2021年から Ruby on Rails をはじめる人向け】 Heroku を使って Rails アプリを公開する手順
date: 2021-05-28
author: linkohta
tags: [Heroku, Ruby on Rails, Web]
---

link です。

Web アプリの公開は自力でやろうとすると、サーバー構築やドメインの取得などを行わないといけないため、一個人には敷居が高いものになっています。

しかし、個人で利用する分には無料のクラウド・アプリケーション・プラットフォームがいくつか存在します。

そこで、その中の一つ、 **Heroku** を使って、 Rails で作成した Web アプリを公開する手順について解説していきたいと思います。

## 前提

- Ruby on Rails 6
- Heroku

## Heroku とは

**開発した Web アプリケーションをお手軽に無料で全世界に公開できる PaaS です。**

Git のリモートリポジトリに Push するだけで勝手にデプロイしてくれます。

今回は Ruby on Rails 6 で作成したアプリをデプロイしますが、 Node.js, Python, PHP, Java などにも対応しています。

## 事前準備

### ルート画面の設定

Rails の Web アプリを起動して、 `localhost:3000` に接続するとデフォルトでは下の画像のような画面が出ます。
![railsデフォルト](https://mseeeen.msen.jp/wp-content/uploads/2021/04/rails.png)

しかし、 Heroku でデプロイ後に出力される URL にそのまま接続すると下の画像のような画面になってしまいます。
![herokuデフォルト](https://mseeeen.msen.jp/wp-content/uploads/2021/05/2021-05-13_11h00_59.png)

そこでルートを設定して、デフォルトで表示される画面を変更してみましょう。

`app/controllers` に `index` 関数を持った `start_controller.rb` があるとします

`config/routes.rb` に `root to: 'start#index'` を追加しましょう。

これでルート画面が StartController に対する GET になります。

ちなみに ルート画面で GET 以外の HTTP メソッドを送信できるようにする場合は、例えば POST の場合は `post '/', to: 'start#index'` という風にしてください。

### データベース管理システムの変更

最新の Rails Web アプリを Heroku の Git にPush すると、確実にデプロイに失敗します。

これは、 Rails 内部で使われているデフォルトのデータベース管理システムが **SQLite** なのに対して、 Heroku 内部で使われるデータベース管理システムが **PostgreSQL** となっているのが原因です。

**そのため、 Rails で使うデータベース管理システムを PostgreSQL に変更する必要があります。**

### Gemfile 変更

プロジェクト内にある `Gemfile` を VS Code などで開きましょう。

`Gemfile` とは、 Ruby コードを実行するために必要な Gem の依存関係が記述されているファイルです。

Rails で生成したプロジェクトの `Gemfile` を弄って依存関係を変更することでデータベース管理システムを変更します。

まず、 `Gemfile` の `gem 'sqlite3', '~> 1.4'` とある箇所を `# gem 'sqlite3', '~> 1.4'` とコメントアウトします。

続いて、
```rb
group :development, :test do
  :
end
```
と書かれている個所の `do~end` の中に `gem 'sqlite3'` を書き足します。

テスト環境でのみ使用するシステムに SQLite を追加しています。

最後に、後ろのほうに下記の文を付け足しましょう。
```rb
group :production do
  gem 'pg'
end
```

こちらは本番環境でのみ使用するシステムに PostgreSQL を追加しています。

`Gemfile` を書き換え終わったら、ターミナルを起動して `bundle install --without production` と入力しましょう。

`--without production` は私の環境に PostgreSQL を入れていないための措置です。

`Gemfile` を変更して、 Rails で PostgreSQL を使えるようにしましたが、まだデータベースに接続するための設定がありません。

`config/datebase.yml` を以下のように書き換えましょう。
```yml
production:
  <<: *default
  adapter: postgresql
  encoding: unicode
  pool: 10
```
これで本番環境でPostgreSQLと接続する準備ができました。

最後に `config/environments/production.rb` の `config.assets.compile` の値を `false` から `true` に書き換えましょう。

本番環境での動的な画像の表示をオンにするためです。

## デプロイ手順
[Heroku](https://id.heroku.com/login)にログインし、 `Create new app` を選択して新しいプロジェクトを作成したら、 Deploy に移動しましょう。

**Heroku CLI** のリンク先から Heroku CLI をダウンロードしてインストールします。

![deploy](https://mseeeen.msen.jp/wp-content/uploads/2021/05/2021-05-19_13h09_50-e1621397934822.png)

Git Bash を起動して、 `heroku login` を入力します。 Heroku のログインが求められるのでログインします。

ログイン出来たら、プロジェクトのフォルダに移動して
```
$ git init
$ heroku git:remote -a プロジェクト名
$ git add -A
$ git commit -m "first commit"
$ git push
```
と入力しましょう。

`git init` はフォルダを Git で扱えるようにするためのコマンドです。これで Git のソフトなどでリポジトリとして認識してくれるようになります。

`heroku git:remote -a プロジェクト名` は Heroku 内の Git リポジトリを指定しているコマンドです。

`git add -A` ですべてのファイルをステージングしています。

これで Heroku 側でデプロイが始まります。

デプロイに失敗すると下の画像のような画面になり、 Git の Push にも失敗します。
![failed](https://mseeeen.msen.jp/wp-content/uploads/2021/05/2021-05-13_14h22_12.png)

こうなった場合、**赤文字で目立つところだけではなく、上の方のログをよく見て、エラーを発見しましょう。**

デプロイに成功すると、最後のほうに `https://プロジェクト名.herokuapp.com/`と表示されます。これが Web アプリの URL です。

## まとめ

今回は Heroku を使って Web アプリを公開する方法を解説しました。

無料のままでも十分な機能が存在し、お手軽に Web アプリを公開できるサービスなので是非使ってみてください。