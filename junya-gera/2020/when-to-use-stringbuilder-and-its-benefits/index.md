---
title: Visual Basic で StringBuilder を使うべき場合とその利点
date: 2020-12-16
author: junya-gera
tags: [VB.NET, .NET]
---

こんにちは、じゅんじゅんです。先日、業務の中で .NET Framework(Visual Basic) での改修を行っているとき、 SQL 文の生成を [String](https://docs.microsoft.com/ja-jp/dotnet/api/system.string?view=net-5.0) で行っている部分と [StringBuilder](https://docs.microsoft.com/ja-jp/dotnet/api/system.text.stringbuilder?view=net-5.0) で行っている部分があることが気になったので、 [kenzauros](https://mseeeen.msen.jp/category/articles-kenken-wrote/)さんに 2つの違いを教えていただきました。

ということで今回は **String と StringBuilder の違い**、**どういうときに StringBuilder を使うのか**についてお話します。

## String と StringBuilder の違い
### String の特徴
String クラスのオブジェクトは読み取り専用になっています。**作成したら変更ができません**。

以下のように元の文字列 (`myName`) に別の文字列を連結したものを代入する場合、変更を行っているように見えますが、実際には**その変更を含む新しいオブジェクトが作成され、その参照が `myName` に代入されています**。

```vb
Dim myName As String = "ねじま"
myName = myName & "はじま"

Console.WriteLine(myName) ' ねじまはじま
```

このとき、変更前の文字列のオブジェクト (ねじま) は使われないオブジェクトとして残ります。といってもシステムが自動で廃棄を行いメモリを解放するので少しなら問題ありませんが、文字列に対して何度も変更を実行する必要がある場合、パフォーマンスを低下させる恐れがあります。

### StringBuilder の特徴
一方、 StringBuilder の場合、**文字列の内容を直接変更することができます**。 StringBuilder クラスのオブジェクトは**文字列の変更に対応するためのメモリのバッファをあらかじめ用意しています**。文字列がバッファから溢れたら新しく 2 倍のバッファが割り当てられ、そこに今までのデータをコピーします。

以下のコードでは、上記の String と同様 `myName` に "ねじまはじま" という文字列が入りますが、こちらでは**直接 `myName` というオブジェクトの内容を変更しており、 String のように新しいオブジェクトが作られることはありません**。
```vb
Dim myName As New System.Text.StringBuilder("ねじま")
myName.Append("はじま")

Console.WriteLine(myName) ' ねじまはじま
```
StringBuilder は動的に文字列内の文字数を拡張できるようにするオブジェクトですが、かといって**バッファの更新が頻繁に起こってしまうとパフォーマンスが低下**してしまいます。それを防ぐため、 **[StringBuilder.Capacity](https://docs.microsoft.com/ja-jp/dotnet/api/system.text.stringbuilder.capacity?view=net-5.0) を設定しておくことで、あらかじめメモリに格納できる文字数を決めておく**ことができます。ちなみに `Capacity` の初期値は 16 文字です。

```vb
Dim myName As New System.Text.StringBuilder
myName.Capacity = 200
```

また、 `Capacity` プロパティは StringBuilder のコンストラクタの引数でも指定ができます。
```vb
Dim myName As New System.Text.StringBuilder(200)

' 文字列の初期値がある場合
Dim yourName As New System.Text.StringBuilder("ねじまはじま", 200)
```

このように先にどれぐらいの文字数になるかが予測できる場合、 `StringBuilder.Capacity` で大きめの値を設定しておけばバッファの更新の頻度を抑えることができます。

## StringBuilder はどういうときに使うのか
では具体的にどのような場合に StringBuilder を使うべきか考えたとき、**文字列の変更をたくさん行う `For` 文**で使うと恩恵が大きそうですね。実際はどうなのか、 `For` 文での文字列の連結を、 String で行った場合と StringBuilder で行った場合で実行速度の差を計って確認してみましょう。

```vb
Dim stopwatch As New Stopwatch()

' String で 100000 回文字列を連結
Dim str As String = ""
stopwatch.Start()
For i As Integer = 0 To 100000
    str = str & "a"
Next
stopwatch.Stop()
Console.WriteLine($"String:        {stopwatch.Elapsed} 秒")

stopwatch.Reset()

' StringBuilder で 100000 回文字列を連結
Dim strBd As New System.Text.StringBuilder("")
stopwatch.Start()
For i As Integer = 0 To 100000
    strBd = strBd.Append("a")
Next
stopwatch.Stop()
Console.WriteLine($"StringBuilder: {stopwatch.Elapsed} 秒")

' 結果
' String:        00:00:01.7203247 秒
' StringBuilder: 00:00:00.0015878 秒
```

結果、圧倒的に StringBuilder が速いという結果になりました。


## String を使う方がいいかもしれない場合
逆に StringBuilder よりも String を使う方がパフォーマンスが良くなる可能性がある場合も紹介しておきます。

- 文字列に対しての変更の回数が少ない場合
特にループもなく文字列の変更も少ない場合、 StringBuilder を使うことでパフォーマンスがわずかに低下する可能性があります。

- 文字列の広範な検索操作を実行する必要がある場合
StringBuilder には、 [String.Contains](https://docs.microsoft.com/ja-jp/dotnet/api/system.string.contains?view=net-5.0) 、 [String.IndexOf](https://docs.microsoft.com/ja-jp/dotnet/api/system.string.indexof?view=net-5.0) 、 [String.StartsWith](https://docs.microsoft.com/ja-jp/dotnet/api/system.string.startswith?view=net-5.0) などの文字列を検索するメソッドがありません。一度 StringBuilder を String に変換する必要があるため、結果的に StringBuilder のパフォーマンス上の利点が損なわれる可能性があります。


## 感想
.NET Framework に初めて触れて何か月か経ちますが、ずっと String と StringBuilder の違いをよく知らないまま使ってしまっていました。これは調べることが面倒だったからではなく、**これらの違いを知る必要があるという意識が薄かったから**です。別の言い方をすると**「自分が知らない」ということを知らない**状態でした。

「他の人が書いてたから」「動いてるからいいや」ではなく、細かいところにもしっかり疑問を持ち、**自分がまだ知らないことはないか**を常に意識しておこうと思います。

## 参考
> - [文字列処理を高速に行う](https://dobon.net/vb/dotnet/string/stringbuilder.html)
> - [文字列の連結をStringBuilderで高速に行う(StringBuilder)](http://vbnettips.blog.shinobi.jp/other/%E6%96%87%E5%AD%97%E5%88%97%E3%81%AE%E9%80%A3%E7%B5%90%E3%82%92stringbuilder%E3%81%A7%E9%AB%98%E9%80%9F%E3%81%AB%E8%A1%8C%E3%81%86)