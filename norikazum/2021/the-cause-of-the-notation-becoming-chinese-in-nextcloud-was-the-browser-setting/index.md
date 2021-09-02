---
title: "[解決] Nextcloud で中国語になってしまう原因はブラウザーの設定だった"
date: 2021-01-28
author: norikazum
tags: [Nextcloud, Chrome, その他の技術]
---

こんにちは。

**Chrome を利用** して [Nextcloud](https://ja.wikipedia.org/wiki/Nextcloud) の評価を行っていて、 **ログイン後の表記が中国語になってしまう現象** に悩まされていました。

<a href="images/the-cause-of-the-notation-becoming-chinese-in-nextcloud-was-the-browser-setting-1.jpg"><img src="images/the-cause-of-the-notation-becoming-chinese-in-nextcloud-was-the-browser-setting-1.jpg" alt="" width="1584" height="1105" class="alignnone size-full wp-image-15479" /></a>

私が悲鳴を上げていたところ、[kenzauros](https://github.com/kenzauros) も同じ環境にログインして確認してくれた結果、「**なってないよ**」との連絡が・・・。

切り分けを行ったところ、 **会社PC・自宅PCのどちらも同じ状態** だったため、**ブラウザーの言語設定が原因ではないか？** とアドバイスをもらい早速確認してみました。
[Chrome の言語の変更とウェブページの翻訳 - パソコン - Google Chrome ヘルプ](https://support.google.com/chrome/answer/173424?co=GENIE.Platform%3DDesktop&hl=ja)

結果・・・ **ビンゴ！** でした。
<a href="images/the-cause-of-the-notation-becoming-chinese-in-nextcloud-was-the-browser-setting-2.jpg"><img src="images/the-cause-of-the-notation-becoming-chinese-in-nextcloud-was-the-browser-setting-2.jpg" alt="" width="1576" height="958" class="alignnone size-full wp-image-15480" /></a>

**中国語がふたつ** 上位に来ている。。

なんでこんなことに、と思いながら **早速削除** しました。
<a href="images/the-cause-of-the-notation-becoming-chinese-in-nextcloud-was-the-browser-setting-3.jpg"><img src="images/the-cause-of-the-notation-becoming-chinese-in-nextcloud-was-the-browser-setting-3.jpg" alt="" width="1228" height="767" class="alignnone size-full wp-image-15481" /></a>

**Nextcloudに戻り F5** ぽち。

**おおおー Good Morning ! 直りました！**
<a href="images/the-cause-of-the-notation-becoming-chinese-in-nextcloud-was-the-browser-setting-4.jpg"><img src="images/the-cause-of-the-notation-becoming-chinese-in-nextcloud-was-the-browser-setting-4.jpg" alt="" width="1247" height="777" class="alignnone size-full wp-image-15482" /></a>

では、なぜ私だけが起きたのか。

**原因は定かではない** ですが、**会社・自宅の環境でChromeにログイン** してるので何らかの原因で設定が同期されたものと推測しています。

ともあれ解決しました。
**同じような現象** に悩まされている方は、是非 **ブラウザーの言語設定をご確認** ください。

それでは次回の記事でお会いしましょう。