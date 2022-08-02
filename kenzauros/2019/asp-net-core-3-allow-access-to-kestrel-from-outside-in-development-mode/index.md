---
title: "[ASP.NET Core 3.0] 開発環境 (Kestrel) で localhost 以外からのアクセスを許可する"
date: 2019-10-29
author: kenzauros
tags: [.NET Core, ASP.NET Core, .NET]
---

こんにちは、kenzauros です。

Web アプリを開発していると、自機だけでなく、たとえばスマホから開発環境で起動している Web サーバーへ接続したくなることがあります。

今回は **ASP.NET Core の Kestrel (組み込みの Web サーバー) で自分のマシン (localhost) 以外からサイトにアクセスする方法**を紹介します。

## 前提条件

- .NET Core 3.0
- 開発環境のみ (Development モード) のみで適用したい
- ファイアウォールで対象ポートは解放済み (今回は TCP 5000-5001)

## 方法

### 開発環境の設定ファイルに urls を指定

結論から言えば、 **`appsettings.Development.json` に下記のように `urls` を指定**するだけです。

```js
{
  "urls": "http://*:5000;https://*:5001",
  ～略～
}
```

この状態で `dotnet run` すれば下記のように http は 5000 ポート, https は 5001 ポートでホストされます。ホスト名の部分が `[::]` となっており、ホスト名に関わらず待ち受けるようになります。

```
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://[::]:5000
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: https://[::]:5001
```

### 仕組み

なぜこれだけで実現できるのでしょうか。簡単に仕組みを説明します。

まず、リファレンスによれば、エンドポイントを指定する方法は 4 つあります。

> Specify URLs using the:
> * `UseUrls`
> * `--urls` command-line argument
> * `urls` host configuration key
> * `ASPNETCORE_URLS` environment variable
>
> [ASP.NET Core への Kestrel Web サーバーの実装 | Microsoft Docs](https://docs.microsoft.com/ja-jp/aspnet/core/fundamentals/servers/kestrel?view=aspnetcore-3.0#endpoint-configuration)

今回はこの 3 番目にある 「`urls` ホスト構成 (`urls` host configuration key)」を使っています。

.NET Core 3.0 の環境ではデフォルトの `Program.cs` の `CreateHostBuilder` で `IHostBuilder .ConfigureWebHostDefaults` が呼ばれており、環境ごとの設定ファイルが自動的にロードされます。

つまり `appsettings.Development.json` (`appsettings.json` を含む) に `urls` を指定すれば、ホスト構成として `urls` が読み込まれ、 Kestrel の起動時に設定として渡されるということです。

### その他の方法

リファレンスにもあるとおり、上記 1 番目の `UseUrls` を使う方法はもっともポピュラーであり、いろいろなサイトで紹介されています。指定としても直接的なのでわかりやすいです。

この場合、下記のような書き方になります。

```cs
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
            webBuilder.UseUrls("http://*:5000;https://*:5001");
        });
```

ただ、このままだと開発環境以外にも適用されてしまいますし、変更するたびにコミットしなければなりません。

環境ごとの切り替え、ソースコードに記述しなくてよいことを踏まえると今のところ `appsettings.Development.json` への `urls` 指定が一番よいのではないかと思っています。

## 参考

- [ASP.NET CoreのWebApplicationを外部公開 - Qiita](https://qiita.com/husky774rr/items/256609e9d126653274f0)
- [ASP.NET Core の Web ホスト | Microsoft Docs](https://docs.microsoft.com/ja-jp/aspnet/core/fundamentals/host/web-host?view=aspnetcore-3.0)
