---
title: Authentication failure が止まらない (Vagrant 1.8.5)
date: 2016-09-23
author: kenzauros
tags: [Vagrant, 仮想化技術]
---

Vagrant 1.8.5 に更新したところ、`vagrant up` したときに下記の警告に見舞われるようになりました。ちなみに box は bento/centos-7.1 です。

## Authentication failure の嵐

```
default: Warning: Authentication failure. Retrying...
```

`vagrant up` 時の接続確認で SSH 接続するときにエラーがでているのが原因です。

`vagrant ssh` したときにはパスワードがきかれるようになりました。要するに鍵認証での SSH ができていません。

けっこう面倒なので、調べたところ、同様の症状で悩んでる先輩諸氏がいらっしゃいました。

いくつかのページで紹介されていた公開鍵をサーバーに配置する、というのは試してみても解決しませんでした。

## 解決

結局、下記のページで紹介されていた .ssh フォルダのパーミッション設定だけでいけました。

* [vagrant upコマンド実行時にAuthentication failure.エラーが発生する - Qiita](http://qiita.com/shyse/items/9ec50b868b90f847c75f)

vagrant にログイン (パスワードも vagrant) してから vagrant ユーザーのまま、下記のコマンドを叩くだけです。

```bash
$ chmod 0700 /home/vagrant/.ssh
$ chmod 0600 /home/vagrant/.ssh/authorized_keys
$ chown -R vagrant /home/vagrant/.ssh
```

実行前（デフォルト）のパーミッションとと所有権はこちら。おや、 authorized_keys のパーミッションが 644 になってますね。

```bash
$ ll -a /home/vagrant/ | grep ssh
drwx------. 2 vagrant root     28 Sep 15 14:18 .ssh
$ ll -a /home/vagrant/.ssh | grep auth
-rw-rw-r--. 1 vagrant vagrant 389 Sep 15 14:18 authorized_keys
```

コマンド実行後のパーミッションと所有権はこちら。

```bash
$ ll -a /home/vagrant/ | grep ssh
drwx------. 2 vagrant root      28 Sep 15 14:18 .ssh
$ ll -a /home/vagrant/.ssh | grep auth
-rw-------. 1 vagrant vagrant  389 Sep 15 14:18 authorized_keys
```

無事 authorized_keys が 600 になりました。結局変更されるのはこのパーミッションだけなので

```bash
chmod 0600 /home/vagrant/.ssh/authorized_keys
```

だけもいけるはずです。

要するに **authorized_keys は他ユーザーから一切アクセスできないようにしておかないとつながらないよ** 、ということでした。