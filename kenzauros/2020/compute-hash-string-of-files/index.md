---
title: "[C#] ファイルハッシュを求める (MD5, SHA-1, SHA-256)"
date: 2020-05-29
author: kenzauros
tags: [C#, .NET, .NET Framework, .NET Core]
---

ファイルの整合性を確かめるときにファイルのハッシュ値同士を比較するという手法があります。ファイルサイズや作成・更新日時だけでは同一か判断しづらい場合に役立ちます。

今回は **C# で簡単にファイルのハッシュ値を計算する**方法を紹介します。

## ユースケース

今回、 2 つのディレクトリのファイル差分を確認して同期するツールを作成していたのですが、片方のディレクトリが Git のリポジトリであったため、更新日時だけでは差分を判断することができませんでした。 (Git でチェックアウトした日時がファイルの更新日時になるため)

というわけで今回は**ファイルハッシュをとってファイル同士の比較を行う**ことにしました。

## 実装

### ソースコード

なにはともあれソースコードです。非常にシンプルなメソッドを一つ作るだけです。

```cs
using System.Security.Cryptography;

static readonly HashAlgorithm hashProvider = new SHA1CryptoServiceProvider();

/// <summary>
/// Returns the hash string for the file.
/// </summary>
/// <param name="filePath"></param>
/// <returns></returns>
public static string ComputeFileHash(string filePath)
{
    using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
    var bs = hashProvider.ComputeHash(fs);
    return BitConverter.ToString(bs).ToLower().Replace("-", "");
}
```

※ `using` が C# 8 の省略記法 (`using` 変数宣言) なので C#7 までの場合はブロック構文に直してください。

### 使い方

この `ComputeFileHash` を呼び出すだけです。

```cs
var hash = ComputeFileHash(@"C:\Windows\notepad.exe");
Console.WriteLine(hash);
// will show "c401cd335ba6a3bdaf8799fdc09cdc0721f06015"
```

**SHA1 なので 40 文字 (40 バイト) のハッシュ文字列**が得られるはずです。

### ハッシュアルゴリズム

ここでは SHA1 を用いましたが、**ハッシュプロバイダーを変更すれば MD5 や SHA256 などに対応可能**です。同一性を見るだけですので、 MD5 でも十分だと思います。

詳細は過去記事を参照してください。

- [\[C# 6\] SHA256 や MD5 の 16 進ハッシュ文字列を得る](https://mseeeen.msen.jp/compute-hash-with-csharp-6-or-later/)

### ファイルを開くときのモード

ファイルは `FileShare.ReadWrite` モードで開いています。

詳細は過去記事に委ねますが、今回の用途では**他のアプリがファイルを開いているときでも、ハッシュ計算を行いたかった**ため、読み取り書き込みロックがかかっているファイルが開ける `FileShare.ReadWrite` を指定しています。

- [\[C#.NET\] 書き込みモードで開かれたファイルを読み取る ReadLines メソッド](https://mseeeen.msen.jp/csharp-read-lines-from-a-file-locked-by-other-process/)

## 動作速度

手元で試したところ、 1315 ファイル 合計 64MB のハッシュを求めるのには 400 ミリ秒程度でしたが、 100GB のファイルのハッシュを求めるには 7 分ほどかかりました。

やはり全データを読み取るのでファイルサイズが大きくなると比例して長くなります。

## あとがき

分割して読み取るなどの工夫もあるかもしれませんが、**サイズの大きなファイル同士の高速な比較には向いていません**。

ファイルの比較の場合であれば、そもそもファイルサイズが異なる場合は確実に中身も異なるはずなので、その場合はハッシュ計算する必要がありませんし、いろいろ最適化はできそうです。

アプリケーションによって必要となる場面は変わると思いますが、どこかで役に立てば幸いです。
