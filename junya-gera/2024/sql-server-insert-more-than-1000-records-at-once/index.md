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

まずはエラーが発生する SQL の例を紹介します。以下のように Visual Basic で 1001 行の VALUES 句が書かれた INSERT 文を作成します。 

`valueExpressions` は `('SampleName1', 1)` から `('SampleName1001', 1001)` の文字列が格納された配列です。

```VB:title=エラーが発生する&nbsp;SQL&nbsp;文作成するプログラム
Dim sqlText = $"
-- サンプルテーブルを作成
CREATE TABLE TargetTable (
  ID INT IDENTITY(1,1) PRIMARY KEY,
  NAME NVARCHAR(100),
  VALUE INT
);

-- 一時テーブルに全件挿入
INSERT INTO TargetTable (NAME, VALUE)
VALUES
  {String.Join(vbCrLf + ", ", valueExpressions)}
;"
```

INSERT 部分の SQL は以下のようになります。

```SQL:title=エラーが発生する&nbsp;INSERT&nbsp;文
INSERT INTO TargetTable (NAME, VALUE)
VALUES
  ('SampleName1', 1),
  ('SampleName2', 2),
  ('SampleName3', 3),
  -- 省略: 998行分のデータ
  ('SampleName1000', 1000),
  ('SampleName1001', 1001); -- この行でエラーが発生します
;
```

この SQL を実行すると制限に引っかかり「INSERT ステートメントの行値式の数が、1000 行値の許容最大数を超えています。」のエラーが発生します。

## エラーを回避する方法

`INSERT INTO ... SELECT` の書き方をすればこのエラーを回避できます。

```VB:title=エラーが発生しない&nbsp;SQL&nbsp;文作成するプログラム
Dim sqlText = $"
-- サンプルテーブルを作成
CREATE TABLE TargetTable (
  ID INT IDENTITY(1,1) PRIMARY KEY,
  NAME NVARCHAR(100),
  VALUE INT
);

-- 一時テーブルに全件挿入
INSERT INTO TargetTable (NAME, VALUE)
SELECT
  targetData.NAME, targetData.VALUE
FROM (
  VALUES
    {String.Join(vbCrLf + ", ", valueExpressions)}
  ) AS targetData(
    NAME
  , VALUE
);"
```

INSERT 部分の SQL は以下のようになります。

```SQL:title=エラーが発生しない&nbsp;INSERT&nbsp;文
INSERT INTO TargetTable (NAME, VALUE)
SELECT
  targetData.NAME, targetData.VALUE
FROM (
  VALUES
    ('SampleName1', 1),
    ('SampleName2', 2),
    ('SampleName3', 3),
    -- 省略: 998行分のデータ
    ('SampleName1000', 1000),
    ('SampleName1001', 1001);
  ) AS targetData(
    NAME
  , VALUE
);
```

この書き方であればエラーなく 1000 件以上の INSERT が可能です。

## 参考

- [テーブル値コンストラクター (Transact-SQL)](https://learn.microsoft.com/ja-jp/sql/t-sql/queries/table-value-constructor-transact-sql?view=sql-server-ver16)



