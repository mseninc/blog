---
title: CentOS 7.2 上の PHP 7.1 から SQL Server に接続する
date: 2016-10-25
author: kenzauros
tags: [PHP, CentOS, SQL Server, PHP 7, Web]
---

こんにちは。

今回は **CentOS 7.2 の PHP 7.1 から Microsoft SQL Server 2014 に接続する**方法を紹介します。

## 情報が少ない

そもそも Linux 上の PHP から Windows Server の SQL Server に接続する人が奇特なのか、ネット上でまとまった情報に出会うことができません。

あってもけっこう古かったりして、なんかいろいろ入れないといけない感じを醸し出して(´д｀)な顔になっていたんですが、実は簡単にインストールできました。

## 想定条件

この記事は下記の環境を想定しています。

* remi リポジトリがインストールされていること  
```bash
# yum install -y http://rpms.famillecollet.com/enterprise/remi-release-7.rpm
```
* remi-php71 リポジトリから PHP 7.1 がインストールされていること
```bash
# yum install -y --enablerepo=remi,remi-php71 php php-devel php-mbstring php-pdo php-gd php-dom
```

## インストール

インストール自体はごくシンプルで、同じく **remi-php71 リポジトリ から php-sqlsrv パッケージをインストールしてやる**だけです。

```bash
# yum install -y --enablerepo=remi,remi-php71 php-sqlsrv
php-sqlsrv.x86_64 0:4.0.4-5.el7.remi.7.1
```

依存関係のパッケージも一緒にインストールされます。

php-mssql とか FreeTDS とかなんにもいりませんでした。ほとんど mysql とかと変わりませんね！

## おまけ: Laravel 5.3 での接続設定

Laravel 5 での接続設定をメモしておきます。

### config/database.php

Laravel のデフォルトでは SQL Server 用の接続情報がないので、 .env に sqlsrv を指定しても、

>InvalidArgumentException with message 'Database [sqlsrv] not configured.'

とか言われてしまいます。

config/database.php  の `'connections'` が定義されているところに sqlsrv を追加します。

```php
'connections' => [
       'sqlsrv' => [
            'driver' => 'sqlsrv',
            'host' => env('DB_HOST', 'localhost'),
            'port' => env('DB_PORT', '1433'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8',
            'prefix' => '',
        ],
```

### .env

.env ファイルには上で定義した sqlsrv の接続設定を使うように指定します。

```
DB_CONNECTION=sqlsrv
DB_HOST=ホスト名
DB_DATABASE=データベース名
DB_USERNAME=ユーザー名
DB_PASSWORD=パスワード
```

### 動作確認

あとは普通に Model を作成して、 tinker でデータを取得してみればいいでしょう。

```bash
$ php artisan make:model モデル名
$ php artisan tinker
Psy Shell v0.7.2 (PHP 7.1.0RC2 — cli) by Justin Hileman
>>> App\モデル名::all()->toArray()
=> []
```
