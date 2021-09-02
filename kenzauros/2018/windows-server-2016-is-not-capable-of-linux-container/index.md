---
title: Windows Server 2016 の Docker では Linux コンテナーが動かないという話
date: 2018-11-26
author: kenzauros
tags: [Windows Server, Docker, 仮想化技術]
---

結論から言うと、先に仕様を調べれば**「Windows Server 2016 のコンテナー機能では Linux コンテナーは動作させられない」**ことがわかるのですが、そこに行き着くまで試行錯誤するはめになったので、記録として残しておきます。

## 試行錯誤

### docker-compose がない

**Windows Server 2016 にはコンテナー機能が実装されており、 Hyper-V を有効化すると docker コマンドが使えます。**

つまり **Windows 10 Pro の Docker for Windows ぐらいの簡単さで動いてしまうものと考えてしまったのが、まず間違い**でした。

Hyper-V を有効にし docker コマンドを叩いてみると `hello-world` もたしかに動作しました。
（後から確認するとこの `hello-world` は Windows コンテナーでした）

しかし `docker-compose` を叩いてみると存在しないようです。

ということで compose の公式サイトから Windows 用のバイナリーをダウンロードして、 docker.exe と同じフォルダ (`C:\Program Files\Docker`) に置いてみました。

> docker-compose-Windows-x86_64.exe
> [Releases · docker/compose](https://github.com/docker/compose/releases)

実行してみると...

```sh
PS C:\hogehoge> docker-compose version
docker-compose version 1.23.1, build b02f1306
docker-py version: 3.5.0
CPython version: 3.6.6
OpenSSL version: OpenSSL 1.0.2o  27 Mar 2018
```

動作はするようでした。

### エラー: client version 1.22 is too old.

しかし、いざ `docker-compose.yml` のあるフォルダで `up` してみると...

```sh
PS C:\hogehoge> docker-compose up -d
ERROR: client version 1.22 is too old. Minimum supported API version is 1.24, please upgrade your client to a newer version
```

クライアントバージョン 1.22 が古すぎると言われました。 **API のバージョンが 1.24 以上でないと無理**、と。

docker のバージョンを確認してみます。

```sh
PS C:\hogehoge> docker version
Client:
 Version:      17.06.2-ee-17
 API version:  1.30
 Go version:   go1.8.7
 Git commit:   66834de
 Built:        Thu Oct 25 12:16:20 2018
 OS/Arch:      windows/amd64

Server:
 Engine:
  Version:      17.06.2-ee-17
  API version:  1.30 (minimum version 1.24)
  Go version:   go1.8.7
  Git commit:   66834de
  Built:        Thu Oct 25 12:25:12 2018
  OS/Arch:      windows/amd64
  Experimental: false
```

いや、 1.30 ですやん。

いろいろ調べた結果、**このエラーは `docker-compose.yml` の `version` を `2.1` にすると直るらしい**ことが判明しました。

```diff
-version: '2'
+version: '2.1'
```

再度、 `up` したところ同エラーはでなくなりました。

### エラー: Creating network "hogehoge_default" with the default driver

しかし今度は別のエラーが発生しました。

```sh
PS C:\hogehoge> docker-compose up -d
Creating network "hogehoge_default" with the default driver
ERROR: HNS failed with error : パラメーターが間違っています。 (The parameter is incorrect.)
```

まったく意味不明ですが、これに関しては `docker-compose.yml` に `networks` 指定をいれて `nat` を指定すればいいらしいという[コメント](https://github.com/docker/compose/issues/4024#issuecomment-321839587)を見たので下記の記述を追加してみました。

```ruby
networks:
  default:
    external:
      name: nat
```

これで同エラーは消えました。

### エラー: image operating system "linux" cannot be used on this platform

しかし、再度 `up` してみると今度はなんか根本的らしいエラーが発生。。。イタチごっこです。

```sh
PS C:\hogehoge> docker-compose up -d
～中略～
ERROR: image operating system "linux" cannot be used on this platform
```

>ERROR: image operating system "linux" cannot be used on this platform
>エラー: Linux OS のイメージはこのプラットフォームでは使えません。

再度、 docker バージョンを見てみると...

```sh
PS C:\hogehoge> docker version
Client:
 Version:      17.06.2-ee-17
 API version:  1.30
 Go version:   go1.8.7
 Git commit:   66834de
 Built:        Thu Oct 25 12:16:20 2018
 OS/Arch:      windows/amd64

Server:
 Engine:
  Version:      17.06.2-ee-17
  API version:  1.30 (minimum version 1.24)
  Go version:   go1.8.7
  Git commit:   66834de
  Built:        Thu Oct 25 12:25:12 2018
  OS/Arch:      windows/amd64
  Experimental: false
```

`Server.Engine.OS/Arch` が `windows/amd64` になっているので Linux コンテナーが起動できないですね。ここが `linux/amd64` でなければならないらしいです。

### Linux コンテナーモードへの切り替え

Windows 10 Pro の Docker for Windows ならタスクトレイアイコンから [Switch to Linux container...] を選ぶことで切り替えられるので、これに相当するコマンドを探してみたが見つかりませんでした。

stackoverflow 等で最新の Docker for Windows なら 2016 に入るよ！という情報があったので、試しに Docker for Windows 18.06.1-ce-win73 をインストールしてみたが、やはり Desktop OS しかサポートされないということで正常に起動しませんでした。

Docker for Windows EE (Enterprise Edition) なら動くのかもしれませんが、そこは未確認です。

### 結論: Windows Server 2016 で Linux コンテナーは実行できない

で、いろいろ調べていくうち、そもそもな話に行き当たりました。

> 現時点でWindows ServerのDockerコンテナはWindows Serverコンテナであり、そこで実行できるのはWindows Serverアプリケーションとなっていました。
> [Windows ServerでLinuxコンテナが稼働可能に、今月のWindows Server 2016アップデートで。マイクロソフトが予告 － Publickey](https://www.publickey1.jp/blog/17/windows_serverlinuxwindows_server_2016.html)

つまるところ、**Windows Server 2016 の Docker で Linux コンテナーは実行できない** ということです。

また、記事中では下記のように紹介されています。

>その最初のアップデートとなる「バージョン1709」は2017年9月、つまり今月リリース予定です。同社はブログ「Sneak peek #3: Windows Server, version 1709 for developers」で今回のアップデートの概要を伝えており、新機能のひとつとしてWindows Server 2016のDockerでLinuxコンテナが稼働することを紹介しています。
>マイクロソフトはこのHyper-Vコンテナに、Dockerが今年4月にMoby Projectのひとつとして発表したコンテナ環境に特化した最小限のLinux機能を提供する「LinuxKit」を組み合わせることで、Windows ServerのDockerコンテナでLinuxコンテナを実現すると説明しています。

つまり **Windows Sever バージョン 1709 で Linux コンテナーに対応した** ということです。

ただし、ここで注意すべきは **Windows Sever バージョン 1709** であり、 **Windows Server 2016** ではないということです。（参考記事ではおそらく混同されています）

このあたりの話は @IT の以下の記事が詳しいです。

> Windows Server バージョン1709（ビルド16299）は「半期チャネル（Semi-Annual Channel）」サービスモデルで提供される、Windows Serverの新しい、初のバージョンです。このサービスモデルは、Windows Serverのソフトウェアアシュアランス（SA）契約に基づいて提供されるものです。
> [Windows Server 2016の次は「1709」？　いえ、2016の次はまだ出ていません！ (1/2)：その知識、ホントに正しい？ Windowsにまつわる都市伝説（96） - ＠IT](http://www.atmarkit.co.jp/ait/articles/1711/07/news012.html)

名前が Windows 10 の 1709 や 1803 の機能更新プログラムみたいでややこしいのですが、要するに基本的には **Windows Server 2016 (1607) は 1709 や 1803 にアップグレードすることはできない**ということです。

よって、冒頭の結論に戻り、**「Windows Server 2016 のコンテナー機能では Linux コンテナーは動作させられない」**ということになります。

## あとがき

Windows Server をずっと追いかけている人ならともかく、片手間の開発者にとっては非常にわかりにくいですね。

いずれにしろ Linux コンテナーのサポートぐらい更新プログラムかなんかで、なんとかしてほしかったです。

以上、グチでした。

## 参考

- [ERROR: client version 1.22 is too old · Issue #4106 · docker/compose](https://github.com/docker/compose/issues/4106)
- [HNS failed with error on Windows 10 · Issue #4024 · docker/compose](https://github.com/docker/compose/issues/4024)
- [Sneak peek #3: Windows Server, version 1709 for developers - Windows Server Blog](https://cloudblogs.microsoft.com/windowsserver/2017/09/13/sneak-peek-3-windows-server-version-1709-for-developers/)
- [Windows Server バージョン 1803 の概要 | Microsoft Docs](https://docs.microsoft.com/ja-jp/windows-server/get-started/get-started-with-1803)