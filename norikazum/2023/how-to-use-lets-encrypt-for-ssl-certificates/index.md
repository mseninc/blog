---
title: "SSL証明書にLet's Encryptを使う方法"
date: 
author: norikazum
tags: [証明書,SSL,Red Hat]
description: ""
---

こんにちは。

今回の記事は、SSL証明書に Let's Encrypt（レッツ・エンクリプト）を使ってみよう といものです。

SSL証明書の有効期間は **年々短縮され2020年には1年 + 1ヶ月** になりました。

この流れによりサーバー管理者は、毎年SSL証明書の発行・更新の作業を忘れず行う必要があり作業負荷が大きくなっています。

期間短縮の背景などは、以下のサイトが分かりやすかったのでよければ参考にしてください。

[何度も短縮し過ぎ？！SSL証明書の有効期間がどんどん短くなる理由とは？ | さくらのSSL](https://ssl.sakura.ad.jp/column/shortened-ssl/)

> Let's Encrypt（レッツ・エンクリプト）は、非営利団体のInternet Security Research Group（英語版）（ISRG）により運営されている証明書認証局で、TLSのX.509証明書を無料で発行している。証明書の有効期間は90日で、期間内のいつでも証明書の再発行を行うことができる。発行はすべて自動化されたプロセスで行われており、安全なウェブサイトを実現するために、証明書の作成、受け入れテスト、署名、インストール、更新を手動で行う必要があった問題を克服するように設計されている。2016年4月に正式に開始された。

[Wikipedia抜粋](https://ja.wikipedia.org/wiki/Let's_Encrypt)

Red Hat Enterprise Lnux 9 での内容を記載します。

## 必要条件
- Webサービスが稼働していること
- `80/TCP` がオープンしていること

## 筆応