---
title: "DNSレコード：SPF、DKIM、DMARC とは？"
date: 
author: Lee-juNu
tags: [Mail Server, DNS Record, SPF, DKIM, DMARC]
description: "DNS レコードの基本であるSPF、DKIM、DMARCについて解説しています。
 最近メールサーバーを初めて調べながら理解する目的として書いたブログ記事です。"
---

## 挨拶

最近、メールサーバーについて学んでいるリリです。DNS レコードを触りながら学んだ内容を整理するために、ブログ記事として書いてみました。
## DNS（Domain Name System）とは？

DNS は、インターネット上でドメイン名と IP アドレスを対応付けるシステムです。人間にとって覚えやすいドメイン名（例: example.com）を機械が読み取れる IP アドレス（例: 192.0.2.1）に変換します。これにより、インターネットサービスが円滑に機能しています。

DNS は、さまざまな種類のレコードを持っており、その中の1つが TXT（テキスト）レコードです。

## DNS TXT レコードとは？

### 昔はただのコメントの役割

本来、TXT レコードはドメインに関する情報や管理者の連絡先などを記載する目的で使用されていました。昔の TXT レコードはコーディングするときのコメントみたいな説明を目的としていたイメージですね。

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
- `ip4:192.0.2.0` : 承認する IP アドレス。（複数定義可能）
- `include:examplesender.mail` : 第三者組織がこのドメインに代わってメールを送信できる DNS アドレス。（複数定義可能）
- `-all` : 列挙されないすべてのアドレスを拒否する。
- `~all` : 列挙されないすべてのアドレスをスパムなどで表示はするが許容はしない。
- `+all` : 列挙されなくても許容する。

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

DKIM は、スパムメールなどの悪意のあるものが正当なドメインになりますことを防止するためのメール認定方式です。
その方式ではメールにデジタル署名を追加し、受信メールが送信ドメインから許可された送信者によって送信されたものであることを確認できる機能です。

### DKIM レコードの記述方法

DKIM レコードも SPF と同じく DNS TXT レコードに書かれます。

| 名称 | 種類 | 本文 | TTL |
| ------------------------- | ---- | ---------------------------------------------------------------------------------------------- | ---- |
| example-selector._domainkey.example.com   | TXT  | v=DKIM1; p=76E629F05F70 9EF665853333 EEC3F5ADE69A 2362BECE4065 8267AB2FC3CB 6CBE             | 6000 |


#### 名称
- `セレクター(example-selector)`：DKIM のセレクター名です。セレクター名は、ドメインが使用しているメールサービスプロバイダーが発行する特殊な値です。メールサーバーが DNS で必要な DKIM 検索するように DKIM のヘッダーに含まれています。
- `_domainkey`：_domainkey.は、すべての DKIM レコード名に含まれています。
- `ドメイン名(example.com)`：メールのドメイン名です。

#### 本文
 DKIM レコードの内容。以下のように構成されます。
  - `v=DKIM1` : DKIM レコードのバージョンを示します。（必須）
  - `p=76E629...` : 公開鍵の値です。メールのヘッダーに含まれる署名を検証するために使用されます。

### DKIM ヘッダー

送信側のメールサーバーは、メールヘッダー、メール本文、秘密鍵を用いてデジタル署名を作成します。
この電子署名は、DKIMヘッダーの一部としてメールに挿入されます。

DKIM ヘッダーは、電子メールに挿入される数あるヘッダーの1つです。ほとんどのメールアプリケーションでは、ユーザーが特定のオプションを選択しない限り、ヘッダーは表示されません。

以下に、DKIMヘッダーの例を示します。

```
v=1; a=rsa-sha256; 
        d=example.com; s=example-selector;
        h=from:to:subject;
      bh=uMixy0BsCqhbru4fqPZQdeZY5Pq865sNAnOAxNgUS0s=;
  b=LiIvJeRyqMo0gngiCygwpiKphJjYezb5kXBKCNj8DqRVcCk7obK6OUg4o+EufEbB
tRYQfQhgIkx5m70IqA6dP+DBZUcsJyS9C+vm2xRK7qyHi2hUFpYS5pkeiNVoQk/Wk4w
ZG4tu/g+OA49mS7VX+64FXr79MPwOMRRmJ3lNwJU=
```

- `v=1;` : 使用している DKIM のバージョンです。
- `d=example.com;` : 送信者のドメイン名です。
- `s=example-selector;` : 送信者側サーバーが DNS レコードを検索する際に使用するセレクターです。
- `h=from:to:subect:Date;` : デジタル署名 (`b`) を作成するために使用されるヘッダーフィールドを列挙たものです。通常「From」は必須で、改ざんを防ぐために「To」「Subect」「Date」なども追加されることがあります。
- `bh=uMixy0B…` : メール本文のハッシュ値です。ハッシュ値とは、ハッシュ関数と呼ばれる特殊な数学関数の結果です。この値は、受信側のメールサーバーがメール本文全体を読み込む前に署名を計算できるように含まれています。場合によっては読み込みに時間がかかることもあるため、メール本文は任意の長さにできます。
- `a=rsa-sha256;` : デジタル署名（`b`）の計算と、ハッシュ（`bh`）の生成に使用されるアルゴリズムが指定されます。この例では、RSA-SHA-256が使用されています
- `b=LiIvJeR…` : hとbhから生成された**デジタル署名**で、秘密鍵で署名されたものです。

デジタル署名により、受信サーバーは以下を確認できます。
1. 送信サーバーを認証
2. 電子メールが改ざんされていないことを保証

受信サーバーは、`h` に列挙されているのと同じ内容を取得し、本文のハッシュ値（`bh`）を加え、DKIMレコードの公開鍵を使ってデジタル署名が有効かどうかをチェックすることでこれを行います。正しい秘密鍵が使用され、ヘッダーと本文が変更されていなければ、メールはDKIMチェックを許可します。

## DMARC（Domain-based Message Authentication Reporting and Conformance）レコード

### DMARC とは？

DMARCは、DKIMとSPFをベースに構築された電子メール認証方式です。DMARCには、SPFとDKIMに失敗した電子メールへの対処法が記載されています。SPF、DKIM、DMARCを併用することで、メールスパムやメールスプーフィングを防止できます。DKIMレコードと同様に、DMARCポリシーはDNS TXTレコードとして登録されます。

### DMARC レコードの記述方法

```
v=DMARC1; p=quarantine; adkim=s; aspf=s; rua=mailto:dmarc-reports@example.com;
```

- `v=DMARC1` : DMARC のバージョンを示します。
- `p` : 認証に失敗したメールの処理方法を決定するポリシーです。
    - `none` : 監視モード。処理はせず、レポートのみを送信します（推奨）。
    - `quarantine` : 認証に失敗したメールを隔離します（スパムフォルダに移動）。
    - `reject` : 認証に失敗したメールを拒否します。
- `adkim=s` : DKIM の判定を厳格にします。送信元ドメインと完全に一致する DKIM 署名のみを許可します。（strict）
    - `adkim=r`: サブドメインの DKIM 署名も許可します。 (relaxed) 
- `aspf=s` : SPF の判定を厳格にします。送信元ドメインと完全に一致する SPF のみを許可します。（strict）
    - `aspf=r`  : サブドメインの SPF も許可します。(relaxed)
- `rua=mailto:dmarc-reports@example.com` : 認証結果のレポートを送信するメールアドレスを指定します。DMARCレポートは、メールの認証状況を把握し、設定を調整するために必要です。
    - `rua` : レポーティング URI Aggregateの略で、DMARCの集計レポートの受け取り先を指定します。
    - `malito` : レポートを送信するメールアドレスを指定する際に使うURIスキームです。

## 終わりに

メールサーバー移行の件を聞いてメールサーバーを一度見てみたいと思いました。案件をもらった後に調べている途中一番多く触れたのはこの DNS レコードでした。まだ知らないパソコンの知識を学ぶことは楽しいですね。また別の知識を持ってきます。

## 参考サイト

- [AWS - DNS とは](https://aws.amazon.com/jp/route53/what-is-dns/?nc1=h_ls)
- [CloudFlare - DNS TXTレコードとは？](https://www.cloudflare.com/ja-jp/learning/dns/dns-records/dns-txt-record/)
- [CloudFlare - DNS の DKIM レコードとは？](https://www.cloudflare.com/ja-jp/learning/dns/dns-records/dns-dkim-record/)
- [CloudFlare - DNS の DMARC レコードとは？](https://www.cloudflare.com/ja-jp/learning/dns/dns-records/dns-dmarc-record/)
- [電子メールのドメイン使用を認証するための送信者ポリシーフレームワーク (SPF)](https://datatracker.ietf.org/doc/html/rfc4408)
