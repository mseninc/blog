---
title: "[Docker] Docker コンテナの PHP コンテナから別コンテナ上の MySQL に接続する方法"
date: 2020-05-11
author: k-so16
tags: [Docker, 仮想化技術]
---

こんにちは。最近、 [Beat Saber](https://beatsaber.com/) という VR のリズムゲームにハマっている k-so16 です。リズムに合わせて腕を動かすゲームなのですが、普段の運動不足がたたって 2 日で腕が筋肉痛になりました(笑)

PHP をより理解するために、 [パーフェクト PHP](https://gihyo.jp/dp/ebook/2014/978-4-7741-6756-5) という参考書を手元において勉強しているのですが、その過程でローカルの環境を汚すことなく PHP と MySQL の環境を用意したくなり、 Docker を使うことにしました。それぞれのコンテナは問題なく動くことを確認したのですが、 PHP のコンテナから MySQL に接続しようとしたところ、以下のようなエラーが発生しました。

> Fatal error: Uncaught PDOException: could not find driver in /path/to/php/program:2

**MySQL の PDO ドライバーが入っていない** ということで、ドライバーをインストールしたら解決すると思っていたのですが、次は以下のようなエラーが発生しました。

> Fatal error: Uncaught PDOException: SQLSTATE[HY000] [2002] No such file or directory in /path/to/php/program:2

今度は **MySQL のコンテナに接続できていない** ようでした。 **接続先をループバックではなく、 MySQL のコンテナに割り振られるアドレスを指定** する必要があるようです。

本記事では、 **Docker の PHP コンテナから 別のコンテナ上で稼働する MySQL に接続する方法** を紹介します。

本記事で想定する読者層は以下の通りです。

- Docker の基本的な使い方を知っている
- PHP および MySQL の基礎的な設定の知識を有している

## 下準備

### 使用するコンテナ

本記事で使用する Docker コンテナは以下の通りです。

- php:apache
- mysql:5.7.27

PHP のライブラリが MySQL 8.x 系のデフォルトの認証方式 (caching_sha2_password) に対応していないので、 5.x 系のバージョンを採用することにしました。 MySQL の認証方式を手動で変更することで、 8.x 系にも対応することは可能ですが、本記事では省略します。

### 実行環境の準備

PHP と MySQL のコンテナをそれぞれ立ち上げます。 PHP のコンテナはポートフォワーディングとボリュームのマウントの設定を、 MySQL のコンテナはポートフォワーディングとユーザー認証およびデータベースの設定をコンテナ起動時に行うようにしました。

以降、本記事の例では、 PHP コンテナには PHP のソースコードを格納しているディレクトリ `/path/to/src/dir` を `/var/www/html` にマウントし、ホスト側のポート 8080 を PHP コンテナのポート 80 にフォワーディングします。 MySQL はユーザー名とデータベース名を `docker` とし、ホスト側のポート 3306 を MySQL コンテナのポート 3306 にフォワーディングします。

各コンテナを立ち上げるコマンドは以下の通りです。

```bash
docker run -d --name test-php-server -v /path/to/src/dir:/var/www/html -p 8080:80 php:apache
docker run -d --name test-mysql -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_USER=docker -e MYSQL_PASSWORD=secret -e MYSQL_DATABASE=docker -p 3306:3306 mysql:5.7.27
```

PHP のソースコードには、 MySQL コンテナに接続するための、以下のようなコード片を持つプログラムが存在するとします。

```php
$con = new PDO('mysql:dbname=docker;host=localhost', 'docker', 'secret');
```

## ライブラリのインストール

**MySQL への接続に必要なドライバーがインストールされているかを確認** します。 **`phpinfo()`** で有効なドライバーを確認すると、 MySQL の PDO ドライバーがインストールされていませんでした。

Linux や FreeBSD などの OS では、 `apt` や `pkg` などのパッケージマネージャー経由でドライバーをインストールしますが、 PHP の Docker コンテナには、 **`docker-php-ext-install`** という専用のコマンドが準備されているので、そちらを利用します。

MySQL の PDO ドライバーをインストールするコマンドは以下の通りです。コマンドはコンテナに入ってから実行します。 PDO がインストールされていない場合、 `docker-php-ext-install` の引数に `pdo` も付与して実行します。

```bash
docker exec -it test-php-server bash # PHP のコンテナに入る
docker-php-ext-install pdo_mysql
```

## 接続設定

まず、 **MySQL のコンテナ ID を `docker ps` コマンドなどで確認** します。

以下は実行結果の例です。本記事の場合、 MySQL のコンテナ ID は `ebc8580e8dd5` です。

```
CONTAINER ID    IMAGE           COMMAND                  CREATED        STATUS          PORTS                               NAMES
ebc8580e8dd5    mysql:5.7.27    "docker-entrypoint.s…"   5 hours ago    Up 5 hours      0.0.0.0:3306->3306/tcp, 33060/tcp   test-mysql
0d7fa361f6a2    php:apache      "docker-php-entrypoi…"   5 hours ago    Up 8 minutes    0.0.0.0:8080->80/tcp                test-php-server
```

次に、 **MySQL のコンテナに入り、 `/etc/hosts` を確認** します。コンテナ ID に割り振られている IP アドレスが MySQL コンテナの IP アドレスです。本記事の場合、 `172.17.0.3` が IP アドレスになります。

```
127.0.0.1       localhost
::1     localhost ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
172.17.0.3      ebc8580e8dd5
```

最後に、 PDO のコンストラクタの第 1 引数の `host=` の箇所を、 **MySQL コンテナの IP に書き換え** ます。

```php
$con = new PDO('mysql:dbname=docker;host=172.17.0.3', 'docker', 'secret');
```

これで PHP コンテナから MySQL コンテナに接続できるようになりました。

## Docker のコンテナ間通信を用いる方法

localhost のポートを用いる以外の方法として、 **コンテナ間通信** があることを [kenzauros](https://github.com/kenzauros) さんに教えてもらいました。

Docker のコンテナ間通信を実現するには、次の 2 通りの方法があります。

- Docker ネットワークを用いる方法
- `--link` オプションを用いる方法

`--link` オプションを用いる方法は、現在ではレガシーな機能であり、非推奨とされているので、本記事では Docker ネットワークを用いる方法のみを紹介します。

### Docker ネットワークを用いる方法

まず、 `docker network create` コマンドで Docker ネットワークを作成します。

```bash
docker network create test-network
```

Docker ネットワークを確認するには、 `docker network ls` コマンドを実行します。

```bash
docker network ls
NETWORK ID      NAME            DRIVER    SCOPE
6681a32a3d6f    bridge          bridge    local
bc8ace895846    host            host      local
74bc6dce3a53    test-network    bridge    local
6f730504383f    none            null      local
```

コンテナを Docker ネットワークに接続するためには、 `docker run` コマンドでコンテナを作成する際に、 `--network` オプションで作成した Docker ネットワークを指定します。

本記事の例の場合、コンテナの作成コマンドは以下のようになります。

```bash
docker run -d --name test-php-server --network test-network -v /path/to/src/dir:/var/www/html -p 8080:80 php:apache
docker run -d --name test-mysql --network test-network -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_USER=docker -e MYSQL_PASSWORD=secret -e MYSQL_DATABASE=docker -p 3306:3306 mysql:5.7.27
```

コンテナ間通信を用いて MySQL に接続する場合、 PDO のコンストラクタの第 1 引数の `host=` の箇所を、 **MySQL のコンテナ名に書き換え** ます。本記事の例の場合は、 `host=test-mysql` となります。

```php
$con = new PDO('mysql:dbname=docker;host=test-mysql', 'docker', 'secret');
```

本セクションを記述するにあたって、以下のページを参考にしました。

> [Docker入門（第五回）〜コンテナ間通信〜 | さくらのナレッジ](https://knowledge.sakura.ad.jp/16082/)

## まとめ

本記事のまとめは以下の通りです。

- `docker-php-ext-install` で PDO および MySQL の PDO ドライバーをインストールする
- MySQL コンテナの `/etc/hosts` から IP アドレスを確認して PDO コンストラクタに渡すホストに設定する

以上、 k-so16 でした。Docker を使いこなせるようになるには修行が必要そうですね(笑)