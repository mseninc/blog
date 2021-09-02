---
title: Ansible+pexpect+samba4 で Active Directory Domain Controller 設定時にハマった話
date: 2018-08-17
author: jinna-i
tags: [CentOS, Ansible, ActiveDirectory, samba, その他の技術]
---

こんにちは、じんないです。

Ansibleを使ってsamba4でActive Directoryの設定をしていました。

ADの設定は対話形式のため、自動で応答ができるようにpythonパッケージの[Pexpect](https://pexpect.readthedocs.io/en/stable/)を利用します。

あらかじめ必要な回答を確認し、Ansibleに組み込んでいきますが何回やってもエラーになってしまいました。

同じとこでハマってしまわぬようメモしておきます。

## 環境
- CentOS 7.5
- Ansible 2.6.1
- samba 4.8.3

## ハマったところ

AD設定で回答が必要な項目は以下の7つです。

```
Realm [JINNAI.NET]:
Domain [JINNAI]:
Server Role (dc, member, standalone) [dc]:
DNS backend (SAMBA_INTERNAL, BIND9_FLATFILE, BIND9_DLZ, NONE) [SAMBA_INTERNAL]:
DNS forwarder IP address (write 'none' to disable forwarding) [192.168.1.1]:
Administrator password:
Retype password:
```

これに対する回答を、playbookの` responses `に書いていきます。

正規表現が使えるので、いい感じに質問行にヒットするようにします。※この回答が失敗なのが後ほどわかります。。。

```
## AD設定
- name: set Active Directory
  expect:
     command: /usr/local/samba/bin/samba-tool domain provision --use-rfc2307 --interactive
     responses:
       '^Realm.*' : '{{ realm }}'
       '^Domain.*' : '{{ domain }}'
       '^Server Role.*' : '{{ role }}'
       '^DNS backend.*' : '{{ dns_backend }}'
       '^DNS forwarder IP address.*' : '{{ forwarder }}'
       '^Administrator password:' : '{{ admin_password }}'
       '^Retype password:' : '{{ admin_password }}'
```

この状態でplaybookを実行するとエラーになりました。


` -vvv `オプションをつけてplaybookを実行した結果(抜粋)が以下のとおり。

``` bash
    "msg": "command exceeded timeout",
    "rc": null,
    "start": "2018-07-28 17:36:31.349885",
    "stdout": "Realm [JINNAI.NET]:  Domain [JINNAI]: ",
    "stdout_lines": [
        "Realm [JINNAI.NET]:  Domain [JINNAI]: "
```

メッセージを見るとタイムアウト(デフォルトは30秒)でコケています。

なんとなく` Domain `の入力待ちまではいけてる様子？？

このあと正規表現が悪かったのかと試行錯誤を繰り返していましたが、一向に進まず・・・

## echoオプションをつけてみる

pexpect(expect)ではechoオプションをつけることによって、応答文字列を表示させることができます。

```
## AD設定
- name: set Active Directory
  expect:
     command: /usr/local/samba/bin/samba-tool domain provision --use-rfc2307 --interactive
     echo: true   ★追記
     responses:
       '^Realm.*' : '{{ realm }}'
       '^Domain.*' : '{{ domain }}'
       '^Server Role.*' : '{{ role }}'
       '^DNS backend.*' : '{{ dns_backend }}'
       '^DNS forwarder IP address.*' : '{{ forwarder }}'
       '^Administrator password:' : '{{ admin_password }}'
       '^Retype password:' : '{{ admin_password }}'
```

` echo: true `を設定し、再度playbookを実行してみると、、、

```
    "msg": "command exceeded timeout",
    "rc": null,
    "start": "2018-07-28 17:33:46.500327",
    "stdout": "Realm [JINNAI.NET]: JINNAI.NET\r\n Domain [JINNAI]: ",
    "stdout_lines": [
        "Realm [JINNAI.NET]: JINNAI.NET",
        " Domain [JINNAI]: "
```

やっぱり` Domain `まではいけてますが、、、

あれっ?よく見ると**Dの前にスペースが入っている?!**


` " Domain [JINNAI]: " `
   　^here

質問を見直しても行頭から始まっていてスペースが入ってる様子もありませんが、ひとまずplaybookを修正してみます。

```
## AD設定
- name: set Active Directory
  expect:
     command: /usr/local/samba/bin/samba-tool domain provision --use-rfc2307 --interactive
     echo: true
     responses:
       '\s*Realm.*' : '{{ realm }}'
       '\s*Domain.*' : '{{ domain }}'
       '\s*Server Role.*' : '{{ role }}'
       '\s*DNS backend.*' : '{{ dns_backend }}'
       '\s*DNS forwarder IP address.*' : '{{ forwarder }}'
       '\s*Administrator password:' : '{{ admin_password }}'
       '\s*Retype password:' : '{{ admin_password }}'
```
行頭にスペースが入ることを考慮して ` ^ ` から ` \s* ` に変更。

再度playbookを実行すると無事成功しました。

```
TASK [samba : set Active Directory] ********************
changed: [localhost]
```

Domain以外の質問も半角スペースが入っているので、すべて修正しておいた方が無難かもしれません。

あとは実行するたびに再設定が行われないよう、ADの設定が済んでいるかを事前にチェックし、未完了の場合だけ実行されるようにしておくのがベターです。

チェック方法はいくつかあると思いますが、設定が完了すると` /usr/local/samba/etc/smb.conf `が生成されるので` stat `でこれの有無をチェックします。

以下サンプルです。

```
## AD設定
- name: check Active Directory setup
  stat: path=/usr/local/samba/etc/smb.conf
  register: samba_setup_check

- name: set Active Directory
  expect:
     command: /usr/local/samba/bin/samba-tool domain provision --use-rfc2307 --interactive
     echo: true
     responses:
       '\s*Realm.*' : '{{ realm }}'
       '\s*Domain.*' : '{{ domain }}'
       '\s*Server Role.*' : '{{ role }}'
       '\s*DNS backend.*' : '{{ dns_backend }}'
       '\s*DNS forwarder IP address.*' : '{{ forwarder }}'
       '\s*Administrator password:' : '{{ admin_password }}'
       '\s*Retype password:' : '{{ admin_password }}'
  when: not samba_setup_check.stat.exists
```
こんな感じにしておくとOKかと思います。

思わぬところでハマってしまいましたが、無事に設定ができ一安心です。

ではまた。