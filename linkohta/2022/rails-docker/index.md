---
title: Docker 上で Ruby on Rails 7 の開発環境を構築してみた
date: 
author: linkohta
tags: [Web, Ruby on Rails, Docker]
description: 
---

link です。

## 前提条件

- Ruby 3
- Ruby on Rails 7
- Docker 4

## Docker ファイル作成

まず、 Rails のプロジェクトフォルダを作りましょう。

```title=フォルダ作成コマンド
mkdir docker-rails
cd docker-rails
```

この直下に以下の空ファイルを作成します。

- Dockerfile
- docker-compose.yml
- Gemfile
- Gemfile.lock
- entrypoint.sh

次に作成したファイルの中身を以下のように変更します。
Gemfile.lock は書き換えなくて大丈夫です。

```title=Dockerfile
FROM ruby:3.1.2

# yarnパッケージ管理ツールをインストール
RUN apt-get update && apt-get install -y curl apt-transport-https wget && \
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
apt-get update && apt-get install -y yarn

RUN apt-get update -qq && apt-get install -y nodejs yarn
RUN mkdir /myapp
WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
RUN bundle install
COPY . /myapp

RUN yarn install --check-files
RUN bundle exec rails webpacker:compile

# コンテナ起動時に実行させるスクリプトを追加
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Rails サーバ起動
CMD ["rails", "server", "-b", "0.0.0.0"]
```

```title=docker-compose.yml
version: '3'
services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: root
    ports:
      - "3306:3306"
    volumes:
      - ./tmp/db:/var/lib/mysql

  web:
    build: .
    command: bash -c "rm -f tmp/pids/server.pid && bundle exec rails s -p 3000 -b '0.0.0.0'"
    volumes:
      - .:/myapp
    ports:
      - "3000:3000"
    depends_on:
      - db
```

```title=Gemfile
source 'https://rubygems.org'
gem 'rails', '~> 7.0.2'
```

```title=entrypoint.sh
#!/bin/bash
set -e

rm -f /myapp/tmp/pids/server.pid

exec "$@"
```

## コンテナイメージのビルド

次は、先ほど作成した Docker 関連ファイルを使ってコンテナイメージをビルドします。

以下のコマンドを入力します。

```title=ビルドコマンド
docker-compose build
```

そこそこ時間がかかりますのでしばらく待ちます。

## 起動

次は `docker-compose` コマンドを使って `rails new` を実行し、 Rails プロジェクトを作成しましょう。

`docker-compose run` に続けてサービス名を指定し、さらにコンテナ内で実行したいコマンドを続けていきます。

Rails が動くサービスには web という名前を docker-compose.yml で付けたのでコマンドでのコンテナ名としては web を当てはめます。

以下のコマンドを実行してください。

```title=Railsプロジェクト生成コマンド
docker-compose run web rails new . --force --no-deps --database=mysql
```

通常の `rails new` と同じように、ディレクトリ内に関連ファイルが生成されます。

再度、ビルドコマンドを実行して足りないパッケージをインストールします。

## データベース作成

```yml:title=config/database.yml
default: &default
  adapter: mysql2
  encoding: utf8mb4
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: root
  password:
  host: localhost

development:
  <<: *default
  database: myapp_development
  host: db
  username: root
  password: password

test:
  <<: *default
  database: myapp_test
  host: db
  username: root
  password: password
```

## コンテナを起動

コンテナを起動するため、次のコマンドを実行します。

```title=コンテナ起動コマンド
docker-compose up -d
```

`docker-compose up` は docker-compose.yml に基づいて起動するコマンドです。

コンテナ起動時にコンテナ内で実行させたいコマンドは Dockerfile で設定しているので、コンテナを起動させると Rails サーバが立ち上がります。

また、オプションの -d を付けるとバックグラウンドで起動させることができます。

## 動作確認

これで無事に Rails の開発用サーバが起動したことになります。

ブラウザのアドレスバーに http://localhost:3000/ と入力し、起動を確認してみましょう。

以下の画像のような画面が出れば成功です。

![起動画面](images/2022-04-19_16h54_45.png)

## 参考サイト

- [Quickstart: Compose and Rails | Docker Documentation](https://docs.docker.com/samples/rails/)

## まとめ