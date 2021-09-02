---
title: 2020年11月30日からESETが原因でThunderbirdでメールが受信できない
date: 2020-12-04
author: norikazum
tags: [Thunderbird, ESET, Windows]
---

こんにちは。

**2020年12月3日に** 得意先のお客様から、 **「メールが送信できるが受信ができない」と問合せ** がありました。
お客様は、**ThunderbirdでX Serverで作成したメールアカウントを利用** されています。

**結論からですが、ESETプロトコルフィルタリングでThunderbirdを除外すると解決** しました。

調査すると、**メーカーページでも公表** されていました。
執筆時点では、 **原因は、調査中です** となっており、発生日時は、 **2020年11月30日 18時40分頃～** となっていました。

[Thunderbirdでメールの送信や受信ができない | ESETサポート情報](https://eset-support.canon-its.jp/faq/show/18092?back=front%2Fcategory%3Ashow&category_id=35&page=1&site_domain=default&sort=sort_access&sort_order=desc)

現象が発生したPCには、 **ESET Internet Secrurity 14.0.22.0** がインストールされていました。
<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-1.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-1.jpg" alt="" width="849" height="770" class="alignnone size-full wp-image-15066" /></a>

ESET のサポートページには記述されていますが、この現象が発生する対象の環境は Windows の模様です。

## 現状確認
- 受信トレイを見ると **11月26日からメールが受信できていません** でした
<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-2.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-2.jpg" alt="" width="1547" height="671" class="alignnone size-full wp-image-15064" /></a>

## ESET の設定を変更する
1. **ESET Internet Securityを開く** をクリックします
<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-3.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-3.jpg" alt="" width="431" height="463" class="alignnone size-full wp-image-15067" /></a>

1. **設定** を開きます
<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-4.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-4.jpg" alt="" width="1114" height="775" class="alignnone size-full wp-image-15068" /></a>

1. **ネットワーク保護** をクリックします 
<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-5.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-5.jpg" alt="" width="1123" height="771" class="alignnone size-full wp-image-15069" /></a>

1. **電子メールクライアント保護 の 歯車** をクリックします<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-6.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-6.jpg" alt="" width="1123" height="771" class="alignnone size-full wp-image-15070" /></a>

1. **WEBとメール から 対象外のアプリケーションの編集** をクリックします
<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-7.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-7.jpg" alt="" width="1108" height="756" class="alignnone size-full wp-image-15076" /></a>

1. **対象外のアプリケーションを追加** します
<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-8.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-8.jpg" alt="" width="984" height="619" class="alignnone size-full wp-image-15072" /></a>

1. **Thnderbird のパス** を `C:\Program Files (x86)\Mozilla Thunderbird\thunderbird.exe` と入力しOKをクリックします
<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-9.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-9.jpg" alt="" width="528" height="392" class="alignnone size-full wp-image-15073" /></a>

1. **OKをクリックし設定を確定** します
<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-10.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-10.jpg" alt="" width="982" height="613" class="alignnone size-full wp-image-15074" /></a>

1. **Thunderbird を再起動すると無事受信**できました
<a href="images/eset-now-screams-in-thunderbird-from-november-30-2020-11.jpg"><img src="images/eset-now-screams-in-thunderbird-from-november-30-2020-11.jpg" alt="" width="1546" height="1063" class="alignnone size-full wp-image-15075" /></a>

## 事例多数
調べていると、同現象に見舞われている方が多数おられました。
メーカーの公表が待たれますね。

[2020年12月1日からThunderbird + ESETのパソコンでメールが受信できない！ | ブルーオーブのブログ](https://ameblo.jp/redsun2100/entry-12641627747.html)

[Thunderbirdで急にメールが受信できなくなったのですが以下情報で原因わ... - Yahoo!知恵袋](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q14235234289)

