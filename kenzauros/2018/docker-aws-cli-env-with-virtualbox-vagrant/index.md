---
title: VirtualBox + Vagrant で Docker + AWS CLI の環境を最短で構築する
date: 2018-09-21
author: kenzauros
tags: [CentOS, Vagrant, VirtualBox, AWS, 仮想化技術]
---

**Amazon Elastic Container Service (Amazon ECS)** で利用するための Docker コンテナを作るのに、手元の環境に Docker がなかったので、お手軽に Vagrant 環境の上で走らせることにしました。

## やりたいこと

Docker 環境のほか、 ECR (Elastic Container Registry) にコンテナを登録するために **AWS Command Line Interface (AWS CLI)** が必要なので、これらがインストールされた CentOS 7 環境を起動します。

## 前提

- VirtualBox と Vagrant はインストール済み
- Vagrant box は CentOS 7 + Docker の [williamyeh/centos7-docker](https://app.vagrantup.com/williamyeh/boxes/centos7-docker) を利用
- awscli は Vagrant のプロビジョニングでインストール

## Vagrantfile

適当なフォルダを作って、 **`Vagrantfile`** を作成します。

[williamyeh/centos7-docker](https://app.vagrantup.com/williamyeh/boxes/centos7-docker) を使わせていただくので、 `config.vm.box = "williamyeh/centos7-docker"` を書くだけです。

あとは後述の `provision.sh` を読み込んで AWS CLI をインストールさせるために `config.vm.provision` を指定しておきます。

このとき**デフォルトでは root で実行されてしまうので `privileged: false` をつけて vagrant ユーザーで実行する**ようにしておきます。

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "williamyeh/centos7-docker"
  config.vm.provision "shell", path: 'provision.sh', privileged: false
end
```

## プロビジョニング用シェルスクリプト

Vagrant 起動後に自動的に走らせたいスクリプトを記述します。今回は上記で書いた `provision.sh` というファイル名にします。

今回は、 **awscli のインストールに必要な pip とそれに必要な epel リポジトリをインストールしてから、 AWS CLI をインストール**しています。

AWS CLI のインストール方法は **[AWS CLI の公式ページ](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/installing.html)** の手順を参考にしました。

```sh
#!/bin/env bash

sudo yum update -y
sudo yum install -y epel-release
sudo yum install -y python-pip
sudo pip install pip --upgrade
pip install awscli --user --upgrade
```

## Vagrant 起動

Vagrant を起動します。起動後に自動的にプロビジョニングが行われます。

```sh
vagrant up
```

すべて完了したら `vagrant ssh` で VM に入り、 `aws --version` を叩いてバージョン番号が表示されれば OK です。

```sh
vagrant@localhost ~ $ aws --version
aws-cli/1.16.14 Python/2.7.5 Linux/3.10.0-327.28.3.el7.x86_64 botocore/1.12.4
```