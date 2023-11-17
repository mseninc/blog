---
title: "[AWS] CLI での SSO ログインを簡単にする（プロファイル名自動補完付き）"
date: 2023-11-17
author: kenzauros
tags: [AWS, IAM Identity Center, AWS SSO, Linux]
description: "AWS の IAM Identity Center を使用した SSO で、 Linux から 1 コマンドでログインできるようにします。またプロファイル名を忘れてしまうことが多いため complete によるオートコンプリートができるようにしました。"
---

## はじめに

こんにちは、 kenzauros です。

AWS (Amazon Web Services) で管理対象アカウントが多い場合、それぞれのアカウント設定や IAM ユーザーの管理が負担になってきます。

そこで *AWS Organizations* と *IAM Identity Center* を設定すれば、メインアカウントのユーザーで **SSO (シングルサインオン)** できるようになり、とても便利です。
ここでは SSO の導入方法は割愛しますが、まだの方はぜひ設定ください。

- [AWS IAM Identity Center および AWS Organizations - AWS Organizations](https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/services-that-can-integrate-sso.html)

SSO 導入後は `aws sso login` という CLI コマンドが使えるようになります。ただ、そのあとは資格情報を環境変数に展開する必要がありますし、複数のプロファイルを切り替えて使う場合などはコマンドを実行するのも面倒です。

ということで、今回は「SSO ログイン」と「資格情報の展開」を 1 コマンドで行えるようにしたうえで、プロファイル名の自動補完ができるようにします。内容的にはただの Shell Script なので難しいところはありません。

細かいことを省きたい方は最後の「まとめ」をご覧ください。

## 前提条件

- bash / Ubuntu 20.04 / WSL 2.0 / Windows 11
- IAM Identity Center（旧 AWS Single Sign-on）を設定済み
- `aws configure sso` で SSO セッションは設定済み<br>参考: [AWS IAM Identity Center の自動認証更新によるトークンプロバイダーの設定 - AWS Command Line Interface](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/sso-configure-profile-token.html)
- SSO 用のプロファイルは設定済み
    - `aws sso login --profile プロファイル名` でログインできる<br>参考: [IAM Identity Center 名前付きプロファイルを使用する - AWS Command Line Interface](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/sso-using-profile.html)
    - `~/.aws/config` が下記のような状態を想定

```ini:title=~/.aws/config
[sso-session hogehoge]
sso_start_url = https://example-hogehoge.awsapps.com/start#
sso_region = ap-northeast-1
sso_registration_scopes = sso:account:access

[profile example-hogehoge]
sso_start_url = https://example-hogehoge.awsapps.com/start#
sso_region = ap-northeast-1
sso_account_id = 123456789012
sso_role_name = AdministratorAccess
region = ap-northeast-1
output = json
sso_session = hogehoge

[profile example-fugafuga]
～以下略～
```

## セットアップ

### ログインコマンドの準備

`.bashrc` をエディターで開き、下記のように追記して、 `awsexport` と `awslogin` を定義します。

```sh:title=.bashrc
# AWS 資格情報を環境変数にエクスポート
function awsexport() {
  eval "$(aws configure export-credentials --profile $1 --format env)"
}
# AWS SSO ログイン
function awslogin() {
  aws sso login --profile $1 && awsexport $1 && echo "export AWS_PROFILE=$1"
}
```

`.bashrc` をリロードします。

```sh:title=.bashrcを再読み込み
$ source ~/.bashrc
```

### ログインしてみる

これで下記のように `awslogin` を呼び出し、ブラウザー側で Authorize すれば、ログインできます。

```sh:title=awsloginコマンドでログインしてみる
$ awslogin example-hogehoge

Attempting to automatically open the SSO authorization page in your default browser.
If the browser does not open or you wish to use a different device to authorize this request, open the following URL:

https://device.sso.ap-northeast-1.amazonaws.com/

Then enter the code:

CSBB-FBDX
tcgetpgrp failed: Not a tty
Successfully logged into Start URL: https://example-hogehoge.awsapps.com/start#
export AWS_PROFILE=example-hogehoge
```

※このスクリプトは環境変数 `AWS_PROFILE` の設定は行いませんので、必要に応じて実行してください。

試しに環境変数を表示してみると `AWS_ACCESS_KEY_ID` などの値が設定されているはずです。

```sh:title=環境変数の確認
$ env | grep AWS_
AWS_SECRET_ACCESS_KEY=890YAXg7upMVV5m3Fr24U+GqUrqGSLPXWTx9qPPc
AWS_ACCESS_KEY_ID=ASIAVIYAJWGPUHSSA2O3
AWS_CREDENTIAL_EXPIRATION=2023-10-16T04:53:12+00:00
AWS_SESSION_TOKEN=IQoJb3JpZ2luX2VjEFMaDmFwLW5vcn.....................
```

これで SSO ログインがずいぶん簡単になりました。

## プロファイル名を入力補完する

さて、これでログインは簡単になりましたが、複数のプロファイルがあるときに、プロファイル名を間違わずに覚えておくのは困難です。

ファイル名やディレクトリ名を補完するような感じでプロファイル名を補完できるようにしましょう。いわゆる**オートコンプリート**ですね。

### .bashrc の設定

下記の内容を `.bashrc` （`awslogin` の後）に追記します。

```sh:title=.bashrc
# awslogin に AWS プロファイル名の自動補完を設定
_awslogin_bash_completion()
{
    local cur prev opts
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    opts=$(grep -oP '\[profile \K[^]]*' ~/.aws/config | sort)

    if [[ ${cur} == * ]] ; then
        COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
        return 0
    fi
}
complete -F _awslogin_bash_completion awslogin
```

### プロファイル名の補完を試す

あとは `.bashrc` をリロードすれば OK です。

```sh:title=.bashrcを再読み込み
$ source ~/.bashrc
```

これで `awslogin ` のスペースのあとに文字を入力して `Tab` キーを押せば、プロファイル名が補完されます。
候補が複数ある場合は `Tab` `Tab` で一覧を表示できます。

```sh:title=プロファイル名の候補が複数の場合はリストが表示される
$ awslogin example-<Tab><Tab>
example-hogehoge        example-fugafuga       example-muramura 
```

### 補足：bash-completion のインストール

補完のために bash-completion を使いますので、 `complete` コマンドを叩いてみて、もしコマンドがない場合はインストールしましょう。

```sh:title=bash-completionのインストール
$ sudo yum install bash-completion # Red Hat 系 (または dnf install)
$ sudo apt-get install bash-completion # Debian, Ubuntu
```

## まとめ

要するに `~/.bashrc` に下記のスクリプトを追加するだけです。

```sh:title=.bashrc
# AWS 資格情報を環境変数にエクスポート
function awsexport() {
  eval "$(aws configure export-credentials --profile $1 --format env)"
}
# AWS SSO ログイン
function awslogin() {
  aws sso login --profile $1 && awsexport $1 && echo "export AWS_PROFILE=$1"
}
# awslogin に AWS プロファイル名の自動補完を設定
_awslogin_bash_completion()
{
    local cur prev opts
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    opts=$(grep -oP '\[profile \K[^]]*' ~/.aws/config | sort)

    if [[ ${cur} == * ]] ; then
        COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
        return 0
    fi
}
complete -F _awslogin_bash_completion awslogin
```

どなたかのお役に立てれば幸いです。
