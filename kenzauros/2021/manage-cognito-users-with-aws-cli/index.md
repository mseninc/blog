---
title: AWS CLI の Cognito 管理コマンドで Cognito ユーザーを手軽に操作する
date: 2021-07-28
author: kenzauros
tags: [Cognito, AWS]
---

アプリを試作していると、**とりあえず AWS Cognito のユーザーを作りたい場面**があります。

コンソールから作ってもいいのですが、**アカウントの確認ができないとログインできないので、 AWS CLI からやってやるのが一番手っ取り早い**です。

管理者としてユーザーを管理するためのコマンドを紹介します。コードスニペットとしてご利用ください。

## 前提条件

- **AWS CLI** がインストールされている
- `aws configure` は完了している
- Cognito ユーザープールは作成済みでユーザープール ID を取得している

参考までに今回使用した私の環境です。

```
$ aws --version
aws-cli/2.2.22 Python/3.8.8 Linux/5.4.72-microsoft-standard-WSL2 exe/x86_64.ubuntu.20 prompt/off
$ aws configure list
      Name                    Value             Type    Location
      ----                    -----             ----    --------
   profile                <not set>             None    None
access_key     ****************4NVE shared-credentials-file
secret_key     ****************G+3q shared-credentials-file
    region                us-east-1      config-file    ~/.aws/config
```

- [Installing, updating, and uninstalling the AWS CLI version 2 - AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [Configuration basics - AWS Command Line Interface](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

**ユーザープール ID** が不明な場合は下記のように `list-user-pools` コマンドで確認しておきましょう。

```
$ aws cognito-idp list-user-pools --max-results 10
{
    "UserPools": [
        {
            "Id": "us-east-1_2dQxWw3c5",
            "Name": "hogehoge-dev-user-pool",
            "LambdaConfig": {},
            "LastModifiedDate": 1624327386.057,
            "CreationDate": 1624326107.032
        },
...
```

## Cognito ユーザー管理 CLI

各コマンドは `USER_POOL_ID` などの大文字スネークケースの部分をご自身の情報に置き換えてください。

なお AWS プロファイルがデフォルトでない場合は `--profile AWS_PROFILE_NAME` を、デフォルトのリージョンを指定していない場合は `--region REGION` を付加してください。

### ユーザーの追加 (admin-create-user)

```
aws cognito-idp admin-create-user --user-pool-id USER_POOL_ID --username USERNAME
```

ユーザーを作成した状態だとステータスは `FORCE_CHANGE_PASSWORD` になっているはずです。

### ユーザー情報の取得 (admin-get-user)

```
aws cognito-idp admin-get-user --user-pool-id USER_POOL_ID --username USERNAME
```

### ユーザーのパスワード設定 (admin-set-user-password)

```
aws cognito-idp admin-set-user-password --user-pool-id USER_POOL_ID --username USERNAME --password PASSWORD --permanent
```

`permanent` オプションをつけて、パスワードを設定することでステータスが `CONFIRMED` に変わります。

### ユーザーをグループに追加 (admin-add-user-to-group)

```
aws cognito-idp admin-add-user-to-group --user-pool-id USER_POOL_ID --username USERNAME --group-name GROUP_NAME
```

### ユーザーの削除 (admin-delete-user)

```
aws cognito-idp admin-delete-user --user-pool-id USER_POOL_ID --username USERNAME
```

## リファレンス

- [cognito-idp — AWS CLI 1.20.6 Command Reference](https://docs.aws.amazon.com/cli/latest/reference/cognito-idp/index.html#cli-aws-cognito-idp)