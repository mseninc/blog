---
title: Windows PowerShell でオブジェクトのプロパティ名を配列で取得する
date: 2017-12-26
author: kenzauros
tags: [PowerShell, Windows]
---

PowerShell で**変数に格納したオブジェクトのプロパティ名を配列で取得**する方法を紹介します。

## ソースコード

特に前提条件もないですが、調べたい対象オブジェクトが `$obj` という変数に格納されているとします。

```ps
$propNames = $obj | Get-Member -MemberType Properties | Select-Object -ExpandProperty Name
```

これだけで `$propNames` には `$obj` にはこのオブジェクトのもつプロパティの名前が列挙されているはずです。

あとは foreach で回すなり、焼くなりしていただければ OK です。

あまり必要ないと思いますが、軽く説明しておくと、 **`Get-Member -MemberType Properties` で `$obj` がもつすべてのメンバープロパティを取得し、 `Select-Object -ExpandProperty Name` で `Name` (プロパティ名) を展開**しています。

なんのことはないことですが、意外と悩むところかもしれませんので、助けになれば幸いです。