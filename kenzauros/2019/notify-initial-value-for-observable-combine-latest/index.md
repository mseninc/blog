---
title: "[ReactiveProperty] Observable.CombineLatest で最初にすべてのシーケンスを発火させておくには"
date: 2019-03-20
author: kenzauros
tags: [C#, ReactiveProperty, .NET]
---

こんにちは、kenzauros です。

Observer パターンや ReactiveProperty を使った開発で **`IObservable<T>` の最初に任意の要素を付加したい**場合があります。

## 概要

特に複数の `IObservable<T>` を **`Observable.CombineLatest` で結合する場合などは、すべての `IObservable<T>` が一度は発火していないと動作しない**ため、とりあえず最初に発火させておきたいのです。

たとえば下記のような `ReadOnlyReactiveProperty<DateTime>` を作るとして、

```cs
// YourReactiveProperty は既存の ReactiveProperty<T> ,
// LastChanged は ReadOnlyReactiveProperty<DateTime> 型だとする

LastChanged = YourReactiveProperty // これと
    .CombineLatest(
        SomeCollection.CollectionChangedAsObservable(), // これを監視する
        (x1, x2) => DateTime.Now)
    .ToReadOnlyReactiveProperty();
```

この場合、 `SomeCollection.CollectionChangedAsObservable()` はなにかコレクションが変化するまで発火しませんので、
それまでは **`YourReactiveProperty` が変更されたとしても `LastChanged` が更新されません**。

これは意図した動きではないわけで、なんとかするには `SomeCollection.CollectionChangedAsObservable()` も最初に発火させておく必要があります。

## StartWith 拡張メソッドを使う

というわけで、登場するのが **`IObservable<T>.StartWith()`** です。
これは `IObservable<T>` の **先頭** に任意のシーケンスを追加する拡張メソッドです。

これを上記のソースに追加して下記のようにすることで、`LastChanged` が直ちに反映されるようになります。

```diff
LastChanged = YourReactiveProperty
    .CombineLatest(
-       SomeCollection.CollectionChangedAsObservable(),
+       SomeCollection.CollectionChangedAsObservable().StartWith(new NotifyProperyChangedEventArgs[] { null }),
        (x1, x2) => DateTime.Now)
    .ToReadOnlyReactiveProperty();
```

ただ、この `StartWith` の引数を配列 (もしくは `IEnumerable<T>`) で渡さないといけないのが、イカにもタコにもダサいです。

## さらに StartWithDefault 拡張メソッドを定義してみる

そもそもこんなところに型名なんて書きたくない。というわけで、さらに拡張メソッドを定義します。

```cs
using System;
using System.Reactive.Linq;

namespace Hogehoge
{
    public static class IObservableExtensions
    {
        /// <summary>
        /// Prepends a default value of the type to an observable sequence.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="observable"></param>
        /// <returns></returns>
        public static IObservable<T> StartWithDefault<T>(this IObservable<T> observable)
            => observable.StartWith(new T[] { default });
    }
}
```

これでいくらかマシになります。

```diff
LastChanged = YourReactiveProperty
    .CombineLatest(
-       SomeCollection.CollectionChangedAsObservable().StartWith(new NotifyProperyChangedEventArgs[] { null }),
+       SomeCollection.CollectionChangedAsObservable().StartWithDefault(),
        (x1, x2) => DateTime.Now)
    .ToReadOnlyReactiveProperty();
```

これで監視対象が増えても安心ですね！

## 補足: ReactiveProperty は StartWithDefault が不要な理由

さらっと流しましたが、通常 `YourReactiveProperty` のほうには `StartWithDefault` をつける必要はありません。

`ReactiveProperty` の場合は通常、生成されるときに **`ReactivePropertyMode.RaiseLatestValueOnSubscribe`** フラグが有効になっており、このフラグが有効だと `Subscribe` したときに初期値が通知されるようになっているからです。

## 参考

今回の拡張メソッドは下記の QA を参考にしました。

>[.net - About Rx's CombineLatest and default initial values - Stack Overflow](https://stackoverflow.com/questions/30540106/about-rxs-combinelatest-and-default-initial-values)
