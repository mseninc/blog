---
title: "[ASP.NET Core] Blazor Preview 9 入門 (EF Core + SQL Server 編)"
date: 2019-09-20
author: kenzauros
tags: [Entity Framework Core, .NET Core, ASP.NET Core, Blazor, .NET]
---

こんにちは、kenzauros です。

> .NET Core 3.0 の正式リリースに伴い、本記事を書き直しましたので、新記事をお読みください。
> [[ASP.NET Core] Blazor Server 入門 (EF Core + SQL Server 編)](/asp-dotnet-core-blazor-ef-core-sqlserver)

[前回](/asp-dotnet-core-blazor-preview9-install/) はインストールとセットアップを行ったので、**今回は Entity Framework Core (EFCore) を使って SQL Server に接続**してみます。

SQLite で始める例も多いですが、今回はより実践的になるよう、**既存のデータベース (SQL Server) に接続**することを想定します。

## 前提

### 環境

[前回](/asp-dotnet-core-blazor-preview9-install/)の続きを想定します。

- Visual Studio Code 1.38.1
    - 拡張機能 [C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp) 1.21.2
    - 拡張機能 [C# XML Documentation Comments](https://marketplace.visualstudio.com/items?itemName=k--kato.docomment) 0.1.8
- .NET Core 3.0.100-preview9-014004
    - Microsoft.AspNetCore.Blazor.Templates 3.0.0-preview9.19424.4
    - Microsoft.EntityFrameworkCore.SqlServer 3.0.0-preview9.19423.6

冒頭に書いたとおり、データベースへの接続と操作には Entity Framework Core (EFCore) を使います。リファレンスは下記のページです。

> - [Entiy Framework Core のインストール | Microsoft Docs](https://docs.microsoft.com/ja-jp/ef/core/get-started/install/)
> - [ASP.NET Core - 既存のデータベース - EF Core の概要 | Microsoft Docs](https://docs.microsoft.com/ja-jp/ef/core/get-started/aspnetcore/existing-db)

### データベース

下記のようなデータベースが既存で存在することを仮定します。

```
- hogehoge データベース
  - dbo スキーマ
    - D_Users テーブル
      - id 列 (integer, PK)
      - name 列 (nvarchar(256))
```

すなわち、下記の SQL で `dbo.D_Users` テーブルの中身が取得できる想定です。

```sql
USE hogehoge;
SELECT id, name FROM dbo.D_Users;
```

以後、データベース構造やテーブルについては、ご自身の環境で読み替えてください。

## 実践

### パッケージのインストール

**`Microsoft.EntityFrameworkCore.SqlServer` をインストール**します。 **Preview 9 のバージョンを指定**することを忘れないようにしてください。

最新のバージョン番号は [NuGet](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.SqlServer) で確認できます。 (執筆時点では `3.0.0-preview9.19423.6`)

前回構築したフォルダー構成のため、 `src` フォルダーを指定していますが、ワークスペース直下にプロジェクトがある場合は `src` 部分の指定は不要です。

```bash
$ dotnet add src package Microsoft.EntityFrameworkCore.SqlServer --version 3.0.0-preview9.19423.6
```

バージョンを指定しないと 2.x 系がインストールされるため注意してください。 ASP.NET Core で動かしているときに古いバージョンの SqlServer パッケージを使うと下記のようなエラーが発生しました。

> Could not load type 'Microsoft.EntityFrameworkCore.Infrastructure.IDbContextOptionsExtensionWithDebugInfo'

EF Core のツールも `Microsoft.EntityFrameworkCore.Tools` でインストールしておきます。

```bash
$ dotnet add src package Microsoft.EntityFrameworkCore.Tools --version 3.0.0-preview9.19423.6
```

### モデルクラスの準備

Users テーブルに対応するモデルとして `User` クラスを作成します。今回は `Data/User.cs` としました。

```cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyFirstBlazorApp.Data
{
    /// <summary>
    /// ユーザー
    /// </summary>
    [Table("D_Users", Schema = "dbo")]
    public class User
    {
        /// <summary>
        /// ID
        /// </summary>
        /// <value></value>
        [Key]
        [Column("id")]
        public string Id { get; set; }
        /// <summary>
        /// Name of the user
        /// </summary>
        /// <value></value>
        [Column("name")]
        public string Name { get; set; }
    }
}
```

このようにモデルと DB の定義名が違う場合は `Table`, `Column` などの**データ注釈**で DB の定義名を指定します。主キー (PK) は `[Key]` で指定しておきます。

なおプログラム上、必要のないカラムは特に定義する必要はありません。

ちなみに**モデルクラスは既存のデータベースから対象のテーブルを指定してリバースエンジニアリングすることも可能**です。

> [モデルのリバース エンジニアリングを行う - ASP.NET Core - 既存のデータベース - EF Core の概要 | Microsoft Docs](https://docs.microsoft.com/ja-jp/ef/core/get-started/aspnetcore/existing-db#reverse-engineer-your-model)

テーブル数が多い場合などは、工数の削減につながりそうです。

### DbContext の準備

`Data/HogehogeDbContext.cs` を作成し、**データベースコンテキスト**を定義します。このあたりは従来の Entity Framework と同様です。

コンテキストのファイル名 (クラス名) は任意でかまいません。

```cs
using Microsoft.EntityFrameworkCore;

namespace MyFirstBlazorApp.Data
{
    public class HogehogeDbContext : DbContext
    {
        public HogehogeDbContext(DbContextOptions<HogehogeDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; }
    }
}
```

`DbSet<T>` で `User` モデルのデータセットを定義すれば、 `context.Users` で `D_Users` テーブルのデータにアクセスできるようになります。

### DB 接続情報の定義

**DB の接続文字列 (ConnectionString)** は `appsettings.json` の `ConnectionStrings` に定義して読み込めますが、今回は開発環境なのでとりあえず `appsettings.Development.json` に定義します。

```js
{
  "ConnectionStrings": {
    "HogehogeConnection": "Data Source=サーバー;Initial Catalog=hogehoge;Persist Security Info=True;User ID=ユーザー;Password=パスワード"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "System": "Information",
      "Microsoft": "Information"
    }
  }
}
```

### データサービスの準備

作った `HogehogeDbContext` を直接ビューから呼び出してもいいのですが、依存関係を減らすため、データサービスを作成します。

Blazor テンプレートで生成される `WeatherForecastService` を真似て作ります。

```cs
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MyFirstBlazorApp.Data
{
    public class HogehogeDataService
    {
        // DbContext being injected by DI
        HogehogeDbContext _Context { get; }

        public HogehogeDataService(HogehogeDbContext context) =>
            _Context = context;

        /// <summary>
        /// Gets the entire user list.
        /// </summary>
        /// <returns></returns>
        public Task<List<User>> GetUsersAsync() =>
            _Context.ShukketsuKubun
                .OrderBy(x => x.Id)
                .ToListAsync();
    }
}
```

ここでは `D_Users` テーブルのデータを単純にすべて取得するだけのメソッドを定義しています。

この `_Context` は DI (依存性注入) により、コンストラクター経由で実際のインスタンスが設定されます。


### サービスの登録

**`Startup` の `ConfigureServices`** で `HogehogeDbContext` と `HogehogeDataService` をサービスとして登録します。

```cs
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MyFirstBlazorApp.Data;

namespace MyFirstBlazorApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<HogehogeDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("HogehogeConnection"),
                    providerOptions => providerOptions.CommandTimeout(120)));
            services.AddRazorPages();
            services.AddServerSideBlazor();
            services.AddScoped<HogehogeDataService>();
        }

        // ～後略～
    }
}
```

`DbContext` を `AddDbContext` で登録する際に `options` (`DbContextOptionsBuilder`) の **`UseSqlServer`** を呼び出して設定ファイルの接続文字列を読み込ませることで、この接続情報を使ったインスタンスが生成されるようになります。

`AddDbContext` の第2引数を省略すると有効期限 (Lifetime) は `Scoped` で登録されます。有効期限の詳細は [サービスの有効期限 - ASP.NET Core での依存関係の挿入](https://docs.microsoft.com/ja-jp/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-2.2#service-lifetimes) を参照してください。

データサービス `HogehogeDataService` も `AddScoped` メソッドでサービスとして登録しておきます。

以上で `HogehogeDataService` を利用する準備が整いました。

### ビュー側で利用する

テンプレートから作成した状態では `Pages/FetchData.razor` では `WeatherForecastService` が使用されているので、 `HogehogeDataService` を利用するように変更します。

```cs
@page "/fetchdata"

@using MyFirstBlazorApp.Data
@inject HogehogeDataService HogehogeData

<h1>Hogehoge Users</h1>

<p>This component demonstrates fetching data from a service.</p>

@if (users == null)
{
    <p><em>Loading...</em></p>
}
else
{
    <table class="table">
        <thead>
            <tr>
                <th>id</th>
                <th>name</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var user in users)
            {
                <tr>
                    <td>@user.Id</td>
                    <td>@user.Name</td>
                </tr>
            }
        </tbody>
    </table>
}

@code {
    Users[] users;

    protected override async Task OnInitializedAsync()
    {
        users = await HogehogeData.GetUsersAsync();
    }
}
```

この状態で F5 (実行) すれば Fetch data ページでユーザーの一覧が表示されるはずです。

## 次の記事

次回は**パスワードなどの秘密情報をリポジトリ外に保存する Secret Manager** を使ってみます。

- [[ASP.NET Core] Blazor 入門 (Secret Manager 編)](/asp-dotnet-core-blazor-secret-manager)
