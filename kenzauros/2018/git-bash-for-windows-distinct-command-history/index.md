---
title: Git Bash for Windows で重複したコマンド履歴 (history) を残さないようにする
date: 2018-05-04
author: kenzauros
tags: [Git, bash, Windows]
---

こんにちは、kenzauros です。

Windows のコマンドプロンプトは正直いって使いにくいので、ある程度コマンドに慣れた人なら、なんらかの**ターミナルエミューレーター**をインストールされていることでしょう。

**Git for Windows** をインストールするとおまけのようにインストールされる **Git Bash** は Linux に近くて意外と使いやすいですし、当然ながら Git との親和性も高い (特に `git rebase -i` とか) ので、私はけっこう利用しています。

## Git Bash の憂鬱

ところでこの Git Bash 、標準では使い勝手がイマイチなところもいくつかあります。その一つが、**コマンド履歴 (history)** です。

スクリプトなどを作っていると、同じコマンドを繰り返し叩きながら、修正していくことがよくあります。

Git bash のデフォルト設定ではコマンド履歴がすべて残るため、たとえば `touch a.txt` というコマンドを叩いたあと `ls -l` というコマンドを 10 回叩くと、その前に叩いた `touch a.txt` を再び呼び出すには上カーソルキー[↑] を 11 回も押さなければなりません。

## HISTCONTROL を設定

ということで**同じコマンドは最新のもののみ残すように設定**します。 Git Bash 上で下記を実行した後、 Git Bash を再起動して設定を反映させてください。

```bash
echo "export HISTCONTROL=erasedups" > ~/.bash_profile
```

**環境変数 `HISTCONTROL` に `erasedups` を指定**しておくことで、過去の同一コマンドは削除されるようになります。この設定は Linux の bash でも同じです。

`HISTCONTROL` の詳細は下記のページを参照してください。

>ignoredups : 同じコマンドが連続した場合、historyに記録しません
>ignorespace : 空白で始まるコマンドはhistoryに記録しません
>erasedups : 全履歴に渡り重複コマンドを削除します
>
>[「HISTCONTROL=erasedups」でbashのhistoryで重複コマンド削除 - end0tknrのkipple - web写経開発](http://d.hatena.ne.jp/end0tknr/20110507/1304778190)

ちなみに Windows ではホームディレクトリ (`~`) は `C:\Users\ユーザー名` になりますので、上記コマンドを叩くと `C:\Users\ユーザー名\.bash_profile` ができていると思います。

## .bash_profile と .bashrc

なお、 `~/.bash_profile` は `~/.bashrc` としても問題ないですが、コマンド実行後、 Git Bash の起動時に下記の Warning が表示されます。

```bash
WARNING: Found ~/.bashrc but no ~/.bash_profile, ~/.bash_login or ~/.profile.

This looks like an incorrect setup.
A ~/.bash_profile that loads ~/.bashrc will be created for you.
```

この警告は「`~/.bashrc` を読み込むための `~/.bash_profile` を生成したよ～」というレベルですので、特段無視しても問題はありません。

.bash_profile と .bashrc の使い分けは下記のページを参照ください。

>- [本当に正しい .bashrc と .bash_profile の使ひ分け - Qiita](https://qiita.com/magicant/items/d3bb7ea1192e63fba850)
>- [.bash_profile と .bashrc は何が違うの？使い分けを覚える - Corredor](http://neos21.hatenablog.com/entry/2017/02/12/142817)
