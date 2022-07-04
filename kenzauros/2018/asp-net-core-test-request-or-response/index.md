---
title: "[ASP.NET Core] コントローラーの単体テストで Request や Response を使ったメソッドをテストする"
date: 2018-12-12
author: kenzauros
tags: [.NET Core, ASP.NET Core, .NET]
---

こんにちは、kenzauros です。

**ASP.NET Core** でコントローラーを単体テストするとき、なにもせずにコントローラーをインスタンス化してしまうと `ControllerContext` が設定されないため、 `Request`, `Response` といった 本来の呼び出しでは設定されるはずのコンテキストプロパティが設定されません。

このため、コントローラー内で `Response` ヘッダーなどを操作していると `NullReferenceException` が発生してしまいます。

```cs
Response.Headers["X-Paging-PageNo"] = page.ToString();
```

> System.NullReferenceException: Object reference not set to an instance of an object.

これを防ぎ、適切にヘッダー等を設定しつつテストする方法を紹介します。

## ControllerContext.HttpContext に DefaultHttpContext を設定

基本的にはコントローラーをインスタンス化したあと **`ControllerContext`** を作成し、 **`HttpContext`** プロパティに **`DefaultHttpContext`** を設定すれば OK です。

テストクラス内に下記のようなコントローラーを生成するメソッドを用意しておくとよいと思います。

```cs
private HogehogeController CreateController() => new HogehogeController()
    {
        ControllerContext = new ControllerContext
        {
            HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext(),
        },
    };
```

## 参考

- [DefaultHttpContext Class (Microsoft.AspNetCore.Http) | Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.defaulthttpcontext?view=aspnetcore-2.1)
