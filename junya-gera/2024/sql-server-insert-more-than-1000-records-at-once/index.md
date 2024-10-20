---
title: "SQL Server で一度に 1000 件以上のレコードを INSERT する"
date: 
author: junya-gera
tags: [SQL Server]
description: "SQL Server で、エラーを発生させず一度に 1000 件以上のレコードの INSERT を実行する方法を紹介します。"
---

こんばんは、じゅんじゅんです。

普段、業務で SQL Server をよく使用しています。

プログラムに不具合が発生したので調べてみると、SQL で「INSERT ステートメントの行値式の数が、1000 行値の許容最大数を超えています。」というエラーが発生していました。

今回はこのエラーを回避し、一度に 1000 件以上のレコードを INSERT する方法について紹介します。

## エラーが発生する SQL

まずはエラーが発生する SQL を以下に記載します。

VALUES 句をループ処理などで 1000 行以上記載したとき、制限に引っかかり「INSERT ステートメントの行値式の数が、1000 行値の許容最大数を超えています。」のエラーが発生します。

## エラーを回避する方法

`INSERT INTO ... SELECT` の書き方をすればこのエラーを回避できます。以下に SQL を記載します。

```SQL
-- サンプルテーブルを作成する
CREATE TABLE SourceTable (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100),
    Value INT
);

CREATE TABLE TargetTable (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100),
    Value INT
);

-- SourceTable にサンプルデータを 1200 件挿入する
INSERT INTO SourceTable (Name, Value)
SELECT TOP 1200
    'SampleName' + CAST(ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS NVARCHAR(10)),
    ROW_NUMBER() OVER (ORDER BY (SELECT NULL))
FROM sys.objects a
CROSS JOIN sys.objects b;

-- INSERT INTO SELECT を使って 1000 件以上のデータを TargetTable に挿入する
INSERT INTO TargetTable (Name, Value)
SELECT Name, Value
FROM SourceTable
WHERE Value <= 1200; -- この条件により、1000 件以上のデータが挿入される

-- 挿入した結果を確認する
SELECT * FROM TargetTable;
```

## このエラーが発生する背景



## 参考

- [テーブル値コンストラクター (Transact-SQL)](https://learn.microsoft.com/ja-jp/sql/t-sql/queries/table-value-constructor-transact-sql?view=sql-server-ver16)



