---
title: CentOS 6 の Git で SSL connect error にハマった (NSS error -12286)
date: 2016-12-23
author: kenzauros
tags: [CentOS, Git, GitLab, Linux]
---

**CentOS 6 の Git** で急に fetch や pull ができなくなってハマったので、その記録です。なお、サーバー側は **GitLab** です。

## 症状

以前はできていたはずのリポジトリで `git fetch` が下記のようなエラーを出して、実行できなくなりました。

```
fatal: unable to access 'https://sample.com/hogehoge.git': SSL connect error
```

同じく、別ディレクトリで同一サーバーからの `git clone` もできなくなっていました。ただ **BitBucket のリポジトリは同症状なのに GitHub のリポジトリだけは成功してしまう**という困った状態でした。

なお OpenSSL は yum で更新できる最新の状態でした。

## 試行錯誤

### 1. git の SSL 検証を OFF にしてみる

よくある対処法ですが、 SSL/TLS 系のエラーなのは間違いなさそうだったので、 SSL 検証を OFF にしてみましたが、効果はありませんでした。

```
git config --global http.sslVerify false
```

### 2. GitLab 側の認証を外す

GitLab のリポジトリ側の認証をゆるゆるにしてみましたが、エラー内容は変わらず、どうも認証以前にエラーを吐いている様子なので元に戻しました。

### 3. Git のバージョンアップ

Git をソースからコンパイルして最新 (2.11.0) に更新してみましたが、エラーメッセージが微妙に変化しただけで同様のエラーは継続しました。

### 4. curl を更新

調べてみると git が内部で使用している curl でエラーになっているようなので、 libcurl もソースからコンパイルして最新 (7.51.0) に更新しました。

が、 git が参照している curl は yum インストールされているものらしく効果なし。パスを設定し直しても、なぜかかたくなに旧バージョンしか使ってくれず、時間的制限のため、とりあえず断念しました。

### 5. verbose モードで git を実行

curl 関連であることがわかったので、 `export GIT_CURL_VERBOSE=1` で詳細なログを吐くように設定しました。

この状態で `git fetch` をしてみると下記のように表示されました。

```
Cloning into 'hogehoge'...
* Couldn't find host sample.com in the .netrc file; using defaults
* About to connect() to sample.com port 443 (#0)
*   Trying xxx.xxx.xxx.xxx... * Connected to sample.com(xxx.xxx.xxx.xxx) port 443 (#0)
* Initializing NSS with certpath: sql:/etc/pki/nssdb
* NSS error -12286
* Expire cleared
* Closing connection #0
fatal: unable to access 'https://sample.com/hogehoge.git': SSL connect error
```

`NSS error -12286` というエラーから **curl が OpenSSL でなく NSS(Network Security Services) を使用している**ことがわかりました。

ソースから curl をコンパイルすると OpenSSL を使うようになるようですが、前項で断念しているため、とりあえず他の解決法を模索しました。

なお -12286 は SSL_ERROR_NO_CYPHER_OVERLAP を表すエラーです。

## 解決方法

* [cURL doesn't connect to HTTPS while wget does (NSS error -12286) - Unix & Linux Stack Exchange](http://unix.stackexchange.com/questions/280548/curl-doesnt-connect-to-https-while-wget-does-nss-error-12286)

このページで下記のコメントを発見しました。

> Upgrading the nss package (i.e. yum update nss) or using curl -1 might also solve this. – DiegoG Dec 14 at 12:31

後者は git 内部のことなので、前者を試してみた。NSS のバージョンは 3.16.2.3 だったので、 yum で update したところ **3.21.3** に更新されました。

```
yum update nss
```

この状態で git fetch してみると...！問題なく実行できました！！

もちろん git clone も OK。あっけなく解決してしまいました...

## まとめ

というわけで、CentOS 6 の Git でこの問題に当たったときは

```
export GIT_CURL_VERBOSE=1
git fetch
```

をしてみて、 **NSS error** が表示されるようなら

```yum update nss```

してみましょう。

そしてできるだけ CentOS 6 はもうやめて 7 に移行しましょう(泣)


ステージング環境はとても大事だと思い知らされた1件でした。
次回の記事でお会いしましょう。