---
title: MariaDB の Docker で全文検索エンジン Mroonga を有効化して起動する
date: 
author: kenzauros
tags: [MariaDB, Mroonga, MeCab]
description: MySQL 用の日本語全文検索ストレージエンジンで Mroonga と MeCab トークナイザーを MariaDB の Docker イメージで使えるようにする方法を紹介します。
---

**Mroonga は MySQL 用の日本語全文検索ストレージエンジン**です。テーブル作成時のエンジンを指定して、インデックスを作成するだけで全文検索ができるようになり、とても便利です。

- [Mroonga - MySQLで高速日本語全文検索](https://mroonga.org/ja/)

今回はこの Mroonga を MariaDB の公式 Docker イメージにインストールして、全文検索インデックスを使えるようにします。また、トークナイザーとして [MeCab](https://taku910.github.io/mecab/) を利用します。

❗ この記事でインストールできる Mroonga のバージョンは v7 系です。最新バージョンではありませんのでご注意ください。

## はじめに

### 環境

- MariaDB 10.6
- Mroonga 7.07
- Docker 20.10.13
- Docker Compose 2.3.3

Docker イメージは下記の公式のものを利用します。

- [Mariadb - Official Image | Docker Hub](https://hub.docker.com/_/mariadb)


### docker-compose.yml

`docker-compose.yml` は前記事でも利用したものを流用します。

- [MySQL と MariaDB の Docker イメージでコンテナー起動時にサブディレクトリー内の SQL ファイルを読み込む](https://mseeeen.msen.jp/init-with-subdirectory-sql-files-with-mysql-docker/)

```yaml{numberLines:1}{4}:title=docker-compose.yml
version: '3.1'
services:
  db:
    build: database
    restart: always
    environment:
      MYSQL_DATABASE: common
      MYSQL_USER: admin
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-defaultPass}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-defaultPass}
      TZ: 'Asia/Tokyo'
    ports:
      - 3306:3306
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    volumes:
      - ./initdb:/docker-entrypoint-initdb.d
      - ./database/my.cnf:/etc/mysql/conf.d/my.cnf
      - db-data:/var/lib/mysql

volumes:
  db-data:
    driver: local
```

4行目で `database/` ディレクトリをビルドするように指定しています。

## 結論

今回の Dockerfile の最終形です。ビルドディレクトリ (今回は `database` ディレクトリ) に配置します。

```{numberLines:1}:title=database/Dockerfile
FROM mariadb:10.6

RUN apt update \
    && apt install -y mariadb-plugin-mroonga \
    && apt install -y software-properties-common lsb-release \
    && add-apt-repository -y universe \
    && add-apt-repository "deb http://security.ubuntu.com/ubuntu $(lsb_release --short --codename)-security main restricted" \
    && add-apt-repository -y ppa:groonga/ppa \
    && apt update \
    && apt install -y groonga-tokenizer-mecab \
    && apt clean \
    && rm -rf /var/lib/apt/lists/* \
    && ln -s /usr/share/mysql/mroonga/install.sql /docker-entrypoint-initdb.d
```

## 試行錯誤

### 公式の手順ではうまくいかなかった

Mroonga は日本語の全文検索エンジンなだけあって、公式ドキュメントが日本語なのは助かります。インストール方法も環境ごとに詳細に記載されています。

- [2. インストール — Mroonga v12.02 documentation](https://mroonga.org/ja/docs/install.html)

しかし、 Docker のイメージが Ubuntu ベースのため、 [Ubuntu のインストール手順](https://mroonga.org/ja/docs/install/ubuntu.html) でインストールしようと思いましたが、うまくいきませんでした。

```:title=bash
# apt-get install -y -V software-properties-common lsb-release
# add-apt-repository -y universe
# add-apt-repository "deb http://security.ubuntu.com/ubuntu $(lsb_release --short --codename)-security main restricted"
# add-apt-repository -y ppa:groonga/ppa
# apt-get update
# apt-get install -y -V mariadb-server-mroonga 👈 ここでインストールできない
```

エラーメッセージは下記のような感じです。

```
#5 194.7 The following packages have unmet dependencies:
#5 194.7  mariadb-server-mroonga : Depends: mariadb-mroonga (= 12.02-1.ubuntu20.04.1) but it is not going to be installed
```

Mroonga の対応バージョンと MariaDB のバージョンが一致していないため、インストールできないようです。

GitHub で他のバージョンでも同様の報告があり、使用している MariaDB のバージョンに対応されないと無理なようです。

- [Install Error (Ubuntu 18.04, MariaDB 10.3.9) · Issue #214 · mroonga/mroonga](https://github.com/mroonga/mroonga/issues/214#issuecomment-423443068)

上記のコメントにも下記のように書かれています。

> just stop to install Mroonga from B. and install mariadb-plugin-mroonga from A.
>
> B(PPA) からのインストールはやめて ubuntu リポジトリから mariadb-plugin-mroonga をインストールしてください

Mroonga のリリース情報を見ると、なぜか Ubuntu のリリースはなく、 Debian Bullseye 系も 10.5 で止まっています😂

### Debian の手順も試す

試しに MariaDB のバージョンを 10.5 に下げ、 Debian Bullseye 系のインストール方法に従ってみました。

- [2.3. Debian GNU/Linux — Mroonga v12.02 documentation](https://mroonga.org/ja/docs/install/debian.html#bullseye-mariadb)

```:title=bash
# apt update
# apt install -y -V apt-transport-https \
# apt install -y -V wget \
# wget https://packages.groonga.org/debian/groonga-apt-source-latest-bullseye.deb \
# apt install -y -V ./groonga-apt-source-latest-bullseye.deb \
# apt update
```

すると `mariadb-server-10.5-mroonga` のインストールで下記のように失敗します。

```:title=bash
# apt install -y -V mariadb-server-10.5-mroonga
～略～
The following packages have unmet dependencies:
 mariadb-server-10.5-mroonga : Depends: mariadb-10.5-mroonga (= 12.02-1) but it is not going to be installed
```

さらにインストールできないと言われている `mariadb-10.5-mroonga` をたどってみます。

```:title=bash
# apt install -y -V mariadb-10.5-mroonga
～略～
The following packages have unmet dependencies:
 mariadb-10.5-mroonga : Depends: libgroonga0 (>= 11.0.0) but it is not going to be installed
                        Depends: mariadb-server-10.5 (= 1:10.5.15-0+deb11u1) but 1:10.5.15+maria~focal is to be installed
                        Depends: mariadb-server-core-10.5 (= 1:10.5.15-0+deb11u1) but 1:10.5.15+maria~focal is to be installed
                        Depends: groonga-normalizer-mysql but it is not going to be installed
```

Debian 用 (1:10.5.15-0+deb11u1) が必要なのに Ubuntu (1:10.5.15+maria~focal) が入ります、ということで拒否られます。

はい、ということで最新バージョンのインストールは難しいことがわかりました。

### 既定のリポジトリから Mroonga をインストールする

しかたがないので、 Mroonga のバージョンは妥協することにして `mariadb-plugin-mroonga` パッケージをインストールすることにしました。

最新バージョンが v12 で、 `mariadb-plugin-mroonga` パッケージでインストールできるのが v7 系ですので、妥協しすぎな感もあります。ここではとりあえずインストールできればよしとします。

`apt update` でリポジトリ情報を更新したあと、 `apt install` で `mariadb-plugin-mroonga` をインストールするだけで OK です。

試しに `database/Dockerfile` を下記のようにして、ビルド・起動してみます。

```{numberLines:1}:title=database/Dockerfile
FROM mariadb:10.6

RUN apt update \
    && apt install -y mariadb-plugin-mroonga
```

最後にコンテナー内の `/usr/share/mysql/mroonga/install.sql` を実行して MySQL にインストールする必要があります。

`docker-compose up -d` で起動したら、`exec` でコンテナーに入り、 `/usr/share/mysql/mroonga/install.sql` を流し込みます。

```:title=bash
$ docker-compose exec db bash 👈 Docker に入る
root@f61b0bc37568:/# mysql -uadmin -pdefaultPass < /usr/share/mysql/mroonga/install.sql 👈 SQL を流し込み
```

### Mroonga のインストール確認

Mroonga が正常にインストールできているか確認します。

- [4.1. インストールチェック — Mroonga v12.02 documentation](https://mroonga.org/ja/docs/tutorial/installation_check.html)

コンテナーに入ってから `mysql` にログインし、 **`SHOW ENGINES;`** を実行してみます。

```:title=bash
$ docker-compose exec db bash 👈 Docker に入る
root@f61b0bc37568:/# mysql -uadmin -pdefaultPass 👈 ユーザー名とパスワードで mysql に入る
```

```{1,6}:title=mysql
MariaDB [(none)]> SHOW ENGINES;
+--------------------+---------+-------------------------------------------------------------------------------------------------+--------------+------+------------+
| Engine             | Support | Comment                                                                                         | Transactions | XA   | Savepoints |
+--------------------+---------+-------------------------------------------------------------------------------------------------+--------------+------+------------+
～略～
| Mroonga            | YES     | CJK-ready fulltext search, column store                                                         | NO           | NO   | NO         |
+--------------------+---------+-------------------------------------------------------------------------------------------------+--------------+------+------------+
9 rows in set (0.000 sec)
```

続いて **`SHOW VARIABLES LIKE 'mroonga_version';`** で Mroonga のバージョンを確認します。

```{1,5}:title=mysql
MariaDB [(none)]> SHOW VARIABLES LIKE 'mroonga_version';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| mroonga_version | 7.07  |
+-----------------+-------+
1 row in set (0.001 sec)
```

はい、しっかり v7 系です。少々残念ですが、使えないよりはマシです。

### MeCab トークナイザーのインストール手順

Mroonga をインストールしただけではトークナイザーに **MeCab** が利用できません。 MeCab の詳細は公式ページや Groonga のドキュメントを参照してください。

- [MeCab: Yet Another Part-of-Speech and Morphological Analyzer](https://taku910.github.io/mecab/)
- [7.8.12. TokenMecab — Groonga v12.0.2ドキュメント](https://groonga.org/ja/docs/reference/tokenizers/token_mecab.html)

日本語のトークナイズに形態素解析を使用したい場合は以下の流れで MeCab をインストールする必要があります。
こちらはほぼ Mroonga のインストールドキュメントに従えばインストールできます。(mroonga 自体のインストールをスキップ)

- [2.4. Ubuntu — Mroonga v12.02 documentation](https://mroonga.org/ja/docs/install/ubuntu.html#ppa-personal-package-archive)

```{numberLines:1}:title=bash
# apt install -y software-properties-common lsb-release
# add-apt-repository -y universe
# add-apt-repository "deb http://security.ubuntu.com/ubuntu $(lsb_release --short --codename)-security main restricted"
# add-apt-repository -y ppa:groonga/ppa
# apt update
# apt install -y groonga-tokenizer-mecab
```

大まかには下記のような流れです。

1. universe リポジトリとセキュリティアップデートリポジトリを有効化
1. `ppa:groonga/ppa` PPAをシステムに追加
1. `groonga-tokenizer-mecab` をインストール

これで MeCab トークナイザーの最新バージョンがインストールされます。

```{2-3}:title=bash
root@e32e17fb1d8f:/# apt info groonga-tokenizer-mecab
Package: groonga-tokenizer-mecab
Version: 12.0.2-1.ubuntu20.04.1
Priority: optional
Section: libs
Source: groonga
Maintainer: Groonga Project <packages@groonga.org>
Installed-Size: 183 kB
Depends: libc6 (>= 2.4), libgroonga0 (= 12.0.2-1.ubuntu20.04.1), libmecab2 (>= 0.996), mecab-naist-jdic | mecab-jumandic-utf8
Breaks: libgroonga-tokenizer-mecab (<< 1.2.0-1)
Replaces: libgroonga-tokenizer-mecab (<< 1.2.0-1)
Download-Size: 40.6 kB
APT-Manual-Installed: yes
APT-Sources: http://ppa.launchpad.net/groonga/ppa/ubuntu focal/main amd64 Packages
Description: MeCab tokenizer for Groonga
```

こちらは MySQL へのインストールは不要です。これで MeCab が利用できるようになりました。

Mroonga のバージョンと合っていないのが気になりますが、特に問題はないようでした。

### Dockerfile を作る

ここまでをまとめて **Mroonga と MeCab をインストールする Dockerfile** を作ります。

```{numberLines:1}:title=database/Dockerfile
FROM mariadb:10.6

RUN apt update \
    && apt install -y mariadb-plugin-mroonga \
    && apt install -y software-properties-common lsb-release \
    && add-apt-repository -y universe \
    && add-apt-repository "deb http://security.ubuntu.com/ubuntu $(lsb_release --short --codename)-security main restricted" \
    && add-apt-repository -y ppa:groonga/ppa \
    && apt update \
    && apt install -y groonga-tokenizer-mecab \
    && apt clean \
    && rm -rf /var/lib/apt/lists/* \
    && ln -s /usr/share/mysql/mroonga/install.sql /docker-entrypoint-initdb.d
```

これが最初に紹介した Dockerfile です。

10 行目までは Mroonga と MeCab のインストール部分で、ここまで試行錯誤してきた内容です。

11～12 行目はキャッシュや不要なファイルを削除してなるべくイメージのサイズを減らします。 Docker イメージをビルドするときの定石です。

13 行目は Mroonga のインストールファイルのシンボリックリンクを `/docker-entrypoint-initdb.d` に配置してコンテナー起動時に自動的にインストールされるようにします。

### Mroonga インストールファイルの注意

前項で Mroonga のインストールファイルのシンボリックリンクを `/docker-entrypoint-initdb.d` に配置しました。

*ただ、今回の例では Docker Compose で同ディレクトリーにホストのディレクトリーをマウントしているため、実際には起動時にインストールファイルが読み込まれません。*

```yaml{6}:title=docker-compose.yml
version: '3.1'
services:
  db:
    # ～略～
    volumes:
      - ./initdb:/docker-entrypoint-initdb.d
```

これを防ぐには、マウントされるディレクトリに下記のようなシェルスクリプトを配置しておきます。

```sh:title=initdb/000_install_mroonga.sh
#!/bin/bash

echo "$0: installing mroonga"
"${mysql[@]}" < /usr/share/mysql/mroonga/install.sql
echo "$0: installed"
echo
```

内容は `/usr/share/mysql/mroonga/install.sql` を `mysql` コマンドに流し込んでいるだけです。`${mysql[@]}` が実行されるときに実際の `mysql` コマンドに置き換わります。

ファイル名もテーブルの作成などより先に実行されれば、なんでもかまいません。 `/docker-entrypoint-initdb.d` 内のファイルは名前順に実行されます。


## Mroonga エンジンの使用方法

### Mroonga エンジンを使ったテーブル作成と全文検索インデックスの追加

Mroonga エンジンを使ったテーブルを作成するには下記のように `ENGINE` に `mroonga` を指定します。

```sql
CREATE TABLE IF NOT EXISTS employees (
  id bigint AUTO_INCREMENT NOT NULL PRIMARY KEY COMMENT 'ID'
, name_ja varchar(255) COMMENT '名前(日)'
, name_en varchar(255) COMMENT '名前(英)'
) COMMENT '社員' ENGINE = mroonga;
```

そのテーブルのカラムに対して全文検索インデックスを追加するには下記のようにします。

```sql
ALTER TABLE employees ADD FULLTEXT INDEX ix_ft_name_ja (name_ja) COMMENT 'tokenizer "TokenMecab"';
ALTER TABLE employees ADD FULLTEXT INDEX ix_ft_name_en (name_en) COMMENT 'tokenizer "TokenBigram"';
```

トークナイザーはコメントで指定します。（この方法なんとかならないんですかね...）

`TokenMecab` だと MeCab トークナイザー、 `TokenBigram` だとバイグラムトークナイザーが使われます。

その他、下記の公式情報にあるトークナイザーが利用できるようです。
（※公式ドキュメントは v12 系の情報のため v7 系では使えないものがあるかもしれませんのでご注意ください。）

- [4.3. ストレージモード — Mroonga v12.02 documentation](https://mroonga.org/ja/docs/tutorial/storage.html?highlight=%E3%83%88%E3%83%BC%E3%82%AF%E3%83%8A%E3%82%A4%E3%82%B6%E3%83%BC#how-to-specify-the-parser-for-full-text-search)

また、 `my.cnf` などで下記のように指定するとデフォルトのトークナイザーを指定できるようです。

```ini:title=my.cnf
[mysqld]
mroonga_default_tokenizer=TokenMecab
```

### Mroonga エンジンの注意

**ストレージエンジンを Mroonga にしたテーブルでは、 NULL 値で指定したデータはカラムのデフォルト値として扱われます。**

つまり `varchar` 型のカラムの場合は NOT NULL 制約をつけていなくても、*自動的に空文字として格納*されます。

NULL で INSERT/UPDATE して、 SELECT して NULL が返ってくると信じていたら、バグの元です。これに限りませんが、 NULL 値の扱いには注意しましょう。

その他 Mroonga に関する制限事項は公式情報を参照してください。

- [5.6. 制限事項 — Mroonga v12.02 documentation](https://mroonga.org/ja/docs/reference/limitations.html)


## まとめ

今回は試行錯誤の末、 Docker の MariaDB で Mroonga を動かすことができたので、その経緯を含めて紹介しました。

Mroonga が最新バージョンでないのが残念ですが、とりあえず全文検索を使用する分には問題ありません。

最新バージョンが必要な場合は、 Mroonga の公式イメージを参考にして、ゼロから作ったほうがいいかもしれません。

- [mroonga/docker: Dockerfile for Mroonga](https://github.com/mroonga/docker#readme)

どなたかのお役に立てれば幸いです。
