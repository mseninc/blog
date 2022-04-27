---
title: C# で null 合体代入演算子を使って読み取り専用プロパティーを動的に初期化する
date: 
author: kenzauros
tags: [C#, .NET]
description: 今回は C# 8.0 から導入された null 合体代入演算子を使って、 getter のみのプロパティーの値を動的に初期化する方法を紹介します。
---

こんにちは、 kenzauros です。

今回は **getter のみのプロパティーの値を動的に初期化する方法** を紹介します。

## 結論

まずは結論から。 C# 8.0 以降では **null 合体代入演算子** を使うと簡潔に書けます。

```cs{6-7}:title=null合体代入演算子で置き換え
public static class MyAssets {
    public static readonly Color[] MyColors = new[] { Colors.Red, Colors.Green, Colors.Blue };

    private static Brush[]? _MyBrushes;

    public static Brush[] MyBrushes =>
        _MyBrushes ??= MyColors.Select(c => new SolidColorBrush(c)).ToArray();
}
```

では、以降で順を追ってみていきましょう。

## 実例

たとえば下記のようなクラスを想定します。

```cs{4-5}:title=getterで生成する場合
public static class MyAssets {
    public static readonly Color[] MyColors = new[] { Colors.Red, Colors.Green, Colors.Blue };

    public static Brush[] MyBrushes =>
        MyColors.Select(c => new SolidColorBrush(c)).ToArray();
    // 👆は以下と同義
    // public static Brush[] MyBrushes
    // {
    //     get { return MyColors.Select(c => new SolidColorBrush(c)).ToArray(); }
    // }
}
```

このクラスの *`MyBrushes` プロパティーは `MyColors` から動的にブラシの配列を生成して返却*しています。
（慣れていない方は `=` と `=>` の違いに留意してください）

シンプルですが、 `MyAssets.MyBrushes` へアクセスされる度に、動的にオブジェクトが生成されます。
このため、このプロパティーへのアクセスが多い場合や生成処理にコストがかかる場合にパフォーマンス上の問題が生じます。

生成元の `MyColors` は変わらないわけですから、 `MyBrushes` も動的に生成する必要はありません。
（ここでは話を簡単にするため `MyColors` が書き換えられる可能性は無視します。）

### フィールドにキャッシュする

そこで下記のように *private 変数を用意してキャッシュ* します。

```cs{4-7}:title=フィールドにキャッシュする
public static class MyAssets {
    public static readonly Color[] MyColors = new[] { Colors.Red, Colors.Green, Colors.Blue };

    private static readonly Brush[] _MyBrushes =
        MyColors.Select(c => new SolidColorBrush(c)).ToArray();

    public static Brush[] MyBrushes => _MyBrushes;
}
```

これでブラシの配列は `_MyBrushes` に格納され、以後 `MyAssets.MyBrushes` はその配列を返すだけになるため、パフォーマンスは改善します。

しかし、今度は *`MyAssets.MyBrushes` へのアクセスがない時点でもブラシの配列が生成されて保持されます*。
（厳密には `MyAssets` のいずれかのメンバーにアクセスされた時点で初期化されます。）

必ず使われるオブジェクトなら問題ありませんが、たとえばユーザー操作によっては不要になる場合など、「**必要になるまで生成を遅延したい**」場面というのは結構あります。

この例のような軽量なオブジェクトでは実質的に問題になることはありませんが、メモリーを消費するインスタンスの場合は生成のタイミングを考慮する必要があります。

そこで **`MyAssets.MyBrushes` へ初めてアクセスされた時点で初期化する**ようにします。

### getter で一回だけ生成してフィールドに保存する

まずは古典的な手法です。

```cs{6-15}:title=getterで一回だけ生成してフィールドに保存する
public static class MyAssets {
    public static readonly Color[] MyColors = new[] { Colors.Red, Colors.Green, Colors.Blue };

    private static Brush[]? _MyBrushes;

    public static Brush[] MyBrushes
    {
        get
        {
            if (_MyBrushes == null) {
                _MyBrushes = MyColors.Select(c => new SolidColorBrush(c)).ToArray();
            }
            return _MyBrushes;
        }
    }
}
```

ロジックはわかりやすいのですが、やりたいことの割にコードが長いですね。

`_MyBrushes` が 3 回も登場しますし、 null 判定をしている部分がいかにも古めかしく感じられます(笑)

### null 合体演算子で書き換え

そこで **null 合体演算子 (null coalescing operator) `??`** を使って書き換えます。 null 合体演算子は C# 2.0 で導入されたものです。意外と古いですね。

```cs{6-7}:title=null合体演算子で置き換え
public static class MyAssets {
    public static readonly Color[] MyColors = new[] { Colors.Red, Colors.Green, Colors.Blue };

    private static Brush[]? _MyBrushes;

    public static Brush[] MyBrushes =>
        _MyBrushes ?? (_MyBrushes = MyColors.Select(c => new SolidColorBrush(c)).ToArray());
}
```

ずいぶんスッキリしました。

- `_MyBrushes` が null でなければ `_MyBrushes` を返す
- `_MyBrushes` が null なら初期化して `_MyBrushes` に代入して、それを返す

という処理が、 1 つの式で表現できています。これで式中の `_MyBrushes` の登場は 2 回になりました。

### null 合体代入演算子で書き換え (C# 8.0 以降)

さらに C# 8.0 で導入された **null 合体代入演算子 (null coalescing assignment operator) `??=`** を使用して書き換えます。

```cs{6-7}:title=null合体代入演算子で置き換え
public static class MyAssets {
    public static readonly Color[] MyColors = new[] { Colors.Red, Colors.Green, Colors.Blue };

    private static Brush[]? _MyBrushes;

    public static Brush[] MyBrushes =>
        _MyBrushes ??= MyColors.Select(c => new SolidColorBrush(c)).ToArray();
}
```

すごくスッキリしましたね。動作は同じなのに `_MyBrushes` が式に 1 回しかでてこなくなりました。

おそらく将来的にもこれ以上短くなることはないでしょう。

これで *`MyAssets.MyBrushes` へ初めてアクセスされた時点で初期化する* という目標が達成でき、コードもスッキリしました。

## まとめ

**null 合体代入演算子** を使えば、プロパティーの遅延初期化も簡潔に記述できるということをお伝えしました。

頻出パターンの 1 つだと思うのですが、慣れていないと思いつきにくいかもしれないので、ヒントにしていただければ幸いです。

それにしても「null 合体代入演算子」ってすごい名前ですよね😂
