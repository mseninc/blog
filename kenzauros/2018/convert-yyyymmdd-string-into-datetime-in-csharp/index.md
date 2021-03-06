---
title: C# で yyyymmdd 形式の日付文字列を DateTime 型に変換する拡張メソッド
date: 2018-06-15
author: kenzauros
tags: [C#, .NET Framework, .NET]
---

こんにちは、kenzauros です。

もはやタイトルにすべて書いてありますので、細かいことは省きますが、データベース等で **`20180401` のように区切り文字なしで格納されている日付文字列を `DateTime` 型に変換**します。

## 変換用の拡張メソッドを用意

この形式は `DateTime.Parse` や `DateTime.TryParse` でパースできないため、少々面倒です。

変換には**書式指定が可能な [DateTime.TryParseExact メソッド](https://msdn.microsoft.com/ja-jp/library/h9b85w22(v=vs.110).aspx)** を利用します。 (.NET 2.0 以降で利用可能)

いちいち書くと冗長なので下記のような拡張メソッドを用意します。

- [yyyymmdd 形式の文字列を DateTime 型に変換する拡張メソッド - gist](https://gist.github.com/kenzauros/e59e66fb6b3e76cddd790c4067b51917)

```cs
using System;
using System.Globalization;

namespace System
{
    public static class DateTimeExtensions
    {
        /// <summary>
        /// 指定した日付を "yyyyMMdd" 形式で返します。
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ToDbDateString(this DateTime value) => value.ToString("yyyyMMdd");

        /// <summary>
        /// データベースの "yyyyMMdd" 形式の文字列を <see cref="DateTime"/> 型に変換します。
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static DateTime? ToDateTime(this string value)
            => DateTime.TryParseExact(value, "yyyyMMdd", null, DateTimeStyles.None, out var result)
            ? (DateTime?)result : null;
    }
}
```


※ラムダ式でメソッドを記述しているため、 C# 6 未満をお使いの場合は、メソッド記法に修正してください。

文字列 → DateTime だけなら、下側の `ToDateTime` メソッドだけで問題ありません。

TryParseExact の第3, 第4引数あたりが冗長ですが、このオーバーロードしかないので我慢しましょう。

では少しでもエレガントな C# ライフをご満喫ください。
