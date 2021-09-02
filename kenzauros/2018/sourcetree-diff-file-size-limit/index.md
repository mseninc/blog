---
title: SourceTree でサイズの大きいソースコードの差分 (diff) が見えない問題
date: 2018-12-17
author: kenzauros
tags: [Git, SourceTree, その他の技術]
---

**SourceTree** を使っていて、一部のソースコードの diff が確認できなくて困ったのでメモです。

## 現象

SourceTree 画面下部の変更差分表示で、行数が多い (ファイルサイズの大きい) ファイルの場合「**このファイルは、変更されていないか、または、バイナリファイルです。**」と表示されます。

<a href="images/sourcetree-diff-file-size-limit-1.png"><img src="images/sourcetree-diff-file-size-limit-1.png" alt="SourceTreeでサイズの大きいファイルの差分が表示されない" width="1116" height="392" class="aligncenter size-full wp-image-8459" /></a>

ファイルの拡張子的にも中身もソースファイルには間違いありませんし、変更されたことは検出されているので、設定の問題のようです。

## 解決策

この部分の表示には **SourceTree 内蔵の Diff** が使われています。高速化のためか、**標準設定では 1 MB 以上のファイルの差分は表示しない**ようになっています。

**[ツール]→[オプション]→[Diff]タブ→[内部 Diff 表示]→[サイズ制限 (テキスト)]** で任意のサイズに変更します。あまり大きくしすぎると巨大なログファイル等を開いたときに死にそうですので、とりあえず標準の倍の **2048 KB (2 MB)** にしておきました。

<a href="images/sourcetree-diff-file-size-limit-2.png"><img src="images/sourcetree-diff-file-size-limit-2.png" alt="SourceTreeでサイズの大きいファイルの差分が表示されない場合の解決法" width="681" height="600" class="aligncenter size-full wp-image-8460" /></a>

これで設定したサイズ未満のファイルは差分が表示されるようになります。

正直 1 ファイルで数 MB のソースコードとかやめてほしいですが。。。