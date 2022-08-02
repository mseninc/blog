---
title: CentOS 7.2 + PHP 7.1 + MySQL 5.7 + Node 6.5 で開発環境構築して Vagrant の box ファイルをつくる
date: 2016-10-07
author: kenzauros
tags: [PHP, Node.js, CentOS, Vagrant, Git, MySQL, 仮想化技術]
---

こんにちは、kenzauros です。

Laravel 5.3 を使ってみるのに vagrant に下記の開発環境を作成したので、まとめておきます。

## 概要

* CentOS 7.2.1511
* PHP 7.1.0RC1
* Git 2.10.0
* anyenv + ndenv
* Node v6.5.0
* Composer 1.2.0
* MySQL 5.7.15

## Vagrantfile

ベースとなる box は [bento/centos-7.2](https://atlas.hashicorp.com/bento/boxes/centos-7.2) を利用しました。 Vagrant のバージョンは 1.8.5 です。

```bash
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.ssh.insert_key = false
  config.vm.box = "bento/centos-7.2"
  config.vm.network "forwarded_port", guest: 80, host: 8080
end
```

適当なフォルダに上記のような適当な Vagrantfile を作成して `vagrant up` します。

起動したら `vagrant ssh` で vagrant マシンにつなぎ、 `sudo su -` で root に昇格します。

以下、特に書かなければ **vagrant 上の root での実行**とします。

## 環境構築

### 開発環境等インストール

あとあとのインストールで必要になるツール群とリポジトリをインストールします。

```bash
# yum install -y epel-release
# yum install -y vim gcc curl-devel expat-devel gettext-devel openssl-devel zlib-devel perl-ExtUtils-MakeMaker
# yum install -y http://rpms.famillecollet.com/enterprise/remi-release-7.rpm
# yum install -y yum-utils
# yum-config-manager --enable remi-php71
```

### SELinux, ファイアウォール無効化

ローカルの開発環境なのでセキュリティは無視して、SELinux とファイアウォールをオフにします。

```bash
# setenforce 0
# vim /etc/selinux/config
SELINUX=disabled
# systemctl disable firewalld
```

### Git インストール

もはや Git なしではなにもできないので、最新版をソースからインストールしておきます。

```bash
# wget https://www.kernel.org/pub/software/scm/git/git-2.10.0.tar.gz
# tar xzvf git-2.10.0.tar.gz
# cd git-2.10.0
# make prefix=/usr/local all
# make prefix=/usr/local install
# git --version
# rm -rf git-2.10.0*
```

### PHP インストール

PHP 7 と必要そうなパッケージをまとめてインストールし、 php.ini をちょっとだけ設定しておきます。

```bash
# yum install -y --enablerepo=remi,remi-php71 php php-devel php-mbstring php-pdo php-gd php-dom php-mysqlnd
# vim /etc/php.ini
date.timezone = "Asia/Tokyo"
mbstring.language = Japanese
```

### PHP Composer インストール

PHP のパッケージマネージャーである Composer をインストールして `/usr/local/bin` に移動しておきます。

```bash
# curl -sS https://getcomposer.org/installer | php
# mv composer.phar /usr/local/bin/composer
```

### anyenv + ndenv インストール

Node のバージョン管理のため **anyenv + ndenv** をインストールします。

#### anyenv インストール

```bash
# git clone https://github.com/riywo/anyenv /usr/local/anyenv
# echo 'export PATH=/usr/local/anyenv/bin:$PATH' >> /etc/profile.d/anyenv.sh
# echo 'export ANYENV_ROOT=/usr/local/anyenv'  >> /etc/profile.d/anyenv.sh
# echo 'eval "$(anyenv init -)"' >> /etc/profile.d/anyenv.sh
# source /etc/profile
```

#### ndenv インストール

```bash
# anyenv install ndenv
# exec $SHELL -l
# anyenv versions
```

#### node インストール

```bash
# ndenv install -l
# ndenv install v6.5.0
# ndenv versions
# ndenv global v6.5.0
# node -v
```

### MySQL インストール・設定

CentOS 7 には標準で MariaDB が入っているのでアンインストールしてから、 MySQL のソースをダウンロードしてインストールします。

#### MySQL インストール

```bash
# yum remove -y mariadb-libs
# ll /var/lib/mysql/
# wget http://dev.mysql.com/get/mysql57-community-release-el7-8.noarch.rpm
# rpm -Uvh mysql57-community-release-el7-8.noarch.rpm
# yum install -y mysql-community-server
# rm -f mysql57-community-release-el7-8.noarch.rpm
# mysqld -V
```

#### my.cnf 設定

my.cnf に設定を追記してサービスを有効化して起動します。

```bash
# echo 'character_set_server=utf8' >> /etc/my.cnf
# echo 'skip-character-set-client-handshake'  >> /etc/my.cnf
# systemctl enable mysqld
# systemctl start mysqld
# systemctl status mysqld
```

#### root パスワード変更

起動するとログがはかれるので、その中に出力されている root の一時パスワードを取得します。

```bash
# cat /var/log/mysqld.log | grep "temporary password"
```

**一時パスワードでログインしたあと、 MySQL のパスワード検証ポリシーを低く変更し、 root のパスワードを "root" に変えます。**

ついでに開発環境用のデータベース develop を作成しておきます。名前は任意のものに変更してください。

```bash
# mysql -u root -p
mysql> SET GLOBAL validate_password_length=4;
mysql> SET GLOBAL validate_password_policy=LOW;
mysql> SHOW VARIABLES LIKE 'validate_password%';
mysql> set password for root@localhost=password("root");
mysql> CREATE DATABASE IF NOT EXISTS develop;
mysql> \q
```

ここまででパッケージのインストールは終了です。

## vagrant パッケージ作成

環境を再利用できるように box ファイルを作ります。不要なら作る必要はありません。

### クリーンアップ

box ファイルを軽量化するため、クリーンアップし、シャットダウンします。

```bash
# du -sh /var/cache/yum
# yum clean all
# dd if=/dev/zero of=/EMPTY bs=1M
# rm -f /EMPTY
# shutdown -h now
```

### パッケージ作成

シャットダウンされたらホスト側で下記のコマンドを叩いて package.box を作成します。

```bash
vagrant package
```

今回生成された box ファイルは約 860MB でした！

以上、おつかれさまでした！
