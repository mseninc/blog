---
title: Laravel Sail で Supervisor を使ってキューワーカを永続化させる方法
date: 2021-06-27
author: junya-gera
tags: [Laravel, Docker, Laravel Sail, Supervisor, Web]
---

こんにちは、じゅんじゅんです。以前、[キューを使用して非同期でメール送信を行う機能を実装する記事](/implement-mail-function-with-queue-in-laravel/)を投稿しました。この記事では `php(sail) artisan queue:work` コマンドを使用してキューワーカを起動させていましたが、このコマンドを実行しているターミナルを閉じてしまうとキューワーカも停止してしまいます。

今回は、[Laravel Sail](https://readouble.com/laravel/8.x/ja/sail.html) を用いた開発環境で、プロセス管理システムである [Supervisor](http://supervisord.org/) を使用し、キューワーカのプロセスをバックグラウンドで永続的に実行させる方法をご紹介します。


## 開発環境
今回の開発環境は以下のようになります。
PHP: 8.0
Laravel: 8.12
MySQL: 5.7
Supervisor: 4.1.0

## Supervisor とは
Supervisor とは、 OS 上の多数のプロセスを監視および制御できるようにするシステムです。UNIX ライクなので、Windows の場合は WSL2 を使用する必要があります（WSL2 を使うための参考記事は[こちら](/windows-terminal-with-ubuntu/)）。

ただし、後述しますが今回の作業においては Supervisor のコマンド操作を行わないので、 WSL2 をインストールする必要はありません。

この Supervisor を使って、キューワーカをなんやかんや


## Laravel Sail における Supervisor の設定
本来 Laravel で Supervisor を使用する場合、 Supervisor をインストールするところから始めますが、 Laravel Sail ではコンテナの内部で Supervisor が起動しています。 Laravel Sail で環境構築を行った場合、`vendor/laravel/sail/runtimes/` 下に 7.4 または 8.0 という PHP のバージョンごとのディレクトリがあり、中には Dockerfile があります。この Dockerfile にはデフォルトで以下の記述があります。

`vendor/laravel/sail/runtimes/8.0/Dockerfile`
```
COPY start-container /usr/local/bin/start-container
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
```

`COPY` は、ローカルにおいてあるファイルを Docker イメージのファイルシステムのなかにコピーする命令です。ここでは Dockerfile と同階層にある `start-container` 、 `supervisord.conf` をそれぞれコンテナ内の `/usr/local/bin/start-container` 、 `/etc/supervisor/conf.d/supervisord.conf` にコピーしています。

`start-container` ファイルは以下のようなバッシュスクリプトです。
```sh
#!/usr/bin/env bash

if [ ! -z "$WWWUSER" ]; then
    usermod -u $WWWUSER sail
fi

if [ ! -d /.composer ]; then
    mkdir /.composer
fi

chmod -R ugo+rw /.composer

if [ $# -gt 0 ];then
    exec gosu $WWWUSER "$@"
else
    /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
fi
```

Dockerfile の一番下にこのような記述があります。
```
ENTRYPOINT ["start-container"]
```
このように `start-container` はコンテナの `ENTRYPOINT` に設定されていて、コンテナが立ち上がるときに毎回実行されます。スクリプトの `else` の部分で、自身と同階層にある `supervisord.conf` (上で紹介した構成ファイル) を `supervisord` に固定的に渡すよう設定されています。

ここで Supervisor に「キューワーカを永続的に実行させる」という処理をさせるには、以下の手順で修正を行います。

1.  「キューワーカを永続的に実行させる」という処理を記述した `supervisord.conf` を新たに作成する
2. 1 で作成した `supervisord.conf` を読み込む、新たなエントリポイントとなる `start-container.sh` を作成する
3. `dcoker-compose.yml` の `laravel.test` コンテナの `entrypoint` でエントリポイントを 2 で作成した `start-container.sh` に変更する

## 1.  「キューワーカを永続的に実行させる」という処理を記述した `supervisord.conf` を新たに作成する
では順番に行っていきます。 `src` 下に `supervisord.conf` というファイルを作成し、以下の内容にします。
```
[supervisord]
nodaemon=true
user=root

[program:php]
command=/usr/bin/php -d variables_order=EGPCS /var/www/html/artisan serve --host=0.0.0.0 --port=80
user=sail
environment=LARAVEL_SAIL="1"
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=/usr/bin/php /var/www/html/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
user=sail
numprocs=8
redirect_stderr=true
stdout_logfile=/var/www/html/supervisord-worker.log
stopwaitsecs=3600
```
`[program:laravel-worker]` という部分にキューワーカを実行する設定を記述しています。


## 2. 1 で作成した `supervisord.conf` を読み込む、新たなエントリポイントとなる `start-container.sh` を作成する
こちらも `src` 下に `start-container.sh` というファイルを作成し、以下の内容にします。
```sh
#!/usr/bin/env bash

if [ ! -z "$WWWUSER" ]; then
    usermod -u $WWWUSER sail
fi

if [ ! -d /.composer ]; then
    mkdir /.composer
fi

chmod -R ugo+rw /.composer

if [ $# -gt 0 ];then
    exec gosu $WWWUSER "$@"
else
    /usr/bin/supervisord -c ./supervisord.conf
fi
```
変わったのは `else` の部分のみで、同階層の `supervisord.conf`(先ほど作成した方) を `/usr/bin/supervisord` に渡すよう設定しました。

## 3. `dcoker-compose.yml` の `laravel.test` コンテナの `entrypoint` でエントリポイントを 2 で作成した `start-container.sh` に変更する
最後に、今作成した `start-container.sh` をエントリポイントとするため、 `dcoker-compose.yml` の `laravel.test` コンテナの `entrypoint` を `start-container.sh` に修正します。
```yml
laravel.test:
    build:
        context: ./vendor/laravel/sail/runtimes/8.0
        dockerfile: Dockerfile
        args:
            WWWGROUP: '${WWWGROUP}'
    image: sail-8.0/app
    ports:
        - '${APP_PORT:-80}:80'
    environment:
        WWWUSER: '${WWWUSER}'
        LARAVEL_SAIL: 1
    volumes:
        - '.:/var/www/html'
    entrypoint: ./start-container.sh
```

## 感想

## 参考
