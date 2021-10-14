---
title: 【LINQ 備忘録】LINQ で気を付けること集
date: 
author: linkohta
tags: [LINQ, .NET, Windows]
---

link です。

.NET にはデータベースへの問い合わせを簡単に行うための **LINQ (統合言語クエリー)** という機能が存在します。

LINQ を使うと `for` や `foreach` を使って書いていた部分が簡潔に書けます。

しかし、コードを記述する際にいくつか気を付けないとパフォーマンスに影響があります。

今回は LINQ を使う上で注意するべき点をいくつか挙げてみたいと思います。

## First() と Last()

最初の要素を取得する `First()` ですが、 **`First()` は条件に合う要素が存在しない場合に例外が発生します。**

意図的に、要素が存在しない場合は例外を発生させるのでなければ、 `FirstOrDefault()` を使いましょう。

また、最後の要素を取得する `Last()` と `LastOrDefault()` がありますが、**このメソッドの利用は非推奨です。**

`Last()` と `LastOrDefault()` はすべての要素を最後まで取得してしまうため、単に動作が遅いだけでなく、メモリーを圧迫する恐れがあります。

最後の要素を取得したい場合は、 `Reverse()` を使って要素の順番を逆転させてから、 `First()` か `FirstOrDefault()` を使いましょう。

## Count()

`IEnumerable<T>` 型には要素数を返す `Count()` が存在します。

要素数が欲しい時に便利ですが `Count()` を使うのはやめましょう。

以下のコードは `IEnumerable<T>.Count()` の中身です。

```cs
public static int Count<TSource>(this IEnumerable<TSource> source)
{
    if (source == null)
    {
        throw Error.ArgumentNull("source");
    }
    ICollection<TSource> is2 = source as ICollection<TSource>;
    if (is2 != null)
    {
        return is2.Count;
    }
    int num = 0;
    using (IEnumerator<TSource> enumerator = source.GetEnumerator())
    {
        while (enumerator.MoveNext())
        {
            num++;
        }
    }
    return num;
}
```

上述のコードの通り、 `Count()` は使うたびに内部で要素をすべて取得して、要素数を 1 から数えているため、メモリーを圧迫する恐れがあります。

どうしても要素数が必要な場合は、`ToList()` で実体を取得したうえで `Count` プロパティーを利用するなど、 `Count()` を使う回数を可能な限り減らしましょう。

例外として、 `ICollection` 型としても扱える場合は `Count()` を使用しても問題ありません。

その場合、 `Count()` は `ICollection` 型が実装している `Count` プロパティーを返すようになっています。

また、要素が存在するかを判定したい場合は `Count() > 0` ではなく、 `Any()` を使いましょう。 `Any()` は要素が 1 つでも見つかればそこで処理が終了するのでメモリーを圧迫しません。

## 同じクエリーを使いまわす時

同じクエリーを複数回使いまわすと、クエリーを実行するたびに実体を取得しに行ってしまうため、パフォーマンスに影響が出てしまいます。

そんな時は `ToArray()` や `ToList()` を使って取得した実体を使いまわすようにしましょう。

## メソッドチェインの順番

`Where` と `Select` を組み合わせて使うことは多いと思います。 **`Select` は `Where` で条件を指定した後に呼び出しましょう。**

LINQ 内部では `Where` -> `Select` の順番で処理が行われる場合、自動で最適化してくれます。

**逆に `Select` -> `Where` の順番で呼び出すと最適化してくれません。**

これは、内部で `WhereSelectEnumerableIterator` として `Where` と `Select` が統合された状態になるためです。

ちなみに、 `Select` の直前に `Where` を何回呼び出しても、最適化時に 1 つの `Where` にまとめてくれます。

ですので、 `Select` は最後に呼び出しましょう。

## まとめ

LINQ を使う上で気を付けるべきことを挙げてみました。

それではまた、別の記事でお会いしましょう。