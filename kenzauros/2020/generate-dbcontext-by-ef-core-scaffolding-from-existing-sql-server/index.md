---
title: EF Core 3.x で既存の SQL Server からスキャフォールディングで DbContext を生成する
date: 2020-05-08
author: kenzauros
tags: [.NET, SQL Server, Entity Framework Core, .NET Core]
---

**既存のデータベースに .NET Core のアプリケーションからアクセスする際、 Entity Framework Core を使いたい**わけですが、いちいち DbContext やモデル定義を書くのも疲れます。

というわけで **EF Core にはデータベースからリバースエンジニアリングして、手軽に (?) DbContext とモデルクラス (エンティティクラス) を生成する**方法が用意されていますので、これを紹介します。

## 前提

- .NET Core SDK 3.1.200
- Entity Framework Core .NET Command-line Tools (dotnet-ef) 3.1.3

そもそも .NET Core SDK がインストールされていない場合は、下記のページからダウしてインストールしてください。

- [Download .NET (Linux, macOS, and Windows)](https://dotnet.microsoft.com/download)

## インストール

### EF Core のインストール

EF Core のコマンドラインツールがインストールされていない場合はグローバルにインストールします。

- [EF Core ツールリファレンス (.NET CLI)-EF Core | Microsoft Docs](https://docs.microsoft.com/ja-jp/ef/core/miscellaneous/cli/dotnet)

```
dotnet tool install --global dotnet-ef
```

### EF Core パッケージのインストール

コマンドプロンプトか PowerShell でプロジェクトフォルダ (`*.csproj` などがあるフォルダ) を開き、スキャフォールディングに必要なパッケージをインストールします。

```
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

インストールされたことを確認します。

```
dotnet restore
dotnet ef
```

もし下記のようなメッセージがでるようであれば、 `%USERPROFILE%\.dotnet\tools` に PATH が通っていない可能性があります。 .NET Core SDK を初めて使用するときであればマシンを再起動したほうがよいようです。

```
指定されたコマンドまたはファイルが見つからなかったため、実行できませんでした。
次のような原因が考えられます:
  * 組み込みの dotnet コマンドのスペルが間違っている。
  * .NET Core プログラムを実行しようとしたが、dotnet-ef が存在しない。
  * グローバル ツールを実行しようとしたが、プレフィックスとして dotnet が付いたこの名前の実行可能ファイルが PATH に見つからなかった。
```

## `dotnet ef` によるスキャフォールディング

`dotnet ef` コマンドがインストールできたら、実際のテーブルから **`dotnet ef dbcontext scaffold` を使ってスキャフォルーティングを実行**します。リファレンスは下記の MS Docs です。

- [リバースエンジニアリング-EF Core | Microsoft Docs](https://docs.microsoft.com/ja-jp/ef/core/managing-schemas/scaffolding)

`dotnet ef dbcontext scaffold` コマンドは下記のような構成になります。

```
dotnet ef dbcontext scaffold "接続文字列" Microsoft.EntityFrameworkCore.SqlServer --table テーブル名 --context-dir DBコンテキストのディレクトリ --output-dir モデルクラスのディレクトリ --context DBコンテキストのクラス名
```

なお、 `dotnet ef` コマンドは引き続きプロジェクトフォルダで実行するか、プロジェクト名を `--project` オプションで指定してください。ソリューションフォルダなど、プロジェクトファイルが存在しなければ下記のようなエラーが表示されます。

```
No project was found. Change the current working directory or use the --project option.
```

### 引数

#### 接続文字列

`dotnet ef dbcontext scaffold` の**第1引数はデータベースへの接続文字列**を指定します。 SQL Server 認証であれば典型的には下記のような文字列です。

```
Data Source=ホスト名かIPアドレス;Initial Catalog=データベース名;User ID=ユーザー名;Password=パスワード
```

詳細は MS Docs を参照してください。

- [接続文字列の構文 - ADO.NET | Microsoft Docs](https://docs.microsoft.com/ja-jp/dotnet/framework/data/adonet/connection-string-syntax)

#### プロバイダー名

`dotnet ef dbcontext scaffold` の**第2引数はプロバイダー名** (プロバイダー ≒ DBMS) です。

**SQL Server の場合は `Microsoft.EntityFrameworkCore.SqlServer`** (追加したパッケージの NuGet パッケージ名) を指定します。

### オプション

#### テーブルの指定

**テーブルを指定しないとデータベースに含まれるすべてのテーブルがスキャフォールディングされます**。

プログラムで一部のテーブルしか必要がない場合は**スキーマ単位かテーブル単位でテーブルを制限**します。

スキーマ単位の場合は **`--schema`** を使用して、 `--schema hoge` のように指定します。

テーブル単位の場合は **`--table`** を使用して、 `--table M_CODE` のように指定します。複数のテーブルを指定する場合は `--table M_CODE --table M_USERS` のように複数回指定します。

なお、異なるスキーマ間に同名のテーブルが存在する場合は、 `--table hoge.M_CODE` のようにスキーマ名も指定すれば、特定のテーブルに限定することができます。ちなみに、テーブル名のみ指定した場合は、存在するテーブル数分クラスが作成されます。

#### 名前の保持

デフォルトではデータベースの命名規則によらず、**モデルクラスが .NET の命名規則に則ったパスカルケースの名前に変換**されます。

たとえば `M_CODE` というテーブル名は `MCode` クラスに、 `GROUP_ID` というカラム名は `GroupId` になります。

```
public partial class MCode
{
    public int GroupId { get; set; }
}
```

データベースで定義されている名前をそのままメンバー名に用いるには **`--use-database-names`** オプションを使用します。リファレンスには「可能な限り」とありますので、 .NET で名前として使用できない場合を除いて、そのままの名前が用いられるようです。 

このオプションを利用すると上記のクラスは下記のようにデータベースと同じ名前になります。

```
public partial class M_CODE
{
    public int GROUP_ID { get; set; }
}
```

#### Fluent API か DataAnnotations

**デフォルトではカラムの属性などは Fluent API を使って表現**されますので、モデルクラス側は非常にシンプルな POCO クラスになります。

モデルクラス
```
public int GroupId { get; set; }
```
DbContext 側に記述された Fluent API
```
entity.Property(e => e.GroupId)
    .HasColumnName("GROUP_ID")
    .HasComment("グループID");
```

**`--data-annotations`** オプションを指定すると **DataAnnotations を使ってモデルクラス側に属性定義**を記述させることもできます。ただし DataAnnotations で表現できない属性は Fluent API で記述されます。

モデルクラス
```
[Key]
[Column("GROUP_ID")]
public int GroupId { get; set; }
```
DbContext 側に記述された Fluent API
```
entity.Property(e => e.GroupId).HasComment("グループID");
```

#### DbContext 名

デフォルトでは**生成される DbContext クラスの名称は `データベース名 + Context`** になります。たとえば `hoge` データベースであれば `hogeContext` クラスになります。

任意の名前にした場合は、 **`--context`** オプションに `--context HogeDbContext` のように指定します。

#### 出力ディレクトリ

デフォルトでは**プロジェクトのルートフォルダに DbContext とモデルクラスが展開**されてしまいます。

**サブディレクトリに格納したい場合は `--output-dir`** オプションで指定します。このサブディレクトリ名は生成されるクラスの名前空間にもなりますので、適切なものを指定します。

DbContext クラスはモデルクラスと同じディレクトリに生成されますが、 DbContext クラスのみ別ディレクトリにしたい場合はさらに `--context-dir` を指定します。




