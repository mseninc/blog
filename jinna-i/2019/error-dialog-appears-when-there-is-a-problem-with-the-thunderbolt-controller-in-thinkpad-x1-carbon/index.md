---
title: ThinkPad X1 Carbon (5th) で Thunderbolt コントローラーに問題があるとエラーダイアログが出る
date: 2019-08-29
author: jinna-i
tags: [ThinkPad, Thunderbolt, その他の技術]
---

こんにちは、じんないです。

ここのところ、 USB-C にやディスプレイ出力のケーブルを接続すると以下のエラーダイアログが表示されることがありました。

> Thunderbolt コントローラーに問題があり、新しいファームウェアをインストールしないとデバイスまたは他のコンピューターに接続できません。他の Thunderbolt ポートは正常に機能していることがあります。 PC の製造元にファームウェアの更新についてお問い合わせになり、 Thunderbolt の機能を完全に復元してください。

<a href="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-1.png"><img src="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-1.png" alt="" width="413" height="180" class="alignnone size-full wp-image-10565" /></a>

Thunderbolt ソフトウェアの詳細を見ても警告が出ています。

<a href="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-2.png"><img src="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-2.png" alt="" width="433" height="487" class="alignnone size-full wp-image-10566" /></a>

充電できなくなったり、ディスプレイ出力がうまくいかなかったりという不具合は無かったのですが、何度も出てくるので対処してみました。

## 環境
- Lenovo ThinkPad X1 Carbon (5th)
- Windows 10 Pro 1809

## Lenovo Vantage の更新では解消されない

気づいたときに Lenovo Vantage からシステム更新を実施していますが、システムが最新の状態であっても事象が改善されることはありませんでした。
まだやったことないって人はとりあえず更新しておくことをオススメします。

ここで、下部に表示されている **シリアル番号**、**製品番号** は次項で役立ちますので控えておきましょう。

<a href="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-3.png"><img src="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-3.png" alt="" width="1002" height="834" class="alignnone size-full wp-image-10568" /></a>

## Thunderbolt ファームウェアをアップデートする

[Lenovo のサポートページ](https://support.lenovo.com/jp/ja/home)へアクセスし、前項で確認したシリアル番号または製品番号で検索します。

<a href="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-4.png"><img src="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-4.png" alt="" width="1764" height="1301" class="alignnone size-full wp-image-10570" /></a>

製品ホームから thunderbolt で検索します。

<a href="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-5.png"><img src="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-5.png" alt="" width="1761" height="630" class="alignnone size-full wp-image-10572" /></a>

Thunderbolt のファームウェアアップデートがあるので、ダウントード&インストールします。
※画像は 2019/7/2 リリースのものですが、執筆時の最新は 2019/8/21 となっていました。 

<a href="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-6.png"><img src="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-6.png" alt="" width="1894" height="930" class="alignnone size-full wp-image-10573" /></a>

<a href="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-7.png"><img src="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-7.png" alt="" width="979" height="512" class="alignnone size-full wp-image-10575" /></a>

インストールが完了したら再起動します。
再起動後は Thunderbolt ソフトウェアの詳細から警告が消えていることを確認しました。

<a href="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-8.png"><img src="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-8.png" alt="" width="386" height="487" class="alignnone size-full wp-image-10583" /></a>

ファームウェアのアップデート以後、エラーダイアログが表示されることはありませんでした。

これにて解決です。めでたしめでたし。

## 【おまけ】4K 外部モニターで Hulu が観れるようになった

余談ですが、このファームウェアのアップデート前に USB-C 出力の外部モニター(4K) で hulu を見ようとすると以下のエラーが出て何も視聴できませんでしたが、アップデートを実施すると無事に見れるようになりました。笑
こちらもめでたしめでたしです。

<a href="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-9.png"><img src="images/error-dialog-appears-when-there-is-a-problem-with-the-thunderbolt-controller-in-thinkpad-x1-carbon-9.png" alt="" width="582" height="334" class="alignnone size-full wp-image-10577" /></a>

[Huluで「動画の再生中に問題が発生しました。更新ボタンを押していただくか、インターネットの接続状況をご確認ください。」のエラーメッセージが表示されます。 | Huluカスタマーサポート - Hulu Helpcenter](https://help.happyon.jp/faq/show/2993?back=front%2Fcategory%3Ashow&category_id=282&page=1&site_domain=jp&sort=sort_access&sort_order=desc)

ではまた。