---
title: SQL Server でカラムに設定された MS_Description を列挙する
date: 2021-07-30
author: kenzauros
tags: [SQL Server, SQL]
---

SQL Server でオブジェクトに説明を追加するときに使う拡張プロパティといえば **`MS_Description`** ですね。

膨大なテーブル群を相手にしていると、ふとカラムに設定された `MS_Description` を列挙したくてたまらなくなるときがあります。

ということでそんなときに役立つ SQL のコードスニペットをご紹介します。

## SQL Server でカラムに設定された MS_Description を列挙する SQL

```sql
SELECT
  i.TABLE_SCHEMA
, i.TABLE_NAME
, i.COLUMN_NAME
, p.value AS [DESCRIPTION]
FROM INFORMATION_SCHEMA.COLUMNS i
  INNER JOIN sys.extended_properties p
    ON p.major_id = OBJECT_ID(i.TABLE_SCHEMA + '.' + i.TABLE_NAME)
    AND p.minor_id  = i.ORDINAL_POSITION
    AND p.name = 'MS_Description'
WHERE OBJECTPROPERTY(OBJECT_ID(i.TABLE_SCHEMA + '.' + i.TABLE_NAME), 'IsMsShipped') = 0 -- システムオブジェクト以外
  AND CAST(p.value as nvarchar) LIKE '%hoge%' -- MS_Description の内容で抽出
ORDER BY
  i.TABLE_SCHEMA
, i.TABLE_NAME
, i.ORDINAL_POSITION
```

以上です。

## 簡単な説明

基本的には `INFORMATION_SCHEMA.COLUMNS` と `sys.extended_properties` を結合しているだけです。

### INFORMATION_SCHEMA.COLUMNS

`INFORMATION_SCHEMA.COLUMNS` **現在のデータベースの現在のユーザーがアクセスできるすべての列**の情報を取得できます。

- [COLUMNS (Transact-sql) - SQL Server | Microsoft Docs](https://docs.microsoft.com/ja-jp/sql/relational-databases/system-information-schema-views/columns-transact-sql?view=sql-server-ver15)

ちなみにこのテーブルは MySQL や PostgreSQL でも用意されているため、同じような感じで使用できます。

### sys.extended_properties

こちらは **SQL Server の拡張プロパティ (Extended Property) を列挙するためのビュー**です。

- [sys.extended_properties (Transact-sql) - SQL Server | Microsoft Docs](https://docs.microsoft.com/ja-jp/sql/relational-databases/system-catalog-views/extended-properties-catalog-views-sys-extended-properties?view=sql-server-ver15)
