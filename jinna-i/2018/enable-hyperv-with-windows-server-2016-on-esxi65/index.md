---
title: ESXi6.5上のWindows Server 2016でHyper-Vを有効にする
date: 2018-12-10
author: jinna-i
tags: [Windows Server, VMware, Hyper-V, Windows]
---

こんにちは、じんないです。

今回はVMware ESXi上のWindows Server 2016でHyper-Vを有効にする方法を紹介します。

仮想マシンのWindows Server 2016で役割と機能の追加からHyper-Vをインストールしようとすると、以下のメッセージが表示されてインストールできません。

> Hyper-Vをインストールできません:必要な仮想化機能がプロセッサにありません。

<a href="images/enable-hyperv-with-windows-server-2016-on-esxi65-1.png"><img src="images/enable-hyperv-with-windows-server-2016-on-esxi65-1.png" alt="" width="522" height="290" class="alignnone size-full wp-image-8373" /></a>

これを回避するには仮想マシンの構成ファイルを編集し、仮想化支援機能を有効にする必要があります。

尚、本番環境の仮想環境の入れ子についてVMwareは公式サポートしていないようですので、その点ご認識をお願いします。

## 想定環境
仮想化基盤：VMware ESXi 6.5
仮想化管理：vCenter Server 6.7
OS: Windows Server 2016 (1607)

インタフェースはvSphere Client(HTML)を利用します。

## 仮想化支援機能を有効化する

vSphere Clientから仮想マシンファイルが格納されているデータストアを参照し、仮想マシンをファイルをダウンロードします。

[caption id="attachment_8374" align="alignnone" width="1734"]<a href="images/enable-hyperv-with-windows-server-2016-on-esxi65-2.png"><img src="images/enable-hyperv-with-windows-server-2016-on-esxi65-2.png" alt="" width="1734" height="837" class="size-full wp-image-8374" /></a> 仮想マシンファイルは hogehoge.vmx 形式[/caption]

ダウンロードした仮想マシンファイルをテキストエディターで開き、以下を追記します。

`vhv.enable = "TRUE"`

「ファイルのアップロード」から編集した仮想マシンファイルをアップロードします。

<a href="images/enable-hyperv-with-windows-server-2016-on-esxi65-3.png"><img src="images/enable-hyperv-with-windows-server-2016-on-esxi65-3.png" alt="" width="1081" height="704" class="alignnone size-full wp-image-8390" /></a>

警告が出た場合は「はい」をクリックします。

<a href="images/enable-hyperv-with-windows-server-2016-on-esxi65-4.png"><img src="images/enable-hyperv-with-windows-server-2016-on-esxi65-4.png" alt="" width="499" height="181" class="alignnone size-full wp-image-8392" /></a>

これで準備はOKです。仮想マシンをパワーオンしてHyper-Vをインストールしてみてください。

### GUIからは変更できない

仮想マシンの設定を開き **設定パラメータ ＞ 設定の編集** で仮想マシンファイル(vmxファイル)の編集ができます。

<a href="images/enable-hyperv-with-windows-server-2016-on-esxi65-5.png"><img src="images/enable-hyperv-with-windows-server-2016-on-esxi65-5.png" alt="" width="863" height="754" class="alignnone size-full wp-image-8393" /></a>

<a href="images/enable-hyperv-with-windows-server-2016-on-esxi65-6.png"><img src="images/enable-hyperv-with-windows-server-2016-on-esxi65-6.png" alt="" width="863" height="491" class="alignnone size-full wp-image-8394" /></a>

「設定パラメータの追加」から先ほどの `vhv.enable = "TRUE"` を追加すればいいのですが、**何回やっても設定が無効になってしまいます**。

いくつか他の設定を入れてみましたが、問題なく保存されるのでこのパラメータ特有の問題かもしれません。

仮想化支援機能を有効にする場合はテキストエディターから行うことをおすすめします。

ではまた。