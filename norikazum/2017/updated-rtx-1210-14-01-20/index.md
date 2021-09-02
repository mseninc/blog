---
title: YAMAHA RTX1210 のファームウェアを14.01.20にネットワークアップデートしてみた
date: 2017-11-24
author: norikazum
tags: [その他の技術]
---

こんにちは。

YAMAHAの中小規模拠点向けVPNルーターであるRTX1210に、気になる機能「[Amazon VPCとのVPN接続(API方式)](http://www.rtpro.yamaha.co.jp/RT/docs/cloud_vpn/amazon-vpc_api.html)」が追加されたのでファームウェアを14.01.20にアップデートしてみました。

リリースノートは[こちら](http://www.rtpro.yamaha.co.jp/RT/docs/relnote/Rev.14.01/relnote_14_01_20.html
)です。
14.01.20は、投稿時点で最新でバグについても38項目で修正されているため適用をおすすめします。

今回は完全にリモートで実施し、ちゃんと上がってくるかな・・・とドキドキしながらこの記事を書いてみました。

## アップデート手順
1. Web画面にアクセスし、管理権限でログインします。

1. **管理**から**ファームウェア更新**に進みます。
<a href="images/updated-rtx-1210-14-01-20-1.png"><img src="images/updated-rtx-1210-14-01-20-1.png" alt="" width="838" height="540" class="aligncenter size-full wp-image-5584" /></a>

1. **ネットワーク経由でファームウェアファイルを確認後に更新します** へ進みます。
<a href="images/updated-rtx-1210-14-01-20-2.png"><img src="images/updated-rtx-1210-14-01-20-2.png" alt="" width="1545" height="861" class="aligncenter size-full wp-image-5585" /></a>

1. 更新可能なファームを確認し、**実行** を選択します。
<a href="images/updated-rtx-1210-14-01-20-3.png"><img src="images/updated-rtx-1210-14-01-20-3.png" alt="" width="1564" height="875" class="aligncenter size-full wp-image-5586" /></a>

1. ライセンス契約を**同意**します。
<a href="images/updated-rtx-1210-14-01-20-4.png"><img src="images/updated-rtx-1210-14-01-20-4.png" alt="" width="1515" height="1028" class="aligncenter size-full wp-image-5587" /></a>

1. 前項の同意をクリックした時点でアップデートが始まります。

1. しばらくすると以下の画面が出るので、**トップへ戻る**を選択します。再起動は一瞬で完了しました。
<a href="images/updated-rtx-1210-14-01-20-5.png"><img src="images/updated-rtx-1210-14-01-20-5.png" alt="" width="474" height="300" class="aligncenter size-full wp-image-5588" /></a>

1. バージョンを確認すると正常に上がっていました。特に問題もなく無事完了です。
<a href="images/updated-rtx-1210-14-01-20-6.png"><img src="images/updated-rtx-1210-14-01-20-6.png" alt="" width="419" height="160" class="aligncenter size-full wp-image-5589" /></a>

AWSとRTX1210の連携記事は是非書きたいと思っていますのでお楽しみに。