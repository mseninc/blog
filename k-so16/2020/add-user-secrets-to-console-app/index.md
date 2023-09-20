---
title: "[.NET Core] コンソールアプリケーションで Secret Manager を使う方法"
date: 2020-02-24
author: k-so16
tags: [C#, .NET Core, .NET]
---

こんにちは。最近、 [オタマトーン](https://otamatone.jp/lineup/otamatone/) を購入した k-so16 です。ヴァイオリンやチェロなどの弦楽器同様フレットがないので、正確に音階を鳴らすのもなかなか難しいです（笑）

C# でコンソールアプリケーションからデータベースにアクセスするには、 ASP.NET Core 同様に `DbContext` クラス経由で実現できます。その際には接続文字列が必要になりますが、 Git などでバージョン管理することを考えると、直接ソースコードに書くのではなく、 **Secret Manager** から参照したいところです。

本記事では、コンソールアプリケーションから Secret Manager を利用する方法を紹介します。

本記事で想定する読者層は以下の通りです。

- Secret Manager について基礎知識を有している

## シークレットの読み込み
ASP.NET Core では自動的に Secret Manager が利用できるように設定されるので、自前で設定を記述する必要はありません。一方、コンソールアプリケーションで Secret Manager を扱う場合には、 `Configuration` クラスの **`AddUserSecrets<T>()`** を自前で実行する必要があります。

コンソールアプリケーションでシークレットを読み込む手順は以下の通りです。

1. `ConfigurationBuilder` のインスタンスを生成
1. `AddUserSecrets<T>()` を実行
1. `Build()` で `Configuration` のインスタンスを返却

`Main()` を含むクラス `Program` においてシークレットを読み込むプログラム例は以下の通りです。

```csharp:title=コンソールアプリケーションでシークレットを読み込むコード例
class Program
{
    static void Main(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .AddUserSecrets<Program>()
            .Build();
    }
}
```

## シークレットの参照
読み込んだシークレットを参照するためには、上記の手順で取得した `Configuration` のインスタンスを用いて、 **`GetValue()`** などの設定値を取得するメソッドを実行します。 Secret Manager から **接続文字列として読み込む** 場合は、 **`GetConnectionString()`** が利用できます。

接続文字列をシークレットから取得するプログラム例は以下の通りです。
```csharp
class Program
{
    static void Main(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .AddUserSecrets<Program>()
            .Build();
        var connectionString = configuration.GetConnectionString("ConnectionString");
    }
}
```

コンソールアプリケーションで Secret Manager を利用する方法について、以下のページを参考にしました。

> [How to get 'Manage User Secrets' in a .NET Core console-application? - Stack Overflow](https://stackoverflow.com/questions/42268265/how-to-get-manage-user-secrets-in-a-net-core-console-application)

## まとめ
本記事のまとめは以下の通りです。

- Secret Manager のシークレットを読み込むためには `AddUserSecrets<T>()` を利用
- Secret Manager のシークレットを参照するためには `GetValue()` を利用
    - 接続文字列として読み込む場合は `GetConnectionString()` が利用可能

以上、 k-so16 でした。 ASP.NET Core の知識をコンソールアプリケーションにも利用できるのは便利ですね。