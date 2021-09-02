---
title: CentOS 7にKVMでコマンドラインのみで仮想マシンを構築する
date: 2016-11-01
author: norikazum
tags: [Linux]
---

こんにちは。

今回はCentOS7+KVMで仮想マシンを構築します。

【ノートPCサーバのOS概要】
<a href="images/make-virtual-machine-with-kvm-in-centos-7-1.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-1.png" alt="2016-09-24_01h50_44" width="348" height="250" class="alignnone size-full wp-image-2837" /></a>

【全体概要】
<a href="images/make-virtual-machine-with-kvm-in-centos-7-2.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-2.png" alt="2016-09-26_00h47_22" width="753" height="326" class="alignnone size-full wp-image-2935" /></a>

ノートPCサーバのCentOS7は事前に開発環境としてインストールを実施しています。
そのため、インストール直後からKVM(libvirtd)関連のパッケージはインストール済みです。

<a href="images/make-virtual-machine-with-kvm-in-centos-7-3.jpg"><img src="images/make-virtual-machine-with-kvm-in-centos-7-3.jpg" alt="dsc_0213" width="960" height="540" class="alignnone size-full wp-image-2856" /></a>

ノートPCサーバ側の操作は全てコマンドラインで実施していきたいと思います。


## 準備

### ノートPCサーバ側

1. CentOS7のISOをダウンロード

```
# wget http://ftp.riken.jp/Linux/centos/7/isos/x86_64/CentOS-7-x86_64-DVD-1511.iso
```
**※2016年9月下旬のバージョンです。**

1. ダウンロード後、`/var/lib/libvirt/images`に移動します。
```
# mv /root/CentOS-7-x86_64-DVD-1511.iso /var/lib/libvirt/images/
```

1. BIOSの設定変更
BIOSの設定でVirtualization TechnologyをEnableにする。
**これを忘れるとKVMが動作しません。**

### 操作用Windows端末側

1. Tiger VNCのインストール

今回はVNCで接続出来ればなんでもよかったので、ぱっと思い出したTiger VNCにしました。

[ここ](http://tigervnc.org/)からダウンロードし、インストールします。


ダウンロードの流れは以下を参考にしてください。

1.1 赤枠のリンクへ移動

<a href="images/make-virtual-machine-with-kvm-in-centos-7-4.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-4.png" alt="2016-09-24_02h06_28" width="1148" height="613" class="alignnone size-full wp-image-2838" /></a>

1.1 赤枠のリンクへ移動

<a href="images/make-virtual-machine-with-kvm-in-centos-7-5.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-5.png" alt="2016-09-24_02h07_19" width="1073" height="599" class="alignnone size-full wp-image-2839" /></a>

1.1 赤枠からEXEをダウンロード

<a href="images/make-virtual-machine-with-kvm-in-centos-7-6.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-6.png" alt="2016-09-24_02h07_56" width="665" height="590" class="alignnone size-full wp-image-2840" /></a>

インストールは複雑ではないので、直感でインストール出来ると思います。
起動すると、このような画面が出てきます。

<a href="images/make-virtual-machine-with-kvm-in-centos-7-7.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-7.png" alt="2016-09-24_16h24_00" width="452" height="187" class="alignnone size-full wp-image-2844" /></a>


## 仮想OS構築

### ノートPCサーバに接続
操作用Windows端末からTeratermなどのターミナルソフトでノートPCサーバに接続します。

### 仮想マシンの作成と起動
以下のコマンドを実行し、仮想マシンの作成と起動を実施します。
```
virt-install \
  --name centos7 \
  --hvm \
  --virt-type kvm \
  --ram 2048 \
  --vcpus 2 \
  --arch x86_64 \
  --os-type linux \
  --os-variant rhel7 \
  --network network=default \
  --graphics vnc,listen=0.0.0.0 \
  --noautoconsole \
  --disk path=/var/lib/libvirt/images/centos7.img,size=150,sparse=true \
  --cdrom /var/lib/libvirt/images/CentOS-7-x86_64-DVD-1511.iso
```
**CPUコア＝2コア、メモリ＝2G、HDD＝150GB　という条件で作成。**

実行すると、以下の出力になります。

```
# virt-install \
   --name centos7 \
   --hvm \
   --virt-type kvm \
   --ram 2048 \
   --vcpus 2 \
   --arch x86_64 \
   --os-type linux \
   --os-variant rhel7 \
   --network bridge=virbr0 \
   --graphics vnc,listen=0.0.0.0 \
   --noautoconsole \
   --disk path=/var/lib/libvirt/images/centos7.img,size=150,sparse=true \
   --cdrom /var/lib/libvirt/images/CentOS-7-x86_64-DVD-1511.iso

インストールの開始中...
割り当て中 'centos7.img'                            | 150 GB     00:00
ドメインを作成中...                              |    0 B     00:00
仮想マシンのインストールが進行中です。インストール
が完了するまでコンソールの再接続を待っています。
```

Tiger VNCからノートPCサーバに接続するため、VNCポートを以下のコマンドで確認します。

```
#  netstat -tanp | grep kvm
tcp        0      0 127.0.0.1:5900          0.0.0.0:*               LISTEN      11645/qemu-kvm
```

5900ポートで待ち受けていることが分かりました。


## OSインストール及び仮想マシンの操作

### Tiger VNC起動
操作用Windows端末で、Tiger VNCを起動します。

### 仮想OSに接続
Tiger VNC で接続します。

<a href="images/make-virtual-machine-with-kvm-in-centos-7-8.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-8.png" alt="2016-09-24_19h37_10" width="448" height="181" class="alignnone size-full wp-image-2852" /></a>

### 仮想OSのインストール
Tiger VNCで接続後、CentOSのインストールを進めます。
※ここではCentOSのインストール詳細は割愛します。

<a href="images/make-virtual-machine-with-kvm-in-centos-7-9.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-9.png" alt="2016-09-24_19h43_01" width="640" height="510" class="alignnone size-full wp-image-2854" /></a>

操作感は遅延などの違和感はほぼ感じませんでした。

### インストール完了

インストールが完了すると、再起動をしますがなぜか再起動なのに停止します。
以下のコマンドで起動します。

``virsh start centos7``

起動後、再度 Tiger VNCで接続します。
すると、ライセンス同意の画面となっていますので以下を参考に進めます。
**入力部分を赤枠で囲っています。**

<a href="images/make-virtual-machine-with-kvm-in-centos-7-10.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-10.png" alt="2016-09-24_20h08_30" width="837" height="667" class="alignnone size-full wp-image-2857" /></a>

ログイン出来ることを確認しました。

<a href="images/make-virtual-machine-with-kvm-in-centos-7-11.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-11.png" alt="2016-09-24_20h10_16" width="1023" height="705" class="alignnone size-full wp-image-2858" /></a>

<a href="images/make-virtual-machine-with-kvm-in-centos-7-12.png"><img src="images/make-virtual-machine-with-kvm-in-centos-7-12.png" alt="2016-09-24_20h11_01" width="1024" height="694" class="alignnone size-full wp-image-2859" /></a>

## あとがき

仮想化するメリットは、1台の物理マシンで複数の仮想OSを稼働させることでコストダウンが出来るなどあると思いますが、今回は1台の物理マシンに1台の仮想OSを構築しました。

その理由は、仮想化することでスナップショットが採取できることとバックアップから復元するのが容易なことです。

現在はハードウェアの価格が非常に安くなってきているので、安価なサーバを複数台購入して、今回のような構築を行い、万が一 サーバが故障でつぶれた場合にはサーバは直さず（保守も入らず）予備のサーバに仮想OSを復元して運用を継続したい、というお客さまもおられます。

ミッションクリティカルなシステムではそうはいかない部分もあると思いますが、このような手法があることも知っておけば提案の幅は広がるのではないでしょうか。

それでは次回の記事でお会いしましょう。
