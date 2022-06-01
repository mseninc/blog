---
title: "[C# 6] SHA256 や MD5 の 16 進ハッシュ文字列を得る"
date: 2019-03-11
author: kenzauros
tags: [C#, .NET, .NET Framework]
---

<ins>
2022/6/1 追記

.NET 6 では一部が非推奨になっています。新しい記事をご参照ください。

- [\[.NET 6\] SHA256 や MD5 の 16 進ハッシュ文字列を得る | MSeeeeN](https://mseeeen.msen.jp/compute-hash-with-dotnet6/)
</ins>

- - -

**C# で SHA256 や MD5 のハッシュ文字列を得る**方法はいろいろなところで紹介されていますが、今どきのソースコードが少ないので、あらためて紹介します。

ただし、 MD5 や SHA1 については、脆弱性や安全性の問題から使用は推奨されていませんので、用途を考慮してご使用ください。

> 暗号技術検討会1及び関連委員会（以下、「CRYPTREC」という。）により安全性及び実装性能が確認された暗号技術2について、市場における利用実績が十分であるか今後の普及が見込まれると判断され、**当該技術の利用を推奨するもののリスト**。
> ハッシュ関数: **SHA-256**, **SHA-384**, **SHA-512**
>
> 「電子政府における調達のために参照すべき暗号のリスト(CRYPTREC暗号リスト)」 ([CRYPTREC | CRYPTREC暗号リスト(電子政府推奨暗号リスト)](https://www.cryptrec.go.jp/list.html))

## ソースコード

おそらく現状では下記が最短の記述となると思います。

- [C# で SHA256 のハッシュ文字列を得る - gist](https://gist.github.com/kenzauros/09377008ff036a730d0c7de7e6ecdb89)

```cs:title=GetSHA256HashedString.cs
using System.Security.Cryptography;
using System.Linq;
using System.Text;

public class MyClass
{
    static readonly SHA256CryptoServiceProvider hashProvider = new SHA256CryptoServiceProvider();
    public static string GetSHA256HashedString(string value)
        => string.Join("", hashProvider.ComputeHash(Encoding.UTF8.GetBytes(value)).Select(x => $"{x:x2}"));
}
```

下記のように使用できます。

```cs
var hash = GetSHA256HashedString("test");
Console.WriteLine(hash);
// will show "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
```

16 進数文字列に変換して結合するところを LINQ の `Select` を用いることで直接 `string.Join` に渡し、式の形にできるのでラムダ式として記述できます。

※メソッドのラムダ式記述は C# 6 以降で可能になりました。 ([参考](https://www.atmarkit.co.jp/ait/articles/1606/01/news051.html))

C# 7 以降で、複数の場所から使われることがないのであれば、ローカル関数として実装もできますね。

```cs
static readonly SHA256CryptoServiceProvider hashProvider = new SHA256CryptoServiceProvider();
public void SomeMethod()
{
    string GetSHA256HashedString(string value)
        => string.Join("", hashProvider.ComputeHash(Encoding.UTF8.GetBytes(value)).Select(x => $"{x:x2}"));

    var hash = GetSHA256HashedString("test");
    Console.WriteLine(hash);
    // will show "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
}
```

ちなみに 16 進文字列を大文字にしたい場合は `$"{x:x2}"` を `$"{x:X2}"` と変えれば OK です。

## その他のハッシュ関数

上記の例では SHA256 を用いましたが、 .NET Framework の [System.Security.Cryptography](https://docs.microsoft.com/ja-jp/dotnet/api/system.security.cryptography?view=netframework-4.7.2) 名前空間にはほかにもハッシュプロバイダーが用意されています。`SHA256CryptoServiceProvider` の部分を置き換えるだけでそれらを利用できます。


暗号化方式 | クラス
--- | ---
MD5 | `MD5CryptoServiceProvider`
SHA1 | `SHA1CryptoServiceProvider`
SHA256 | `SHA256CryptoServiceProvider`
SHA384 | `SHA384CryptoServiceProvider`
SHA512 | `SHA512CryptoServiceProvider`

## 参考

- [文字列のSHA-256を求める (C#プログラミング)](https://www.ipentec.com/document/csharp-get-sha256-string)
- [MD5やSHA1などでハッシュ値を計算する - .NET Tips (VB.NET,C#...)](https://dobon.net/vb/dotnet/string/md5.html)
- [System.Security.Cryptography Namespace | Microsoft Docs](https://docs.microsoft.com/ja-jp/dotnet/api/system.security.cryptography?view=netframework-4.7.2)
