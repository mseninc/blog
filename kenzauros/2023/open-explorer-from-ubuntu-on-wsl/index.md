---
title: "[WSL] Ubuntu から Windows エクスプローラーを一発で開く"
date: 
author: kenzauros
tags: ["WSL","Ubuntu","Windows"]
description: "WSL 上の Ubuntu からカレントディレクトリーを Windows エクスプローラーで開く方法を紹介します📂"
---

WSL 上の **Ubuntu からカレントディレクトリーを Windows エクスプローラーで開く**方法を紹介します📂

## 環境

- Windows 11 Pro
- WSL 2
- Ubuntu 20.04

## 結論

`~/.bashrc` を開き、最後に下記を追記して保存します。

```sh:title=~/.bashrc
alias open='/mnt/c/windows/explorer.exe .'
```

あとは `open` を実行するだけです。

## 説明

### explorer.exe は WSL からも実行できる

WSL は Windows とうまく統合されています。エクスプローラーから `\\wsl.localhost\Ubuntu-20.04` のようにして WSL でホストしている OS 内のディレクトリを参照できます。

ただ、毎回そんなことをするのは面倒ですし、だいたいエクスプローラーを開きたいときは bash 上で作業しているカレントディレクトリーであることも多いです。そんなときは `explorer.exe .` としてやることで、現在のディレクトリーをエクスプローラーで開けます📂

```sh:title=bash
explorer.exe .
```

これは `env | grep -i /mnt/c/windows` としてみればわかる通り、 `PATH` に `C:\Windows` (= `/mnt/c/windows`) が設定されているためです。それにしても Windows の exe を bash から実行すると Windows 側で起動するとはこれもうまく統合されていますね。

というわけで `explorer.exe .` を実行すればいいだけですが、毎回こんなタイポしがちなコマンドをタイプするのも面倒ですので、エイリアスに登録しましょう。

### エイリアスの登録

シェルが bash の場合で説明します。 bash ログイン時に **`~/.bashrc`** (`~` はユーザーのホームディレクトリ) が読み込まれますので、ここでコマンドのエイリアスを登録します。

まず `~/.bashrc` が存在しなければ作成します。おそらく最初から存在していて、すでにいろいろ記載されていると思います。 VS Code で開く場合は bash 上で下記のように入力します。

```sh:title=bash
code ~/.bashrc
```

ファイルの最後尾に下記を追記します。私は `open` としていますが、任意の名前でかまいません。

```sh:title=~/.bashrc
alias open='/mnt/c/windows/explorer.exe .'
```

編集が終わったら保存して、 `source` で読み込み直します。

```sh:title=bash
source ~/.bashrc
```

これでエイリアスが利用可能になったと思います。

では、よい WSL ライフをお楽しみください🎉
