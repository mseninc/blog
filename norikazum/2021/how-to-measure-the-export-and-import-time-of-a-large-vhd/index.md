---
title: "[Hyper-V] 容量の大きいVHDのエクスポート・インポート時間を計測する方法"
date: 
author: norikazum
tags: [仮想化技術,Hyper-V]
---

こんにちは。

今回はある案件で、**500GB程度のHyper-Vの仮想マシン(VHD)をエクスポートして、その後再度インポートする** という内容のものがあり、その際に評価した結果を記事にしました。

簡単な図ですが、以下の **①の時間** と **②の時間** を計測します。

<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-20_21h51_39.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-20_21h51_39.png" alt="" width="777" height="385" class="alignnone size-full wp-image-10328" /></a>

## 計測結果
評価結果からの記載ですが、
①エクスポートは、**約6時間50分**
②インポートは、**約2時間20分** かかりました。　

## 評価環境
ホストOS　Windows Server 2016 Standard
仮想OS　Windows Server 2012 R2
仮想OSのCドライブ　500GB
インストール直後のCドライブの空き容量　489GB
<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-19_18h00_01.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-19_18h00_01.png" alt="" width="260" height="64" class="alignnone size-full wp-image-10329" /></a>

**外付けHDDは、Dドライブ** として認識していることを前提とします。

## テスト用の仮想マシンを作成する

以下の流れでに **仮想ディスク (VHDX )を作成** します。
<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h05_11.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h05_11.png" alt="" width="507" height="442" class="alignnone size-full wp-image-10345" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h05_53.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h05_53.png" alt="" width="701" height="491" class="alignnone size-full wp-image-10346" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h06_20.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h06_20.png" alt="" width="697" height="489" class="alignnone size-full wp-image-10347" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h06_40.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h06_40.png" alt="" width="700" height="492" class="alignnone size-full wp-image-10348" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h07_06.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h07_06.png" alt="" width="701" height="492" class="alignnone size-full wp-image-10349" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h07_42.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h07_42.png" alt="" width="703" height="495" class="alignnone size-full wp-image-10350" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h08_02.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_11h08_02.png" alt="" width="699" height="495" class="alignnone size-full wp-image-10351" /></a>

稼働ディスクが作成できていることを確認します。
<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_08h54_54.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_08h54_54.png" alt="" width="1004" height="719" class="alignnone size-full wp-image-10342" /></a>

**作成したVHDを指定して仮想マシンを作成** し、OSのインストール等の準備を済ませます。
※仮想マシンの作成手順は割愛します。

## エクスポート時間の計測
### エクスポートの流れ
前項で作成した仮想マシンを起動(実行)し、外付けHDD (Dドライブ) エクスポートします。
以下の流れでエクスポートします。

<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_08h56_36.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_08h56_36.png" alt="" width="801" height="508" class="alignnone size-full wp-image-10343" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_08h57_28.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-22_08h57_28.png" alt="" width="476" height="144" class="alignnone size-full wp-image-10344" /></a>

### エクスポートに要した時間
**約6時間50分** かかりました。

今回は案件の状況を再現するために起動状態で実施しましたが、**エクスポート中はやはり動作が重く** なりました。

エクスポートした仮想マシンはをシャットダウンし、仮想ディスク (C:\Hyper-V\test.vhdx) を削除します。

**Hyper-Vマネージャーから一覧も削除** します。(これをしないとインポート時にエラーになります)
<a href="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h11_14.jpg"><img src="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h11_14.jpg" alt="" width="714" height="302" class="alignnone size-full wp-image-18417" /></a>

## インポート時間の計測
### インポートの流れ
以下の流れでインポートします。
<a href="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h00_25.jpg"><img src="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h00_25.jpg" alt="" width="331" height="332" class="alignnone size-full wp-image-18418" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h00_38.jpg"><img src="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h00_38.jpg" alt="" width="703" height="496" class="alignnone size-full wp-image-18419" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h09_28.jpg"><img src="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h09_28.jpg" alt="" width="784" height="592" class="alignnone size-full wp-image-18420" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h09_40.jpg"><img src="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h09_40.jpg" alt="" width="705" height="493" class="alignnone size-full wp-image-18421" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h09_53.jpg"><img src="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h09_53.jpg" alt="" width="700" height="494" class="alignnone size-full wp-image-18422" /></a>

<a href="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h10_02-1.jpg"><img src="https://mseeeen.msen.jp/wp-content/uploads/2021/09/2021-09-13_10h10_02-1.jpg" alt="" width="702" height="496" class="alignnone size-full wp-image-18425" /></a>

エクスポート場所は、元あった場所 (C:\Hyper-V\test.vhdx) を指定します。

### インポートに要した時間
**約2時間20分** かかりました。　

インポートした仮想マシンが無事起動することを確認し、評価は完了です。

## あとがき

あとがきに、**ダミーファイル作成** に関しての情報を記載します。

ダミーファイルを作成する場合には以下の記事・ツールが便利です。
[ダミーファイル作成ソフト – GFileCreator | ぽーたぶるっ！](https://triton.casey.jp/portable/gfilecreator/)


別方法として 標準コマンドである `fsutil` を利用して、Windows上で大容量のファイルを作成することは出来るのですが、ゼロデータのみで作成されるため仮想ディスク(VHDファイル)の容量が大きくなりません。
[Windows 10対応：巨大サイズのファイルを簡単に作る（fsutilコマンド編）：Tech TIPS - ＠IT](https://www.atmarkit.co.jp/ait/articles/0209/28/news002.html)

例えば、100GBのファイルを作成して以下のように仮想マシン内に格納しても、
<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-19_18h03_23.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-19_18h03_23.png" alt="" width="797" height="594" class="alignnone size-full wp-image-10326" /></a>

仮想ディスク(VHDファイル)の容量が変わりません。
<a href="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-19_18h06_28.png"><img src="https://mseeeen.msen.jp/wp-content/uploads/2019/07/2019-07-19_18h06_28.png" alt="" width="1010" height="717" class="alignnone size-full wp-image-10327" /></a>

時間計測の参考になれば幸いです。
それでは次回の記事でお会いしましょう。