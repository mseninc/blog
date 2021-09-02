---
title: XServer に Laravel 5.8 プロジェクトを GitHub からデプロイする
date: 2019-07-12
author: kenzauros
tags: [PHP, MySQL, PHP 7, Laravel, GitHub, XServer, Web]
---

**Laravel 5.8 で作ったプロジェクトを XServer にデプロイする**ことになったので、設定方法のメモです。


## 前提条件

### 環境

- XServer (sv2000 番台)
- PHP 7.2.17 (サーバーパネルで設定)
- MySQL 5.7
- XServer のサーバーへは SSH 鍵認証で接続できる
- すでに Laravel 5.8 をベースとしたプロジェクトの GitHub リポジトリがある

### ディレクトリ構成

Jenkins から機械的にデプロイするため、**リポジトリの構成 (Laravel 標準の構成) をそのまま利用できる**ようにします。 Laravel 側の `.htaccess` なども変える必要がないため、 Git で管理しやすくなります。

また、今回はサブドメインではなく 1ドメインとして構築しますので、下記のようなディレクトリ構成にしました。

```
/home/msen/sample.com
  laravel/ ← Laravel アプリのディレクトリ
    app/
    bootstrap/
    public/
    ～省略～
  public_html/
    .htaccess
    public ← ../laravel/public/ へのシンボリックリンク
```

この構成であれば、デプロイ時は **`laravel` ディレクトリで `git pull` し、ビルドコマンドを叩いていくだけ**なので比較的シンプルです。

ドキュメントルート自体は public_html 以外には設定できない (と思う) ため、 `public_html/.htaccess` でルートディレクトリのアクセスを `public/` 以下にリライトし、さらにシンボリックリンクで `laravel/public` に飛ばします。このあたりは後述します。

## 環境整備

SSH で XServer に接続します。

### Git のインストール

Git はもともと入っているようなので、これをそのまま利用します。

```bash
$ git --version
git version 1.8.3.1
```

古いですが、普通にクローンするぐらいなら大丈夫でしょう。

### SSH で使う PHP バージョンの確認と設定

SSH で使われる PHP のバージョンを設定します。これは **XServer のサーバーパネルの PHP の設定とは別**ですので注意してください。

まずバージョンを確認しておきます。

```bash
$ php -v
PHP 7.1.2 (cli) (built: Feb 22 2017 10:08:41) ( NTS )
Copyright (c) 1997-2017 The PHP Group
Zend Engine v3.1.0, Copyright (c) 1998-2017 Zend Technologies
```

案の定、 7.1.2 でした。 **Laravel 5.8 が 7.1.3 以上でしか動かない**ため、この状態で `composer install` しても下記のように怒られるはずです。

```bash
$ composer install
Loading composer repositories with package information
Installing dependencies (including require-dev) from lock file
Your requirements could not be resolved to an installable set of packages.

  Problem 1
    - This package requires php ^7.1.3 but your HHVM version does not satisfy that requirement.
  Problem 2
    - Installation request for laravel/framework v5.8.7 -> satisfiable by laravel/framework[v5.8.7].
    - laravel/framework v5.8.7 requires php ^7.1.3 -> your PHP version (7.1.2) does not satisfy that requirement.
```

まず利用可能なバージョンを確認します。

```bash
$ find /opt/php-*/bin -type f -name 'php'
～省略～
/opt/php-7.2.17/bin/php
/opt/php-7.2.6/bin/php
/opt/php-7.2/bin/php
/opt/php-7.3.4/bin/php
/opt/php-7.3/bin/php
```

今回は XServer のサーバーパネルで選択しているバージョンと同じ `7.2.17` を使うことにします。

```bash
$ mkdir $HOME/bin
mkdir: ディレクトリ `/home/msen/bin' を作成できません: ファイルが存在します
$ rm $HOME/bin/php
$ ln -s /opt/php-7.2.17/bin/php $HOME/bin/php
```

今回はすでに `$HOME/bin/php` があったため、シンボリックリンクを作り直しました。

`.bashrc` か `.bash_profile` に `$HOME/bin` へのパス設定を（なければ）追加します。

```bash
$ vi ~/.bash_profile
export PATH=$HOME/bin:$PATH
$ source ~/.bash_profile 
```

これで PHP のバージョンが無事切り替わったはずです。

```bash
$ php -v
PHP 7.2.17 (cli) (built: Apr 13 2019 01:04:33) ( NTS )
Copyright (c) 1997-2018 The PHP Group
Zend Engine v3.2.0, Copyright (c) 1998-2018 Zend Technologies
```

### Node.js (nodebrew) のインストール

ビルドに Node.js が必要なため、 SSH でインストールします。

**Node.js はそのまま入れるとバージョン管理が面倒なので、切り替えやすくするため nodebrew をインストール**します。

```bash
$ wget git.io/nodebrew
$ perl nodebrew setup
```

PATH を通すため `.bashrc` か `.bash_profile` に追記します。

```bash
$ echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> ~/.bash_profile
$ source ~/.bash_profile 
```

これで nodebrew が使えるようになっているはずなので `ls-remote` でバージョンを確認し、 `install`, `use` でインストールします。

```bash
$ nodebrew -v
nodebrew 1.0.1
～省略～
$ nodebrew ls-remote
$ nodebrew install v10.16.0
Fetching: https://nodejs.org/dist/v10.16.0/node-v10.16.0-linux-x64.tar.gz
######################################################################## 100.0%
Installed successfully
$ nodebrew use v10.16.0
use v10.16.0
$ node -v
v10.16.0
$ npm -v
6.9.0
```

Node のセットアップはこれで OK です。

## プロジェクトのデプロイ

### Git でリポジトリをクローン

所望のリポジトリを **`laravel` ディレクトリにクローン**し、対象のブランチやタグをチェックアウトします。

```bash
$ cd ~/sample.com/
$ git clone <リポジトリURL> laravel
$ cd laravel
$ git checkout <デプロイするタグなど>
```

### Laravel セットアップ

**`.env` ファイルを設定**します。データベースは XServer の MySQL を使用すると思いますので、該当箇所を書き換えます。

```bash
$ cp .env.example .env
$ vi .env
```

`artisan key:generate` でキーを生成します。

```bash
$ php artisan key:generate
```

ログファイルやキャッシュのディレクトリのパーミッションを 777 に設定します。

```bash
$ chmod -R 777 storage
$ chmod -R 777 bootstrap/cache/
```

### マイグレーション

ここまで設定できたらマイグレーションしてみます。

```bash
$ php artisan migrate
```

問題なく通れば OK です。エラーがでたら `.env` や `composer dump-autoload` などを確認しましょう。

必要ならシーディングまでしておきます。

```bash
$ php artisan db:seed
```

### ドキュメントルート (public_html) の設定

nginx のドキュメントルートに設定されている `public_html` の `.htaccess` と `laravel/public` へのシンボリックリンクを設定します。

再度ディレクトリ構成を確認します。

```
/home/msen/sample.com
  laravel/ ← Laravel アプリのディレクトリ
    app/
    bootstrap/
    public/
    ～省略～
  public_html/
    .htaccess
    public ← ../laravel/public/ へのシンボリックリンク
```

**`.htaccess`** を開きリライトの設定を行います。すべてのリクエストを同階層の `public` 以下に書き換えるだけの設定です。

```bash
$ cd ~/sample.com/public_html
$ vi .htaccess
```

```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [QSA,L]
</IfModule>
```

さらに **`public_html/public` から `laravel/public` へのシンボリックリンク**を設定します。

```bash
$ ln -s /home/msen/sample.com/laravel/public ./public
$ ll
合計 0
lrwxrwxrwx 1 msen members 44  7月  9 07:42 public -> /home/msen/sample.com/laravel/public
```

正常にシンボリックリンクが張られれば OK です。

## 動作確認

すでにドメインの設定まで済んでいる場合は、そのドメイン名でアクセスします。

まだの場合は XServer で「動作確認 URL」が発行できるので、これを利用します。 `http://sample-com.check-xserver.jp/` のような URL になることが多いです。

Laravel が正常に動作すれば完了です。

## 参考

- [XSERVER（エックスサーバー）のSSHでPHPのバージョンを7に変更する方法 | Minory](https://minory.org/xserver-ssh-php7.html)
- [XSERVER(エックスサーバー)にNode.jsをインストールするときはnodebrew使うと楽 - Qiita](https://qiita.com/yni17196791/items/f49b3e2f683cd06b3120)
- [XSERVERでssh接続→git最新版インストール→php5.6でlaravel deployまで - Qiita](https://qiita.com/chr/items/aaa5a0e005958c7a9a16)