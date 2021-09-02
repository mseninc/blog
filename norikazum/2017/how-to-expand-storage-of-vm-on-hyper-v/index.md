---
title: Hyper-Vで仮想マシンのハードディスクを拡張する方法
date: 2017-05-23
author: norikazum
tags: [Windows Server, Hyper-V, Windows]
---

こんにちは。

今回は、**Hyper-Vで構築した仮想マシンのCドライブを拡張**する方法を紹介します。

想定されるケースとしては、作成時は100GBで十分だと思って仮想マシンを作成したものの、運用を続けるうちに容量が足りなくなった・・・などが考えられるかと思います。

それでは早速拡張しましょう。

## 環境
* 仮想ホストサーバー：Windows Server 2016 
* Hyper-Vマネージャーのバージョン：10.0.14393.0
* 仮想マシン：Windows 2012 R2（以降、**対象**と表記）

## 事前確認

1. 対象のサーバーにログインし、拡張前のディスク容量を確認します。99.6GBであることが確認できます。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-1.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-1.png" alt="" width="217" height="300" class="alignnone size-medium wp-image-4406" /></a>

1. 対象のサーバーをシャットダウンします。

## 拡張手順（Hyper-V マネージャー上から作業）

1. 対象仮想マシンを選択した状態で、**右クリックから 設定** をクリックします。

1. 仮想マシンの設定画面が開きますので、**左側の一覧**から **ハードドライブ** を選択し、**メディア - 仮想ハードディスク - [編集** をクリックします。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-2.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-2.png" alt="" width="300" height="289" class="alignnone size-medium wp-image-4407" /></a>

1. 拡張のためのウィザードとなり、以下のような流れで進めます。
**次へ**をクリックします。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-3.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-3.png" alt="" width="300" height="210" class="alignnone size-medium wp-image-4408" /></a>
**拡張**を選択し、**次へ**　※ここで拡張が表示されていない場合は拡張をすることができません。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-4.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-4.png" alt="" width="300" height="211" class="alignnone size-medium wp-image-4409" /></a>
拡張後のディスク**総容量を入力**し、**次へ**で進みます。容量は、仮想ディスクが格納されている領域の枯渇に注意して指定してください。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-5.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-5.png" alt="" width="300" height="211" class="alignnone size-medium wp-image-4411" /></a>
内容を確認し、**完了**をクリックします。完了を押した瞬間に拡張が実行されます。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-6.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-6.png" alt="" width="300" height="209" class="alignnone size-medium wp-image-4413" /></a>
**OK**で設定画面を閉じます。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-7.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-7.png" alt="" width="300" height="284" class="alignnone size-medium wp-image-4418" /></a>

1. 対象サーバーを起動します。

## 拡張手順（対象サーバーにログインして作業）

1. 管理者権限のユーザーでログインします。

1. **管理ツール→コンピュータの管理→ディスク管理**と進みディスクを確認します。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-8.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-8.png" alt="" width="300" height="215" class="alignnone size-medium wp-image-4420" /></a>

1. Cドライブを選択し、**右クリックからボリュームの拡張**を選択します。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-9.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-9.png" alt="" width="300" height="183" class="alignnone size-medium wp-image-4421" /></a>

1. 拡張のウィザードを進めます。
**次へ**をクリックします。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-10.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-10.png" alt="" width="300" height="232" class="alignnone size-medium wp-image-4422" /></a>
選択されたディスクを確認し**次へ**をクリックします。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-11.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-11.png" alt="" width="300" height="235" class="alignnone size-medium wp-image-4423" /></a>
**完了**をクリックし終了します。拡張作業は今回の20GB増量では一瞬で終わりました。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-12.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-12.png" alt="" width="300" height="233" class="alignnone size-medium wp-image-4424" /></a>

1. 拡張されていることを確認します。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-13.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-13.png" alt="" width="300" height="120" class="alignnone size-medium wp-image-4425" /></a>

1. 対象にログインし、作業前の99.6GBから119GBに拡張されていることが確認できます。
<a href="images/how-to-expand-storage-of-vm-on-hyper-v-14.png"><img src="images/how-to-expand-storage-of-vm-on-hyper-v-14.png" alt="" width="218" height="300" class="alignnone size-medium wp-image-4429" /></a>

## あとがき

今回紹介した拡張作業にあたって、Hyper-Vマネージャーからの作業時にはサーバーの停止が発生しますが、Windows Serverにログインしてからの拡張作業ではサーバーの停止は発生しません。

評価環境で実施した限りではハードルの高い作業ではありませんが、念のためバックアップしてから作業をされることをおすすめします。

それでは次回の記事でお会いしましょう。