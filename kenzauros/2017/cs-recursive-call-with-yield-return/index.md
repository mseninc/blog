---
title: C# の yield return で再帰呼び出しを行うには
date: 2017-01-31
author: kenzauros
tags: [C#, .NET]
---

今回は C# の `yield return` 文を再帰メソッドの中で用いるときの書き方をメモしておきます。

## 概要

C# には `yield return` という構文があります。これは `IEnumerable<T>` を返すようなメソッドの中に記述し、 `foreach` などの呼び出し元に対して、コレクション要素を返すものです。

```csharp
IEnumerable<int> GetNumber()
{
    yield return 1;
    yield return 2;
    yield return 3;
}
```

たとえば上の `GetNumber` メソッドを `foreach` で使うことができます。

```csharp
// 1, 2, 3 を順に出力
foreach (var n in GetNumber())
{
    Console.WriteLine(n);
}
```

`GetNumber` 内で `List<T>` などに格納して返してもいいのですが、その場合すべての要素を列挙し終えるまで `GetNumber` を抜けないため、要素数が多い場合などは `yield return` のほうが望ましいでしょう。

まぁ、詳細な説明はグーグル先生にお任せするとして、今回は再帰メソッドでの使い方をご紹介します。

## 再帰呼び出しでの yield return

今回の例は一つの `XmlElement` インスタンスを渡して、**自分を含む配下のすべての `XmlElement` を返す**メソッドです。

素直に再帰メソッドを考えれば下記のように書きたくなります。

```csharp
private static IEnumerable<XmlElement> GetXmlElements(XmlElement node)
{
    yield return node; // とりあえず自分を返す
    if (!node.HasChildNodes) yield break; // 子ノードがなければ抜ける
    foreach (XmlNode child in node.ChildNodes)
    {
        if (child.NodeType == XmlNodeType.Element) // 子ノードが XmlElement なら
        {
            return GetXmlElements(child as XmlElement); // ここが再帰呼び出し！でも動かない。
        }
    }
}
```

`yield return` を使うメソッドで強制的に抜けたい場合は `yield break` を使いましょう。このへんはコレクションらしいですね。

しかしこのコードは `return GetXmlElements(child as XmlElement);` の部分がコンパイルできません。 **`yield return` を使用しているメソッド中では `return` が書けない**からです。

かといって `return` しなければ、子ノードに対する呼び出しの結果は返されないまま終わってしまいます。

ということでどうするかと言うと、**再帰呼び出しで戻ってくるコレクションをさらに `foreach` と `yield return` で戻します**。

書き換えると下記のようになります。

```csharp
private static IEnumerable<XmlElement> GetXmlElements(XmlElement node)
{
    yield return node; // とりあえず自分を返す
    if (!node.HasChildNodes) yield break; // 子ノードがなければ抜ける
    foreach (XmlNode child in node.ChildNodes)
    {
        if (child.NodeType == XmlNodeType.Element) // 子ノードが XmlElement なら
        {
            var subElements = GetXmlElements(child as XmlElement); // 再帰呼び出し
            foreach (var subElement in subElements)
            {
                yield return subElement; // 子ノードと含まれる要素を返す
            }
        }
    }
}
```

少々ややこしいですが、読めないほどではありませんね。

## あとがき

ツリー構造を走査するときに便利な再帰呼び出し。`yield return` を使ってリッチに書いてみてはいかがでしょう？
