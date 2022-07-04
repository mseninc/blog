---
title: Vagrant で手っ取り早く CentOS 7 + GNOME 環境を立ち上げる
date: 2017-06-20
author: kenzauros
tags: [CentOS, Vagrant, VirtualBox, 仮想化技術]
---

こんにちは、kenzauros です。

**CentOS 7.3 で GNOME デスクトップ環境**を 2 ステップで立ち上げましょう。

VirtualBox (5.1.22) と Vagrant (1.9.5) はインストール済みとします。

## Vagrantfile 配置

適当なフォルダに `Vagrantfile` を作って下記の内容にしましょう。

```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "bento/centos-7.3"
  config.vm.provider "virtualbox" do |vb|
    vb.gui = true
    vb.memory = "1024"
  end
  config.vm.provision "shell", inline: <<-SHELL
    sudo yum -y groupinstall "GNOME Desktop"
    sudo yum -y epel-release
    sudo systemctl set-default graphical.target
    systemctl get-default
    sudo shutdown -r now
  SHELL
end
```

## 起動

`Vagrantfile` を作成したフォルダでコンソールを立ち上げて `vagrant up` しましょう。

多少ダウンロードや起動に時間はかかりますが、勝手に終わります。

以上です。

## 一応の解説

というのもあまりにもあっけないので(笑)、`Vagrantfile` の説明だけ簡単にしておきます。

* box は HashiCorp の Atlas で提供されている [bento/centos-7.3](https://atlas.hashicorp.com/bento/boxes/centos-7.3) を使っています。
* `vb.gui = true` で VirtualBox で GUI が使えるようにしています。このフラグを設定しておかないと vagrant はヘッドレスモードで VM を起動しますので、 VitualBox の GUI で操作ができません。
* `config.vm.provision "shell", inline: <<-SHELL` からの行で CentOS 起動後に GNOME デスクトップ環境をインストールして有効にし、最後に再起動しています。

再起動されれば自動的に GNOME が立ち上がって初期設定画面が表示されるはずです。

## おまけ

**CentOS 7 系への VLC プレーヤーのインストール**方法です。

```
sudo yum -y epel-release
sudo rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-1.el7.nux.noarch.rpm
sudo yum -y update
sudo yum -y install vlc
```

なぜか [VLC Player の公式ページ](http://www.videolan.org/vlc/#download)には CentOS へのインストール方法だけありませんでした。
