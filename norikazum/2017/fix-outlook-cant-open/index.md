---
title: Outlookが「このフォルダーセットを開けません」となって開けない！
date: 2017-08-18
author: norikazum
tags: [Office365, Windows]
---

こんにちは。

弊社はメールにOffice365を利用しており、PCでの受信は主にOutlookを使って利用しているのですが、先日契約しているライセンス種別を変更したところ、以下のエラーでOutlookアプリが開かなくなりました。

>Microsoft Outlookを起動できません。Outlook ウィンドウを開けません。このフォルダーのセットを開けません。インフォメーション ストアを開けませんでした。

<a href="images/fix-outlook-cant-open-1.png"><img src="images/fix-outlook-cant-open-1.png" alt="" width="680" height="290" class="aligncenter size-full wp-image-5096" /></a>

とにかくいろいろ開けないみたいです。
早速復旧に向けてチャレンジしましょう。

環境は、**Windows 10** + **Outlook2016**です。

## Outlook 個人用フォルダー ファイル (.pst) を修復する

1. 修復ツールを開きます。`C:\Program Files (x86)\Microsoft Office\root\Office16\SCANPST.EXE`
1. 参照から、PSTファイルを指定し、開始をクリックします。
<a href="images/fix-outlook-cant-open-2.png"><img src="images/fix-outlook-cant-open-2.png" alt="" width="608" height="507" class="aligncenter size-full wp-image-5098" /></a>
PSTファイルは、標準設定では各ユーザーの ドキュメント フォルダに存在します。
ユーザー名が **username** とすると、**C:\Users\username\Documents\Outlook ファイル\Outlook.pst** にあります。
1. **修復する前にスキャンしたファイルのバックアップを作成** にチェックを入れた状態で、**修復** をクリックします。バックアップファイルは、同じフォルダにできます。
<a href="images/fix-outlook-cant-open-3.png"><img src="images/fix-outlook-cant-open-3.png" alt="" width="601" height="540" class="aligncenter size-full wp-image-5099" /></a>
もし、エラーがなければ以下のような結果になります。
<a href="images/fix-outlook-cant-open-4.png"><img src="images/fix-outlook-cant-open-4.png" alt="" width="601" height="540" class="aligncenter size-full wp-image-5100" /></a>
1. 修復が完了し、無事Outlookが開きました！
<a href="images/fix-outlook-cant-open-5.png"><img src="images/fix-outlook-cant-open-5.png" alt="" width="370" height="247" class="aligncenter size-full wp-image-5101" /></a>
<a href="images/fix-outlook-cant-open-6.png"><img src="images/fix-outlook-cant-open-6.png" alt="" width="1667" height="1136" class="aligncenter size-full wp-image-5102" /></a>

発生原因は定かでないのですが、同じエラーの方は試して見る価値はありそうです。
それでは次回の記事でお会いしましょう。