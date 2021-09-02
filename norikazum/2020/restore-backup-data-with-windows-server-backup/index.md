---
title: Windows Server バックアップのバックアップデータを利用してリストアする
date: 2020-05-18
author: norikazum
tags: [Windows Server, Windows Server バックアップ, Windows]
---

こんにちは。

今回は、 **Windows Server バックアップで取得しているバックアップデータを利用して、OSまるごと復元** (**ベアメタル回復**) をしてみたいと思います。

利用しているOSは、 **Windows Server 2016** です。
搭載されているハードディスクをSSDに交換した際の手順を記事にしました。

環境は以下のようなイメージです。
<a href="images/restore-backup-data-with-windows-server-backup-1.png"><img src="images/restore-backup-data-with-windows-server-backup-1.png" alt="" width="758" height="261" class="alignnone size-full wp-image-12693" /></a>

**ベアメタル回復を行う場合はフルバックアップを取得しておく必要があります** 

## Windows Server バックアップ

Windows Server バックアップは、 毎日同じ時間に、外付けハードディスクに取得しているものとします。
<a href="images/restore-backup-data-with-windows-server-backup-2.png"><img src="images/restore-backup-data-with-windows-server-backup-2.png" alt="" width="1006" height="720" class="alignnone size-full wp-image-12707" /></a>

取得先は推奨の **専用ハードディスク** を選択。
<a href="images/restore-backup-data-with-windows-server-backup-3.png"><img src="images/restore-backup-data-with-windows-server-backup-3.png" alt="" width="668" height="579" class="alignnone size-full wp-image-12658" /></a>

## 復元の流れ

1. 取り付けていた、ハードディスクをSSDに換装します。
1. 動作させているOSと同じ、ブートUSBを作成しブートします。(ブートDVDでも問題ありません)
<a href="images/restore-backup-data-with-windows-server-backup-4.jpg"><img src="images/restore-backup-data-with-windows-server-backup-4.jpg" alt="" width="1281" height="1559" class="alignnone size-full wp-image-12694" /></a>
1. ブートした画面から、 **次へ → コンピューターを修復する** と進みます。
<a href="images/restore-backup-data-with-windows-server-backup-5.jpg"><img src="images/restore-backup-data-with-windows-server-backup-5.jpg" alt="" width="1695" height="1239" class="alignnone size-full wp-image-12695" /></a>
↓
<a href="images/restore-backup-data-with-windows-server-backup-6.jpg"><img src="images/restore-backup-data-with-windows-server-backup-6.jpg" alt="" width="1814" height="1236" class="alignnone size-full wp-image-12696" /></a>
1. 続けて、 **トラブルシューティング → イメージでシステムを回復** と進みます。
<a href="images/restore-backup-data-with-windows-server-backup-7.jpg"><img src="images/restore-backup-data-with-windows-server-backup-7.jpg" alt="" width="1108" height="867" class="alignnone size-full wp-image-12697" /></a>
↓
<a href="images/restore-backup-data-with-windows-server-backup-8.jpg"><img src="images/restore-backup-data-with-windows-server-backup-8.jpg" alt="" width="1277" height="869" class="alignnone size-full wp-image-12698" /></a>
1. 外付けハードディスクに取得されているバックアップデータを自動で認識しますので、 **利用可能なシステムイメージのうち最新のものを使用する** を選択します。(任意の日付を指定する場合は **システムイメージを選択する** を指定してください)
<a href="images/restore-backup-data-with-windows-server-backup-9.jpg"><img src="images/restore-backup-data-with-windows-server-backup-9.jpg" alt="" width="1852" height="1396" class="alignnone size-full wp-image-12699" /></a>
1. **次へ → 完了** と進みます。
<a href="images/restore-backup-data-with-windows-server-backup-10.jpg"><img src="images/restore-backup-data-with-windows-server-backup-10.jpg" alt="" width="1785" height="1366" class="alignnone size-full wp-image-12700" /></a>
↓
<a href="images/restore-backup-data-with-windows-server-backup-11.jpg"><img src="images/restore-backup-data-with-windows-server-backup-11.jpg" alt="" width="1753" height="1319" class="alignnone size-full wp-image-12701" /></a>
1. ディスクが消去される確認に対し **はい** で応答します。
<a href="images/restore-backup-data-with-windows-server-backup-12.jpg"><img src="images/restore-backup-data-with-windows-server-backup-12.jpg" alt="" width="1820" height="1291" class="alignnone size-full wp-image-12702" /></a>

以上までの流れで復元が開始されます。
<a href="images/restore-backup-data-with-windows-server-backup-13.jpg"><img src="images/restore-backup-data-with-windows-server-backup-13.jpg" alt="" width="1444" height="685" class="alignnone size-full wp-image-12703" /></a>

## あとがき
今回は、 **1TBディスクに対して復元** を実施しましたが **約70分** かかりました。

完了後、再起動され無事ログイン画面が表示されました。
<a href="images/restore-backup-data-with-windows-server-backup-14.jpg"><img src="images/restore-backup-data-with-windows-server-backup-14.jpg" alt="" width="2082" height="1563" class="alignnone size-full wp-image-12704" /></a>

トラブルがあったときの利用以外にも、ハードディスク換装にも利用することができます。
Windows Server バックアップは標準機能なので是非ご活用ください。

それでは次回の記事でお会いしましょう。