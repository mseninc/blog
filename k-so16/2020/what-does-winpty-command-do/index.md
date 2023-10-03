---
title: "[Git Bash] winpty コマンドについて調べてみた"
date: 2020-07-15
author: k-so16
tags: [Windows, bash]
---

こんにちは。最近、メガネを買い替えた k-so16 です。フレームが軽くなって掛け心地も改善されました(笑)

**[Git for Windows](https://gitforwindows.org/) の Git BASH** (以降 Git Bash と表記) で Docker のコンテナに入るために `docker exec` などのコマンドを実行すると、以下のようなメッセージが表示されます。

> the input device is not a TTY.  If you are using mintty, try prefixing the command with 'winpty'

メッセージに従って **実行するコマンドの前に `winpty` をつける** と Docker のコンテナに入ることができるようになります。

Git Bash を触っていくうちに、 `docker exec` でコンテナの `bash` に入るように  **Git Bash のデフォルトでないコマンドでインタラクティブなプログラムを動かすには `winpty` を頭につければ良い** ことに気づきました。しかし、よく分からないまま使うのもスッキリしないので、 `winpty` の正体は何なのかを調べてみることにしました。

本記事では前提知識として **TTY** について説明し、 **`winpty`** コマンドについて紹介します。

本記事で想定する読者層は以下の通りです。

- Git Bash を用いて Windows で bash を利用している

## TTY とは
冒頭のメッセージに "the input device is not a **TTY**." と表示されていましたが、そもそも **TTY** とは何でしょうか。 

TTY は **teletypewriter** の略で、キーボードでタイプしたアルファベットや数字文字を PC の画面やプリンタなどに入力するためのインタフェースです。

UNIX/Linux における `tty` コマンドは、標準入力に接続された端末のファイル名を表示します。Git Bash で `tty` を実行すると、以下のように表示されます。

```bash:title=tty&nbsp;コマンドの実行例
$ tty
/dev/pty0
```

さらに Git Bash の端末を新たに開いて `tty` を実行すると、以下のように別のファイル名が表示されます。

```bash
$ tty
/dev/pty1
```

このことから、 **端末ごとに TTY が割り当てられている** ことが分かります。

ところで、 TTY は **標準入力を受け取った内容を標準出力へ出力** します。上記の `pty0` の標準出力を `pty1` の標準入力へリダイレクトすると、 `pty1` の画面に `pty0` の出力内容を表示出来ます。

以下は実行例です。 なお、行頭の `$` はプロンプトです。

- `pty0` の端末
```bash
$ echo Hello, world > /dev/pty1
$
```
- `pty1` の端末
    - `pty0` の出力内容が表示される
```
$ Hello, world

```

UNIX/Linux はマルチユーザーでの使用が可能で、現在ログイン中のユーザーや TTY を `w` コマンドによって確認できます。ログイン中のユーザーに対して上記の例のように TTY を指定してメッセージを送ることができます。 `wall` コマンドを用いれば、ログイン中のユーザー全員の端末の TTY にメッセージを送信できます。また、 `shutdown` コマンドを実行した時に表示されるメッセージはログイン中のユーザーすべての TTY に対して送られます。

TTY については、以下の記事を参考にしました。

> - [What is teletypewriter (TTY)? - Definition from WhatIs.com](https://whatis.techtarget.com/definition/teletypewriter-TTY)
> - [What is a TTY on Linux? (and How to Use the tty Command)](https://www.howtogeek.com/428174/what-is-a-tty-on-linux-and-how-to-use-the-tty-command/)
> - [ttyとかptsとかについて確認してみる - Qiita](https://qiita.com/toshihirock/items/22de12f99b5c40365369)
> - [tty(1) - Linux manual page](https://man7.org/linux/man-pages/man1/tty.1.html)

## `winpty` コマンドの役割

Git Bash の `tty` コマンドで TTY が割り当てられていることを確認したはずにも関わらず "the input device is not a TTY." と言われています。メッセージの後半を読んでみると、 "If you are using **mintty**, try prefixing the command with '**winpty**' " と表示されていました。筆者の Git Bash の Options を確認したところ、ターミナルエミュレーターとして **[mintty](https://mintty.github.io/)** が利用されていることが分かりました。

`winpty` コマンドは、 **Windows のコンソールプログラムと UNIX の仮想端末を通信させるためのインタフェース** です。 Windows のネイティブなコマンドラインプログラムを mintty などのエミュレーターで実行すると、 **仮想端末との非互換性** や **文字エンコーディングの非互換性** の問題が影響することがあるようです。例えば、 Git Bash で Windows のネイティブのコマンドの `ipconfig` を `winpty` をつけずに実行すると、日本語が文字化けして出力されます。これは **Git Bash が UTF-8 で出力する** のに対し、 **Windows のネイティブのコマンドは Shift_JIS で出力する** ので文字コードが一致せず、実行結果が文字化けして出力されます。

`winpty` は mintty などのエミュレーターと Windows のコンソールプログラムとの非互換性を解決する橋渡しの役割を担っています。 `winpty` コマンドを使うことで、 **`winpty-agent.exe`** のプロセスが **隠されたコンソールウィンドウを生成** し、そのコンソールの **バッファの変更を調査して対応する出力を生成** します。それによって、 Windows のネイティブなコマンドラインプログラムの入出力を mintty で扱えるようになります。先ほどの `ipconfig` の例の場合、 `winpty ipconfig` と実行することで `winpty` が文字コードの差異を吸収してくれるので、実行結果が文字化けすることなく出力されます。

mintty などの端末エミュレーターでコマンドを実行する際に `winpty` が必要となるのは、 mintty の環境下でコンパイルされていない、 **Windows のネイティブ環境下でコンパイルされたプログラムを実行する場合** です。例えば Windows 用の Python の実行系をインストールして Git Bash 上で実行する場合、 `winpty` を利用しないと出力内容が表示されません。 

- `winpty` をつけずに Git Bash で `python` を実行した場合
```bash
$ python

```

- `winpty` をつけて Git Bash で `python` を実行した場合
```bash
$ winpty python
Python 3.6.4 (v3.6.4:d48eceb, Dec 19 2017, 06:54:40) [MSC v.1900 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Python を Git Bash で実行した際に困ることは、強制終了させることが難しいことです。端末上に何も表示されない上、 `Ctrl-C` で強制終了しようにも、 Python のインタプリタで `Ctrl-C` を押下した際には `KeyboardInterrupt` 例外を発生させる役割が振られているので、インタプリタを抜けられません。

本来、 `Ctrl-C` を押下すると `KeyboardInterrupt` 例外が発生したというメッセージが表示されるのですが、当然そのメッセージも Git Bash 上に表示されません。しばらくの間、筆者の環境では Python のインタプリタを Git Bash 上で実行するとハングすると思い込んでいました (^^;)

`winpty` については、以下の Stack Overflow の回答を参考にしました。

> - [python - Winpty and Git Bash - Stack Overflow](https://stackoverflow.com/questions/48199794/winpty-and-git-bash)

## まとめ

本記事のまとめは以下の通りです。

- TTY は標準入出力を扱うためのインタフェース
- `winpty` は端末エミュレーターとネイティブの Windows プログラムとの入出力の橋渡し役
    - 端末エミュレーターとネイティブプログラムの文字コードの差異を吸収

以上、 k-so16 でした。普段当たり前のよう使っている端末の標準入出力も、実は奥が深いことを実感しました。