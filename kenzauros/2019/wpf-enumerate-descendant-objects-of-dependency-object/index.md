---
title: "[WPF] DependencyObject の子孫要素を型指定ですべて列挙する"
date: 2019-03-01
author: kenzauros
tags: [WPF, C#, .NET]
---

こんにちは、kenzauros です。

タイトルのとおり、WPF の Window 等で **DependencyObject の子孫要素を特定の型のみすべて列挙する方法**を紹介します。

## やりたいこと

ウィンドウ上には大量なコントロールが配置されますが、論理ツリー上では結構な階層になっていますので、一気に全階層取得できるとうれしいときがあります。

具体的には今回**ウィンドウ上のラジオボタンをすべて取得**する必要があり、レイアウトの都合上、別コンテナーに分散していたため、全列挙がしたくなりました。

## ソースコード

早速ですが、ソースコードです。

```cs
/// <summary>
/// 指定した <see cref="DependencyObject"/> の子孫のうち、指定された型のオブジェクトを列挙します。
/// </summary>
/// <typeparam name="T">列挙する型</typeparam>
/// <param name="obj">DependencyObject</param>
/// <returns>指定した型に一致する子孫オブジェクト</returns>
private static IEnumerable<T> EnumerateDescendantObjects<T>(DependencyObject obj) where T : DependencyObject
{
    foreach (var child in LogicalTreeHelper.GetChildren(obj))
    {
        if (child is T cobj)
        {
            yield return cobj;
        }
        if (child is DependencyObject dobj)
        {
            foreach (var cobj2 in EnumerateDescendantObjects<T>(dobj))
            {
                yield return cobj2;
            }
        }
    }
}
```

以上です。

ではつまらないので少しだけ説明します。

### 補足

まず、ある **`DependencyObject` の論理的な子孫要素は `LogicalTreeHelper.GetChildren(DependencyObject)` メソッドで順次列挙**できます。

**この要素が `T` 型であれば `yield return`** します。

最後に下層を検索するため、 `child` が `DependencyObject` であれば **`EnumerateDescendantObjects` を再帰的に呼び出し**ます。

この場合、 `return EnumerateDescendantObjects<T>(dobj)` としたいところですが、 `yield return` を使っているメソッドでは `return` は書けないので、**さらに `foreach` で回して `yield return`** します。

このあたりは昔の記事にあるので、参考にしてください。

> [C# の yield return で再帰呼び出しを行うには - MSeeeeN](/cs-recursive-call-with-yield-return/)

## 使い方

たとえば `GroupName` が `"hogehoge"` なラジオボタンでを列挙したいときは下記のように書けます。

```cs
var hogehogeRadioButtons = EnumerateDescendantObjects<RadioButton>(this)
    .Where(x => x.GroupName == "hogehoge");
```

さらに「チェックされてるやつ」を取りたいときは一気に下記のように書いていけば、見つかり次第ループも終わるので、検索もそれなりに速いのではなかろうかと思います。

```cs
var checkedHogehogeRadioButton = EnumerateDescendantObjects<RadioButton>(this)
    .Where(x => x.GroupName == "hogehoge" && x.IsChecked == true)
    .FirstOrDefault();
```

なにかのお役に立てば幸いです。
