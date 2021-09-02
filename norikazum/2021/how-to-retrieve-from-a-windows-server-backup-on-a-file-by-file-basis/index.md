---
title: Windows Server バックアップデータ からファイルを復元する方法
date: 2021-07-23
author: norikazum
tags: [Windows Server, バックアップ, Windows Server バックアップ, Windows]
---

こんにちは。

お客様から「バックアップデータから過去のファイルを取り出せますか？」と問合せがあり、いざ実施しようと思ったらすぐに分からなかったので **Windows Server バックアップデータ からファイルを復元する方法** をメモ代わりに記事にしました。

## やりたいこと
- Windows Server バックアップで取得しているバックアップデータからファイルを復元したい
    - すでに Windows Server バックアップで日々バックアップが取得できていることが前提です

## 手順
1. サーバーマネージャーから **ツール→Windows Server バックアップ** を開きます。
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-1.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-1.jpg" alt="" width="493" height="416" class="alignnone size-full wp-image-17118" /></a>
タスクバーにピン留めしておくと便利ですね。
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-2.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-2.jpg" alt="" width="51" height="41" class="alignnone size-full wp-image-17119" /></a>
1. 右ペインから回復 を選択します
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-3.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-3.jpg" alt="" width="1275" height="886" class="alignnone size-full wp-image-17120" /></a>
1. ウィザードを進めます。バックアップの場所は環境に応じて選択してください
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-4.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-4.jpg" alt="" width="740" height="580" class="alignnone size-full wp-image-17121" /></a>
1. **復元したいファイルが含まれている日付を選択し、次へをクリック** します。上部に **最も古いバックアップ** と **最新のバックアップ** の **日時が表示** されます
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-5.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-5.jpg" alt="" width="743" height="584" class="alignnone size-full wp-image-17122" /></a>
1. **ファイルおよびフォルダーを選択し、次へをクリック** します。
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-6.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-6.jpg" alt="" width="744" height="583" class="alignnone size-full wp-image-17550" /></a>
1. 復元元の **ファイルおよびフォルダーを選択** します。
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-7.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-7.jpg" alt="" width="739" height="579" class="alignnone size-full wp-image-17552" /></a>
1. 回復先のフォルダを指定します。今回は、デスクトップ上に保存します。
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-8.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-8.jpg" alt="" width="738" height="578" class="alignnone size-full wp-image-17123" /></a>
1. 内容を確認し、**回復をクリック** します
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-9.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-9.jpg" alt="" width="740" height="577" class="alignnone size-full wp-image-17124" /></a>
1. 完了しました
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-10.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-10.jpg" alt="" width="742" height="578" class="alignnone size-full wp-image-17125" /></a>

回復先に指定した場所にファイルが復元されました。
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-11.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-11.jpg" alt="" width="125" height="107" class="alignnone size-full wp-image-17387" /></a>

操作記録はログに残ります。
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-12.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-12.jpg" alt="" width="430" height="52" class="alignnone size-full wp-image-17127" /></a>

## 注意点
回復オプションの指定で、**回復するファイルまたはフォルダに対し、アクセス制御リスト(ACL)のアクセス許可を復元する** にチェックをいれていると、復元後にファイルが開けない場合があります。
<a href="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-13.jpg"><img src="images/how-to-retrieve-from-a-windows-server-backup-on-a-file-by-file-basis-13.jpg" alt="" width="474" height="164" class="alignnone size-full wp-image-17126" /></a>

その場合は必要に応じてプロパティから権限を付与してください。

## あとがき
その他 [Windows Server バックアップ](https://mseeeen.msen.jp/tag/windows-server-%e3%83%90%e3%83%83%e3%82%af%e3%82%a2%e3%83%83%e3%83%97/) に関連した記事も是非ご覧下さい。

それでは次回の記事でお会いしましょう。


