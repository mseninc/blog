---
title: PowerShell で Git の最新タグを取得して変数に格納する
date: 2019-01-11
author: kenzauros
tags: [PowerShell, Git, Windows]
---

こんにちは、kenzauros です。

Git で対象のブランチの最新のタグ名を取得するには **`git describe` コマンド**を使います。

今回はタグ名を PowerShell のスクリプト内で利用する必要があったので、変数に格納してみました。

## Git のタグ名を変数に格納

**PowerShell で外部コマンドを実行して結果を変数に格納するには `&` (アンパサンド)** を使います。

直近の軽量タグは `git describe --abbrev=0 --tags` で取得できるので、 `&` に続けます。

```
PS C:> $version = &git describe --abbrev=0 --tags
PS C:> echo $version
v1.0.6
```

また、引数をダブルクオーテーションで括る場合は `"--abbrev=0"` のように引数ごとにダブルクオーテーションで括って記述します。

## 参考

- [gitで最後に付けられたタグを確認する - 作業ノート](http://te2u.hatenablog.jp/entry/2014/11/26/003112)
