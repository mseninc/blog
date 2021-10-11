---
title: "[Linux] コマンドの進捗状況を確認する方法"
date: 2020-07-22
author: k-so16
tags: [Linux]
---

こんにちは。最近、週末に [Beat Saber](https://beatsaber.com/) で体を動かすことが習慣となりつつある k-so16 です。季節柄 VR のゴーグルがすぐ曇ることが最近のちょっとした悩みです(笑)

UNIX/Linux において処理に時間のかかる処理を実行する場合、コマンドによってはシェル上に進捗状況が表示されず、 **正しく動作しているのかハングしてしまっているのか区別がつけづらい** ことがあります。 FreeBSD や macOS などの BSD 系の OS では、 **`Ctrl-T`** を押下することで実行中のコマンドの情報を得られますが、 Linux では同じ方法が使えません。

Linux で実行中のコマンドの情報を取得する方法はないか調べてみたところ、コマンドの進捗状況を取得できる **`pv`** コマンドがあるということを知りました。

本記事では、 `pv` コマンドを使ってコマンドの進捗状況を取得する方法を紹介します。さらに BSD 系で `Ctrl-T` を押下した際に実行中のコマンドの情報が出力される仕組みについても紹介します。

本記事で想定する読者層は以下の通りです。

- UNIX/Linux のパイプについて知っている

## `pv` コマンドのインストール

標準で Linux に `pv` コマンドはインストールされていないので、利用するためにはインストール作業が必要です。基本的にはパッケージマネージャーからインストールできます。 CentOS の場合、**[pv の公式 YUM リポジトリの追加](http://www.ivarch.com/programs/yum.shtml)** があります。

- Ubuntu の場合
```bash
apt install pv
```

- CentOS の場合
```bash
yum install pv
```

なお、 `pv` コマンドは Linux 以外にも macOS や FreeBSD でも入手可能です。

## `pv` コマンドの使い方

`pv` は **Pipe Viewer** の略とのことです。 `pv` コマンドは **入力のデータのサイズとパイプを通過したデータの量から進捗状況を算出** して表示します。  `pv` コマンドはファイルが指定された場合は、そのファイルの内容を標準出力に出力し、指定されない場合は標準入力の内容を標準出力に出力します。

Raspberry Pi の OS のバックアップを `dd` を用いて作成する際に、 `pv` コマンドを用いて画面上に進捗状況を表示させる方法は以下の通りです。

```bash
$ pv /dev/sdc | dd of=raspbian-backup.img 
5.04GiB 0:04:06 [19.6MiB/s] [==========>                       ] 34% ETA 0:07:40
```

上記の実行例のように、`pv` コマンドを利用することで、 **プログレスバー** や **進捗のパーセンテージ** 、 **残り時間(ETA)** などが表示されます。進捗状況が表示されないコマンドでも、処理がどの程度進んで残り時間がどの程度か分かるのは便利ですね。

`pv` コマンドについては、以下の記事を参考にしました。

> - [シェルのパイプの速度(進捗バー) は pv で - Qiita](https://qiita.com/kitsuyui/items/549c8e786e7d456e0923)
> - [Ubuntu Manpage: pv - monitor the progress of data through a pipe](http://manpages.ubuntu.com/manpages/bionic/man1/pv.1.html)

## BSD 系における `Ctrl-T` の動作

予めコマンドの進捗状況を見ながらコマンドを実行したいと考える場合は `pv` コマンドは便利なのですが、 **処理に時間がかかることが想定しづらい場合や `pv` コマンドを実行し忘れた場合にコマンドがハングしてないかが確認できなくなってしまう** ところが難点です。

一方、 FreeBSD や macOS などのBSD 系の OS では、 **`Ctrl-T`** を押下すると現在実行されているコマンドの情報が出力されます。以下の例では FreeBSD で Raspberry Pi のバックアップを `dd` を用いて作成している途中で `Ctrl-T` を押下してコマンドの情報を取得しています。

```bash
$ dd if=/dev/da0 of=raspbian-backup.img 
# 実行途中に Ctrl-T を押下
load: 0.49  cmd: dd 2687 [physrd] 19.84r 0.06u 0.21s 0% 2368k
26034+0 records in
26034+0 records out
13329408 bytes transferred in 19.838753 secs (671887 bytes/sec)
```

BSD 系の OS では、 `Ctrl-T` を押下すると **`SIGINFO`** という **シグナル** が送信され、その応答としてフォアグラウンドで動作中のコマンドの情報が返ってきてターミナル上に表示されます。残念ながら Linux には `SIGINFO` シグナルは用意されていないようです。[^1]

`SIGINFO` で実行中のコマンドの情報を取得する場合、その実行時の状態を知ることはできるのですが、 `pv` のようにどの程度進んだかの把握は困難です。適当なタイミングで `Ctrl-T` を何度か押下して表示内容を比較し、コマンドがハングしていないか知るには便利ですが、残りどの程度で終わりそうかの把握には `pv` を使った方が良いでしょう。

## シグナル

UNIX/Linux でコマンドの実行中に特定のキーを押下すると、 **シグナル** が送られます。例えば、コマンドを中断する場合、 `Ctrl-C` を押下すると、 `SIGINT` が送られます。

`Ctrl-C` や `Ctrl-D` などの特定のキーを押下すると、 **特殊文字** が入力されます。 **`Ctrl-C`** を押下すると **`INTR`** (interrupt), **`Ctrl-D`** の場合は **`EOF`** (end of file) のように、入力されるキーに対して入力される特殊文字がデフォルトで設定されています。 BSD 系の OS では、 **`Ctrl-T`** は **`STATUS`** が割り当てられています。

入力キーと特殊文字との対応の確認や変更をするためには、 **`stty`** コマンドを利用します。 OS によって多少異なる箇所はありますが、 **基本的に特殊文字と入力キーの対応は共通している** ので、滅多に `stty` で対応を確認することはないかもしれませんね。

筆者の macOS と Ubuntu でそれぞれデフォルトの入力キーと特殊文字の対応を `stty` で確認した結果は以下の通りです。

- macOS の場合
```bash
$ stty -a
speed 9600 baud; 24 rows; 80 columns;
lflags: icanon isig iexten echo echoe -echok echoke -echonl echoctl
	-echoprt -altwerase -noflsh -tostop -flusho pendin -nokerninfo
	-extproc
iflags: -istrip icrnl -inlcr -igncr ixon -ixoff ixany imaxbel iutf8
	-ignbrk brkint -inpck -ignpar -parmrk
oflags: opost onlcr -oxtabs -onocr -onlret
cflags: cread cs8 -parenb -parodd hupcl -clocal -cstopb -crtscts -dsrflow
	-dtrflow -mdmbuf
cchars: discard = ^O; dsusp = ^Y; eof = ^D; eol = <undef>;
	eol2 = <undef>; erase = ^?; intr = ^C; kill = ^U; lnext = ^V;
	min = 1; quit = ^\; reprint = ^R; start = ^Q; status = ^T;
	stop = ^S; susp = ^Z; time = 0; werase = ^W;
```

- Ubuntu の場合
```bash
$ stty -a 
speed 38400 baud; rows 24; columns 80; line = 0;
intr = ^C; quit = ^\; erase = ^?; kill = ^U; eof = ^D; eol = <undef>;
eol2 = <undef>; swtch = <undef>; start = ^Q; stop = ^S; susp = ^Z; rprnt = ^R;
werase = ^W; lnext = ^V; discard = ^O; min = 1; time = 0;
-parenb -parodd -cmspar cs8 -hupcl -cstopb cread -clocal -crtscts
-ignbrk -brkint -ignpar -parmrk -inpck -istrip -inlcr -igncr icrnl ixon -ixoff
-iuclc -ixany -imaxbel iutf8
opost -olcuc -ocrnl onlcr -onocr -onlret -ofill -ofdel nl0 cr0 tab0 bs0 vt0 ff0
isig icanon iexten echo echoe echok -echonl -noflsh -xcase -tostop -echoprt
echoctl echoke -flusho -extproc
```

それぞれ共通して `intr = ^C`, `eof = ^D`, `susp = ^Z` などが定義されています。なお、 `^C` は `Ctrl-C` のように `^` は Ctrl キーを意味しています。

`Ctrl-C` すなわち `INTR` が入力されると `SIGINT` が送られるように、特殊文字の中にはシグナルを送るものがあります。 BSD で `STATUS` が入力されると `SIGINFO` が送られます。この機能によって、 BSD で `Ctrl-T` を押下することで実行中のコマンドの情報が確認できます。

シグナルについては、以下の記事を参考にしました。

> - [Ctrl+Cとkill -SIGINTの違いからLinuxプロセスグループを理解する | ギークを目指して](http://equj65.net/tech/linuxprocessgroup/)
> - [termios(4)](https://www.freebsd.org/cgi/man.cgi?query=termios&sektion=4&manpath=freebsd-release-ports)
> - [GNU Coreutils: 19.2.6 特殊文字](https://linuxjm.osdn.jp/info/GNU_coreutils/coreutils-ja_139.html)

## まとめ

本記事のまとめは以下の通りです。

- Linux でコマンドの進捗状況を表示するコマンド `pv` を紹介
    - パイプに流れるデータ量を監視して進捗状況を求めて表示
- BSD でコマンドの進捗状況を表示できるシグナル `SIGINFO` を紹介
- シグナルについて紹介

以上、 k-so16 でした。いずれ Linux でも `pv` も `Ctrl-T` も使えるようになったらいいなと思います。

[^1]: Linux のコマンドによっては `SIGUSR1` のシグナルが送られた際に実行中の情報を出力するものもあるが、 `USR1` 自体はコマンドの情報を取得するためのシグナルではない。
