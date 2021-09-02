---
title: Acronis で復元を実施すると Segmentation fault になる
date: 2019-12-19
author: norikazum
tags: [Acronis, その他の技術]
---

こんにちは。

以前、Acronisを利用して復元をしようとすると **Segmentation fault** が発生しました。

復元できないと路頭に迷っていたのですが、ブートディスクの起動メニューで **64ビット版を選んだら解決した** という記事です

復元方法は、Acronisの機能から作成したブートディスク(CD)から、復元する流れです。
<a href="images/segmentation-fault-when-restoring-with-acronis-1.png"><img src="images/segmentation-fault-when-restoring-with-acronis-1.png" alt="" width="1295" height="477" class="alignnone size-full wp-image-11703" /></a>

発生したバージョンは少し古いですが　`Acronis True Image 2016` です。

## 発生までの流れ

1. 通常のブートメニューを選択します
<a href="images/segmentation-fault-when-restoring-with-acronis-2.jpg"><img src="images/segmentation-fault-when-restoring-with-acronis-2.jpg" alt="" width="1613" height="1210" class="alignnone size-full wp-image-11706" /></a>

1. 復元ボタンを押します
発生タイミングは、復元を進んで開始する直前や、この画像のボタンを押した瞬間に発生するなど複数のパターンが確認できました。
<a href="images/segmentation-fault-when-restoring-with-acronis-3.jpg"><img src="images/segmentation-fault-when-restoring-with-acronis-3.jpg" alt="" width="1613" height="1210" class="alignnone size-full wp-image-11707" /></a>

1. **Segmentation fault, addr=0x79E6C3E1** が発生
<a href="images/segmentation-fault-when-restoring-with-acronis-4.jpg"><img src="images/segmentation-fault-when-restoring-with-acronis-4.jpg" alt="" width="1613" height="1210" class="alignnone size-full wp-image-11708" /></a>

## 回避方法

方法といっても、ブートの選択で **64bit版を選択する** だけです。
<a href="images/segmentation-fault-when-restoring-with-acronis-5.jpg"><img src="images/segmentation-fault-when-restoring-with-acronis-5.jpg" alt="" width="1613" height="1210" class="alignnone size-full wp-image-11709" /></a>

無事、復元が開始されました。
<a href="images/segmentation-fault-when-restoring-with-acronis-6.jpg"><img src="images/segmentation-fault-when-restoring-with-acronis-6.jpg" alt="" width="1613" height="1210" class="alignnone size-full wp-image-11710" /></a>

## あとがき

当時、現象をAcronisのチャットサービスに問い合わせたのですが、事例がないということでした。

まさか、64ビットで解決するとは思っていなかったので意外に時間がかかりました。
1名でも同じ現象になった方が救われますように。

それでは次回の記事でお会いしましょう。
