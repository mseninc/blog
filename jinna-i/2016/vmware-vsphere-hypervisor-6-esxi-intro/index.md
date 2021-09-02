---
title: 無償の仮想化基盤 VMware vSphere Hypervisor 6.0 (vSphere ESXi) を使ってみる。【 導入編 】
date: 2016-11-08
author: jinna-i
tags: [VMware, ESXi, 仮想化, 仮想化技術]
---

こんにちは、じんないです。

今回はVMware社から無償で提供されているvSphere Hypervisor 6.0（以下、ESXi）を使って、仮想環境を構築してみます。

ESXiはハードウェア上で直接動作するハイパーバイザーで、ホストOS(Windowsなど)を必要としません。
仮想化技術は大きく分けて「ハイパーバイザー型」と「ホスト型」に分類されます。

例として以下のようなものがあります。

* **ハイパーバイザー型**
 * VMwareのvSphere ESXi
 * MicrosoftのHyper-V
 * LinuxのKVM　

* **ホスト型**  
 * OracleのVirtualBox
 * VMwareのVMware Player

KVMについては、社長が紹介していますのでご覧ください。
[CentOS 7にKVMでコマンドラインのみで仮想マシンを構築する](https://mseeeen.msen.jp/make-virtual-machine-with-kvm-in-centos-7/)

では、早速ESXiを使ってみましょう。

## ESXiの入手

ざっくりとした流れは、
製品の登録 → パッケージのダウンロード(iso) → インストール → ライセンス登録 となります。

[VMwareのWebサイト](https://my.vmware.com/jp/web/vmware/evalcenter?p=free-esxi6)より、ESXiをダウンロードします。
ダウンロードにはVMwareアカウントが必要ですので、お持ちでない場合は「アカウントの作成」より作成してください。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-1.png" alt="j-esxi-intro_002" width="1024" height="727" class="alignnone size-large wp-image-3094" />

製品の登録が完了するとライセンスキーが発行され、パッケージのダウンロードが可能となります。
「手動ダウンロード」をクリックし、ESXiのISOイメージをダウンロードします。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-2.png" alt="j-esxi-intro_003" width="1024" height="727" class="alignnone size-large wp-image-3096" />

ダウンロードしたISOをブートメディアに焼きます。
サイズも357MBと小さいので、筆者はCD-Rにしました。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-3.png" alt="j-esxi-intro_015" width="421" height="580" class="alignnone size-full wp-image-3098" />

あとは、ESXiをインストールするマシンにブートメディアをセットし、インストールを行います。
画面のスクリーンショットが取れないので、インストール手順は割愛させていただきます。
手順は難しくなく、root用のパスワードを入力して15分足らずで完了します。
※このパスワードは後ほどESXiにリモート接続する時に使用します。


## ESXiにアクセスしてみる

インストールが完了したESXiの画面を見てもらえるとわかりますが、以下のような黄色とグレーの画面が表示されます。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-4.png" alt="j-esxi-intro_016e" width="1024" height="681" class="alignnone size-large wp-image-3124" />

ESXi単体ではIPアドレスやホスト名、DNSなどの設定をします。
実際に仮想マシンを操作する場合はVMwareが提供しているクライアントインターフェースからESXiにリモート接続しておこないます。
これらのインターフェースは3つほど用意されいます。

* vSphere Client(C#)
* vSphere Web Client（※vCenter Serverが必要）
* VMware Host Client(HTML5)　

今回は、ESXi 6.0 Update2よりリリースされたHTML5ベースのVMware Host Clientを使用してみたいと思います。

ESXiにはブラウザ経由でアクセスできます。
ブラウザを起動し、ESXiのIPアドレスを入力して接続します。
https://[IPアドレス]
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-5.png" alt="j-esxi-intro_004e" width="1024" height="727" class="alignnone size-large wp-image-3102" />

ここでSSL証明書がインストールされていないためエラーが表示されますが、「このWebページの閲覧を続ける」をクリックします。
※ブラウザにより表現が異なります。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-6.png" alt="j-esxi-intro_005e" width="1024" height="727" class="alignnone size-large wp-image-3104" />

今回はHost Clientを使用しますので、「Open the VMware Host Client」をクリックします。
※ https://[IPアドレス]/ui/ で直接アクセスすることもできます。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-7.png" alt="j-esxi-intro_006e" width="1024" height="727" class="alignnone size-large wp-image-3106" />

ユーザー名にroot、ESXiのパスワードを入力し、ログインします。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-8.png" alt="j-esxi-intro_008" width="1024" height="727" class="alignnone size-large wp-image-3109" />

ホーム画面はこんな感じです。
vSphere Web Clientによく似たUIです。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-9.png" alt="j-esxi-intro_009" width="1024" height="628" class="alignnone size-large wp-image-3110" />

## ライセンス登録

ホーム画面の左ペインより、「ホスト」 > 「管理」をクリックします。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-10.png" alt="j-esxi-intro_009e" width="1024" height="628" class="alignnone size-large wp-image-3111" />

ライセンスタブより「ライセンスの割り当て」をクリックします。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-11.png" alt="j-esxi-intro_010e" width="1024" height="628" class="alignnone size-large wp-image-3112" />

ポップアップウィンドウが表示されるので、製品登録時に発行されたライセンスを入力し、「ライセンスの確認」をクリックします。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-12.png" alt="j-esxi-intro_012e2" width="1024" height="628" class="alignnone size-large wp-image-3114" />

ライセンス認証に成功すると以下のように表示されます。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-13.png" alt="j-esxi-intro_013e" width="1024" height="628" class="alignnone size-large wp-image-3115" />

## まとめ

さて、いよいよ仮想化基盤の準備ができました。
図で示すと以下のような感じですね。
ハードウェア上に仮想化用のハイパーバイザーが載っている状態です。
<img src="images/vmware-vsphere-hypervisor-6-esxi-intro-14.png" alt="j-esxi-intro_001e" width="1024" height="537" class="alignnone size-large wp-image-3118" />

次は仮想マシンを作っていきましょう。
[無償の仮想化基盤 VMware vSphere Hypervisor 6.0 (vSphere ESXi) を使ってみる。【 仮想マシン作成編 】](https://mseeeen.msen.jp/vmware-vsphere-hypervisor-6-esxi-intro-2/)

ではまた。