---
title: "[AWS Certificate Manager] 外部で取得した SSL/TLS 証明書を更新する"
date: 2021-04-01
author: kenzauros
tags: [AWS, SSL]
---

**AWS** の **Certificate Manager** で **SSL/TLS 証明書を更新する**手順をご紹介します。

## 概要

**TLS/SSL 証明書の期限が迫ると Certificate Manager 上で下記のような警告が表示される**ようになります。今回の証明書は後3日の命でした。

<a href="images/reimport-ssl-cerificate-in-aws-certificate-manager-1.png"><img src="images/reimport-ssl-cerificate-in-aws-certificate-manager-1.png" alt="" width="1397" height="1226" class="aligncenter size-full wp-image-16118" /></a>

証明書の期限が切れるといろいろと影響を及ぼしますので早めに更新しましょう。

今回設定する証明書は FujiSSL で取得したワイルドカード証明書です。

## 手順

とはいえ、手順はごくシンプルです。まず、先の画面で**「証明書の再インポート」をクリック**します。

**証明書の選択**ページで**証明書本文、プライベートキー、証明書チェーンを貼り付け**ます。

- **証明書本文**  
証明書自体 (`-----BEGIN CERTIFICATE-----` から `-----END CERTIFICATE-----` まで)
- **プライベートキー**  
証明書発行に用いた秘密鍵 (`-----BEGIN RSA PRIVATE KEY-----` から `-----END RSA PRIVATE KEY-----` まで)
- **証明書チェーン**  
中間CA証明書 (`-----BEGIN CERTIFICATE-----` から `-----END CERTIFICATE-----` まで)  
※複数がつながっている場合はすべて

入力したら**「レビューとインポート」**をクリックします。

<a href="images/reimport-ssl-cerificate-in-aws-certificate-manager-2.png"><img src="images/reimport-ssl-cerificate-in-aws-certificate-manager-2.png" alt="" width="1397" height="759" class="aligncenter size-full wp-image-16119" /></a>

現在と新しい証明書の内容を確認します。**有効期限が延びていれば OK** です。

<a href="images/reimport-ssl-cerificate-in-aws-certificate-manager-3.png"><img src="images/reimport-ssl-cerificate-in-aws-certificate-manager-3.png" alt="" width="1397" height="783" class="aligncenter size-full wp-image-16120" /></a>

更新が完了すると一覧画面で警告が消えているはずです。念のためもう一度有効期限を確認しておきましょう。

<a href="images/reimport-ssl-cerificate-in-aws-certificate-manager-4.png"><img src="images/reimport-ssl-cerificate-in-aws-certificate-manager-4.png" alt="" width="1397" height="783" class="aligncenter size-full wp-image-16123" /></a>

なお、**同じ証明書を複数リージョンで登録している場合は、個別に更新が必要**ですので注意してください。

## まとめ

今回は外部で取得した SSL/TLS 証明書を使って AWS Certificate Manager の証明書を更新する手順を紹介しました。

それにしても SSL/TLS 証明書の期限が1年になり、更新の手間が増えました。

これからも毎年同じことを複数サイトで実施しないといけないかと思うと、自動更新にしたくなりますね。