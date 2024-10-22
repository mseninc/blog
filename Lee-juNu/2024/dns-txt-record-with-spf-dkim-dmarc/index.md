---
title: "DNSレコード：SPF、DKIM、DMARCの基礎"
date: 
author: Lee-juNu
tags: [Mail Server, DNS Record, SPF, DKIM, DMARC]
description: "DNS レコードの基本であるSPF、DKIM、DMARCについて解説しています。
 最近メールサーバーを初めて調べながら理解する目的として書いたブログ記事です。"
---

## 挨拶

最近、メールサーバーについて学んでいるリリです。DNS レコードを触りながら学んだ内容を整理するために、ブログ記事として書いてみました。

## DNS TXT レコードとは？

### 昔はただのコメントの役割

本来の TXT レコードは人が読めるノートを入力する用途だったらしいです。昔の TXT レコードはコーディングするときのコメントみたいな説明を目的としていたイメージですね。

| example.com | レコードのタイプ | 値                                       | TTL   |
| ----------- | ------------ | ---------------------------------------- | ----- |
| @           | TXT          | This is an awesome domain! Definitely not spammy. | 32600 |

> Today, two of the most important uses for DNS TXT records are email spam prevention and domain ownership verification, although TXT records were not designed for these uses originally.
>
> 現在、DNSのTXTレコードの最も重要な2つの用途は、電子メールのスパム防止とドメイン所有者の確認ですが、元々TXTレコードはこれらの用途のために設計されたものではありません。
>
> <cite>[CLOUDFLARE - DNS TXTレコードとは？](https://www.cloudflare.com/ja-jp/learning/dns/dns-records/dns-txt-record/)</cite>

### 現在の TXT レコードの用途

現在、TXT レコードは単なるコメントのためではなく、SPF や DKIM、DMARC などと呼ばれるプロトコルで、メールの正当性を確認するための重要な役割を担っています。これにより、スパムメールの送信を防ぎ、ドメインの正当な所有者であることを証明するために使われています。

## SPF（Sender Policy Framework）レコード

### SPF レコードとは？

SPF TXT レコードは特定ドメインからのメール送信が許されたすべてのサーバーをリスト化した DNS TXT レコードの一種です。

### SPF レコードの記述方法

```
v=spf1 ip4:192.0.2.0 ip4:192.0.2.1 include:examplesender.email -all
```

- `v=spf1` ：SPF レコードとドメインに知らせます。（必須）
- `ip4:192.0.2.0` : 承認する IP アドレス。複数定義可能
- `include:examplesender.mail` : 第三者組織がこのドメインに代わってメールを送信できる DNS アドレス。複数定義可能
- `-all` : 列挙されないすべてのアドレスを拒否する
- `~all` : 列挙されないすべてのアドレスをスパムなどで表示はするが許容はしない
- `+all` : 列挙されなくても許容する

ドメインと結び付ける SPF は1つだけ許可されます。下記は SPF に関する規則の一例です。

> Multiple DNS Records
>
> A domain name MUST NOT have multiple records that would cause an authorization check to select more than one record.
> See [Section 4.5](https://datatracker.ietf.org/doc/html/rfc4408#section-4.5) for the selection rules.
>
> 複数の DNS レコード
>
> ドメイン名は、認証チェックが複数のレコードを選択するような状況を引き起こす複数のレコードを持ってはなりません。 
> 選択ルールについては [Section 4.5](https://datatracker.ietf.org/doc/html/rfc4408#section-4.5) を参照してください。
>
> <cite>[電子メールのドメイン使用を認証するための送信者ポリシーフレームワーク (SPF)](https://datatracker.ietf.org/doc/html/rfc4408#section-3.1.2)</cite>

## DKIM（DomainKeys Identified Mail）レコード

### DKIM とは？

メールにデジタル署名を追加し、受信メールが送信ドメインから許可された送信者によって送信されたものであることを確認できる機能です。

### DKIM レコードの記述方法

DKIM レコードも SPF と同じく DNS TXT レコードに書かれます。

| 名称                                 | 種類 | 本文                                                                                           | TTL  |
| ------------------------------------ | ---- | ---------------------------------------------------------------------------------------------- | ---- |
| big-email._domainkey.example.com     | TXT  | v=DKIM1; p=76E629F05F70 9EF665853333 EEC3F5ADE69A 2362BECE4065 8267AB2FC3CB 6CBE             | 6000 |

- **名称** : DKIM レコードの名前。この例では `big-email._domainkey.example.com` となっており、`big-email` はセレクター、`_domainkey` は固定のプレフィックスです。
- **本文** : DKIM レコードの内容。以下のように構成されます。
  - `v=DKIM1` : DKIM レコードのバージョンを示します。必須です。
  - `p=76E629...` : 公開鍵の値です。メールのヘッダーに含まれる署名を検証するために使用されます。

申し訳ありません、DMARC レコードの説明が不足していました。簡潔に説明を追加します。

---

## DMARC（Domain-based Message Authentication Reporting and Conformance）レコード

### DMARC とは？

DMARC は、SPF や DKIM と組み合わせてメールのなりすましを防ぐプロトコルです。認証に失敗したメールの処理方法を指定できます。

### DMARC レコードの記述方法

```
v=DMARC1; p=quarantine; adkim=s; aspf=s;
```

- `v=DMARC1` : DMARC のバージョンを示します。
- `p=quarantine` : 認証に失敗したメールを隔離（スパムフォルダに移動）します。
- `adkim=s` : DKIM の判定を厳格（strict）にします。
- `aspf=s` : SPF の判定を厳格にします。

## 終わりに

メールサーバー移行の件を聞いてメールサーバーを一度見てみたいと思いました。案件をもらった後に調べている途中一番多く触れたのはこの DNS レコードでした。まだ知らないパソコンの知識を学ぶことは楽しいですね。また別の知識を持ってきます。

## 参考サイト

- [CloudFlare - DNS TXTレコードとは？](https://www.cloudflare.com/ja-jp/learning/dns/dns-records/dns-txt-record/)
- [電子メールのドメイン使用を認証するための送信者ポリシーフレームワーク (SPF)](https://datatracker.ietf.org/doc/html/rfc4408)
