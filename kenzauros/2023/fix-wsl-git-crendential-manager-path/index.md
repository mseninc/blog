---
title: "[WSL2] git-credential-manager のパスを修正する"
date: 
author: kenzauros
tags: [Git,WSL,git-credential-manager]
description: 
---

こんにちは、 kenzauros です。

とある Windows 環境で Git を更新したところ、 **WSL で `git-credential-manager-core` が見つからない**というエラーが出るようになりました。

Git for Windows のバージョンは 2.39.1 です。

```bash:title=bash&nbsp;on&nbsp;WSL2
$ git --version
git version 2.39.1
```

## エラー

下記のように `git-credential-manager-core.exe: not found` というエラーに見舞われます。

```bash:title=bash&nbsp;on&nbsp;WSL2
$ git pull
/mnt/c/Program\ Files/Git/mingw64/libexec/git-core/git-credential-manager-core.exe get: 1: /mnt/c/Program Files/Git/mingw64/libexec/git-core/git-credential-manager-core.exe: not found
```

原因は Git for Windows 2.36.1 から **`git-credential-manager` のパスが変更された**ことのようです。

```:title=git-credential-managerのパス
旧: C:\Program Files\Git\mingw64\libexec\git-core\git-credential-manager-core.exe
新: C:\Program Files\Git\mingw64\bin\git-credential-manager-core.exe
```

## 設定確認

念のため現在の設定を確認しておきます。

```bash:title=bash&nbsp;on&nbsp;WSL2
$ git config --global credential.helper
/mnt/c/Program\ Files/Git/mingw64/libexec/git-core/git-credential-manager-core.exe
```

たしかに古いパスになっています。同じく `git config --global credential.helper` で新しいパスに更新します。

```bash:title=bash&nbsp;on&nbsp;WSL2
$ git config --global credential.helper "/mnt/c/Program\\ Files/Git/mingw64/bin/git-credential-manager.exe"
```

これで無事に動作しました。

```bash:title=bash&nbsp;on&nbsp;WSL2
$ git pull
Already up to date.
```

なお、ファイル名は `git-credential-manager-core` でも動作しますが、下記のように「`git-credential-manager` に変更された」旨の警告が表示されます。 `git-credential-manager.exe` を指定しておくのがいいでしょう。

```bash:title=bash&nbsp;on&nbsp;WSL2
$ git pull
warning: git-credential-manager-core was renamed to git-credential-manager
warning: see https://aka.ms/gcm/rename for more information
```

## 参考

- [git-credential-manager-coreのインストール場所が Git for Windows 2.36.1で変更されていた - Shohei Yoshida's Diary](https://syohex.hatenablog.com/entry/2022/05/27/013017)
- [Move Git Credential Manager out of Git's exec path by dscho · Pull Request #406 · git-for-windows/build-extra](https://github.com/git-for-windows/build-extra/pull/406)
