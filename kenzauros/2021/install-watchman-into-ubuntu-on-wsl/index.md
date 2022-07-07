---
title: Ubuntu on WSL に Watchman をインストールする
date: 2021-06-21
author: kenzauros
tags: [AWS, Ubuntu, AppSync, Web, Serverless Framework, WSL]
---

こんにちは、kenzauros です。

**WSL (Windows Subsystem for Linux) 上の Ubuntu に Watchman をインストール**したときのメモです。

**Watchman は Facebook 製のファイルの変更を監視するツール**です。

意外とオプションでつまづいたので、同じような方の助けになれば幸いです。

## 環境

- Windows 10 Pro 20H2
- Ubuntu 20.04 on WSL 2
- Watchman 4.9.0
- Serverless Framework 2.46.0
- Node 14.17.1

## 背景

そもそもの発端は Serverless Framework のオフライン環境 [serverless-offline](https://github.com/dherault/serverless-offline) が起動せず困ったためです。

停止していたのは **[serverless-appsync-simulator](https://github.com/bboure/serverless-appsync-simulator) の起動時**で、下記のように **`Error: spawn watchman ENOENT`** が出ていました。

```
$ sls offline start
Fn::GetAttResolvers not found in params file: AppSyncLoggingServiceRole
AppSync Simulator: my-app-dev AppSync endpoint: http://172.31.240.1:20002/graphql
AppSync Simulator: my-app-dev GraphiQl: http://172.31.240.1:20002
Watchman:  spawn watchman ENOENT

  Error --------------------------------------------------

  Error: spawn watchman ENOENT
      at Process.ChildProcess._handle.onexit (internal/child_process.js:269:19)
      at onErrorNT (internal/child_process.js:467:16)
      at processTicksAndRejections (internal/process/task_queues.js:82:21)

     For debugging logs, run again after setting the "SLS_DEBUG=*" environment variable.
```

いろいろ試行錯誤したあと、下記の Issue で至極真っ当な指摘に行き当たりました。

> **This issue is resolved by installing watchman.**
>
> - [Watchman: spawn watchman ENOENT - · Issue #97 · bboure/serverless-appsync-simulator](https://github.com/bboure/serverless-appsync-simulator/issues/97)

よくよく README を読み返せば、、、なんということでしょう。

> Hot-reloading relies on watchman. **Make sure it is installed on your system.**
>
> [bboure/serverless-appsync-simulator: A simple wrapper around Amplify AppSync Simulator to test serverless AppSync Apis](https://github.com/bboure/serverless-appsync-simulator#hot-reloading)

はっきりと「**watchman インストールしてね**」と書かれているではありませんか。

ということで Watchman をインストールすることにしました。

## インストール

インストール手順は公式の **Installing from source** に従います。

- [Installation | Watchman](https://facebook.github.io/watchman/docs/install.html#installing-from-source)

git からソースを落としてきてコンパイルしてインストールするため、下記のパッケージが必要です。まとめてインストールしましょう。

```sh
$ sudo apt install -y make libtool libssl-dev autoconf automake pkg-config g++
```

パッケージが用意できたら公式手順に従って、コマンドを叩いていきます。ただし、 `./configure` の部分だけ、オプションを変えています。詳細は後述の「トラブルシューティング」を参照ください。

```sh
$ git clone https://github.com/facebook/watchman.git -b v4.9.0 --depth 1
$ cd watchman 
$ ./autogen.sh
$ ./configure --disable-dependency-tracking --without-python --without-pcre --enable-lenient
$ make
$ sudo make install
```

インストールが完了したら、バージョンを確認しておきます。

```sh
$ watchman --version
4.9.0
```

これで Watchman がインストールされ、 `sls offline` が無事動作しました。


## トラブルシューティング

### `configure` でエラー

`configure` で依存性追跡のエラーが発生しました。

```
config.status: error: in `/home/username/watchman':
config.status: error: Something went wrong bootstrapping makefile fragments
    for automatic dependency tracking.  Try re-running configure with the
    '--disable-dependency-tracking' option to at least be able to build
    the package (albeit without support for automatic dependency tracking).
See `config.log' for more details
```

`./configure` に `--disable-dependency-tracking` オプションをつけるととりあえず通りました。

- [aravis解析 その3：腰も砕けよ 膝も折れよ：So-net blog](https://decafish.blog.ss-blog.jp/2019-06-22)

### `make` でエラー

`make` でもエラーが発生しました。

```
scm/Mercurial.cpp: In constructor ‘watchman::Mercurial::infoCache::infoCache(std::string)’:
scm/Mercurial.cpp:16:40: error: ‘void* memset(void*, int, size_t)’ clearing an object of non-trivial type ‘struct watchman::FileInformation’; use assignment or value-initialization instead [-Werror=class-memaccess]
   16 |   memset(&dirstate, 0, sizeof(dirstate));
      |                                        ^
In file included from scm/Mercurial.h:10,
                 from scm/Mercurial.cpp:3:
./FileInformation.h:18:8: note: ‘struct watchman::FileInformation’ declared here
   18 | struct FileInformation {
      |        ^~~~~~~~~~~~~~~
cc1plus: all warnings being treated as errors
make[1]: *** [Makefile:4450: scm/watchman-Mercurial.o] Error 1
make[1]: Leaving directory '/home/yamada/watchman'
make: *** [Makefile:1264: all] Error 2
```

こちらは watchman の Issue でも上がっていました。

- [v4.9.0 compile failure on Debian unstable · Issue #638 · facebook/watchman](https://github.com/facebook/watchman/issues/638)

`enable-lenient` オプションをつけろとあります。

>--enable-lenient  Turn off more pedantic levels of warnings
>                  and compilation checks
>
>[Compile Time Configuration Options - Installation | Watchman](https://facebook.github.io/watchman/docs/install.html#compile-time-configuration-options)


`./configure` に `--enable-lenient` をつけると、上記でエラーになっていた部分が warning になり make が通るようになります。

同 Issue に

```
./configure --without-python --without-pcre --enable-lenient
```

でうまくいった例が多いのでこれを採用して結果的に

```
./configure --disable-dependency-tracking --without-python --without-pcre --enable-lenient
```

としました。

やっつけ対応な気もしますが、 Watchman 自身が主役ではなく、とりあえず動作しているのでよしとします。
