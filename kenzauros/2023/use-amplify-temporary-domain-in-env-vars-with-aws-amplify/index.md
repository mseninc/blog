---
title: "AWS Amplify で環境変数に amplifyapp.com ドメインを自動的に設定する"
date: 
author: kenzauros
tags: ["AWS", "Amplify"]
description: "AWS Amplifyで複数のビルドやステージに対応するため、amplifyapp.com ドメインを環境変数として自動的に設定する方法を紹介します。"
---

こんにちは、 kenzauros です。

複数のステージやビルドごとに環境がある場合、特に Cookie のドメイン設定など、環境に依存する変数の取り扱いが重要になります。

今回は **AWS Amplify で仮ドメインである amplifyapp.com ドメインを環境変数としてアプリ側から参照できるようにする** 方法を紹介します。

## Amplify における環境変数の設定方法

Amplify コンソールの環境変数設定機能を利用すれば、ブランチごとに異なる値を環境変数として設定できます。しかし、一度ブランチを接続してデプロイ処理が走らないと上書き対象のブランチとして表示されないので、設定しづらいです。また特に多くのブランチが生まれるプロジェクトでは非効率的です。

よって、なるべく自動的に環境変数を設定する方法を模索します。 **Amplify の仮ドメインは `{ドメイン名}.{APP_ID}.amplifyapp.com` の形式**になりますので、このルールを利用して、ブランチごとに異なるドメインを割り出します。

逆にカスタムドメインを使用しているブランチはおそらく固定だと思うので、 Amplify コンソールで環境変数を設定しておけばいいでしょう。この記事では `main` や `dev` ブランチはカスタムドメインを割り当てていると仮定します。

## Amplify のビルド設定

基本的には `{ドメイン名}.{APP_ID}.amplifyapp.com` を `export` で環境変数に設定し、それをアプリ側で読み込めるようにしてやれば OK です。

Amplify のビルド環境では APP_ID は `AWS_APP_ID`、ブランチ名は `AWS_BRANCH` として環境変数に設定されています。既定の環境変数については [AWS Amplifyの公式ドキュメント](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html) を参照してください。

ただし、 *ブランチ名である `AWS_BRANCH` には `/` などの URL で意味のある文字列が含まれる場合があります*。Amplify の仮ドメインでも特殊文字は `-` に置換されますので、環境変数に用いる場合も同様に置換する必要があります。

たとえば `main` や `dev` ブランチ以外の場合に、環境変数を上書きする場合は、下記のようなコマンドをビルドコマンドに追加します。

```sh:title=特定のブランチ以外の場合に環境変数を設定
test "$AWS_BRANCH" != 'next' -a "$AWS_BRANCH" != "main" && export NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN=${AWS_BRANCH//[^a-zA-Z0-9]/-}.${AWS_APP_ID}.amplifyapp.com
```

`test` 部分はブランチを除外しているだけなので、主には `export` の後の **`${AWS_BRANCH//[^a-zA-Z0-9]/-}.${AWS_APP_ID}.amplifyapp.com`** がポイントです。 `AWS_BRANCH` に含まれる英数字以外は `-` に置換しています。

このサンプルは Next.js のプロジェクト向けなので、上記のコマンドでは、環境変数 `NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN` に Cookie のドメインを設定しています。

Amplify のビルド設定 (amplify.yml) は下記のようになります。

```yaml:title=amplify.yml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - test "$AWS_BRANCH" != 'next' -a "$AWS_BRANCH" != "main" && export NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN=${AWS_BRANCH//[^a-zA-Z0-9]/-}.${AWS_APP_ID}.amplifyapp.com
            - env | grep -e NEXT_PUBLIC_ >> .env.production
            - cat .env.production 👈 デバッグ用
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
    appRoot: src
```

試しに `feature/hogehoge` ブランチをビルドしてみてログを確認すると、うまくブランチに対応したドメインが設定されていることを確認できました👏

```:title=Amplifyのビルドログ
2023-11-17T04:17:55.299Z [INFO]: # Executing command: test "$AWS_BRANCH" != 'next' -a "$AWS_BRANCH" != "main" && export NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN=${AWS_BRANCH//[^a-zA-Z0-9]/-}.${AWS_APP_ID}.amplifyapp.com
                                 # Executing command: env | grep -e NEXT_PUBLIC_ >> .env.production
2023-11-17T04:17:55.300Z [INFO]: # Executing command: cat .env.production
2023-11-17T04:17:55.301Z [INFO]: NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN=feature-hogehoge.<APP_ID>.amplifyapp.com
```

## まとめ

今回は Amplify の既定の環境変数を利用して、 amplifyapp.com ドメインを環境変数としてアプリ側から参照できるようにしました。

その他も既定の環境変数が定義されていますので、応用すればいろいろできそうです👍
