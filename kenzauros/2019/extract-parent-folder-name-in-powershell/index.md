---
title: PowerShell で親フォルダーの「フォルダー名」を取得する
date: 2019-12-09
author: kenzauros
tags: [PowerShell, Windows]
---

ちょっとした **PowerShell** のスクリプトを書いていて、実行中のスクリプトの **「フォルダー名」** が取得したくなりました。

ちなみに親フォルダーの「フォルダー名」とは `C:\Users\Hoge\Desktop\hogehoge.ps1` の `Desktop` の部分だけを指します。

簡単な話ですが、もっとイイ感じのやり方があると思ったら、実はなかったので、同じように疑心暗鬼になった人のためにメモしておきます。

## 順番に考える

実行するスクリプトは `C:\Users\Hoge\Desktop\hogehoge.ps1` に配置してあるものとします。

順番にやっていきます。

### スクリプトの実行パスを取得する

```
$commandPath = $MyInvocation.MyCommand.Path
Write-Output $commandPath
```

フルパス `C:\Users\Hoge\Desktop\hogehoge.ps1` が得られます。

### 親フォルダーのパスを取得する

```
$parentDir = Split-Path $commandPath -Parent
Write-Output $parentDir
```

親フォルダーのパス `C:\Users\Hoge\Desktop` が得られます。

### ファイル名を取得する

```
$filename = Split-Path $commandPath -Leaf
Write-Output $filename
```

ここでファイルパスを `Split-Path -Leaf` すれば、ファイル名 `hogehoge.ps1` が得られます。

### 親フォルダーの「フォルダー名」を取得する

```
$parentDirName = Split-Path (Split-Path $commandPath -Parent) -Leaf
Write-Output $parentDirName
```

さらに親フォルダーのパスを `Split-Path -Leaf` すれば、親フォルダの「フォルダー名」 `Desktop` が得られます。

## まとめ

**親フォルダーの「フォルダー名」を取得するには `Split-Path (Split-Path <パス> -Parent) -Leaf`** で OK