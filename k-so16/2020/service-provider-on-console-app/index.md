---
title: "[.NET Core] コンソールアプリケーションでサービスコンテナからインスタンスを取得する方法"
date: 2020-02-13
author: k-so16
tags: [C#, ASP.NET Core, .NET]
---

こんにちは。最近、約 10 年ぶりくらいに映画館へ行ってきた k-so16 です。広告で興味を持っていた [フォード vs フェラーリ](http://www.foxmovies-jp.com/fordvsferrari/) という映画を [梅田ブルク7](https://tjoy.jp/umeda_burg7) で観てきました。

ASP.NET Core で `DbContext` や `ILogger<T>` のようなインスタンス化の手順が複雑なオブジェクトをサービスクラスや Razor ファイルで利用する場合、 **Dependency Injection** (以下 DI と記述) を利用することで、簡単にインスタンスを取得できます。例えば、サービスクラスのコンストラクタの引数に指定するコンストラクタインジェクションや、 Razor 構文の `@inject` を用いる方法が挙げられます。

コンソールアプリケーションでも ASP.NET の DI のように `DbContext` や `ILogger<T>` などのインスタンスを簡単に生成したいことがあります。本記事では、コンソールアプリケーション上で **インスタンスをサービスコンテナから取得する方法** を紹介します。

本記事で想定する読者層は以下の通りです。

- C# のクラスについての基礎知識を有している
- DI の基礎知識を有している

## ASP.NET Core における DI の設定
コンソールアプリケーションでサービスコンテナを使う手順を説明する前に、 ASP.NET Core におけるサービスコンテナの設定について説明します。

ASP.NET Core では、 `Startup` クラスの `ConfigureServices()` 内でサービスコンテナの設定を行います。サービスコンテナの設定は、 `ConfigureServices()` の引数から受け取る `IServiceCollection` の実装オブジェクトを利用します。

DI で渡すインスタンスを設定するためには、 `IServiceCollection` の実装オブジェクトで以下のいずれかのメソッドを実行します。

- `AddSingleton()`: 最初にサービスコンテナから要求されたタイミングでインスタンスを生成
    - アプリケーション起動中は **常に同じインスタンス** が返される
- `AddScoped()`: クライアントから接続されたタイミングでインスタンスを生成
    - **同一の接続の間は同じインスタンス** が返される
- `AddTransient()`: サービスコンテナから要求されたタイミングでインスタンスを生成
    - **サービスコンテナから要求されるたびに新しいインスタンス** が返される

`DbContext` や `Identity` などの一部のオブジェクトには、 `AddDbContext<TContext>()` や `AddIdentity<TUser, TRole>()` などの DI 設定用のメソッドが利用できます。

例えば、コンストラクタの引数に `HogeDbContext` を受け取る `HogeService` クラスを、クライアントの接続ごとにインスタンスを生成して DI で取得できるように設定するには、 `AddScoped<HogeService>()` を用いて以下のように記述します。

```csharp
public void ConfigureServices(IServiceCollection services)
{
    /* 中略 */
    services.AddDbContext<HogeDbContext>(options =>
        options.UseSqlServer(
            connectionString,
            providerOptions => providerOptions.CommandTimeout(120)));
    services.AddScoped<HogeService>(serviceProvider =>
    {
        var service = new HogeService(
            serivceProvider.GetService<IConfiguration>(),
            serviceProvider.GetService<ILogger<HogeService>()
        );
        return service;
    });
    /* 中略 */
}
```

## サービスコンテナからインスタンスを取得
コンソールアプリケーションでは `ConfigureServices()` は事前に用意されていないので、 **自前でサービスコンテナのインスタンスを生成** する必要があります。サービスコンテナを生成し、インスタンスをサービスコンテナから取得するまでの手順は以下の通りです。

1. `ServiceProvider` のインスタンスを生成
1. `GetService<T>()` によるインスタンスを取得

### `ServiceProvider` の生成
`ServiceProvider` を生成する下準備の手順は次の通りです。

1. `ServiceCollection` のコンストラクタからインスタンスを生成
1. メソッドチェーンでインスタンスの生成方法を指定
1. `BuildServiceProvider()` で `ServiceProvider` のオブジェクトを生成

基本的には、インスタンスの生成手順の設定は ASP.NET Core の `ConfigureServices()` と同じ手順です。相違点は、 `ServiceCollection` をコンストラクタから生成する点と、 `BuildServiceProvider()` メソッドを起動して `ServiceProvider` のインスタンスを生成する点です。

例として、 `ServiceProvider` に `PiyoDbContext` と `PiyoService` を設定する場合を考えます。 `PiyoService` クラスはコンストラクタの引数に `PiyoDbContext` を受け取るものとします。ソースコード例は以下の通りです。

```csharp
new ServiceCollection()
    .AddDbContext<PiyoDbContext>(options =>
        options.UseSqlServer(
            connectionString,
            providerOptions => providerOptions.CommandTimeout(120)))
    .AddScoped<PiyoService>(serviceProvider =>
        new PiyoService(serviceProvider.GetService<PiyoDbContext>()))
    .BuildServiceProvider();
```

### インスタンスの取得
サービスコンテナから目的のインスタンスを取得するためには、 `GetService<T>()` から取得します。例えば、先程の `PiyoService` を取得するためには、次のように記述します。

```csharp
var service = serviceProvider.GetService<PiyoService>();
```

サービスコンテナの設定とインスタンスの取得方法は以下の記事を参考にしました。

> [Using dependency injection in a .Net Core console application](https://andrewlock.net/using-dependency-injection-in-a-net-core-console-application/)

## まとめ
本記事のまとめは以下の通りです。

- インスタンスの生成手順を設定したサービスコンテナを生成
    - `ServiceCollection` のインスタンスを生成
    - `AddScoped<T>()` などのメソッドからインスタンス化の手順を設定
    - `BuildServiceProvider()` で `ServiceProvider` のインスタンスを生成
- `GetService<T>()` でサービスコンテナからインスタンスを取得

以上、 k-so16 でした。 ASP.NET Core のサービスコンテナに少し詳しくなれた気がします(笑)