---
title: ESXiにSynology DiskStation DS216jをデータストア(NFS)としてマウントする
date: 2017-01-13
author: jinna-i
tags: [VMware, ESXi, DS216j, 仮想化技術]
---

こんにちは、じんないです。

今回は[Synology DiskStation DS216j](https://www.synology.com/ja-jp/products/DS216j)(以下、DS216j)をvSphere ESXiにデータストア(NFS)としてマウントする方法を紹介します。

NASをデータストアにマウントすることで、仮想マシンイメージやisoなどを格納することができます。

また、複数のESXiホストが存在する場合、それぞれに共有ストレージとしてマウントしておくことで、[vMotionやHA](http://blogs.vmware.com/jp-cim/2014/09/vsphere_kiso03.html)、[DRS](http://blogs.vmware.com/jp-cim/2014/02/vspheredrs.html)などを利用することができます。
※利用可能なライセンスは[こちら](http://www.vmware.com/jp/products/vsphere.html#compare)を参照してください。

環境は前回つくったものを使用するので、以下を参考にしてみてください。
[無償の仮想化基盤 VMware vSphere Hypervisor 6.0 (vSphere ESXi) を使ってみる。【 導入編 】](https://mseeeen.msen.jp/vmware-vsphere-hypervisor-6-esxi-intro/)

クライアントインターフェースはVMware Host Clientを使用してESXiに接続します。

ではさっそくはじめていきましょう。

## DS216jの設定
まずはNAS側の設定をしていきます。

### 共有フォルダの作成

ブラウザからDS216jの管理コンソールに接続し、「コントロールパネル」を起動。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-1.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3516" />

「共有フォルダ」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-2.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3518" />

「作成」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-3.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3519" />

フォルダの名前を入力して「OK」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-4.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3521" />

### NFSの設定

コントロールパネルより、「ファイルサービス」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-5.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3524" />

Win/Mac/NFSタブ > NFSサービス　の「NFSを有効にする」をチェックして「適用」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-6.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3525" />

左ペインの「共有フォルダ」より、前項で作成したフォルダを選択して「編集」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-7.png" alt="" width="592" height="412" class="alignnone size-full wp-image-3522" />

NFS権限タブの「作成」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-8.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3523" />

ホスト名またはIP欄に接続するESXiホストのIPアドレスを入力。
※複数のESXiホストにマウントする場合は、ネットワークアドレスなどを指定してください。
「マウントしたサブフォルダへのアクセスを許可する」をチェックして「OK」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-9.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3527" />

作成されたことを確認して、「OK」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-10.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3528" />

### サブフォルダの作成

コンソールトップより、「File Station」を起動。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-11.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3529" />

左ペインから作成したフォルダを選択 > 作成 > フォルダの作成の順にクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-12.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3530" />

サブフォルダ名を入力し、「OK」をクリック。
今回は、isoを入れておくためのフォルダを作成するので「iso」と名付けました。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-13.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3531" />

フォルダが作成されたことを確認。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-14.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3532" />

あとは、エクスプローラーから共有フォルダにアクセスし、ファイルなどをアップロードします。
画像はCentOS7のisoをアップロード後の状態
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-15.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3533" />

## ESXiにマウント
作成した共有フォルダをESXiにマウントします。

ブラウザより「https://<ESXiのIPアドレス/ui>」にアクセスし、ログインします。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-16.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3534" />

左ペインのストレージをクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-17.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3535" />

「新しいデータストア」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-18.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3536" />

「NFSデータストアのマウント」を選択し、「次へ」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-19.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3538" />

マウントするフォルダの名前、DS216jのIPアドレス、NFSシェアを入力し、「次へ」をクリック。
NFSシェアはマウントするDS216jのディレクトリです。ここではサブフォルダのisoを指定しています。
またパスは、**/<ボリューム名>/<フォルダ名>/<サブフォルダ名>** のように、**ボリューム名から指定**する必要があります。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-20.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3539" />

内容を確認して「完了」をクリック。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-21.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3540" />

データストアが追加されたことを確認します。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-22.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3542" />

データストアブラウザを起動してみると、先ほどアップロードしたCentOS7のisoがちゃんと入っています。
<img src="images/vsphere-esxi-synology-ds216j-mount-nfs-datastore-23.png" alt="" width="578" height="383" class="alignnone size-full wp-image-3543" />

複数のESXiホストへマウントしたい場合は、同様の手順を繰り返してください。

## あとがき

isoのみならず、パッチファイルやインストーラなどをデータストアへ入れておくことで、仮想マシンにマウントして使用することができます。
次回は、データストア上のOSイメージ(iso)から仮想マシンを作成する方法を紹介予定です。

ではまた。