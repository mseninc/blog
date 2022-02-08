---
title: C# で任意の文字種を使った適当なランダムパスワードをつくる
date: 2018-09-03
author: kenzauros
tags: [C#, .NET]
---

アカウント管理系のソフトを作っていると**パスワードの自動生成**が必要になることがあります。そんなときにあると便利なのが、パスワード生成ロジックです。

今回は**使える文字列を引数で指定できるパスワード生成メソッド**をご紹介します。

## ソースコード

なにはともあれソースコードです。

- [C# 任意の文字種を使ったランダムパスワードをつくるスタティックメソッド - gist](https://gist.github.com/kenzauros/09c6b19b56a98aad0b79c6ed84376f31)

```js
const string PWS_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
/// <summary>
/// 指定した長さの文字からなるランダムなパスワードを返します。
/// </summary>
/// <param name="length">生成するパスワードの長さ</param>
/// <param name="availableChars">使用可能な文字の一覧</param>
/// <returns>生成されたパスワード</returns>
public static string GenerateRandomPassword(int length, string availableChars = PWS_CHARS)
{
    if (string.IsNullOrEmpty(availableChars)) availableChars = PWS_CHARS;
    var r = new Random();
    return string.Join("", Enumerable.Range(0, length).Select(_ => PWS_CHARS[r.Next(availableChars.Length)]));
}
```

## インターフェース

使う文字列が既定の半角英数字でよければ、引数は**パスワードの長さを指定する `length`** だけで足ります。

```cs
var pass = GenerateRandomPassword(16);
Console.WriteLine(pass); // will show a 16-length password
```

文字種を指定したければ第2引数に渡すだけです。たとえば、見分けのつきにくい `0` と `O`, `o` や `1` と `l` などを除いた文字セットを渡すと、残された文字だけでパスワードを生成します。

```cs
const string DISTINCT_CHARS = "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var pass = GenerateRandomPassword(16, DISTINCT_CHARS);
Console.WriteLine(pass); // will show a 16-length password w/o "0", "O", "o", "1" and "l"
```

**ユーザーの設定に応じた任意文字種のパスワード生成**ができますね。

逆に任意の記号を追加すれば、記号も含まれるようになります。（ただし、「必ず」記号を含むようにしたい場合はもう少し工夫が必要です。）

## 仕組み

難しいところはありませんが、基本的には `Random` クラスの `Next` メソッドで文字種配列の長さ未満の乱数を発生させ、ランダムに配列の要素を選択させているだけです。

やり方はいろいろありますが、ここでは、`Enumerable.Range` で指定長さの整数配列を生成し、その要素ごとに `Select` で文字を取得して、最後に `string.Join` で一つの文字列に結合して返しています。

コピペで使えるロジックとして参考にしていただければ幸いです。


