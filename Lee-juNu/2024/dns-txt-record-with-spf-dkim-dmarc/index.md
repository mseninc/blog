---
title: "DNSレコード：SPF、DKIM、DMARCの基礎"
date: 
author: Lee-juNu
tags: [Mail Server, DNS Record, SPF, DKIM, DMARC]
description: "DNS レコードの基本であるSPF、DKIM、DMARCについて解説しています。
 最近メールサーバーを初めて調べながら理解する目的として書いたブログ記事です。"
---

## 挨拶
最近、メールサーバーについて学んでいるリリです。DNSレコードを触りながら学んだ内容を整理するために、ブログ記事として書いてみました。

## DNS TXT レコードとは？

### 昔はただのコメントの役わり

本来の TXT レコードは人が読めるノートを入力する用途だったらしいです。昔の TXT レコードはコーディングするときのコメント見たいな説明を目的としていたイメージですね。

| example.com | レコードのタイプ： | 値：                                       | TTL   |
| ----------- | --------- | ------------------------------------------------- | ----- |
| @           | TXT       | This is an awesome domain! Definitely not spammy. | 32600 |

> Today, two of the most important uses for DNS TXT records are email spam prevention and domain ownership verification, although TXT records were not designed for these uses originally.
>
> 現在、DNS TXTレコードの最も重要な使用用途は、メールのスパム防止とドメイン所有権の確認ですが、TXTレコードはもともとこれらの用途のために設計されたものではありません。

### 現在のTXTレコードの用途

現在、TXTレコードは単なるコメントのためではなく、SPF や DKIM、DMARC などと呼ばれるプロトコルで、メールの正当性を確認するための重要な役割を担っています。
これにより、スパムメールの送信を防ぎ、ドメインの正当な所有者であることを証明するために使われています。

## SPF（Sender Policy Framework）レコード

### DNS SPF とは？
SPF TXT レコードは特定ドメインからのメール送信が許されたすべてのサーバーをリスト化した一種の DNS TXTレコードです。

### SPF 作成

```
v=spf1 ip4:192.0.2.0 ip4:192.0.2.1 include:examplesender.email -all
```

-　` v=spf1 ` ：SPF レコードとドメインに知らせます。（必須）
-  ` ip=192.0.2.0 ` : 承認するIPアドレス。複数定義可能
- ` include:examplesender.mail ` : 第三者組織がこのドメインに変わってメールを送信すること可能な DNS アドレス、複数定義可能
- ` -all ` 列挙されないすべてのアドレスを拒否する
- ` ~all ` 列挙されないすべてのアドレスをスパムなどで表示はするが許容はしない
- ` +all ` 列挙されなくっても許容する。

ドメインと結び付る SPF は1つだけ許可されます。（[RFC4408](https://datatracker.ietf.org/doc/html/rfc4408)）

[3.1.2](https://datatracker.ietf.org/doc/html/rfc4408#section-3.1.2).  

> Multiple DNS Records
>
> A domain name MUST NOT have multiple records that would cause an authorization check to select more than one record.
> See [Section 4.5](https://datatracker.ietf.org/doc/html/rfc4408#section-4.5) for the selection rules.
>
> 複数のDNSレコード
>
> ドメイン名は、認証チェックが複数のレコードを選択するような状況を引き起こす複数のレコードを持ってはなりません。 
> 選択ルールについては[Section 4.5](https://datatracker.ietf.org/doc/html/rfc4408#section-4.5)を参照してください。

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


- `名称` : DKIMレコードの名前。この例では `big-email._domainkey.example.com` となっており、`big-email` はセレクター、`_domainkey` は固定のプレフィックスです。
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
