---
title: "DNS レコードとは"
date: 
author: Lee-juNu
tags: [DNS Record, SPF, DKIM, DMARC ]
description: "DNS レコードに関しての記事を書いています。
"
---

## 挨拶
最近メールサーバーを学んでいるリリです。勉強したことを整理するためにブログに記事として書いてみました。


## DNS TXT レコードとは？

本来の TXT レコードは人が読めるノートを入力する用途だったらしいです。昔の TXT レコードはコーディングするときのコメント見たいな説明を目的としていたイメージですね。

| example.com | レコードのタイプ： | 値：                                       | TTL   |
| ----------- | --------- | ------------------------------------------------- | ----- |
| @           | TXT       | This is an awesome domain! Definitely not spammy. | 32600 |

>Today, two of the most important uses for DNS TXT records are email spam prevention and domain ownership verification, although TXT records were not designed for these uses originally.

現在は機械が読めるレコードを一緒に追加できるようになっています。

追加可能なレコードの機能としてはなりすましまたはスパムなどを防ぐことができる SPF・DKIM・DMARC です。
順番通り調べて見ます。

## SPF（Sender Policy Framework）レコード

### DNS SPF とは？
SPF TXT レコードは特定ドメインからのメール送信が許されたすべてのサーバーをリスト化した一種の DNS TXTレコードです。

### SPF 作成

```
v=spf1 ip4:192.0.2.0 ip4:192.0.2.1 include:examplesender.email -all
```

-　` v=spf1 ` ：SPF レコードとドメインに知らせます。（必須）
-  ` ip=192.0.2.0 ` : 承認するIPアドレス。複数定義可能
- ` include:examplesender.mail ` : 第三者組織がこのドメインに変わってメールを送信することを可能な DNS アドレス、複数定義可能
- ` -all ` 列挙されないすべてのアドレスを拒否する
- ` ~all ` 列挙されないすべてのアドレスをスパムなどで表示はするが許容はしない
- ` +all ` 列挙されなくっても許容する。

ドメインと結びつける SPF は一つだけ許可されます（[RFC4408](https://datatracker.ietf.org/doc/html/rfc4408)）。
> [3.1.2](https://datatracker.ietf.org/doc/html/rfc4408#section-3.1.2).  Multiple DNS Records
   A domain name MUST NOT have multiple records that would cause an
   authorization check to select more than one record.  See [Section 4.5](https://datatracker.ietf.org/doc/html/rfc4408#section-4.5)
   for the selection rules.

## DKIM （DomainKeys Identified Mail）レコード

### DKIM とは？

メールにデジタル署名を追加し、受信メールが送信ドメインから許可された送信者によって送信されたものであることを確認できる機能です。

### DKIM レコード
DKIM レコードは DKIM 公開鍵を保存します。メールサーバーはドメインのDNSレコードを問い合わせて、DKIMレコードを確認し、公開鍵を確認します。


### DKIMレコードの作成

DKIMレコードも SPF と同じく DNS TXT レコードに書かれます。

| 名称                                 | 種類    | 本文                                                                                           | TTL    |
| ---------------------------------- | ----- | -------------------------------------------------------------------------------------------- | ------ |
| `big-email._domainkey.example.com` | `TXT` | `v=DKIM1; p=76E629F05F70   9EF665853333   EEC3F5ADE69A   2362BECE4065   8267AB2FC3CB   6CBE` | `6000` |


- `名称` : DKIMレコードの名前。この例では `big-email._domainkey.example.com` となっており、`big-email` はセレクタ、`_domainkey` は固定のプレフィックスです。
- `本文` : DKIMレコードの内容。以下のように構成されます。
    - `v=DKIM1` : DKIMレコードのバージョンを示します。必須です。
    - `p=76E629...` : 公開鍵の値です。メールのヘッダーに含まれる署名を検証するために使用されます。


## DMARC（Domain-based Message Authenication Reporting And Conformance）レコード

 SPF や DKIMと併用することで送信認証をより強固にし、なりすましなどを防ぐしくみです。 DMARC では、SPF や DKIM と組み合わせて、認証が失敗したときにバウンスさせるかスパムフォルダーに入れるかなおの振る舞いを設定します。

```
v=DMARC1; p=quarantine; adkim=s; aspf=s; 
```

## 終わりに
メールサーバー移行の件を聞いてメールサーバーを一度見てみたいと思いました案件をもらった後に調べている途中一番多く振れたのはこの DNS レコードでした。さすがまだ知らないパソコンの知識を学ぶことは楽しいですね。また別の知識を持ってきます。

## 参考サイト

- CloudFlare
