---
title: "[VMware] ESXi6.7 に接続した外付け CD/DVD ドライブを仮想マシンに認識させる"
date: 2019-12-05
author: jinna-i
tags: [VMware, ESXi, 仮想化技術]
---

こんにちは、じんないです。

VMware ESXi 上の仮想マシンを展開する際、OS のインストールメディアをマウントする必要があります。たいていの場合は ISO イメージ等をデータストアにアップロードし、その ISO イメージから OS をインストールします。これが最も簡単な手順かと思います。

今回は VMware ESXi に接続した外付けの CD/DVD (光学)ドライブに Windows Server OS のインストールメディアをセットし、仮想マシンにマウントする手順を紹介します。

## 想定環境

- VMware vSphere 6.7 Update2

<a href="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-1.png"><img src="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-1.png" alt="" width="1058" height="523" class="alignnone size-full wp-image-11602" /></a>

前提として、外付け CD/DVD ドライブが ESXi で認識されているものとします。
もし認識していない場合は、以下を参考にドライバを組み込んだカスタム ISO イメージを作成してください。
[VMware ESXi のカスタムインストールディスクの作成方法](https://mseeeen.msen.jp/how-to-make-vmware-esxi-install-disc/)


## 事前準備

外付けの CD/DVD ドライブに Windows Server OS のインストールメディアをセットし、ESXi に USB 接続します。

対象の仮想マシンが起動している場合は電源を落としておきましょう。

## 仮想マシン設定

vSphere Client から対象の仮想マシンを右クリックし「設定の編集」を開きます。

CD/DVD ドライブ1 の項目を以下のように変更します。

- **CD/DVD ドライブ1**: ホスト デバイス
- **ステータス**: パワーオン
- **デバイスノード**: CD-ROM のエミュレート
- **仮想デバイスノード**: SATA コントローラ0, SATA(0:0) CD/DVD ドライブ1

<a href="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-2.png"><img src="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-2.png" alt="" width="829" height="196" class="alignnone size-full wp-image-11580" /></a>

### デバイスモードを変更できない場合

**パススルー CD-ROM** から変更できない場合がありますが、そんなときは思い切ってデバイスを削除し、新たに CD/DVD ドライブを追加しましょう。

<a href="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-3.png"><img src="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-3.png" alt="" width="832" height="532" class="alignnone size-full wp-image-11608" /></a>

### ブート順位の変更

CD/DVD ドライブから起動するよう BIOS のブート順位を変更します。

「仮想マシン オプション」から「次回起動時に、強制的に BIOS セットアップ画面に入る」にチェックを入れ仮想マシンを起動します。

<a href="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-4.png"><img src="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-4.png" alt="" width="812" height="566" class="alignnone size-full wp-image-11585" /></a>

仮想マシンが起動すると BIOS 画面となるので「CD-ROM Drive」を一番上にもっていき、変更を保存します。

<a href="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-5.png"><img src="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-5.png" alt="" width="1532" height="1140" class="alignnone size-full wp-image-11586" /></a>

デバイスが認識され、Windows Server OS のインストーラが起動しました。

<a href="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-6.png"><img src="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-6.png" alt="" width="1032" height="773" class="alignnone size-full wp-image-11587" /></a>

## 認識しない場合は

まれに上記手順を踏んでも認識してくれないときがあります。

<a href="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-7.png"><img src="images/using-an-external-cd-dvd-drive-connected-to-esxi67-in-a-virtual-machine-7.png" alt="" width="1377" height="306" class="alignnone size-full wp-image-11590" /></a>
※こんな感じで PXE 画面で止まる。

その時はもう一度以下の手順を実施してみてください。

1. 仮想マシンを停止する
1. インストールメディアを取り出す
1. 外付け CD/DVD ドライブを挿しなおす
1. インストールメディアをセットする
1. 仮想マシンの設定から CD/DVD ドライブを削除する
1. CD/DVD ドライブを再作成する

おそらくこれで認識してくれるようになるはずです。

ではまた。