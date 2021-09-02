---
title: "[証明書] Rapid-SSL で取得した証明書を更新する"
date: 2019-09-13
author: norikazum
tags: [SSL, 証明書, その他の技術]
---

こんにちは。

今回はRapid-SSLで取得している証明書を更新する方法を紹介します。

1. Rapid-SSLへ接続します。
[SSL証明書 RapidSSL 4300円 ワイルドカード 39000円 (RapidSSL Strategic Partner)](https://www.rapid-ssl.jp/)

1. **更新お申込** をクリックします。
![](images/renew-a-certificate-acquired-with-rapid-ssl-1.png)

1. 最下部にスクロールし、 **お申し込みフォームへ** へ進みます。
![](images/renew-a-certificate-acquired-with-rapid-ssl-2.png)

1. 以下を参考に入力します。ページ中のCSRはCSR作成ツールを利用します。
![](images/renew-a-certificate-acquired-with-rapid-ssl-3.png)
[Rapid-SSL.jp 秘密鍵＆CSR(証明書署名要求)作成ツール2048ビット対応版](https://securitycenter.rapid-ssl.jp/tools/makePkeyCsr2048SHA2.php)

1. 別ページで作成されますので、ページを閉じずに置いておきます。
![](images/renew-a-certificate-acquired-with-rapid-ssl-4.png)

1. 作成したCSRを入力、各項目を入力して **作成** をクリックします。(ここまでは **手順4と同じ画面** です）
![](images/renew-a-certificate-acquired-with-rapid-ssl-5.png)

1. 内容を確認し、進みます。
![](images/renew-a-certificate-acquired-with-rapid-ssl-6.png)

1. 担当者情報を入力します。
今回の紹介では、**発行承認はファイルアップロードで承認** を選択します。
![](images/renew-a-certificate-acquired-with-rapid-ssl-7.png)
![](images/renew-a-certificate-acquired-with-rapid-ssl-8.png)

1. 申し込みを確定します。
![](images/renew-a-certificate-acquired-with-rapid-ssl-9.png)

1. 決済情報を入力し、決済します。
![](images/renew-a-certificate-acquired-with-rapid-ssl-10.png)

1. 承認のために、 **http(s)://documentroot/well-known/pki-validation/fileauth.txt** にメールで指定された文字列(PIN)を記載したファイルを配置します。配置すると、 **10分ほど** で　**「【通知】 SSL サーバ証明書発行完了のお知らせ」** というタイトルのメールが到着します。
以下から状況を確認することもできます。
[SSL サーバ証明書 RapidSSL RapidSSLワイルドカード サポートページ](https://securitycenter.rapid-ssl.jp/rapidssl-support/ssl-support.htm)
承認されたあとは、 **fileauth.txtを削除** しましょう。

1. 証明書はメール本文に記載されていますので、CSR発行時にコピーした秘密鍵を更新してWebサービスを再起動して反映します。

以上で簡単に証明書を更新することができます。
参考になれば幸いです。

それでは次回の記事でお会いしましょう。