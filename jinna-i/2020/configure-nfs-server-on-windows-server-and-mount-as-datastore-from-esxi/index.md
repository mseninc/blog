---
title: Windows Server で NFS サーバーを構成し ESXi からデータストアとしてマウントする
date: 2020-11-24
author: jinna-i
tags: [Windows, Windows Server, VMware, ESXi, 仮想化技術]
---

こんにちは、じんないです。

今回は **Windows Server 2016 で NFS サーバーを構成し、VMware Hypervisor (ESXi) からデータストアとしてマウント**してみます。

複数の ESXi から共有ディスクとして NAS などを NFS マウントすることはよくあると思いますが、Windows Server でやってみるとどうなるのかと思い、実際にやってみました。

## 環境

- NFS サーバー
Windows Server 2016 Standard

- NFS クライアント
VMware Hypervisor (ESXi) 6.7 u3

## Windows Server に NFS サーバーを構成する
### NFS サーバーの役割を追加する

NFS サーバーは Windows Server の標準機能として提供されています。

サーバーマネージャーから **役割と機能の追加ウィザード** を起動し **NFS サーバー** にチェックを入れてインストールします。

`[ファイルサービスと記憶域サービス] > [ファイルサービスおよび iSCSI サービス] > [NFS サーバー]`

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-1.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-1.png" alt="" width="782" height="559" class="alignnone size-full wp-image-14792" /></a>

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-2.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-2.png" alt="" width="789" height="563" class="alignnone size-full wp-image-14793" /></a>

### NFS 共有を作成する

役割が追加できたら、NFS 共有するフォルダーを作成します。今回は例として `C:\export` を共有します。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-3.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-3.png" alt="" width="435" height="511" class="alignnone size-full wp-image-14796" /></a>

サーバーマネージャーから新しい共有ウィザードを起動し、**[NFS 共有 - 簡易]** を選択して [次へ] をクリックします。

`[サーバーマネージャー] > [ファイルサービスと記憶域サービス] > [共有]`

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-4.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-4.png" alt="" width="961" height="733" class="alignnone size-full wp-image-14797" /></a>

カスタムパスに `C:\export` を入力し、[次へ] をクリックします。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-5.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-5.png" alt="" width="764" height="563" class="alignnone size-full wp-image-14800" /></a>

共有名を指定し [次へ] をクリックします。**ここで表示されている [共有するリモートパス] は後で使用しますので、メモしておいてください**。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-6.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-6.png" alt="" width="763" height="559" class="alignnone size-full wp-image-14801" /></a>

認証方法を下記のとおり設定し、[次へ] をクリックします。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-7.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-7.png" alt="" width="763" height="562" class="alignnone size-full wp-image-14802" /></a>

NFS 共有を許可するホストを追加します。ESXi の IP アドレスを入力し、共有アクセス許可は **[読み取り/書き込み]** を選択します。
マウントする ESXi が複数ある場合は同様の手順で追加します。なお、**vCenter Server が存在する環境でも vCenter Server のアクセスを追加する必要はありません**。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-8.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-8.png" alt="" width="766" height="567" class="alignnone size-full wp-image-14804" /></a>

内容を確認し [次へ] をクリックします。あとはウェイザードに従い、共有を作成します。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-9.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-9.png" alt="" width="768" height="563" class="alignnone size-full wp-image-14805" /></a>

## ESXi からマウントする
### 新しいデータストアを追加する
vSphere Client から新しいデータストアを追加します。[NFS] を選択し、[NEXT] をクリックします。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-10.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-10.png" alt="" width="876" height="724" class="alignnone size-full wp-image-14809" /></a>

[NFS 3] を選択し [NEXT] をクリックします。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-11.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-11.png" alt="" width="878" height="724" class="alignnone size-full wp-image-14810" /></a>

NFS シェアの詳細を設定し、[NEXT] をクリックします。
※ パラメーターを抜粋していますので、表現の揺らぎはご容赦ください。

- **データストア名**: 任意のデータストア名
- **フォルダ**: 先の手順で確認した [共有するリモートパス] の`:` 以降を指定
- **サーバ**: NFS サーバーの IP アドレスを指定

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-12.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-12.png" alt="" width="880" height="725" class="alignnone size-full wp-image-14811" /></a>

マウントする ESXi を選択し [NEXT] をクリックします。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-13.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-13.png" alt="" width="878" height="728" class="alignnone size-full wp-image-14814" /></a>

[FINISH] をクリックして完了します。この時正常にマウントできなかった場合は、これまでの手順を確認してみてください。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-14.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-14.png" alt="" width="877" height="733" class="alignnone size-full wp-image-14815" /></a>

空き容量などストレージの情報も正常に取得できていました。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-15.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-15.png" alt="" width="861" height="168" class="alignnone size-full wp-image-14817" /></a>

### ディスクタイプはシックプロビジョニングになる

マウントしたデータストアに **シンプロビジョニング** の仮想マシンを移行したところ、ディスクタイプが **シックプロビジョニング (Eager Zeroed)** になっていることがわかりました。

<a href="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-16.png"><img src="images/configure-nfs-server-on-windows-server-and-mount-as-datastore-from-esxi-16.png" alt="" width="867" height="302" class="alignnone size-full wp-image-14818" /></a>

NAS などで NFS マウントしているデータストア間で仮想マシンを移行したり、新しい仮想マシン作成してもシンプロビジョニングのままとなりますが、**Windows Server の NFS サーバーのデータストアに仮想マシンを移行したり新しい仮想マシンを作成すると シックプロビジョニング (Eager Zeroed) になってしまいます**。

すでに NTFS フォーマットしている領域を NFS として共有しているため、このような動作となっているのかもしれませんが、詳細がわかりましたら追記したいと思います。

最後になりましたが、Windows Server 版 NFS サーバーのデータストア上で仮想マシンを起動させても何ら問題はありませんでした。

ではまた。
