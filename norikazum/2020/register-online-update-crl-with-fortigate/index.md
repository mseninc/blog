---
title: "[ネットワーク] Fortigateにオンライン更新のCRLを登録する"
date: 2020-06-01
author: norikazum
tags: [ネットワーク, 証明書, Fortigate, その他の技術]
---

こんにちは。

今回は、Fortigateに **オンライン更新のCRLを登録** する方法を紹介します。

**CRLは** 以下を参考にしていただければと思いますが、
**失効された証明書の一覧** のことで接続しようとしているサイトなどの **証明書の有効性を確認する** 大事なリストです。
[JPRS用語辞典｜CRL（Certificate Revocation List：証明書失効リスト）](https://jprs.jp/glossary/index.php?ID=0241)

<a href="images/register-online-update-crl-with-fortigate-1.png"><img src="images/register-online-update-crl-with-fortigate-1.png" alt="" width="416" height="279" class="alignnone size-full wp-image-12958" /></a>
[PKI関連技術に関するコンテンツ](https://www.ipa.go.jp/security/pki/042.html)
※IPA抜粋

**CRLは定期的に更新** されるため、最新のリストを取得しておく必要があり、
公開されているリポジトリにアクセスして **自動で更新** されることが理想です。

今回の記事では、 **UPKI** と **Windows証明書サービス** のCRLをFortigateにインポートする方法を紹介します。

# 環境
* Fortigate 60E
* ファームウェア v6.0.9 

## 共通設定

**証明書メニューは標準で非表示** になっているため、 **システム→表示機能設定** から **表示を有効** にします。
<a href="images/register-online-update-crl-with-fortigate-2.png"><img src="images/register-online-update-crl-with-fortigate-2.png" alt="" width="921" height="843" class="alignnone size-full wp-image-12959" /></a>

**管理者でログイン** し、 **システム→証明書→インポート→CRL** と進みます。
<a href="images/register-online-update-crl-with-fortigate-3.png"><img src="images/register-online-update-crl-with-fortigate-3.png" alt="" width="1409" height="828" class="alignnone size-full wp-image-12960" /></a>
**↓**
<a href="images/register-online-update-crl-with-fortigate-4.png"><img src="images/register-online-update-crl-with-fortigate-4.png" alt="" width="989" height="352" class="alignnone size-full wp-image-12992" /></a>

この画面までを共通設定とします。

## UPKI の場合

### URLの確認
リポジトリのURLを以下から確認します。
[国立情報学研究所 オープンドメイン認証局 リポジトリ](https://repo1.secomtrust.net/sppca/nii/odca3/)

<a href="images/register-online-update-crl-with-fortigate-5.png"><img src="images/register-online-update-crl-with-fortigate-5.png" alt="" width="1319" height="424" class="alignnone size-full wp-image-12962" /></a>

もしくは、 UPKIで発行された **証明書を開き詳細タブのCRL配布ポイント** からも確認できます。
<a href="images/register-online-update-crl-with-fortigate-6.png"><img src="images/register-online-update-crl-with-fortigate-6.png" alt="" width="587" height="734" class="alignnone size-full wp-image-12963" /></a>

URLは、 `http://repo1.secomtrust.net/sppca/nii/odca3/fullcrlg5.crl`  であることが分かりました。

### 設定
前項の共通設定から、 **HTTPボタンをON** にし、 **URLを貼り付けます。**
<a href="images/register-online-update-crl-with-fortigate-7.png"><img src="images/register-online-update-crl-with-fortigate-7.png" alt="" width="996" height="802" class="alignnone size-full wp-image-12964" /></a>

少し時間が経つと、ステータスがOKになります。
<a href="images/register-online-update-crl-with-fortigate-8.png"><img src="images/register-online-update-crl-with-fortigate-8.png" alt="" width="1169" height="693" class="alignnone size-full wp-image-12965" /></a>

設定できたCRLをダブルクリックし有効期限を確認すると最新になっていることが分かります。
更新日以降に再度確認すると更新することが分かります。
<a href="images/register-online-update-crl-with-fortigate-9.png"><img src="images/register-online-update-crl-with-fortigate-9.png" alt="" width="949" height="759" class="alignnone size-full wp-image-12966" /></a>

これで **自動的にUPKIのCRLが更新** されます。

## Windows証明書サービス の場合

### URLの確認
今回紹介の方法は、**証明書サービスが動作しているサーバーがADであること** を前提としています。

証明書サービスから **発行された証明書ファイルを開き**、 **詳細タブのCRL配布ポイント** を確認します。

<a href="images/register-online-update-crl-with-fortigate-10.png"><img src="images/register-online-update-crl-with-fortigate-10.png" alt="" width="472" height="586" class="alignnone size-full wp-image-12970" /></a>

黄色く塗っている部分の、 **?の手前** までのアドレスをコピーします。

以下が参考になります。
[Technical Note: Using LDAP for CRL updates](https://kb.fortinet.com/kb/viewContent.do?externalId=FD35052)

### LDAPサーバの登録

**ユーザー&デバイス→LDAPサーバー→新規登録** と進みます。
<a href="images/register-online-update-crl-with-fortigate-11.png"><img src="images/register-online-update-crl-with-fortigate-11.png" alt="" width="1410" height="796" class="alignnone size-full wp-image-12971" /></a>

以下の画像を参考に登録します。

<a href="images/register-online-update-crl-with-fortigate-12.png"><img src="images/register-online-update-crl-with-fortigate-12.png" alt="" width="808" height="516" class="alignnone size-full wp-image-12972" /></a>
①任意名
②ADのIPアドレス
③LDAPポート番号
④デフォルトのまま
⑤前項で確認したアドレスを貼付
⑥レギュラー
⑦ADに接続するユーザー
⑧⑦のパスワード

## 設定
前項の共通設定から、 **LDAPボタンをON** にし、 **LDAPサーバーに前項で登録したサーバーを選択** し、 **ユーザー名・パスワード** は **LDAPサーバー登録と同じもの** を入力します。

<a href="images/register-online-update-crl-with-fortigate-13.png"><img src="images/register-online-update-crl-with-fortigate-13.png" alt="" width="792" height="543" class="alignnone size-full wp-image-12973" /></a>

少し時間が経つと、ステータスがOKになります。
<a href="images/register-online-update-crl-with-fortigate-14.png"><img src="images/register-online-update-crl-with-fortigate-14.png" alt="" width="1159" height="614" class="alignnone size-full wp-image-12974" /></a>

設定できたCRLをダブルクリックし有効期限を確認すると最新になっていることが分かります。
更新日以降に再度確認すると更新することが分かります。
<a href="images/register-online-update-crl-with-fortigate-15.png"><img src="images/register-online-update-crl-with-fortigate-15.png" alt="" width="1077" height="803" class="alignnone size-full wp-image-12983" /></a>

これで  **自動的にWindows証明書サービスのCRLが更新** されます。

Windows証明書サービスの設定に少しはまりました。
参考になれば幸いです。

それでは次回の記事でお会いしましょう。