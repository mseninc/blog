---
title: Serverless Framework + AWS AppSync + DynamoDB のローカル開発環境を整備する
date: 2021-07-12
author: kenzauros
tags: [AWS]
---

**Serverless Framework** で **AppSync** と **DynamoDB** を組み合わせた開発を行っています。

開発にあたっては、もちろん AWS にデプロイしてもいいのですが、デプロイにかかる時間で開発効率が上がらないため、やはりオフラインで開発したいところです。

ということで今回は **serverless-offline** と DynamoDB Local を使ってオフラインの開発環境を構築しました。

## 環境

- Windows 10 Pro 20H2
- Ubuntu 20.04 on WSL 2
- Serverless Framework 2.48.0

今回はすべて WSL 2 上の Ubuntu 20.04 で進めます。 Git など基本的なツールはインストールされている前提とします。

### パッケージ

- serverless-appsync-plugin: 1.11.3
- serverless-dynamodb-local: 0.2.39
- serverless-appsync-simulator: 0.16.1
- serverless-offline: 7.0.0

### ツール

- dynamodb-admin 4.0.1

## リポジトリ

今回の結果セットを GitHub に置いていますので、ご利用ください。




## インストール

### AWS CLI

この記事を読んでいる方で AWS CLI の入っていない方はいないと思いますが、なければインストールしておきます。

```
sudo apt install unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

- [Linux での AWS CLI バージョン 2 のインストール、更新、およびアンインストール - AWS コマンドラインインターフェイス](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2-linux.html)

### Serverless Framework のインストール

Serverless Framework がインストールされていない場合はインストールしておきましょう。

```sh
npm install -g serverless
```

- [Serverless Framework - AWS Lambda Guide - Installing The Serverless Framework](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)

### Java のインストール

DynamoDB Local を動かすのに Java が必要なため、 JRE をインストールしておきます。

```
sudo apt install default-jre
java -version
```

### Watchman のインストール

AppSync Simulator の Hot-reloading を動かすのに Watchman が必要です ([参考](https://github.com/bboure/serverless-appsync-simulator#hot-reloading))。インストールされているか確認しておきます。

```sh
watchman --version
```

Watchman が入っていない場合は、下記の記事を参考にインストールしてください。

- [Ubuntu on WSL に Watchman をインストールする](/install-watchman-into-ubuntu-on-wsl/)

### DynamoDB GUI のインストール

DynamoDB Local の管理用 GUI として dynamodb-admin をインストールします。 dynamodb-admin は LSI に対応していないのが難点ですが...

```
npm install dynamodb-admin -g
```

- [aaronshaf/dynamodb-admin: GUI for DynamoDB Local or dynalite](https://github.com/aaronshaf/dynamodb-admin#readme)



## 実践

### ディレクトリ構造

今回のリポジトリは下記のようなディレクトリ構造です。

```tree
.
├── appsync
│   ├── stack.yml
│   ├── datasources.yml
│   ├── mappingtemplates.yml
│   ├── resolvers
│   │   ├── Mutation.createPost.request.vtl
│   │   ├── Mutation.deletePost.request.vtl
│   │   ├── Mutation.updatePost.request.vtl
│   │   ├── Query.listPosts.request.vtl
│   │   ├── Query.listPosts.response.vtl
│   │   └── Response.singlePost.vtl
│   └── schemas
│       └── posts.graphql
├── resources
│   ├── cognito.yml
│   ├── dynamodb-tables.yml
│   └── iam-role-statements.yml
├── package.json
└── serverless.yml
```

要約すると下記のような構成です。

```sh
.
├── appsync # AppSync 関連 ディレクトリ
│   ├── resolvers # テンプレートリゾルバ ディレクトリ
│   └── schemas # スキーマ ディレクトリ
├── resources # AWS リソース定義 ディレクトリ
└── serverless.yml # serverless.yml
```

serverless.yml と下層の yml は下記のような構造で読み込んでいます。

```
serverless.yml
├── resources/cognito.yml # Cognito のユーザープール等
├── resources/dynamodb-tables.yml # DynamoDB テーブル
├── resources/iam-role-statements.yml # IAM ロール
└── appsync/stack.yml # AppSync
    ├── appsync/datasources.yml # AppSync のデータソース定義
    └── appsync/mappingtemplates.yml # AppSync のマッピングテンプレート定義
```

今回はこのようなディレクトリ構成にしましたが、