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

また、最後の要素を取得する `Last()` と `LastOrDefault()` があります。

以下のコードは `Last()` と `LastOrDefault()` 内で最後の要素の取得に利用されている `TryGetLast()` の実装です。

```cs
private static TSource TryGetLast<TSource>(this IEnumerable<TSource> source, out bool found)
{
    // ・・・（中略）

    if (source is IList<TSource> list)
    {
        int count = list.Count;
        if (count > 0)
        {
            found = true;
            return list[count - 1];
            }
    }
    else
    {
        using (IEnumerator<TSource> e = source.GetEnumerator())
        {
            if (e.MoveNext())
            {
                TSource result;
                do
                {
                    result = e.Current;
                }
                while (e.MoveNext());

                found = true;
                return result;
            }
        }
    }

    found = false;
    return default!;
}
```

上述のコードの通り、 `IList` 型に変換可能でない限り、 `Last()` と `LastOrDefault()` はすべての要素を最後まで取得します。

最後の要素を使いまわす時は `ToList()` で `List` 型の結果を取得しましょう。

## Count()

`IEnumerable<T>` 型には要素数を返す `Count()` が存在します。

要素数が欲しい時に便利ですが `Count()` を使うのはやめましょう。

`Count()` を使いたい時というのは大きく分けて、以下の 2 種類あります。

1. 要素が存在するかを判定したい場合
2. 要素数を数えたい場合

1 については `Count() > 0` ではなく、必ず `Any()` を使いましょう。 `Any()` は要素が 1 つでも見つかればそこで処理が終了するのでイテレーションの走査は 1 回だけで済みます。

2 については要素数が必要な場合は、`ToList()` で取得したオブジェクトに実装されている `Count` プロパティーを利用するなど、 `Count()` を使う回数を可能な限り減らしましょう。

例外として、 `ICollection` 型としても扱える場合は `Count()` を使用しても問題ありません。その場合、 `Count()` は `ICollection` 型が実装している `Count` プロパティーを返すようになっています。

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

上述のコードの通り、 `Last()` と同じく `Count()` は使うたびに内部で要素をすべて取得して、要素数を 1 から数えているため、パフォーマンスに影響を与える恐れがあります。

これに関連して、クエリーの結果を使いまわす時はクエリーを何度も実行させるのではなく、 `ToArray()` や `ToList()` の結果を使いまわすようにしましょう。

## メソッドチェインの順番

`Where` と `Select` を組み合わせて使うことは多いと思います。 **`Select` は `Where` で条件を指定した後に呼び出しましょう。**

LINQ 内部では `Where` -> `Select` の順番で処理を行う場合、 `WhereSelectEnumerableIterator` として 2 つのメソッドが統合された状態になります。

これは `Where` -> `Select` の順番で処理を行うことが多いため、それらを統合することでパフォーマンスを向上させるためだと考えられます。

**逆に `Select` -> `Where` の順番で呼び出すと統合してくれません。**

ちなみに、 `Select` の直前で `Where` を何回呼び出しても、中間言語にコンパイルする時、 1 つの `Where` にまとめてくれます。

`Select` 内で処理を行ったものに対して `Where` で絞り込みをしたいのでなければ、 `Select` は最後に呼び出しましょう。

## 参考サイト

- [dotnet/corefx at master](https://github.com/dotnet/corefx/tree/master)
- [Enumerable クラス (System.Linq) | Microsoft Docs](https://docs.microsoft.com/ja-jp/dotnet/api/system.linq.enumerable?view=net-5.0)

## まとめ

LINQ を使う上で気を付けるべきことを挙げてみました。

それではまた、別の記事でお会いしましょう。