---
title: KVMで動作している仮想マシンの名前を変更する方法（既存イメージから新規作成）
date: 2016-11-22
author: norikazum
tags: [KVM, 仮想化技術]
---

こんにちは。

先日、KVMの仮想マシン名を設定ファイルから変更する方法を紹介しました。（リンクを貼る）

今回は、既存のイメージから新規で仮想マシンを作成する際に変更する方法を紹介します。

## 変更の流れ

### 名前の変更
jv-proxy　→　CentOS7.0 に変更する。


### 変更前の仮想マシンを削除する
```
# virsh undefine jv-proxy
ドメイン jv-proxy の定義が削除されました
```
※undefine すると、xml設定ファイルが削除されてしまうため念のためバックアップを採取することをおすすめします。


### 仮想マシンマネージャーから新規作成する

以下の流れで既存のイメージを利用して仮想マシンを新規作成します。

1. 仮想マシンマネージャー(virt-manager)を起動します。
2. 赤枠の新規作成マークをクリックします。
![screenshot-from-2016-11-13-02-26-30](images/kvm-change-name-of-active-vm-2-1.png)
3. 既存のディスクをインポート　を選択し進みます。
![screenshot-from-2016-11-13-02-26-36](images/kvm-change-name-of-active-vm-2-2.png)
4. 参照を選択し、仮想イメージファイルが配置されているパスから選択します。デフォルトでは、画像のように `/var/lib/libvirt/images`です。
![screenshot-from-2016-11-13-02-26-47](images/kvm-change-name-of-active-vm-2-3.png)
5. OSの種類とバージョンを適切に選択します。
![screenshot-from-2016-11-13-02-27-06](images/kvm-change-name-of-active-vm-2-4.png)
6. 仮想マシンに設定するメモリ、CPUコア数を適切に設定し進みます。
![screenshot-from-2016-11-13-02-27-14](images/kvm-change-name-of-active-vm-2-5.png)
7. 変更したい名前を設定し、作成を完了します。
![screenshot-from-2016-11-13-02-27-19](images/kvm-change-name-of-active-vm-2-6.png)

## あとがき

直近の案件で仮想関係の評価をすることが多く、仮想関連のネタが多くなっています。

先日、じんないも書いていましたが、ハイパーバイザー型としてはVMwareのESXi、MicrosoftのHyper-V、OSSのKVMこれらがほとんどのシェアを占めていると思います。

[無償の仮想化基盤 VMware vSphere Hypervisor 6.0 (vSphere ESXi) を使ってみる。【 導入編 】](/vmware-vsphere-hypervisor-6-esxi-intro/)

当方の関与する案件では、ここ最近VMwareよりHyper-Vのほうが優勢と感じています。
その中で、予算削減を要望されるお客さまはOSSのKVMを選択されることが多いです。

ただ、どれも技術的には安定していて仮想基盤が起因するトラブルはほぼ発生していません。

オンプレミスから仮想化・クラウドの時代に移り変わり、次はどの時代が生まれるのでしょうか。

ご覧いただきありがとうございました。
それでは次の記事でお会いしましょう。