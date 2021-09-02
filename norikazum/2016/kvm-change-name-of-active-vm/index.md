---
title: KVMで動作している仮想マシンの名前を変更する方法（設定ファイル編集）
date: 2016-11-18
author: norikazum
tags: [KVM, 仮想化技術]
---

こんにちは。

今回はこれまでも掲載してきたKVM仮想化ですが、仮想マシン名の変更にはちょっとした手順が必要となりますので紹介したいと思います。

KVM構築の記事は以下を参考にしてください。

* [CentOS 7にKVMでコマンドラインのみで仮想マシンを構築する](https://mseeeen.msen.jp/make-virtual-machine-with-kvm-in-centos-7/)
* [KVMの仮想イメージをバックアップ・リストアする方法](https://mseeeen.msen.jp/backup-and-restore-virtual-image-for-kvm/)


## 単純に名前を変更すると動かなくなる

KVMの管理画面(virt-manager)から、単純に名前を変えてみます。

<a href="images/kvm-change-name-of-active-vm-1.png"><img src="images/kvm-change-name-of-active-vm-1.png" alt="screenshot-from-2016-11-12-22-41-09" width="1288" height="875" class="alignnone size-full wp-image-3165" /></a>

<a href="images/kvm-change-name-of-active-vm-2.png"><img src="images/kvm-change-name-of-active-vm-2.png" alt="screenshot-from-2016-11-12-22-41-26" width="1292" height="881" class="alignnone size-full wp-image-3171" /></a>

変更後、起動すると以下のようなエラーで動作しなくなります。**再度同じ名前に戻せば動きます。**

>仮想マシンの開始中にエラーが発生しました：内部エラー：モニターに接続中にプロセスが終了しました：

<a href="images/kvm-change-name-of-active-vm-3.png"><img src="images/kvm-change-name-of-active-vm-3.png" alt="screenshot-from-2016-11-12-22-41-38" width="391" height="440" class="alignnone size-full wp-image-3167" /></a>


## 変更の流れ

### 名前の変更

jv-proxy　→　VMSVPROXY　に変更する。

### 設定ファイルをコピーする

```
# cd /etc/libvirt/qemu
# cp -rp jv-proxy.xml VMSVPROXY.xml
```

※ .xml の前の部分は仮想マシン名と同名になる。

### uuidを作成する

```
# uuidgen
bc6b8e06-4830-47a9-bbbf-2d74bb8cdcba
```

### 仮想イメージファイル名を変更する

```
# cd /var/lib/libvirt/images/
# mv jvproxy.img VMSVPROXY.img
```

※ 必須ではありませんが、名前と一致させることをおすすめします。


### 新規作成した設定ファイルの仮想イメージファイルへのパスを変更する

```
# cd /etc/libvirt/qemu
# vi VMSVPROXY.xml
```

名前と、UUIDを変更します。UUIDの部分は `uuidgen` で出力された値を設定します。以下の画像は変更後となります。

<a href="images/kvm-change-name-of-active-vm-4.png"><img src="images/kvm-change-name-of-active-vm-4.png" alt="2016-11-12_23h06_08" width="539" height="91" class="alignnone size-full wp-image-3168" /></a>

仮想イメージファイル名を変更します。
以下の画像は変更後となります。

<a href="images/kvm-change-name-of-active-vm-5.png"><img src="images/kvm-change-name-of-active-vm-5.png" alt="2016-11-12_23h30_58" width="558" height="64" class="alignnone size-full wp-image-3169" /></a>


### 変更前の仮想マシンを削除する

```
# virsh undefine jv-proxy
ドメイン jv-proxy の定義が削除されました
```

※ undefine すると、xml設定ファイルが削除されてしまうため念のためバックアップを採取することをおすすめします。


### 変更後の仮想マシンを登録する

```
# virsh define /etc/libvirt/qemu/VMSVPROXY.xml
ドメイン VMSVPROXY が /etc/libvirt/qemu/VMSVPROXY.xml から定義されました
```

### channelデバイスの調整

ここまでの流れで名前が変更され、動作するはずだったのですが、channelデバイスの設定に仮想マシンの名前が埋め込まれているため、起動時にエラーとなってしまいました。

今回は、以下の画像のようにデバイスを削除して起動することを確認しました。
※以下の画像は名前変更後のchannelデバイスです。

<a href="images/kvm-change-name-of-active-vm-6.png"><img src="images/kvm-change-name-of-active-vm-6.png" alt="screenshot-from-2016-11-13-02-26-16" width="1173" height="957" class="alignnone size-full wp-image-3173" /></a>

設定ファイルの編集で、以下のように書き換えることで削除しなくても起動が可能になると思います。

```
# cd /etc/libvirt/qemu
# vi VMSVPROXY.xml
```

<a href="images/kvm-change-name-of-active-vm-7.png"><img src="images/kvm-change-name-of-active-vm-7.png" alt="screenshot-from-2016-11-13-02-25-45" width="996" height="98" class="alignnone size-full wp-image-3174" /></a>


## あとがき

名前を変更するという単純な作業ですが、仮想マシンの設定ファイルに埋め込まれていたり少し手間がかかります。

今回紹介した手順とは別で、undefine した後に、仮想イメージから新規で設定ファイルを作成する方法も可能です。次回の記事で紹介したいと思います。

ご覧いただきありがとうございました。