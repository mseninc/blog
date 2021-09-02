---
title: "[ASP.NET Core] Configuration で設定ファイルから独自クラスに設定を読み込む"
date: 2020-01-29
author: kenzauros
tags: [.NET Core, ASP.NET Core, .NET]
---

**.NET Core** や **ASP.NET Core** で設定ファイルから設定を読み込むには **`IConfiguration`** (Microsoft.Extensions.Configuration) を利用します。

この `IConfiguration` は .NET Core でアプリを作る上ではかなり使えますので、ぜひご利用ください。

今回は**基本的な設定の読み込み方に加え、独自の設定用クラスに設定を読み込む方法**を紹介します。

## 前提

- .NET Core 3.1
- 例として下記のような設定ファイル `appsettings.json` を読み込む想定です。
```js
{
  "BathSalt": "登別温泉",
  "Timeout": 1000,
  "DatabaseSettings": {
    "Host": "umauma",
    "Port": "8080"
  }
}
```

## 基本

ASP.NET Core では `CreateDefaultBuilder` で暗黙的に `IConfiguration` が初期化され、 `Startup` にインジェクションされますので、あえて読み込みを書く必要はありません。

素の **.NET Core でも `ConfigurationBuilder` を利用することで簡単に設定を読み込むことができます**。

もっとも利用頻度が高いのは JSON ファイルから読み込む方法だと思います。たとえば下記のコードで `appsettings.json` から設定を読み込む `IConfiguration` を作成できます。

```cs
// Configuration の作成
var builder = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false)
var configuration = builder.Build();
```

ここで、 設定ファイルの `BathSalt` のような**文字列値を読み込むときには下記のように `GetValue` メソッド**を利用します。

```cs
var bathSalt = configuration.GetValue("BathSalt", "草津温泉");
```

2つ目の引数は設定されていなかったときのデフォルト値が指定できます。 (省略可能です)

ちなみに**文字列値以外を読み込む場合は `GetValue<T>` メソッド** を利用します。

```cs
var timeout = configuration.GetValue<int>("Timeout", 123);
```

## ネストされた設定

次に `DatabaseSettings` の**下層の設定を読み込みたいときは下記のように `GetSection` メソッド**を使い、1階層下ったあとに `GetValue` メソッドを呼びます。

```cs
var databaseHost = configuration.GetSection("DatabaseSettings").GetValue("Host");
```

けっこう簡単ですね。

しかし、下層の設定が増えてきたときは毎回こう書くのも大変ですし、変数がやたらと増えてしまいます。

## 独自クラスへの読み込み

というわけで、下記のような適当な自前のクラスを作ります。

```cs
public class DatabaseSettings
{
    public string Host { get; set; }
    public int Port { get; set; }
}
```

そして、 **`GetSection` で得られたセクションに `Get<T>` メソッドを使う**ことで、このインスタンスに値を読み込みます。

```cs
var databaseSettings = configuration.GetSection("DatabaseSettings").Get<DatabaseSettings>();
// databaseSettings.Host will be "umauma"
// databaseSettings.Port will be 8080
```

以上です。シンプルでわかりやすいですね。 `Get<T>` メソッドを呼び出すだけでイイ感じに設定値を独自クラスのインスタンスに設定して返してくれます。

それぞれの型も変換可能であれば、それぞれに応じて読み込んでくれます。 (変換に失敗すると `InvalidOperationException` が発生します)

ちなみにこのコードは下記のコードと同義ですが、単一式で書ける前者のほうがいいですね。

```
var databaseSettings = new DatabaseSettings();
configuration.GetSection("DatabaseSettings").Bind(databaseSettings);
// databaseSettings.Host will be "umauma"
// databaseSettings.Port will be 8080
```

なお、セクション名をクラス名と合わせておけば、 `nameof` 演算子を使えるので、下記のようにすれば完璧ですね。

```cs
var databaseSettings = configuration.GetSection(nameof(DatabaseSettings)).Get<DatabaseSettings>();
```

## 複雑な設定クラスにも対応できる

さきほどは下層の単純な設定のみを `Get<T>` メソッドで読み込みましたが、**設定ファイル全体を独自クラスに定義して読み込む**ことも可能です。

たとえば追加で下記のような設定のモデルクラスを用意すれば

```cs
public class AppSettings
{
    public string BathSalt { get; set; }
    public int Timeout { get; set; }
    public DatabaseSettings DatabaseSettings { get; set; }
}
```

`configuration` の `Get<T>` メソッドを呼ぶだけでネストされた `DatabaseSettings` の値までまとめて読み込むことができます。

```cs
var mySettings = configuration.Get<AppSettings>();
// mySettings.BathSalt will be "登別温泉"
// mySettings.Timeout will be 1000
// mySettings.DatabaseSettings.Host will be "umauma"
// mySettings.DatabaseSettings.Port will be 8080
```

単純な POCO (Plain Old CLR Object) クラスで設定を読み込んで扱えるというのはすばらしいですね。

このときたとえば設定ファイルの `"Timeout"` に相当する `Timeout` プロパティが POCO 側に存在しなくても無視されるだけで正常に動作します。これにより、**スコープに応じて必要な設定キーだけを含む設定クラスを用意することができます**。

## 参考

- [ASP.NET Core の構成 | Microsoft Docs](https://docs.microsoft.com/ja-jp/aspnet/core/fundamentals/configuration/?view=aspnetcore-3.1)