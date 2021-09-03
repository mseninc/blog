---
title: "[ASP.NET Core] Blazor 入門 (Secret Manager 編)"
date: 2019-09-23
author: kenzauros
tags: [Entity Framework Core, .NET Core, ASP.NET Core, Blazor, .NET]
---

[前回](/asp-dotnet-core-blazor-preview9-ef-core-sqlserver/) で EF Core を使い、 Blazor からデータベースへアクセスできることを確認しました。

今回は**開発時にパスワードなどの秘密情報を開発者ごとに保存しておく Secret Manager** を使用してみます。

## 概要

前回は話を簡単にするため、 `appsettings.Development.json` に DB の接続文字列を直接記述しました。

この方法の一番の問題は 「`appsettings.Development.json` がソースコード管理対象であるため、**誤ってコミットしてしまうと秘密情報が晒されてしまう**」ということです。

そこで開発環境については **Secret Manager** という ASP.NET Core のツールを利用することにします。

> [Safe storage of app secrets in development in ASP.NET Core | Microsoft Docs](https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-2.2&tabs=windows)

(日本語版は機械翻訳で意味不明なので英語版のほうがいいと思います)

運用環境、特に Azure の場合は [Azure Key Vault](https://docs.microsoft.com/ja-jp/aspnet/core/security/key-vault-configuration?view=aspnetcore-2.2) を利用するのがよいようですが、今回は評価できていません。

## 前提

### 環境

[前々回](/asp-dotnet-core-blazor-preview9-install/), [前回](/asp-dotnet-core-blazor-preview9-ef-core-sqlserver/)の続きを想定します。

- Visual Studio Code 1.38.1
    - 拡張機能 [C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) 1.21.2
    - 拡張機能 [C# XML Documentation Comments](https://marketplace.visualstudio.com/items?itemName=k--kato.docomment) 0.1.8
- .NET Core 3.0.100-preview9-014004
    - Microsoft.AspNetCore.Blazor.Templates 3.0.0-preview9.19424.4
    - Microsoft.EntityFrameworkCore.SqlServer 3.0.0-preview9.19423.6

## Secret Manager の概要

**Secret Manager** は `dotnet` コマンドに含まれるツールの一つで、別途インストールする必要はありません。

Secret Manager は**下記のユーザー領域に `secrets.json` というファイル名でシークレットを保存**します。

```
%APPDATA%\Microsoft\UserSecrets\<user_secrets_id>\secrets.json
```

`%APPDATA%` は通常 `C:\Users\<ユーザー名>\AppData` を表します。 `user_secrets_id` はプロジェクト名と `.csproj` に記載された `<UserSecretsId>` を結合した `aspnet-MyFirstBlazorApp-3DC7D338-009A-4C64-A037-E62FC9CAF464` のようなフォルダー名になります。

このため、**シークレットはプロジェクトごとに分けて管理されます**。

なお、 **`secrets.json` は単にシークレットが Key-Value 形式で列挙されただけの JSON で、現状では暗号化されません。**将来的には暗号化もできるようになるかも、とのことです。

## 実践

### 設定ファイルから接続文字列を削除

前回 `appsettings.Development.json` に追加した接続文字列が残っている場合は削除しておきます。

### 初期化

ユーザーシークレットを利用するにはプロジェクトファイルに `UserSecretsId` を生成しておく必要がありますので **`dotnet user-secrets init`** で初期化します。

```bash
$ dotnet user-secrets init --p src
```

今回の環境では `src` フォルダー以下にプロジェクトがありますので、 `-p` オプションでプロジェクトのフォルダーを指定しています。ワークスペース直下のときは不要です。

ちなみに `UserSecretsId` が生成されていない状態で保存しようとすると下記のようなエラーが発生します。

> Could not find the global property 'UserSecretsId' in MSBuild project 'プロジェクトファイル'. Ensure this property is set in the project or use the '--id' command line option.

### シークレットの保存

では早速、前回の接続文字列をシークレットに保存してみます。**保存するには `dotnet user-secrets set`** を使用します。

```bash
$ dotnet user-secrets set -p src "ConnectionStrings:HogehogeConnection" "Data Source=サーバー;Initial Catalog=hogehoge;Persist Security Info=True;User ID=ユーザー;Password=パスワード"
```

今回は接続文字列なのでキーを `ConnectionStrings:HogehogeConnection` のような形にしていますが、キー名は `HogeApiKey` や `MyPassword` など自由に設定することができます。接続文字列のキーについては後述します。

`Successfully saved` となっていれば OK です。実際に `%APPDATA%\Microsoft\UserSecrets\<user_secrets_id>\secrets.json` を確認してみると下記のように追加されているはずです。

```js
{
  "ConnectionStrings:HogehogeConnection": "Data Source=サーバー;Initial Catalog=hogehoge;Persist Security Info=True;User ID=ユーザー;Password=パスワード"
}
```

### シークレットの確認

保存されたシークレットの一覧をコマンドから確認するには下記のコマンドを叩きます。

```bash
$ dotnet user-secrets list -p src
ConnectionStrings:HogehogeConnection = Data Source=サーバー;Initial Catalog=hogehoge;Persist Security Info=True;User ID=ユーザー;Password=パスワード
```

### シークレットへのアクセス準備

ソースコードからシークレットへアクセスするには **[AddUserSecrets メソッド](https://docs.microsoft.com/ja-jp/dotnet/api/microsoft.extensions.configuration.usersecretsconfigurationextensions.addusersecrets?view=aspnetcore-2.2)** が呼び出されている必要があります。

ただし、 `Program.CreateHostBuilder` で `WebHost.CreateDefaultBuilder` が呼ばれている場合は、内部的に `AddUserSecrets` を呼び出されますので、 `AddUserSecrets` メソッドの明示的な呼び出しは不要です。 (`Development` モードのときのみ)

※Blazor テンプレートからセットアップした場合、下記のように `Program.CreateHostBuilder` で `Host.CreateDefaultBuilder` が呼ばれています。

```cs
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        });
```

### シークレットの取得

**シークレットは `appsettings.json` の他の設定と同様に `Configuration` API で取得**することができます。

たとえばさきほど保存した `ConnectionStrings:HogehogeConnection` を取得するには下記のようにします。

```cs
var connStr = Configuration["ConnectionStrings:HogehogeConnection"];
```

これでもよいですが、 **`ConnectionStrings` については特別に `Configuration.GetConnectionString(string key)` でも取得可能**です。

```cs
var connStr = Configuration.GetConnectionString("HogehogeConnection");
```

このため `StartUp.ConfigureServices` の `UseSqlServer` で指定する場合、前回のソースコードのままで OK です。

```cs
services.AddDbContext<HogehogeDbContext>(options =>
    options.UseSqlServer(
        Configuration.GetConnectionString("HogehogeConnection"),
        providerOptions => providerOptions.CommandTimeout(120)));
```

ということで、この状態でプログラムを実行すると前回どおりプログラムが動作するはずです。

**プログラム側は書き換えることなく、秘密情報を設定ファイルから消し去ることができました**。

### シークレットの上書き

一度保存したシークレットを書き換える場合は保存時と同様に `dotnet user-secrets set` を呼び出します。

### シークレットの削除

シークレットの削除も極めてシンプルで、キーを指定して `remove` を実行するだけです。

```bash
$ dotnet user-secrets remove -p src "ConnectionStrings:HogehogeConnection"
```

すべてのシークレットを削除するには `clear` を使います。

```bash
$ dotnet user-secrets clear
```

以上で Secret Manager の基本的な使い方を学習できました。とりあえず開発環境についてはこの方法でなんら問題なさそうです。

今後のアップデートで暗号化も可能になることを期待しましょう。