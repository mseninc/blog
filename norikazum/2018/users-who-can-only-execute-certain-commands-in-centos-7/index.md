---
title: CentOS 7 で特定のコマンドしか実行できないユーザーを作成する
date: 2018-01-18
author: norikazum
tags: [CentOS, もくもく会, bash, Linux]
---

こんにちは。

**CentOS 7 で特定のコマンドのみを実行できる制限ユーザーを作成**しようと思い、以下の記事を見つけました。

[＠IT：特定のコマンドしか実行できないユーザーIDを作成するには](http://www.atmarkit.co.jp/flinux/rensai/linuxtips/363rbashuser.html)

2002 年のこの記事の内容が、最新の CentOS 7 でも実行可能か検証してみたところ、**記事同様に制限ユーザーを作成することに成功** しました。

詳細な説明は @IT に委ねるとして、この記事ではサクッとユーザーを作成することを目指します。

制限をかけるユーザー名を `seigen` 、パスワードを `mypassword` 、実行できるコマンドを `ls` と `df` とします。

それでは早速作りましょう。

## 制限までの流れ

実行は `root` ユーザーで実施します。

1. ユーザーの作成
`useradd seigen`

1. 作成したユーザーにパスワードを設定
`passwd seigen`
mypassword とパスワードを設定

1. 制限付きのシェルを作成する
`ln -s /bin/bash /bin/rbash`

1. 制限付きのシェルを登録する
`echo /bin/rbash >> /etc/shells`

1. seigen ユーザーのシェルを切り替える
`su - seigen`
`chsh`
`/bin/rbash`
mypassword とパスワード応答

1. rootユーザー に戻り seigen ユーザーの .bash_profile のユーザーとグループをrootユーザーに変更し、rootユーザー以外が変更できないようにアクセス権を設定する。
`exit`
`cd /home/seigen`
`chown root .bash_profile`
`chgrp root .bash_profile`
`chmod 755 .bash_profile`

1. .bash_profile に制限ユーザーのパスを追記
`echo "export PATH=/home/foo" >> /home/seigen/.bash_profile`

1. 制限コマンドを設定
`ln -s /bin/ls /home/foo/ls`
`ln -s /bin/df /home/foo/df`

1. テスト

```bash
[seigen@msen ~]$ ls
df  ls
```
実行できる。

```bash
[seigen@msen ~]$ df
ファイルシス            1K-ブロック    使用   使用可 使用% マウント位置
/dev/mapper/centos-root    49774852 3993136 45781716    9% /
devtmpfs                     930452       0   930452    0% /dev
tmpfs                        941940       0   941940    0% /dev/shm
tmpfs                        941940   16876   925064    2% /run
tmpfs                        941940       0   941940    0% /sys/fs/cgroup
/dev/sda1                    508588  163044   345544   33% /boot
tmpfs                        188392       0   188392    0% /run/user/1000
```
実行できる。

```
[seigen@msen ~]$ du
-rbash: du: コマンドが見つかりません
```
実行できない。


## 一気に実行しましょう

パスワード応答で区切りができますので、以下の3分割をコピーしていただき、ターミナルに貼り付けで一気に実行できます。

```
useradd seigen
passwd seigen

mypassword とパスワードを設定
```

```
ln -s /bin/bash /bin/rbash
echo /bin/rbash >> /etc/shells
su - seigen
chsh
/bin/rbash

mypassword とパスワード応答
```

```
exit
cd /home/seigen
chown root .bash_profile
chgrp root .bash_profile
chmod 755 .bash_profile
echo "export PATH=/home/seigen" >> /home/seigen/.bash_profile
ln -s /bin/ls /home/seigen/ls
ln -s /bin/df /home/seigen/df
```

ユーザを作成して、 `seigen` ユーザーにスイッチするところまでのシェルスクリプトも書いてみましたので、もしよろしければコピペで利用してください。

```
#!/bin/sh

## 変数 ##

# 作成するユーザー名を入力してください
username=seigen

# パスワードを変更してください
password=mypassword

# パスワードファイル定義
tmp_password_file=/tmp/.tmp_password.txt

# 制限パスワード列挙 ##
set-ls=$(which ls)
set-df=$(which df)

# ユーザー登録処理
useradd ${username}

# パスワードファイル作成
echo ${username}:${password} > ${tmp_password_file}

# パスワード変更処理
chpasswd < ${tmp_password_file}

# パスワードファイル削除
rm -rf ${tmp_password_file}

ln -s /bin/bash /bin/rbash
echo /bin/rbash >> /etc/shells
su - ${username}
```

それでは、次回の記事でお会いしましょう。

