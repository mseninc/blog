---
title: "[Red Hat] VMware ESXi に Red Hat Enterprise Linux 8.1 をインストールする"
date: 2020-10-26
author: norikazum
tags: [Linux, Red Hat]
---

こんにちは。

今回はVMware ESXi 上にRed Hat Enterprise Linux 8.1 をインストールしてみます。
※執筆時の最新は8.2ですが、諸事情で8.1をインストールしています。

## 環境
- VMware ESXi, 6.7.0, 15160138

## 準備
- Red Hat 企業アカウントの作成
- Red Hatサブスクリプションの購入
    - 購入した製品番号は `RH00004` です。1つの購入で仮想マシン2つまで構築できます。
- Red Hat アカウントからISOのダウンロード（契約後から可能）
[ダウンロードページ](https://access.redhat.com/downloads/content/479/ver=/rhel---8/8.1/x86_64/product-software)

## 仮想マシンの作成
以下の手順で仮想マシンを作成します(特別な手順はありません)

1. vCenterにログインし、 **仮想ホスト→右クリックから新規仮想マシン** をクリック
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-1.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-1.png" alt="" width="433" height="1014" class="alignnone size-full wp-image-14048" /></a>

1. **新規仮想マシンの作成** を選択しNEXTをクリック
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-2.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-2.png" alt="" width="1086" height="894" class="alignnone size-full wp-image-14049" /></a>

1. **動作させる仮想ホストを選択** しNEXTをクリック
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-3.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-3.png" alt="" width="1085" height="896" class="alignnone size-full wp-image-14050" /></a>

1. **仮想マシンを格納するストレージを選択** しNEXTをクリック
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-4.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-4.png" alt="" width="1087" height="889" class="alignnone size-full wp-image-14051" /></a>

1. **ESXi 6.7 以降** を選択しNEXTをクリック
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-5.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-5.png" alt="" width="1085" height="891" class="alignnone size-full wp-image-14052" /></a>

1. **Linux→Red Hat Enterprise Linux8(64ビット)** を選択しNEXTをクリック
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-6.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-6.png" alt="" width="1087" height="899" class="alignnone size-full wp-image-14053" /></a>

1. **ハードウェアをカスタマイズ(①～③)し、準備でダウンロードしたISOを指定(④)** し、NEXTをクリック
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-7.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-7.png" alt="" width="1085" height="891" class="alignnone size-full wp-image-14058" /></a>

1. 設定を確認しFINISHをクリック
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-8.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-8.png" alt="" width="1078" height="890" class="alignnone size-full wp-image-14064" /></a>

無事作成できました
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-9.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-9.png" alt="" width="1754" height="1215" class="alignnone size-full wp-image-14056" /></a>

## Red Hat Enterprise Linux 8のインストール
仮想マシンを起動し、Webコンソールを起動します。
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-10.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-10.png" alt="" width="1368" height="800" class="alignnone size-full wp-image-14067" /></a>

以下の流れでインストールを実施しました

1. ISOからブートされので、 **2行目の(デフォルトで選択されている) Test this media & install Red Hat Enterprise Linux 8.1.0 が選ばれた状態でEnter** を押します
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-11.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-11.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14069" /></a>

1. ブート後、checkが走るので待ちます
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-12.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-12.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14070" /></a>

1. **日本語を選択** し続行をクリック
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-13.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-13.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14071" /></a>

1. **最小構成に変更** します
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-14.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-14.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14072" /></a>
↓
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-15.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-15.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14073" /></a>

1. **パーティションを変更** します

    システム | マウントポイント | 容量 | デバイスタイプ | ファイルシステム
    -- | -- | -- | -- | --
    /boot/efi | /boot/efi | 600MiB | 標準パーティション | EFI System Partition
    /boot | /boot | 1024MiB | 標準パーティション | ext4
    / | / | 94.43GiB | LVM | ext4
    swap | - | 3.97GiB | LVM | swap

    [C.4. 推奨されるパーティション設定スキーム Red Hat Enterprise Linux 8 | Red Hat Customer Portal](https://access.redhat.com/documentation/ja-jp/red_hat_enterprise_linux/8/html/performing_an_advanced_rhel_installation/recommended-partitioning-scheme_partitioning-reference)

    <a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-16.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-16.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14074" /></a>
    ↓
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-17.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-17.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14075" /></a>
↓
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-18.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-18.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14076" /></a>
↓
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-19.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-19.png" alt="" width="938" height="458" class="alignnone size-full wp-image-14077" /></a>

1. **ネットワークとホスト名を変更** します
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-20.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-20.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14082" /></a>
↓
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-21.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-21.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14083" /></a>
↓
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-22.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-22.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14084" /></a>
↓
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-23.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-23.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14085" /></a>
↓
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-24.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-24.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14086" /></a>
↓
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-25.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-25.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14087" /></a>

1. **インストールの開始** をクリック
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-26.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-26.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14088" /></a>

1. **rootのパスワード設定** と **管理ユーザーの設定** を行い完了を待機します
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-27.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-27.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14089" /></a>

1. 完了しました
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-28.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-28.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14092" /></a>

無事起動できました。
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-29.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-29.png" alt="" width="1502" height="985" class="alignnone size-full wp-image-14093" /></a>

## アクティベーションとサブスクライブ
インストール直後は、 **ライセンスのアクティベーションと製品が登録されておらずシステムのアップグレードやパッケージのインストールができません** 。

そのため、以下の流れで **アクティベーションと製品登録(サブスクライブ)を実施** します。

### アクティベーション
以下のコマンドを実行して対話式でアクティベーションします。

`subscription-manager register`

以下の出力になります。(ユーザー名とIDは * でマスクしています)
```
[root@rhel8-01 ~]# subscription-manager register
登録中: subscription.rhsm.redhat.com:443/subscription
ユーザー名: *****
パスワード:
このシステムは、次の ID で登録されました: *****-*****-*****-*****
登録したシステム名: rhel8-01
```

カスタマーポータルを確認すると、**仮想マシンが1登録されている**ことが確認できます。
[Red Hat Customer Portal-サブスクリプションの管理](https://access.redhat.com/management)

<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-30.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-30.png" alt="" width="1752" height="1154" class="alignnone size-full wp-image-14094" /></a>

システム登録も確認できました。
[Red Hat Customer Portal-システム](https://access.redhat.com/management/systems)

<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-31.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-31.png" alt="" width="1752" height="1154" class="alignnone size-full wp-image-14095" /></a>

### サブスクライブ

アクティベーションだけでは、 **製品が割り当たっていないため** 例えば、`open-vm-tools` をインストールしようとすると以下のようなエラーになります。

```
[root@rhel8-01 ~]# yum install open-vm-tools
Updating Subscription Management repositories.
This system is registered to Red Hat Subscription Management, but is not receiving updates. You can use subscription-manager to assign subscriptions.
エラー: "/etc/yum.repos.d", "/etc/yum/repos.d", "/etc/distro.repos.d" には有効化されたリポジトリーがありません。
```

`subscription-manager subscribe` のコマンドを実行し、サブスクライブを実行します。

```
[root@rhel8-01 ~]# subscription-manager subscribe
インストール済み製品の現在の状態:
製品名: Red Hat Enterprise Linux for x86_64
状態:   サブスクライブ済み
```

- 実行前のシステム詳細画面
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-32.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-32.png" alt="" width="1752" height="1154" class="alignnone size-full wp-image-14097" /></a>

- 実行後システム詳細画面
<a href="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-33.png"><img src="images/red-hat-enterprise-linux-8-1-on-vmware-esxi-33.png" alt="" width="1752" height="1154" class="alignnone size-full wp-image-14098" /></a>

##  VMware Tools のインストール
アクティベーションとサブスクライブが完了したので、これでパッケージのインストールが実行できます。

まずは、VMware Tools をインストールします。

`yum -y install open-vm-tools` を実行してインストールします。

出力結果は以下のよになります。
```
(抜粋)
合計                                                                               69 MB/s | 703 kB     00:00
トランザクションの確認を実行中
トランザクションの確認に成功しました。
トランザクションのテストを実行中
トランザクションのテストに成功しました。
トランザクションを実行中
  準備             :                                                                                          1/1
  scriptletの実行中: open-vm-tools-11.0.5-3.el8.x86_64                                                        1/1
  アップグレード中 : open-vm-tools-11.0.5-3.el8.x86_64                                                        1/2
  scriptletの実行中: open-vm-tools-11.0.5-3.el8.x86_64                                                        1/2
  scriptletの実行中: open-vm-tools-10.3.10-3.el8.x86_64                                                       2/2
  整理             : open-vm-tools-10.3.10-3.el8.x86_64                                                       2/2
  scriptletの実行中: open-vm-tools-10.3.10-3.el8.x86_64                                                       2/2
  検証             : open-vm-tools-11.0.5-3.el8.x86_64                                                        1/2
  検証             : open-vm-tools-10.3.10-3.el8.x86_64                                                       2/2
Installed products updated.

アップグレード済み:
  open-vm-tools-11.0.5-3.el8.x86_64
```

## システムのアップデート
システム全体もアップデートしておきます。

`dnf -y upgrade` を実行してアップデートします。

445のパッケージがアップグレードされました。

```
(抜粋)
  検証             : python3-syspurpose-1.25.17-1.el8.x86_64                                              445/445
Installed products updated.
(抜粋)
完了しました!
```

ここまでの状態で再起動し、スナップショットを取得して構築完了です。

## あとがき
CentOS8の構築経験は多くなっていますが、Red Hat Enterprise Linux 8はまだまだ少ないのでこの評価機で色々と実施してみたいと思います。

それでは次回の記事でお会いしましょう。
