---
title: "[C#.NET] 書き込みモードで開かれたファイルを読み取る ReadLines メソッド"
date: 2019-04-08
author: kenzauros
tags: [C#, .NET]
---

**`System.IO.File.ReadLines()` で IIS のログファイルを読み取る**コードを書いていたのですが、本番環境に適用してみると

> 別のプロセスで使用されているため、プロセスはファイル “ほげほげ” にアクセスできません

などと怒られてしまいました。

## 結論

結論から言うと下記のようなユーティリティメソッドを作って利用するのが手っ取り早いです。

- [C# で書き込みモードで開かれたファイルを読み取る ReadLines メソッド - gist](https://gist.github.com/kenzauros/3a5345dc40cfc1deeae4d6fc631a059a)

```cs
using System.Collections.Generic;
using System.IO;
using System.Text;

/// <summary>
/// Provides iterators to read lines in a file.
/// </summary>
public static class TextFile
{
    /// <summary>
    /// Enumrates lines in the file with the file share setting.
    /// </summary>
    /// <param name="path"></param>
    /// <param name="fileShare"></param>
    /// <param name="encoding"></param>
    /// <returns></returns>
    public static IEnumerable<string> ReadLines(
        string path,
        FileShare fileShare = FileShare.ReadWrite,
        Encoding encoding = null)
    {
        using (var stream = new FileStream(path, FileMode.Open, FileAccess.Read, fileShare))
        using (var reader = new StreamReader(stream, encoding ?? Encoding.UTF8))
        {
            string line;
            while ((line = reader.ReadLine()) != null)
            {
                yield return line;
            }
        }
    }
}
```

この内容については後述します。例外処理等は適当なので、必要に応じて追加してください。

下記のような感じで使えます。

```cs
var lines = FileText.ReadLines(path)
    .Skip(2) // 2 行スキップ
    .Where(x => x.Contains("HOGE")) // HOGE を含んでいれば
    .Select(x => ConvertLine(x)); // なんか処理
foreach (var line in lines)
{
    Console.WriteLine(line);
}
```

## 原因

IIS はログファイルを書き込む際に当然ながらファイルロックをかけていますが、どうやら `System.IO.File.ReadLines()` は書き込みモードで開かれているファイルを読み込めないようです。

Microsoft の .NET Framework のソースコードを参照すると `ReadLines` は下記のように実装されています。

- [referencesource/file.cs at master · Microsoft/referencesource](https://github.com/Microsoft/referencesource/blob/4fde2de4fc03a2f8f8682f1d225f9fc5da857406/mscorlib/system/io/file.cs#L1033)

```
[ResourceExposure(ResourceScope.Machine)]
[ResourceConsumption(ResourceScope.Machine)]
public static IEnumerable<String> ReadLines(String path)
{
	if (path == null)
		throw new ArgumentNullException("path");
	if (path.Length == 0)
		throw new ArgumentException(Environment.GetResourceString("Argument_EmptyPath"), "path");
	Contract.EndContractBlock();

	return ReadLinesIterator.CreateIterator(path, Encoding.UTF8);
}
```

`ReadLinesIterator.CreateIterator` で作られたイテレーターが返されています。これをさらにたどってみると...

- [referencesource/ReadLinesIterator.cs at master · Microsoft/referencesource](https://github.com/Microsoft/referencesource/blob/master/mscorlib/system/io/ReadLinesIterator.cs)

```cs
internal class ReadLinesIterator : Iterator<string>
{
    // ～中略～
    private static ReadLinesIterator CreateIterator(string path, Encoding encoding, StreamReader reader)
    {
        return new ReadLinesIterator(path, encoding, reader ?? new StreamReader(path, encoding));
    }
}
```

`StreamReader` が引数なしで作成されることがわかります。さらに `StreamReader` のコンストラクターを参照すると...

- [referencesource/streamreader.cs at 4fde2de4fc03a2f8f8682f1d225f9fc5da857406 · Microsoft/referencesource](https://github.com/Microsoft/referencesource/blob/4fde2de4fc03a2f8f8682f1d225f9fc5da857406/mscorlib/system/io/streamreader.cs#L240)

```cs
Stream stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, DefaultFileStreamBufferSize, FileOptions.SequentialScan, Path.GetFileName(path), false, false, checkHost);
```

**`FileShare.Read`** となっています。この `FileShare` という列挙体は非常にわかりにくいのですが、すでにロックされているファイルを開くとき、下記のように動作します。

- **`Read`**: 読み取りロックがかかっているファイルが開ける
- **`ReadWrite`**: 読み取り書き込みロックがかかっているファイルが開ける
- **`None`**: ロックされていないファイルのみ開ける

> [FileShare Enum (System.IO) | Microsoft Docs](https://docs.microsoft.com/ja-jp/dotnet/api/system.io.fileshare?view=netframework-4.7.2)

これが **`Read` になっているので書き込みロックのかかっているファイルが開けない**、ということですね。

## 詳細

内容的には `FileShare` を渡せるようにしただけです。

メソッドは `IEnumerable<string>` を返すようにし、内部では `yield return` で一行ごとに返していきます。

このときファイルの終端 (EOF) をチェックするのに `Peek()` メソッドの戻り値をチェックしている例が多いですが、 `EndOfStream` プロパティをチェックするか、実装例のように `ReadLine()` の戻り値が `null` かどうかで確認するようにします。
