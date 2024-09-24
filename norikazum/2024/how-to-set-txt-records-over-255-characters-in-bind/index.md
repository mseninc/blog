---
title: "BINDで255文字超のTXTレコードを設定する方法"
date: 2024-09-20
author: norikazum
tags: [BIND,DNS,DKIM]
description: "BINDでDKIMレコード設定時にsyntax errorが発生し、原因はTXTレコードの255文字制限でした。複数文字列に分割して回避しました。"
---

こんにちは。

先日、BINDに **DKIM レコード** を設定すると、**syntax error** で設定できない状態になりました。

解決前に少し時間がかかったので原因と方法を記事にしました。

## 原因
Red Hat の公開情報で、**TXT レコードは、文字列あたり 255 文字に制限されています** という記述を確認しました。

[バインドは 255 文字を超える TXT レコードのコンテンツをサポートしますか? - Red Hat Customer Portal](https://access.redhat.com/ja/solutions/7056227)

- bind 9.8.2 で TXT リソースレコードを作成すると、invalid rdata format: ran out of space というエラーが発生します。

- bind 9.11.20 で TXT リソースレコードを作成すると、dns_rdata_fromtext: example.db:XX: syntax error というエラーが発生して起動に失敗します。

## 回避策
[RFC 4408](https://datatracker.ietf.org/doc/html/rfc4408#section-3.1.3) で定義されているように、複数の文字列を使用することです。TXT リソースレコードの文字列コンテンツは、以下の方法で連結されます。

```bash:title=zone&nbsp;string
example.com. 3600 IN TXT "first string" " second string"
```

2 番目の文字列の最初の文字は空白スペースであるため、"first string second string" と読み取られます。文字列はすぐに連結されるため、空白スペースがない場合は "first stringsecond string" と読み取られることに注意してください。

[転記元 : バインドは 255 文字を超える TXT レコードのコンテンツをサポートしますか? - Red Hat Customer Portal](https://access.redhat.com/ja/solutions/7056227)

## `bind 9.16` に設定したレコード
実際に設定したレコードは以下のとおりです。
※値はマスキングしています。


```bash:title=zone&nbsp;string
DKIM-2024081720454._domainkey.example.com. IN TXT (
    "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgAAAQEAzOOQxLUv9HVtTtfAZ0rlBTcZOYVEiLCVtmVyzU"
    "GXUO+S9-gIAKDyTnkv7H70DUlkuCduBe+6efwYwpZSACCaQ3TILF2ZDg4WL9S/3KBWIU7jEc/jEmuW/Ii0ae+eacyAjAWQRtDZovH"
    "3VwC1*GCR6aO7VFHKQw/*vOBITGycK*p8nfRjYm+t*ls/xEFgrORDyi*s23Pg5Z8OrdNlyon1zmarOtEdwV6c1Cq6GY0CqJ6V8SEf"
    "9rzF*rcDV/jXN2iW6DL1DybeUMA+7n*ldgmY09nIfe3AXyo2HueAFCnMB*xdPn1oCtkuhtFI5Lmk8ybw8MclfX+GL7Bt6KcIyq9df"
    "QID*QAB"
)
```

参考になれば幸いです。
それでは次回の記事でお会いしましょう。
