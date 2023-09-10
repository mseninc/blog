---
title: "[C#] プロパティを記述する際の { get; } と => の違い"
date: 2021-08-19
author: k-so16
tags: [C#, .NET]
---

こんにちは。最近、靴を 2 足新調した k-so16 です。ちょうどセールで 2 足で 5,500 円だったので、いいタイミングで買い物したと思いました(笑)

C# で getter のみのプロパティを定義する方法として、 `{ get; }` を用いる方法と `=>` を用いる方法がありますが、 2 つの記述方法には違いがあります。

本記事では、 C# におけるプロパティの記述方法の違いについて紹介します。筆者がつまづいた事例を挙げ、なぜ期待した挙動と違ったのかを説明します。

本記事で想定する読者層は以下の通りです。

- C# の構文についての基礎知識を有している
- C# のプロパティについて基礎知識を有している

## コード例で考える `{ get; }` と `=>` の違い

コード例を出して考えてみましょう。下記のコードの `NextWeek1` と `NextWeek2` の違いは何でしょうか?

```cs
public DateTime NextWeek1 => DateTime.Now.AddDays(7);
public DateTime NextWeek2 { get; } = DateTime.Now.AddDays(7);
```

`NextWeek1` に複数回アクセスした場合、アクセスされた際の時刻から 1 週間後の `DateTime` が計算されて取得できます。一方で、 `NextWeek2` は何回アクセスしても、最初にプロパティにアクセスされた時刻から 1 週間後の `DateTime` が取得されます。

```cs
public async Task DebugNextWeek1()
{
    /* NextWeek1 への最初のアクセスが 2021/08/18 13:00:00 の場合  */
    Console.WriteLine(NextWeek1.ToString()); // 2021/08/18 13:00:00
    await Task.Delay(1000);
    Console.WriteLine(NextWeek1.ToString()); // 2021/08/18 13:00:01
    await Task.Delay(1000);
    Console.WriteLine(NextWeek1.ToString()); // 2021/08/18 13:00:02
}

public async Task DebugNextWeek2()
{
    /* NextWeek2 への最初のアクセスが 2021/08/18 13:00:00 の場合  */
    Console.WriteLine(NextWeek2.ToString()); // 2021/08/18 13:00:00
    await Task.Delay(1000);
    Console.WriteLine(NextWeek2.ToString()); // 2021/08/18 13:00:00
    await Task.Delay(1000);
    Console.WriteLine(NextWeek2.ToString()); // 2021/08/18 13:00:00
}
```

筆者はてっきり `=>` は `{ get; }` の完全な syntax sugar だと思い込み、「単一式で表せる getter のみのプロパティなら `=>` を常に使えば良い」と考えていました。しかし、 **オブジェクトを取得するプロパティ** の場合は、 **記述方法によって挙動に違いが出る** ことがあるので、なんでもかんでも `=>` を用いてプロパティを書いてしまうとハマる場合があります。


## 筆者のつまづいた事例

WPF の画面で現在時刻を表示するために、 ReactiveProperty を利用して 5 秒間隔で現在時刻を更新するためのプロパティを以下のように設定しました。

```cs
public class ViewModel
{
    public ReactiveProperty<string> CurrentTime => Observable.Interval(Timespan.FromSeconds(5))
        .Select(_ => DateTime.Now.ToString("HH:mm:ss"))
        .ToReactiveProperty();

    public ViewModel()
    {
        CurrentTime.Value = DateTime.Now.ToString("HH:mm:ss");
    }
}
```

`CurrentTime` の表示部分の XAML は以下のように定義しました。

```xml
 <Label Content="{Binding CurrentTime.Value}"/>
```

この `CurrentTime` プロパティをビューにバインドすることで、現在時刻を画面上が表示されることを想定していました。しかし、なぜかプログラムを起動した際に、時刻が画面上に表示されるまでに少し遅延がありました。

![時計の表示が遅延した実行例](images/difference-between-getter-and-expression-bodied-members-in-csharp-1.gif "時計の表示が遅延した実行例")

原因が分からず、試しに以下のように `{ get; }` を用いて書き換えたところ、プログラムを起動すると即座に時刻が画面上に表示されました。

```cs
public class ViewModel
{
    public ReactiveProperty<string> CurrentTime { get; } = Observable.Interval(Timespan.FromSeconds(5))
        .Select(_ => DateTime.Now.ToString("HH:mm:ss"))
        .ToReactiveProperty();

    public ViewModel()
    {
        CurrentTime.Value = DateTime.Now.ToString("HH:mm:ss");
    }
}
```

![時計が遅延なく表示された実行例](images/difference-between-getter-and-expression-bodied-members-in-csharp-2.gif "時計が遅延なく表示された実行例")

## `{ get; }` と `=>` の構文の違い

`{ get; }` と `=>` のどちらもプロパティの getter として利用できるのですが、両者には構文的な違いがあるので、完全に等価な構文ではありません。以降の節では、それぞれ何の syntax sugar であるかを紹介し、違いについて説明します。

### `{ get; }` と等価な構文

まず、 `{ get; }` の構文について説明します。

例えば、プロパティ `X` でクラス `T` のコンストラクタからインスタンスを取得するために `{ get; }` を用いて記述すると、以下のようになります。

```cs
public T X { get; } = new T();
```

このコードは以下のコードの syntax sugar です。

```cs
private T _X = new T();
public T X { get { return _X; } }
```

`{ get; }` によるプロパティの定義では、値を保持するための変数[^1] が **暗黙的に** 生成され、プロパティにアクセスされた際には、その変数が返されます。上記のコード例で言えば、 `_X` が暗黙的に生成される変数です。明示的に `_X` の参照先が変更されなければ、 **同じインスタンス** にアクセスされます。

### `=>` と等価な構文

次に `=>` の構文について説明します。

プロパティ `X` でクラス `T` のコンストラクタからインスタンスを取得するために `=>` を用いて記述すると、以下のようになります。

```cs
public T X => new T();
```

このコードは以下のコードの syntax sugar です。

```cs
public T X { get { return new T(); } }
```

`=>` を用いたプロパティでは、参照されるたびに式を評価し、その評価結果を返します。 上記の例では、 `X` プロパティにアクセスするたびに `T` のインスタンスが新たに生成されます。

`=>` は `{ get; }` とは異なり、 **値を保持する変数は生成されない** ので、 2 回目に `X` プロパティにアクセスした場合 1 回目に `X` プロパティにアクセスした際の `T` インスタンスとは異なります。取得したインスタンスに再度アクセスするためには、 **明示的に** 変数を用意する必要があります。以下のように値を保持するためのプロパティを用意することで、 `=>` を用いて `{ get; }` と等価なコードを記述することもできます。

```cs
private T _X;
public T X => _X ?? (_X = new T());
```

少しトリッキーな書き方ですが、上記のコードでは、 private な `T` クラスのフィールド `_X` を保持し、 `_X` が `null` でなければ `_X` を返し、 `null` の場合は `_X` に `T` のインスタンスを代入して返しています。

## 期待した挙動と異なった理由

先ほどの時刻表示のプログラム例では、 `=>` を用いたプロパティを書いていたことによって、 XAML での参照先とコンストラクタ内で参照先で **異なるインスタンスが生成されていた** ことが原因でした。参照先が異なるので、 ViewModel 側で `CurrentTime.Value` の値を設定しても、 XAML 側で参照されている `CurrentTime.Value` が初期化されず、時刻が遅延して表示されました。

`{ get; }` を用いることで、 XAML と ViewModel のコンストラクタ内で参照するインスタンスが **同一** となり、 XAML で参照される `CurrentTime.Value` が初期化され、実行時に時刻が正しく表示されました。

![`=>` と `{ get; }` の挙動の違いのイメージ](images/difference-between-getter-and-expression-bodied-members-in-csharp-3.png "`=>` と `{ get; }` の挙動の違いのイメージ")
本記事を執筆する上で以下の記事を参考にしました。

> - [c# 6.0 - What is the => assignment in C# in a property signature - Stack Overflow](https://stackoverflow.com/a/38999936)

余談ですが、 `{ get; }` は [auto-property initializers](https://docs.microsoft.com/en-us/archive/msdn-magazine/2014/october/csharp-the-new-and-improved-csharp-6-0#auto-property-initializers), `=>` は [expression-bodied members](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/statements-expressions-operators/expression-bodied-members) という名前がそれぞれついているようです。
## まとめ

本記事のまとめは以下の通りです。

- `{ get; }` は **暗黙的に** 値を保持するための変数を生成する
- `=>` はアクセスされるたびに式を評価する

以上、 k-so16 でした。 C# の世界は奥が深いですね(笑)

[^1]: このような変数を **[backing fields](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/properties#properties-with-backing-fields)** と呼ぶようです。