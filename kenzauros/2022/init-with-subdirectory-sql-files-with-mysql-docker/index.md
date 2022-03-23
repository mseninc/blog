---
title: MySQL と MariaDB の Docker イメージでコンテナー起動時にサブディレクトリー内の SQL ファイルを読み込む
date: 
author: kenzauros
tags: [MySQL, MariaDB, Docker]
description: MySQL (MariaDB) の Docker イメージを起動するときに、サブディレクトリーに配置した SQL ファイルも読み込めるようにする方法を紹介します。
---

**MySQL** や **MariaDB** は Docker のイメージが公式に提供されており、これを使うことで簡単に任意のバージョンのデータベースを起動できます。

また*コンテナー作成時に読み込む SQL ファイルを指定でき、別途 SQL を流し込まなくても、初期化済の状態でコンテナーを起動できます*。

ただ、初期設定用の SQL ファイルが多い場合、サブディレクトリーに格納しておきたい場合があると思います。
標準の状態では**サブディレクトリー内のファイルは無視されるため、今回はこれらの SQL ファイルも読み込む方法**を紹介します。

## はじめに

### 環境

- MariaDB 10.6
- Docker 20.10.13
- Docker Compose 2.3.3

それぞれ Docker イメージは下記の公式のものを利用します。

- [Mysql - Official Image | Docker Hub](https://hub.docker.com/_/mysql)
- [Mariadb - Official Image | Docker Hub](https://hub.docker.com/_/mariadb)

今回は *MariaDB* を使用します。
MariaDB は Docker イメージも含めて、 MySQL と差し替えてもほぼそのまま使用できるようになっていますので、 Docker イメージに渡すパラメーターも同じで問題ありません。

### docker-compose.yml

1 コンテナーだけですが、定義がわかりやすいため Docker Compose を利用します。

`docker-compose.yml` は下記のような内容です。

```yaml{16}:title=docker-compose.yml
version: '3.1'
services:
  db:
    image: mariadb:10.6
    restart: always
    environment:
      MYSQL_DATABASE: hoge
      MYSQL_USER: admin
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-defaultPass}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-defaultPass}
      TZ: 'Asia/Tokyo'
    ports:
      - 3306:3306
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    volumes:
      - ./initdb:/docker-entrypoint-initdb.d 👈 初期化スクリプトのディレクトリ－
      - ./my.cnf:/etc/mysql/conf.d/my.cnf
      - db-data:/var/lib/mysql

volumes:
  db-data:
    driver: local
```

環境変数 (`environment`) は環境に合わせて適宜設定してください。また、MySQL の場合は `image` を `mysql` に変更してください。

上の例はデータ領域に Docker Volume (`db-data`) を使用していますが、ディレクトリーマッピングでもかまいません。


## 起動時にサブディレクトリー化のファイルを読み込む

### 初期化ディレクトリ－の難

さて、ここからが本題です。

MySQL (MariaDB) の Docker イメージでは、コンテナーの **`/docker-entrypoint-initdb.d` ディレクトリーにファイルを配置すると、起動時に実行**してくれます。
読み込まれるファイルは `*.sh` や `*.sql` です。

前掲の `docker-compose.yml` では **`./initdb:/docker-entrypoint-initdb.d`** のように指定しています。
これにより*ローカルマシンの `initdb` ディレクトリーがコンテナーの `/docker-entrypoint-initdb.d` ディレクトリーにマウント*されます。

※この `initdb` というディレクトリー名はお好きな名称でかまいません。

あとは下記のように `initdb` ディレクトリーに SQL ファイルを格納しておけば、起動時に実行されるはずです。


```{2}
.
├── initdb 👈 /docker-entrypoint-initdb.d にマウントされる
│   ├── 20220101_001_first.sql
│   ├── 20220101_002_second.sql
│   └── 20220101_003_third.sql
└── docker-compose.yml
```

ただ、読み込まれるのはこの*ディレクトリー直下のファイルのみで、サブディレクトリーのファイルは無視*されてしまいます。

たとえば下記のように 2 ファイルをサブディレクトリーに入れると、 `20220101_003_third.sql` のみが実行されるようになります。

```{3-6}
.
├── initdb
│   ├── 20220101_first 👈 サブディレクトリー
│   │   └── 20220101_001_first.sql
│   ├── 20220102_second 👈 サブディレクトリー
│   │   └── 20220101_002_second.sql
│   └── 20220101_003_third.sql
└── docker-compose.yml
```

ディレクトリーに分けられないと、ファイルが多くなったときに管理しづらくなるため、これは少し不便です。

すでに先人たちが、同じような不満を抱えていたようで、Issue や Pull Request が何度も挙がっているようです。

- [Recurse subdirectories for docker-entrypoint-initdb.d functionality · Issue #179 · docker-library/postgres](https://github.com/docker-library/postgres/issues/179)  
(注：リンク先の Issue は PostgreSQL です)

メンテナーのコメントを読む限り「*Shell script を置いたりすりゃ自由にできるんだから、イメージとしては追加しないよ（超意訳）*」という方針のようです。

### シェルスクリプトを追加

ということで、その方針に従います。下記のような**シェルスクリプトを作成し、このスクリプトを `/docker-entrypoint-initdb.d` で読み込む**ようにします。

```sh{numberLines:1}:title=initdb.sh
#!/bin/bash

echo "$0: initializing database"
find /docker-entrypoint-initdb.d -mindepth 2 -type f | sort | while read f; do
  case "$f" in
    *.sql)    echo "$0: running $f"; "${mysql[@]}" < "$f";;
    *.sql.gz) echo "$0: running $f"; gunzip -c "$f" | "${mysql[@]}";;
    *)        echo "$0: ignoring $f" ;;
  esac
done
echo "$0: initialized"
echo
```

先の Issue などに掲載されているものを参考にしていますが、ファイル名順に実行してほしいので `find` の区切り文字を改行にして、 `sort` を追加しています。

スクリプトでやっていることは単純で、下記の流れです。

1. `/docker-entrypoint-initdb.d` のサブディレクトリー直下のファイルを列挙 (4行目)
1. ファイル名をソート (4行目)
1. ファイルの内容を読み取り (4行目)
1. 拡張子によって実行方法を分岐 (5～9行目)
    1. `*.sql` なら MySQL コマンドに流し込む
    1. `*.sql.gz` なら `gunzip` コマンドを通して MySQL コマンドに流し込む
    1. それ以外なら無視

直下のファイルは既定で読み込まれるため、 *`find` の `-mindepth 2` で「サブディレクトリーのみ」を対象にしている*ところがミソですね。

下記のようにシェルスクリプトが配置できていれば OK です。

```{8}
.
├── initdb
│   ├── 20220101_first
│   │   └── 20220101_001_first.sql
│   ├── 20220102_second
│   │   └── 20220101_002_second.sql
│   ├── 20220101_003_third.sql
│   └── initdb.sh 👈 シェルスクリプトを配置
└── docker-compose.yml
```

### コンテナーを起動してみる

ではスクリプトを配置した状態でコンテナーを起動します。

```sh:title=bash
$ docker-compose up -d
```

SQL ファイルにエラーがなければ、ログには下記のように表示されると思います。

```:title=コンテナー起動ログ
2022-03-23 14:21:13+09:00 [Note] [Entrypoint]: /usr/local/bin/docker-entrypoint.sh: sourcing /docker-entrypoint-initdb.d/initdb.sh 👈 シェルスクリプトが読み込まれている

/usr/local/bin/docker-entrypoint.sh: initializing database 👈 ここからシェルスクリプトの実行結果
/usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/20220101_first/20220101_001_first.sql
/usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/20220102_second/20220101_002_second.sql
/usr/local/bin/docker-entrypoint.sh: initialized 👈 ここまでシェルスクリプトの実行結果
```

無事サブディレクトリーのファイルが実行されれば OK です。

`initialized` が表示されない場合、途中の SQL でエラーの発生している可能性が大きいので、確認してください。
よく見るとログにエラーが表示されているはずです。

再実行する場合、一度コンテナーが起動され、データが初期化されていると、読み込まれません。
その場合は下記のようにボリューム (あるいはデータディレクトリ) を削除してください。

```sh:title=bash
$ docker-compose down 👈 コンテナーを落とす
$ docker volume ls 👈 ボリューム名確認
$ docker volume rm db-data 👈 確認したボリュームを削除
$ docker-compose up -d 👈 再実行
```


## まとめ

今回は MySQL (MariaDB) の Docker イメージで、初回起動時にサブディレクトリーのファイルも読み込めるようにしました。

これで、ある程度整理した状態で初期ファイルを読み込ませることができます。

今回は MySQL 系の話でしたが、参考にした GitHub Issue にもあるように PostgreSQL もほぼ同様の手法で実現できると思います。

どなたかのお役に立てば幸いです。

### 参考

- [Recurse subdirectories for docker-entrypoint-initdb.d functionality · Issue #179 · docker-library/postgres](https://github.com/docker-library/postgres/issues/179)
- [Docker MySQLの初期化処理：サブディレクトリの *.sql なども対象にする](https://gist.github.com/tksugimoto/2ba7f56fad7c3fadb91c9b5ebf9d0518)
