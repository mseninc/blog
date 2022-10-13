---
title: Git LFS でうまく clone や pull ができないときにバイナリファイルのダウンロードをスキップする
date: 2017-01-17
author: kenzauros
tags: [Git, GitLab, Git LFS, SourceTree]
---

こんにちは、kenzauros です。

**Git LFS** は Git で大容量ファイルを扱えるようにするものですが、不具合というか結構クセが強くて、正常に pull できなかったり、 push できなかったりすることがあります。

今回は 1GB 超の大容量ファイルがうまく pull できないリポジトリがあったので、その回避方法をご紹介します。

## 概要

発生したのは下記の環境です。ほぼすべて最新バージョンですので、ツールバージョンによる不具合ではないと考えられます。

* GitLab 8.15.2
* SourceTree 1.9.10.0
* Git 2.11.0
* Git LFS 1.5.2

いくつかの種類のエラーが発生するのですが、基本的に大容量のファイルがリモートにアップされたあと、`git pull` するときに起こります。下記は一例です。

```bash
$ git lfs pull
Git LFS: (27 of 28 files, 1 skipped) 2.18 GB / 1.31 GB, 2.67 GB skipped
[48ba399c685ccfe63481784aabf91cedbde0d984e9563c810878c56c8cb4cd54] Object does no t exist on the server or you don't have permissions to access it: [404] Object do es not exist on the server or you don't have permissions to access it
cannot write data to tempfile "path\\to\\repository\\.git\\lfs\\objects\\incomplete\\ff868eed5c51aaa1ccf5ab618d9544cbf9d6 27e44c5fa7abff1ddf2eaa0ed6df.tmp": LFS: unexpected EOF
```

バイナリファイルにもかかわらず、 `LFS: unexpected EOF` などと言われたりします。

理由はいまいちよくわかりません。

## 回避策

Git のリポジトリ同期と Git LFS が管理するファイルダウンロードを同時にやると不具合が多い（ように感じる）ので、これを分離して行います。

さまざまなところで議論されていますが、下記の issue comment がもっとも端的でした。

* [Smudge filter failed with a fresh new clone · Issue #911 · git-lfs/git-lfs](https://github.com/git-lfs/git-lfs/issues/911#issuecomment-169998792)

流れとしては下記の通りです。

1. Git LFS のファイルダウンロードを pull で一括して行わないように設定する
2. Git で clone もしくは pull する
3. Git LFS で管理されているファイルをダウンロードする
4. 1. の設定を元に戻す

```bash
// 1. Git LFS のファイルダウンロードを pull で一括して行わないように設定する
git lfs install --skip-smudge

// 2. Git で clone もしくは pull する
git clone <URL>
git pull

// 3. Git LFS で管理されているファイルをダウンロードする
git lfs pull

// 4. 1. の設定を元に戻す
git lfs install --force
```

`git lfs install --skip-smudge` (`init` から `install` に変更になっています) を実行します。 **`smudge` は Git LFS 管理のバイナリファイルのダウンロード**のことだと思えばよいです。ちなみに `git lfs install` は何度実行しても支障ないようです。

この状態で pull すると Git LFS 管理のファイルに関してはハッシュの書かれた **ポインタファイル** だけがダウンロードされますので、非常に高速にリポジトリが同期されます。

その後 `git lfs pull` を叩くと実ファイルがダウンロードされます。これは当たり前ですが、ファイルの容量に応じてけっこう時間がかかります。

その後、 `git lfs install --force` で設定を戻しておきます。また大きなファイルの同期が必要な場合は `git lfs install --skip-smudge` を実行して上記の手順に従えば失敗の可能性は低くなると思います。

## Git LFS の憂鬱

この記事を読んでらっしゃるみなさまは多少なりとも Git LFS に不満を感じていらっしゃることでしょう(笑)

まだ発展途上な部分も多いと思うので、これから改善されていくといいのですが...。期待しています。
