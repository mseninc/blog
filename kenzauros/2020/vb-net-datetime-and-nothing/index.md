---
title: VB.NET における DateTime と Nothing の問題
date: 2020-10-12
author: kenzauros
tags: [VB.NET, .NET]
---

**Visual Basic .NET** に慣れていればいいのですが、 C# に慣れていると同じ .NET でも仕様の異なる部分で戸惑うことがあります。

**DateTime (= Date) の既定値**もその一つです。

さて、ここでクイズです。下記のプロパティを実装したとして、 `HogeDate` は何を返すでしょうか。

```vb
Private ReadOnly Property HogeDate As DateTime?
    Get
        Dim condition = False
        Return If(condition, DateTime.Now, Nothing)
    End Get
End Property
```

1. 現在日時
2. `Nothing` (= `null`)
3. `0001/01/01 0:00:00`

## クイズの答え

正解は 3 です。

おそらくソースを書いた人の意図としては、 2 であってほしいはずですが、 VB.NET の仕様の都合上 `0001/01/01 0:00:00` になります。意味不明ですね。

## VB.NET の DateTime の仕様

**.NET の DateTime は構造体なので、 `null` (= `Nothing`) にすることはできません。**

ただ、 **VB.NET の場合、 DateTime に `Nothing` が代入できてしまいます**。つまり下記のコードは問題なく実行可能です。

```vb
Dim myDate As DateTime = Nothing
Console.WriteLine(myDate) // 0001/01/01 0:00:00
```

ただし、この結果は `Nothing` になるのでなく、初期化されていない DateTime の構造体がセットされて `myDate` が `0001/01/01 0:00:00` になります。

下記のように `Nothing` をキャストしてもまた同様です。

```vb
Dim myDate As DateTime = CType(Nothing, DateTime)
Console.WriteLine(myDate) // 0001/01/01 0:00:00
```

ちなみに当然ながら C# ならコンパイルすら通りません。

```cs
DateTime myDate = null;
```

## If 演算子で扱う場合の注意

上記の困った仕様はあるものの、通常 DateTime として扱っている場合は、特に問題ありません。ただ、冒頭の例のように Null 許容 (以下 Nullable) で、しかも If 演算子を併用する場合、少しややこしくなります。

DateTime が `null` をとれないため、たとえば無効な日付の場合や入力されていない場合などを表す場合に Nullable にすることが考えられます。つまり**型としては `Nullable(Of DateTime)` (= `DateTime?`)** になります。

`DateTime?` にすれば、先ほどのように Nothing を代入しても、そのまま Nothing として扱えるようになりますので、少しは直感的になります。

```vb
Dim myDate As DateTime? = Nothing
Console.WriteLine(myDate Is Nothing) // True
```

さて、ここで問題は **If 演算子で条件を満たすときは `DateTime` の値、満たさないときは Nothing にしたいような場合**です。冒頭のクイズの `If(condition, DateTime.Now, Nothing)` のような場合ですね。

ここで False 部分に `Nothing` を記述しているので、この式は `DateTime?` として評価されてほしいのですが、**もともと `Nothing` が `DateTime` として扱えてしまうので、この式は残念ながら `DateTime` として評価**されてしまいます。

というわけで、この式は Nothing になることは絶対になく、必ず `DateTime.Now` か `0001/01/01 0:00:00` のどちらかになります。

冒頭のクイズに戻りますが、下記のプロパティがいかに `DateTime?` 型で宣言されていたとしても、結果が `0001/01/01 0:00:00` になる理由がわかると思います。

```vb
Private ReadOnly Property HogeDate As DateTime?
    Get
        Dim condition = False
        Return If(condition, DateTime.Now, Nothing)
    End Get
End Property
```

ではどう書けばいいのかといえば、 If 演算子で `Nothing` が `0001/01/01 0:00:00` に変換されてしまうことが問題なのですから、下記のように **If 演算子を介さない形に書き換える**のがもっとも簡単です。

```vb
Private ReadOnly Property HogeDate As DateTime?
    Get
        Dim condition = False
        If condition Then
            Return Nothing
        Else
            Return DateTime.Now
        End If
    End Get
End Property
```
