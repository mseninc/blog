---
title: "[Entity Framework Core] ExecuteSqlRaw で更新された内容を取得する方法"
date: 2020-01-20
author: k-so16
tags: [C#, Entity Framework Core, .NET]
---

こんにちは。最近、自作 PC のメモリを 8GB から 16GB に増設するか迷っている k-so16 です。メモリの規格が DDR3 なので、増設かマシン一式新調か悩ましいところです。

Entity Framework Core 3.0 (以降 EF Core 3.0 と表記) で生 SQL を用いてテーブルの更新した後に再度テーブルのデータを取得すると、更新内容が反映されておらず、なぜだろうと頭を悩ませていました。

EF Core 3.0 の OR マッパー (以下 ORM と表記) の機能である変更追跡が有効になっており、 **変更前の状態が保持されたまま** になっていることが原因でした。本記事のケースでは、 `ExecuteSqlRaw()` で **生 SQL を直接実行してデータを更新する** という限られた条件下だったので、 **変更追跡を無効化** することにしました。

本記事では、 EF Core 3.0 で変更追跡を無効化する方法を紹介します。

本記事の想定する読者層は以下の通りです。

- EF Core 3.0 の ORM について基礎的な知識を有している
- EF Core 3.0 の生 SQL の実行方法について知っている

## EF Core の変更追跡機能
EF Core 3.0 の ORM では、 **エンティティに対する変更を追跡して変更差分を保持** し、 `SaveChanged()` が実行された段階でデータベースに変更内容が反映されます。エンティティの内容が変更されると、変更追跡の機能によって、その都度変更内容を差分として保持します。

```csharp
var article = context.Blogs
    .FirstOrDefault(b => b.BlogId == 1);
article.Rating = 5; // 取得したモデルのプロパティを更新
context.SaveChanges(); // この文が実行されてデータベースに変更が反映される
```

一方、生 SQL から変更を行うと、 ORM からエンティティを操作しないので、 **変更内容が追跡できません** 。変更追跡を有効化した状態で生 SQL を用いてデータベースを更新すると、保持されている更新前のデータが利用されます。本記事のように、 `ExecuteSqlRaw()` によって生 SQL でデータを更新し、その前後でデータを取得する場合、データベースの変更は即座に反映されますが、プログラム側では EF Core が保持する変更前のデータが利用されるので、更新内容が反映されていないように見えます。

変更追跡の無効化は、基本的に **読み取り専用** の場合にのみ利用できます。読み取りしか行わない場合は変更追跡を無効化することで処理をより高速化できるメリットがありますが、 ORM による操作でデータを更新する場合、変更追跡を無効化すると、エンティティの変更内容を保持することができず、 **更新内容が反映されない** おそれがあるので、注意が必要です。

EF Core 3.0 の変更追跡について、 Microsoft の公式ページに詳細な説明が記載されています。

> [追跡と追跡なしのクエリ - EF Core | Microsoft Docs](https://docs.microsoft.com/ja-jp/ef/core/querying/tracking)

## 変更追跡を無効化する方法
EF Core 3.0 で変更追跡を無効化する方法として、 **個別の SQL の実行に対して無効化** する方法と、 **コンテキスト全体を通して無効化** する方法があります。

### 個別のクエリの実行に対する変更追跡の無効化
更新前のデータを取得する処理に **`AsNoTraking()`** を追加することで、そのクエリの実行結果の変更追跡を防ぐことができます。 `AsNoTracking()` はメソッドチェーンで `FromSqlRaw()` に繋げることができます。

```cs:title=変更追跡の無効化
_Context.Books
    .FromSqlRaw("SELECT ID AS Id, TITLE AS Title FROM books")
    .AsNoTracking()
    .ToListAsync(); 
```

### コンテキスト全体に対する変更追跡の無効化
コンテキスト全般で変更追跡を防ぎたい場合、 `DbContext` インスタンスの `ChangeTracker.QueryTrackingBehavior` プロパティに **`QueryTrackingBehavior.NoTraking`** を代入します。本記事の場合のように、コンテキスト全体で ORM から変更しないような場合や、コンテキストの読み取りにしか使わない場合に便利です。

```csharp
public HogeService(IHogeDbContext context)
{
    _Context = context;
    _Context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking
}
```

## まとめ
本記事のまとめは以下の通りです。

- EF Core 3.0 で生 SQL から直接更新した後のデータを取得するためには変更追跡を無効化
    - 個別の SQL に対しては `AsNoTracking()` を利用
    - コンテキスト全体に対しては `QueryTrackingBehavior.NoTracking` プロパティを `DbContext` に設定

以上、 k-so16 でした。本記事が同様の問題を抱えている方々の助けになることを願います。