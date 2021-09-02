---
title: "[VMware] 仮想マシンにショートカットでアクセスする方法"
date: 2020-12-14
author: norikazum
tags: [VMware, 仮想化技術]
---

こんにちは。

今回は、**VMwareで作成した仮想マシンへ簡単にショートカットでアクセスする方法** を方法を紹介します。

通常であれば、ESXi や vCenter にログインし、コンソールを開いて利用する流れになりますが、ブラウザを開いて、ログインして・・・と手間がかかります。

この操作を **ショートカットで一発接続** できるようにします。

## 環境
- Windows 10 (1909)
  - 事前に [VMware Remote Console](https://my.vmware.com/jp/web/vmware/downloads/details?downloadGroup=VMRC1120&productId=974) をインストールします
- VMware ESXi, 6.7.0, 15160138
  - IPアドレスを 192.168.10.32 とします

## 接続テスト
1. ショートカットを作りたい **仮想マシンのIDを調べます**
  - **仮想マシンが動作しているESXiにログインし、コンソールを起動** します
  <a href="images/how-to-access-a-virtual-machine-with-a-shortcut-1.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-1.jpg" alt="" width="1540" height="1145" class="alignnone size-full wp-image-15105" /></a>
  ↓
  <a href="images/how-to-access-a-virtual-machine-with-a-shortcut-2.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-2.jpg" alt="" width="368" height="250" class="alignnone size-full wp-image-15106" /></a>
  - ID が **376** であることが分かりました
<a href="images/how-to-access-a-virtual-machine-with-a-shortcut-3.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-3.jpg" alt="" width="521" height="118" class="alignnone size-full wp-image-15107" /></a>
1. ブラウザで接続
  - **Chrome などのブラウザを開き** 、URL に `vmrc://root@192.168.10.32/?moid=376` と入力します
  <a href="images/how-to-access-a-virtual-machine-with-a-shortcut-4.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-4.jpg" alt="" width="557" height="133" class="alignnone size-full wp-image-15108" /></a>
  - **VMware Remote Console を開きますか？** と確認を求められるので **開きます**
  <a href="images/how-to-access-a-virtual-machine-with-a-shortcut-5.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-5.jpg" alt="" width="561" height="191" class="alignnone size-full wp-image-15109" /></a>
  - **認証情報を入力して接続をクリック** します 次回のために認証情報の記憶にチェックをいれましょう
  <a href="images/how-to-access-a-virtual-machine-with-a-shortcut-6.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-6.jpg" alt="" width="704" height="472" class="alignnone size-full wp-image-15110" /></a>
  - **証明書を信頼** し **接続する** をクリックします
  <a href="images/how-to-access-a-virtual-machine-with-a-shortcut-7.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-7.jpg" alt="" width="525" height="227" class="alignnone size-full wp-image-15111" /></a>
1. 接続完了
  - **接続することができました**
  <a href="images/how-to-access-a-virtual-machine-with-a-shortcut-8.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-8.jpg" alt="" width="1602" height="1283" class="alignnone size-full wp-image-15112" /></a>

## ショートカットの作成
ここからはWindowsの操作ですが、ショートカットを作成していきます

1. デスクトップ上などで **右クリック→ショートカットをクリック** します
<a href="images/how-to-access-a-virtual-machine-with-a-shortcut-9.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-9.jpg" alt="" width="709" height="516" class="alignnone size-full wp-image-15113" /></a>

1. 前項でテストした `vmrc://root@192.168.10.32/?moid=376` を入力し 次へ をクリックします
<a href="images/how-to-access-a-virtual-machine-with-a-shortcut-10.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-10.jpg" alt="" width="708" height="593" class="alignnone size-full wp-image-15114" /></a>

1. **任意の名前を入力し完了をクリック** します
<a href="images/how-to-access-a-virtual-machine-with-a-shortcut-11.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-11.jpg" alt="" width="708" height="593" class="alignnone size-full wp-image-15115" /></a>
ショートカットができます
<a href="images/how-to-access-a-virtual-machine-with-a-shortcut-12.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-12.jpg" alt="" width="87" height="100" class="alignnone size-full wp-image-15116" /></a>

1. **ショートカットをダブルクリックし、接続をクリック** します
<a href="images/how-to-access-a-virtual-machine-with-a-shortcut-13.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-13.jpg" alt="" width="704" height="472" class="alignnone size-full wp-image-15117" /></a>

**無事接続** できました

<a href="images/how-to-access-a-virtual-machine-with-a-shortcut-14.jpg"><img src="images/how-to-access-a-virtual-machine-with-a-shortcut-14.jpg" alt="" width="1602" height="1283" class="alignnone size-full wp-image-15118" /></a>

接続頻度の多い仮想マシンの利用には便利だと思いますので参考にしていただけましたら幸いです。
それでは次回の記事でお会いしましょう。