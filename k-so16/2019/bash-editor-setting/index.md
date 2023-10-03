---
title: "[bash] Linuxで lessやcrontabから呼び出されるエディタを変更する方法"
date: 2019-04-12
author: k-so16
tags: [Linux, bash]
---

こんにちは。最近、[Go Pro HERO7 Black](https://jp.shop.gopro.com/APAC/cameras/hero7-black/CHDHX-701-master.html)を我慢できずに購入してしまった k-so16 です。

UNIX/LinuxのOSで `less` コマンドを実行して **v** キー押下すると、環境によって **`vim`** ではなく `nano` が起動してしまうことがあります。エディターが **`vim`** ではなく `nano` が起動するのはプログラマーに優しくないですし、イケてないですよね。

本記事では、シェル[^1]のコマンド経由で起動するエディターを **`vim`** に変更する方法を紹介します。なお、本記事で紹介する方法はLinux以外に、FreeBSDなどのUNIX OSでも有効です。

本記事で想定する読者層は以下の通りです。

- 基本的なUNIX/Linuxコマンドを使える
- シェルの変数について知っている
- シェルの設定ファイルと使い方について知っている

## エディターの変更方法
しくみは非常に単純です。環境変数 `EDITOR` を設定するだけです。

好みのエディターは人それぞれだと思いますが、プログラマーの大半が **`vim`** を好んで利用されていると私が勝手に思い込んでいるので、本記事では設定するエディターを **`vim`** としました。 **`vim`** 以外(`emacs`など)を好んで利用されている方々は、**`vim`** をお好みのエディター名に置き換えてください。

### 現在のシェル端末でのみエディターを手動で変更する方法
他人のマシンを借りて作業するなどで、現在のシェル端末のみでエディターを変更したい場合の方法を以下に示します。

1. `export EDITOR=vim` を実行

たったこれだけです。上記のコマンドを実行後、`less` コマンドでファイルを表示し、**v**キーを押下すると、 **`vim`** が起動されるはずです。おめでとうございます。

### シェル起動時にエディターを自動設定する方法
自分のマシン上で、1.1節の方法を毎回実行するのは面倒です。やりたくありません。ですので、シェル起動時に環境変数 `EDITOR` が自動でセットされるように、設定ファイルに付け加えます。手順は以下の通りです。

1. `echo export EDITOR=vim >> ~/.bashrc` を実行して設定ファイルに環境変数 `EDITOR` の設定を追加
1. `. ~/.bashrc` を実行して現在のシェルにも環境変数 `EDITOR` の変更を反映

## 変更する上での留意点
### `export` コマンドの実行
シェルで環境変数を設定する際に、 `export` コマンドによってシェル変数を変更することを忘れないようにしましょう。 `export` コマンドを用いないと変数の変更が別のプロセスに反映されないので、エディターが変更されません。

### 環境変数 `VISUAL` と `EDITOR`
`less` や `crontab` のmanページを確認すると、エディターを変更する環境変数として、 `VISUAL` と `EDITOR` が挙げられています。
それぞれのmanページを確認すると、 `less` は `VISUAL` に設定があれば、 `EDITOR` より優先して使い、 `crontab` は `VISUAL` か `EDITOR` が設定されていれば、そのエディターを使用するようです。

以下は `less(1)` のmanページの引用です。
>  v      Invokes  an  editor to edit the current file being viewed.  The editor is taken from the environment variable VISUAL if defined, or EDITOR if VISUAL is not defined, or defaults to "vi" if neither VISUAL nor EDITOR is defined.


以下は `crontab(1)` のmanページの引用です。
>  The  -e  option  is  used to edit the current crontab using the editor specified by the VISUAL or EDITOR environment variables.  After you exit from the editor, the modified crontab will be installed automatically. If neither of the environment variables is defined, then the default editor /usr/bin/editor is used.

特別な事情でもない限り、環境変数 `EDITOR` に使いたいエディターを設定すれば良いと思います。

## 総括
本記事のまとめです。

- 環境変数 `EDITOR` に使いたいエディター名を設定する
- 呼び出すエディターを常に固定する場合はシェルの設定ファイルに記述する
- `export` コマンドのつけ忘れに注意する

以上、k-so16でした。 **`vim`** 最高だよね!!(笑)

[^1]: 本記事で想定するシェルは `bash` とする。他のBourne Shell系(`sh`, `ksh` など)で本記事の方法を適用した場合の挙動は未確認である。