---
title: gatsby-plugin-s3 で S3 にアップロードする際に Access Denied に悩まされた件
date: 
author: kenzauros
tags: [Gatsby.js, S3, CloudFront]
description: Gatsby プラグインで S3 にアップロードする際に Access Denied に悩まされました。今回は gatsby-plugin-s3 の導入と IAM の設定について紹介します。
---

*gatsby-plugin-s3 で S3 へアップロードする際、 Access Denied* に悩まされました。

結局メッセージ通り原因は IAM ポリシーの権限不足でしたが、デバッグが難しかったため少しハマりました。

今回は **gatsby-plugin-s3** の導入と IAM の設定について紹介します。

## 前提

### 環境

- Gatsby version: 3.13.0
- CI: GitHub Actions

### コンテンツの配信方法

- Gatsby で生成された結果を S3 バケットに配置
- S3 バケットのコンテンツを CloudFront で配信
- AWS 認証情報はデプロイ用ユーザーの `AWS_ACCESS_KEY_ID` と `AWS_SECRET_ACCESS_KEY` を使用

## 経緯

もともと Gatsby で生成されたページを S3 にアップロードするのに、`aws s3 sync` を使っていました。ただ、*普通に s3 sync して CloudFront で配信しただけでは `Cache-Control` ヘッダーが付与されず、ブラウザキャッシュが有効になりません*。

**CloudFront で配信するコンテンツに `Cache-Control` ヘッダーをつけるには、 S3 のオブジェクトメタデータとして設定**する必要があります。

[Caching Static Sites | Gatsby](https://www.gatsbyjs.com/docs/caching/)

Gatsby の公式情報では下記のように設定することが推奨されています。

ファイル | キャッシュ設定
-- | --
コンテンツ (`.html` や `page-data.json`) | `max-age=0` (キャッシュなし)
webpack で生成物 (`.js` や `.css`) | `max-age=31536000` (1年)

`aws s3 sync` コマンドでも `--cache-control` オプションでメタデータとして付加できますが、拡張子やディレクトリ別に設定するのはとても面倒です。

そこで `aws s3 sync` を諦め、Gatsby プラグイン `gatsby-plugin-s3` を利用することにしました。

[gatsby-plugin-s3 | Gatsby](https://www.gatsbyjs.com/plugins/gatsby-plugin-s3/)


## gatsby-plugin-s3 の導入

### インストール

まず gatsby-plugin-s3 をインストールします。

```bash:title=shell
npm i gatsby-plugin-s3
```

### gatsby-config.js

次に `gatsby-config.js` を編集します。

オプションで使用するため、冒頭でサイトの URL を `URL` オブジェクトにパースしておきます。

```js:title=gatsby-config.js
const siteAddress = new URL(SITE_URL)
```

プラグインに設定を追加します。今回は *S3 のバケット名とリージョンは環境変数 `S3_BUCKET_NAME`, `S3_REGION` で渡す想定*としています。

```js:title=gatsby-config.js
  {
    resolve: `gatsby-plugin-s3`,
    options: {
      bucketName: process.env.S3_BUCKET_NAME,
      region: process.env.S3_REGION,
      acl: null,
      // With CloudFront
      // https://gatsby-plugin-s3.jari.io/recipes/with-cloudfront/
      protocol: siteAddress.protocol.slice(0, -1),
      hostname: siteAddress.hostname,
    },
  },
```

`acl` を null にすると S3 オブジェクトの ACL 設定が行われません。今回は CloudFront で配信するため無効化していますが、デフォルトでは S3 での配信のため `public-read` に設定されます。ただこの場合は IAM ユーザーの権限に PutObjectAcl が必要となるはずですのでご注意ください。

また、 **CloudFront でホストする場合は、`protocol` と `hostname` が必須**です。ここで先に定義しておいた `URL` オブジェクトを使ってサイトのプロトコル (`http` か `https` ) とホスト名を設定します。

> By specifying the protocol and hostname parameters, you can cause redirects to be applied relative to a domain of your choosing.
>
> [Using CloudFront with gatsby-plugin-s3 - gatsby-plugin-s3](https://gatsby-plugin-s3.jari.io/recipes/with-cloudfront/)

## コマンドによるデプロイ

コマンドでデプロイしてみます。**デプロイには `node_modules/.bin/gatsby-plugin-s3 deploy` を実行**します。

AWS の認証情報は CI での実行を想定して、環境変数 `AWS_ACCESS_KEY_ID` と `AWS_SECRET_ACCESS_KEY` で渡しましょう。 (`aws configure` による認証情報も利用できます)

```sh
AWS_ACCESS_KEY_ID=*** AWS_SECRET_ACCESS_KEY=*** node_modules/.bin/gatsby-plugin-s3 deploy
✖ Failed.
  AccessDenied: Access Denied
  
  - s3.js:714 Request.extractError
    [blog-gatsby]/[aws-sdk]/lib/services/s3.js:714:35
  
  - sequential_executor.js:106 Request.callListeners
    [blog-gatsby]/[aws-sdk]/lib/sequential_executor.js:106:20
  
  - sequential_executor.js:78 Request.emit
    [blog-gatsby]/[aws-sdk]/lib/sequential_executor.js:78:10
  
  - request.js:688 Request.emit
    [blog-gatsby]/[aws-sdk]/lib/request.js:688:14
  
  - request.js:22 Request.transition
    [blog-gatsby]/[aws-sdk]/lib/request.js:22:10
  
  - state_machine.js:14 AcceptorStateMachine.runTo
    [blog-gatsby]/[aws-sdk]/lib/state_machine.js:14:12
  
  - state_machine.js:26 
    [blog-gatsby]/[aws-sdk]/lib/state_machine.js:26:10
  
  - request.js:38 Request.<anonymous>
    [blog-gatsby]/[aws-sdk]/lib/request.js:38:9
  
  - request.js:690 Request.<anonymous>
    [blog-gatsby]/[aws-sdk]/lib/request.js:690:12
  
  - sequential_executor.js:116 Request.callListeners
    [blog-gatsby]/[aws-sdk]/lib/sequential_executor.js:116:18
```

はい、ここで *Access Denied* と怒られてしまいました。当然ながら権限問題だということはすぐわかりますが、いかんせん何が悪いのかを吐いてくれないため、デバッグしづらいのが難点です。

試しに、同じユーザーに対して `AmazonS3FullAccess` ポリシーを与えると、下記のように次のステップへ進めます。

```sh
AWS_ACCESS_KEY_ID=*** AWS_SECRET_ACCESS_KEY=*** node_modules/.bin/gatsby-plugin-s3 deploy

    Please review the following: (pass -y next time to skip this)

    Deploying to bucket: バケット名
    In region: リージョン名
    Gatsby will: UPDATE (any existing website configuration will be overwritten!)

? OK? (Y/n) 
```

これが表示される前なのでどうやらバケット情報の取得ができていない模様です。いろいろ調べていると下記の Issue を発見しました。

> Basic permissions
> - s3:HeadBucket
> - s3:ListBucket (for the bucket)
> - s3:GetBucketLocation (for the bucket)
> - s3:GetObject (for all objects within the bucket)
> If acl is configured as null (Recommended)
> - s3:PutObject (for all objects within the bucket)
> If generateRoutingRules is true or not configured (Recommended)
> - s3:PutBucketWebsite (for the bucket)
>
> [Document which permissions are required · Issue #39 · jariz/gatsby-plugin-s3](https://github.com/jariz/gatsby-plugin-s3/issues/39#issuecomment-467379363)

抜けていたパーミッションは **`s3:GetBucketLocation` と `s3:PutBucketWebsite`** でした。 `s3:HeadBucket` は私の環境ではなぜか不要でしたので、結果的にポリシーは下記のようになりました。

```json{numberLines:true}{9-10}:title=IAM&nbsp;Policy
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "0",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:PutBucketWebsite", 👈 これ重要
                "s3:GetBucketLocation" 👈 これ重要
            ],
            "Resource": [
                "arn:aws:s3:::バケット名"
            ]
        },
        {
            "Sid": "1",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::バケット名/*"
            ]
        },
        {
            "Sid": "2",
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation"
            ],
            "Resource": [
                "arn:aws:cloudfront::アカウント:distribution/ディストリビューション"
            ]
        }
    ]
}
```

あとは `node_modules/.bin/gatsby-plugin-s3 deploy` を CI から実行すれば、 S3 へのデプロイ、 `Cache-Control` の設定が行われるはずです。

ただし、すでに存在するオブジェクトにはメタデータが設定されないため、強制的に付与したい場合は一度オブジェクトを消してしまうのが確実です。

## まとめ

今回は gatsby-plugin-s3 を使って Gatsby の生成物を S3 バケットにアップロードする方法と IAM のポリシーについて紹介しました。

同じようにハマりかけた人のお役に立てれば幸いです。
