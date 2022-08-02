---
title: "[ASP.NET Core] Startup の ConfigureServices で実行環境ごとに設定を変えるには"
date: 2020-01-13
author: kenzauros
tags: [C#, ASP.NET Core, .NET]
---

**ASP.NET Core** の `Startup` クラスの `ConfigureServices` メソッドで環境ごとに設定を変える方法をご紹介します。

## 概要

**ASP.NET Core の DI サービスコンテナーを設定するためのメソッドが `Startup.ConfigureServices`** です。

今回、**データ保護の設定を「本番環境だけ」に適用したい**場面がでてきました (データ保護については別記事にまとめます)。環境ごとに違うサービスを利用する場合は、この **`Startup.ConfigureServices` メソッド内で環境を判断**する必要があります。

アプリ自体の設定を行う `Startup.Configure` メソッドには引数に `IWebHostEnvironment` があるので簡単に判定できるのですが、なぜか `ConfigureServices` にはありません。

というわけで、 **`ConfigureServices` メソッド内で環境判定を行う方法**を考えます。

## 方法1: IWebHostEnvironment をインジェクトする

### 説明

一番シンプルな方法です。

**`Startup` のコンストラクターで `IWebHostEnvironment` をインジェクション**で渡し、 `Startup` クラス内の変数で永続化すれば、 OK です。

### ソースコード

実際のソースコードは下記のようになります。シンプルですね。

**`IsProduction`, `IsDevelopment`** といった拡張メソッドによって容易に判定が可能です。

```cs
public class Startup
{
    public Startup(IConfiguration configuration, IWebHostEnvironment env)
    {
        Configuration = configuration;
        _env = env;
    }

    public IConfiguration Configuration { get; }
    private readonly IWebHostEnvironment _env;

    public void ConfigureServices(IServiceCollection services)
    {
        if (_env.IsProduction())
        {
            // 運用環境用の設定
        }
        else if (_env.IsDevelopment())
        {
            // 開発環境用の設定
        }
    }
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // 略
    }
}
```

### 補足

省略していますが、ステージング環境の場合は、同様に `IsStaging` 拡張メソッドで判別できます。


## 方法2: 環境ごとのメソッドを用意する

### 説明

実は ASP.NET Core には `ConfigureServices` メソッドの他に **`Configure<環境名>Services` という名前のメソッドを用意するとその環境のときのみ実行されるという「規約」** があります。

これを利用して、特定の環境向けの設定メソッドを用意しておけば、自動的にそれが実行されます。たとえば **Production のときのみ実行したい場合は `ConfigureProductionServices`** といった具合です。

この場合、方法1のように **`Startup` に `IWebHostEnvironment` をインジェクションする必要がありません**。

### 注意

**メソッドの呼び出しルールに注意が必要**です。 `Startup` クラスの規約は下記のように動作します。

1. 環境ごとのメソッドが見つかった場合はそのメソッド**のみ**が呼ばれる
2. 環境に一致するメソッド名がなければ `ConfigureServices` が呼ばれる

1 が注意点で、たとえば `ConfigureProductionServices` が定義されていると **`ConfigureServices` は呼び出されません**。

このため、**共通の設定は別メソッドで行うことにして `ConfigureProductionServices` などから最後に呼び出す**か、 `ConfigureServices` を手動で呼び出すかする必要があります。

### ソースコード

下記の例では共通の設定は `ConfigureServicesCommon` メソッドに括りだして、環境ごとの設定のあとに呼び出しています。

```cs
public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureProductionServices(IServiceCollection services)
    {
        // 運用環境 (Production) のときのみの設定
        // 共通の設定も行う
        ConfigureServicesCommon(services);
    }

    public void ConfigureServices(IServiceCollection services)
    {
        // 定義外の環境で行う設定
        // 共通の設定も行う
        ConfigureServicesCommon(services);
    }

    private void ConfigureServicesCommon(IServiceCollection services)
    {
        // すべての環境で行う設定
    }

    // ... 後略
}
```

### 補足

上記は Production 用のメソッドでしたが、同様に `ConfigureDevelopmentServices`, `ConfigureStagingServices` が定義できます。いずれも共通設定の呼び出しをお忘れなく。

ちなみに同様の規約で `Configure` メソッドも `ConfigureDevelopment`, `ConfigureStaging`, `ConfigureProduction` を定義することで環境ごとの設定が可能です。

## まとめ

`Startup` クラスの `ConfigureServices` メソッドで環境ごとに設定を変えるには、大きく2つの方法があることを紹介しました。

- 方法1: IWebHostEnvironment をインジェクトする
- 方法2: 環境ごとのメソッドを用意する

方法1のほうがわかりやすいですが、環境ごとの設定が多い場合は `ConfigureServices` が肥大化してしまうので結局別メソッドに切り出すことになりそうです。

そういった意味では、方法2のほうが汎用的ではありますが、環境依存の設定が少ない場合は、少し見通しが悪くなります。ただ、共通設定の呼び出しを忘れないようにするという注意が必要です。

## 参考

- [ASP.NET Core で複数の環境を使用する | Microsoft Docs](https://docs.microsoft.com/ja-jp/aspnet/core/fundamentals/environments?view=aspnetcore-3.1)
