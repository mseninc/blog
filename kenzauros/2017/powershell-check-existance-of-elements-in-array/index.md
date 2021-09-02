---
title: PowerShell で配列の値が別の配列に含まれるかどうかを調べる
date: 2017-12-18
author: kenzauros
tags: [PowerShell, Windows]
---

PowerShell で、**ある配列 `$expected` の値が別の配列 `$actual` に含まれているかどうか**を調べる方法について紹介します。

たとえば、「あるオブジェクトに任意のプロパティがすべて存在するか」を調べる「存在チェック」の用途などに使えます。

## 前提

調査対象の配列 `$actual` にはいろいろな値が含まれているとします。

```
$actual = @("A", "B", "D", "E", "F", "G")
```

これに対して存在を調べる値が格納された `$expected` は下記のようになっているとします。

```
$expected = @("B", "C", "D")
```

今回は **`$expected` の値がすべて `$actual` に含まれるかどうか**を知りたいとします。

## ソースコード

これは `$expected` と `$actual` の要素の差を取ることに相当します。

いくつかやり方はありますが、今回は `Where-Object` と `-notcontains` を使用します。

```ps
$expected = @("B", "C", "D")
$actual = @("A", "B", "D", "E", "F", "G")
$missing = $expected | Where-Object { $actual -notcontains $_ }
$missing.Count -eq 0
```

`$missing` の結果は `$expected` にあって `$actual` にない要素である `"C"` となるはずです。

`$missing.Count` が `0` であれば「すべて含まれる」ことになります。



