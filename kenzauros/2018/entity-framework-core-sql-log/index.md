---
title: "[EFCore] Entity Framework Core で SQL のログを出力する"
date: 2018-10-29
author: kenzauros
tags: [Entity Framework Core, .NET Core, .NET]
---

こんにちは、kenzauros です。

**Entity Framework Core (EF Core)** で SQL をログとして出力させるには Entity Framework の `context.Database.Log` のように簡単にはいきません。

`ILoggerProvider` を継承したクラスをもつ **`ILoggerFactory` を `DbContext` に設定**してやる必要があります。

詳細は [EF Core のログ記録 | Microsoft Docs](https://docs.microsoft.com/ja-jp/ef/core/miscellaneous/logging) に記載されていますので併せて参照してください。

## LoggerFactory をコンテキスト内に静的に用意

基本的には `LoggerFactory` を読み取り専用の静的変数で保持し、 `ILoggerProvider` の配列を設定します。

### コンソールに出力するとき

コンソールに出力するときは `Microsoft.Extensions.Logging.Console.ConsoleLoggerProvider` を使用します。

```cs
public static readonly LoggerFactory LoggerFactory = new LoggerFactory(new[] {
    new ConsoleLoggerProvider((category, level)
        => category == DbLoggerCategory.Database.Command.Name && level == LogLevel.Information, true)
});
```

このとき `ConsoleLoggerProvider` のコンストラクターに、**カテゴリーとログレベルを使用したフィルター**を渡すことができます。

### Debug.WriteLine で出力したいとき

デバッグ出力するときは `Microsoft.Extensions.Logging.Debug.DebugLoggerProvider` を使用します。

```cs
public static readonly LoggerFactory LoggerFactory = new LoggerFactory(new[] {
    new DebugLoggerProvider((category, level)
        => category == DbLoggerCategory.Database.Command.Name && level == LogLevel.Information)
});
```

### その他

[EF Core のログ記録 (その他のアプリケーション)](https://docs.microsoft.com/ja-jp/ef/core/miscellaneous/logging#other-applications) にあるようにその他にもデフォルトで下記のような `ILoggerProvider` を継承したクラスが定義されています。

- [Microsoft.Extensions.Logging.EventLog.EventLogLoggerProvider](https://github.com/aspnet/Logging/blob/master/src/Microsoft.Extensions.Logging.EventLog/EventLogLoggerProvider.cs)
- [Microsoft.Extensions.Logging.EventSource.EventSourceLoggerProvider](https://github.com/aspnet/Logging/blob/master/src/Microsoft.Extensions.Logging.EventSource/EventSourceLoggerProvider.cs)
- [Microsoft.Extensions.Logging.TraceSource.TraceSourceLoggerProvider](https://github.com/aspnet/Logging/blob/master/src/Microsoft.Extensions.Logging.TraceSource/TraceSourceLoggerProvider.cs)

## コンテキストの初期化時に LoggerFactory を渡す

読み取り専用の静的変数で定義した `LoggerFactory` を `DbContext.OnConfiguring` での初期化時に `DbContextOptionsBuilder.UseLoggerFactory` メソッドで指定します。

```cs
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.UseLoggerFactory(LoggerFactory);
}
```

## 全体像

```cs
public class MyDbContext : DbContext
{
    public DbSet<HogeHoge> HogeHoges { get; set; }

    public MyDbContext()
    {
    }

    public static readonly LoggerFactory LoggerFactory = new LoggerFactory(new[] {
        new ConsoleLoggerProvider((category, level)
            => category == DbLoggerCategory.Database.Command.Name && level == LogLevel.Information, true)
    });

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseLoggerFactory(LoggerFactory);
    }
}
```

## ログの例

ログは下記のように出力されます。生の SQL だけが出力されるわけではないので、注意が必要です。

```
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (1ms) [Parameters=[], CommandType='Text', CommandTimeout='30']
      SELECT COUNT(*) FROM "sqlite_master" WHERE "name" = '__EFMigrationsHistory' AND "type" = 'table';
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (10ms) [Parameters=[], CommandType='Text', CommandTimeout='30']
      SELECT "x"."HogehogeId", "x"."Name"
      FROM "Hogehoges" AS "x"
      WHERE "x"."HogehogeId" IN (
          SELECT "t".*
          FROM (
              SELECT DISTINCT "x0"."HogehogeId"
              FROM "Hogehoges" AS "x0"
              WHERE "x0"."Name" IN ('hoge')
              LIMIT 50
          ) AS "t"
          LIMIT -1 OFFSET 0
      )
      ORDER BY "x"."HogehogeId"
```
