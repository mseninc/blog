---
title: "[.NET Core] VS Code を使った xUnit ユニットテストの導入"
date: 2019-10-17
author: kenzauros
tags: [ユニットテスト, .NET Core, xUnit, .NET]
---

VS Code で **xUnit を使ったテストプロジェクトを追加して、テストを実行**してみます。

### 概要

**環境は下記の通り .NET Core 3.0 がインストールされた状態**です。

- Visual Studio Code 1.39.1
- .NET Core 3.0 (SDK 3.0.100)

ソリューションは [Blazor Server 入門記事](https://mseeeen.msen.jp/asp-dotnet-core-blazor-install) で Blazor アプリのプロジェクトを src フォルダ以下に作成した状態とします。

Blazor でなくとも .NET Core アプリのプロジェクトであればなんでもかまいません。

```
my-first-blazor-app/
└ src/
  └ MyFirstBlazorApp.csproj
```

ここに下記のようにテストプロジェクトを追加します。

```
my-first-blazor-app/
├ src/
│ └ MyFirstBlazorApp.csproj
└ test/
  ├ MyFirstBlazorApp.Test.csproj
　└ UnitTest1.cs
```

### テストプロジェクトの作成

**xUnit のプロジェクトテンプレート**は .NET Core の SDK にデフォルトで含まれていますので `xunit` という名前で利用することができます。

まず、 **`dotnet new` コマンドで `xunit` のプロジェクトを作成**します。今回はフォルダとプロジェクト名を指定するため `-o` オプションと `-n` オプションをつけています。

```bash
$ dotnet new xunit -o test -n MyFirstBlazorApp.Test
The template "xUnit Test Project" was created successfully.

Processing post-creation actions...
Running 'dotnet restore' on test\MyFirstBlazorApp.Test.csproj...
  C:\Repos\my-first-blazor-app\test\MyFirstBlazorApp.Test.csproj の復元が 893.27 ms で完了しました。

Restore succeeded.
```

Restore succeeded と表示されれば OK です。

**test フォルダに移動し、テスト対象のプロジェクトへの参照を追加**します。

```bash
$ cd test
$ dotnet add reference ../src/MyFirstBlazorApp.csproj
```

プロジェクトファイル (`test\MyFirstBlazorApp.Test.csproj`) は下記のようになります。

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>netcoreapp3.0</TargetFramework>

    <IsPackable>false</IsPackable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="16.2.0" />
    <PackageReference Include="xunit" Version="2.4.0" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.4.0" />
    <PackageReference Include="coverlet.collector" Version="1.0.1" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\src\MyFirstBlazorApp.csproj" />
  </ItemGroup>

</Project>
```

### テスト実行

test フォルダには **`UnitTest1.cs` が既定で作成**されていますので、最初はこれを編集してテストを実装してみます。

とりあえず `UnitTest1.Test1` が確実に失敗するよう `Assert.True(false);` とでも書いておきます。

```cs
using System;
using Xunit;

namespace MyFirstBlazorApp.Test
{
    public class UnitTest1
    {
        [Fact]
        public void Test1()
        {
            Assert.True(false);
        }
    }
}
```

ここで **`[Fact]` が xUnit においてテストケースを表す属性**です。もう少し複雑なテストの場合は `[Theory]` 属性を指定しますが、そのあたりは別の記事にします。

編集できたらテストを実行してみます。**テストフォルダで `dotnet test` コマンドを実行**します。

```bash
$ cd test
$ dotnet test

C:\Repos\my-first-blazor-app\test\bin\Debug\netcoreapp3.0\MyFirstBlazorApp.Test.dll(.NETCoreApp,Version=v3.0) のテスト実行
Microsoft (R) Test Execution Command Line Tool Version 16.3.0
Copyright (c) Microsoft Corporation.  All rights reserved.

テスト実行を開始しています。お待ちください...

合計 1 個のテスト ファイルが指定されたパターンと一致しました。

[xUnit.net 00:00:01.19]     MyFirstBlazorApp.Test.UnitTest1.Test1 [FAIL]

  X MyFirstBlazorApp.Test.UnitTest1.Test1 [5ms]
  エラー メッセージ:
   Assert.True() Failure
Expected: True
Actual:   False
  スタック トレース:
     at MyFirstBlazorApp.Test.UnitTest1.Test1() in C:\Repos\my-first-blazor-app\test\UnitTest1.cs:line 11


テストの実行に失敗しました。
テストの合計数: 1
     失敗: 1
合計時間: 2.2081 秒
```

無事失敗したことが確認できます。当然ながら `Assert.True(false);` を `Assert.True(true);` とすると成功します。

### 詳細な実行結果の表示

`dotnet test` だけだと簡潔なテスト結果しか表示されないため、テスト中のログやテストケースの一覧を表示するには下記のようなオプションを指定します。

```bash
dotnet test --logger:"console;verbosity=detailed"
```

こうすると下記のように詳細な結果が表示されます。

```bash
$ dotnet test --logger:"console;verbosity=detailed"
C:\Repos\my-first-blazor-app\test\bin\Debug\netcoreapp3.0\MyFirstBlazorApp.Test.dll(.NETCoreApp,Version=v3.0) のテスト実行
Microsoft (R) Test Execution Command Line Tool Version 16.3.0
Copyright (c) Microsoft Corporation.  All rights reserved.

テスト実行を開始しています。お待ちください...

合計 1 個のテスト ファイルが指定されたパターンと一致しました。
C:\Repos\my-first-blazor-app\test\bin\Debug\netcoreapp3.0\MyFirstBlazorApp.Test.dll

[xUnit.net 00:00:00.00] xUnit.net VSTest Adapter v2.4.0 (64-bit .NET Core 3.0.0)
[xUnit.net 00:00:01.07]   Discovering: MyFirstBlazorApp.Test
[xUnit.net 00:00:01.13]   Discovered:  MyFirstBlazorApp.Test
[xUnit.net 00:00:01.14]   Starting:    MyFirstBlazorApp.Test
[xUnit.net 00:00:01.25]     MyFirstBlazorApp.Test.UnitTest1.Test1 [FAIL]
[xUnit.net 00:00:01.25]       Assert.True() Failure
[xUnit.net 00:00:01.25]       Expected: True
[xUnit.net 00:00:01.25]       Actual:   False
[xUnit.net 00:00:01.25]       Stack Trace:
[xUnit.net 00:00:01.25]         C:\Repos\my-first-blazor-app\test\UnitTest1.cs(11,0): at MyFirstBlazorApp.Test.UnitTest1.Test1()
[xUnit.net 00:00:01.26]   Finished:    MyFirstBlazorApp.Test

  X MyFirstBlazorApp.Test.UnitTest1.Test1 [5ms]
  エラー メッセージ:
   Assert.True() Failure
Expected: True
Actual:   False
  スタック トレース:
     at MyFirstBlazorApp.Test.UnitTest1.Test1() in C:\Repos\my-first-blazor-app\test\UnitTest1.cs:line 11


テストの実行に失敗しました。
テストの合計数: 1
     失敗: 1
合計時間: 2.3682 秒
```

`--logger` オプションの詳細は下記を参照してください。

- [vstest-docs/report.md at master · microsoft/vstest-docs](https://aka.ms/vstest-report)

`verbosity` には `quiet`, `minimal`, `normal`, `detailed` の 4 種類が指定できます。

ちなみにこのドキュメントには `dotnet test` の `-v` オプションでも同様の指定となると書いてありますが、私の環境で実行した限りは `-v` オプションでは MSBuild のビルドログも冗長になってしまい、逆に見にくくなってしまいました。 `--logger` オプション内で指定するほうはテストログだけが冗長になりますので、こちらのほうがよいと思います。

### VS Code タスクの設定

VS Code のターミナルでコマンドを叩くのもよいですが、せっかくなので **VS Code のタスク機能からテストを実行**できるようにしてみます。

すでに VS Code で .NET Core をデバッグしている場合は **`.vscode/tasks.json`** が存在しているはずなので、これを開きます。なければ作成します。

`tasks.json` には既にビルド・デバッグ用のコマンドがいくつか定義されているはずなので、 `"tasks"` の最後に `test` タスクを追加します。

基本的には他のタスクと同様 `dotnet` コマンドの実行です。 `args` パラメーターを利用して先述の `test --logger:"console;verbosity=detailed"` を指定します。

```js
{
    "version": "2.0.0",
    "tasks": [
        ～中略～
        {
            "label": "test",
            "command": "dotnet",
            "type": "shell",
            "group": "test",
            "args": [
                "test",
                "test/MyFirstBlazorApp.Test.csproj",
                "--logger:\"console;verbosity=detailed\""
            ],
            "presentation": {
                "reveal": "silent"
            },
            "problemMatcher": "$msCompile"
        }
    ]
}
```

これで**コマンドパレット (Ctrl + Shift + P) から [Tasks: Run Tasks] を選択し、label で指定した `test` を選べば、タスク用のターミナルが起動し、テストが実行**されます。

これでテストプロジェクトの導入は完了です。
