---
title: "[SQL Server] 連番データを格納したテーブルを作成してデータを一括生成する"
date: 2019-01-17
author: kenzauros
tags: [SQL Server, SQL, その他の技術]
---

今回は **SQL Server** で**連番データを格納したテーブルを作成**する Tips を紹介します。

## やりたいこと

SQL でデータを扱っていると**連番データ**がほしいことがあります。

たとえば大量のデータを生成するときなど、ループで回して INSERT だとちょっとダサいので SELECT INTO や MERGE INTO でまとめて生成してしまいたいところですが、そのためには挿入するレコード分の行を生成する必要があります。

こういったとき下記のような**連番データが格納されただけのテーブル**があれば、結合するだけで、いとも簡単に大量のデータを生成することができます。

| N |
| ---: |
| 0 |
| 1 |
| 2 |
| ... |

## 連番データ生成 SQL

早速ですが **SQL Server で前述のような連番データのテーブルを作成する SQL** は下記のようになります。

あとあとの使い勝手がよくなるように一時テーブル `#SEQS` に格納しています。

```sql
-- 連番テーブル生成
IF OBJECT_ID('tempdb..#SEQS', 'U') IS NOT NULL DROP TABLE #SEQS;
WITH TMP_NUMBERS (N) AS (SELECT 0 UNION ALL SELECT 1 + N FROM TMP_NUMBERS WHERE N < 10000)
SELECT N INTO #SEQS FROM TMP_NUMBERS OPTION (MAXRECURSION 0)
```

`SELECT 0` 部分で開始番号, ` WHERE N < 10000` の部分で最後の番号を指定します。この例では 0～10000 が生成されます。

標準では再帰が 100 回に制限されているので `OPTION (MAXRECURSION 0)` で無制限にしています。

※ 1 行目はセッション中で何度か実行されるときに一時テーブルがすでに存在するとエラーになるため、存在すれば削除しています。 (ちなみに一時テーブルの存在は `OBJECT_ID('tempdb..#SEQS', 'U')` で確認できます。)

あるいは一時テーブルでなく、テーブル変数に入れてもいいでしょう。その場合は下記のようになります。

```sql
-- 連番テーブル生成 (テーブル変数版)
DECLARE @SEQS TABLE (N INT);
WITH TMP_NUMBERS (N) AS (SELECT 0 UNION ALL SELECT 1 + N FROM TMP_NUMBERS WHERE N < 10000)
INSERT @SEQS SELECT N FROM TMP_NUMBERS OPTION (MAXRECURSION 0)
```

この場合は `@SEQS` を連番テーブルとして使用できます。

## 利用例

作った一時テーブル `#SEQS` を使えば、例えば下記のようなことができます。

```sql
-- 今日から 50 日分の日付データを生成
SELECT FORMAT(DATEADD(day, B.N, GETDATE()), 'yyyyMMdd') AS YMD
FROM #SEQS AS B
WHERE B.N < 50
```

| YMD |
| --- |
| 20190109 |
| 20190110 |
| 20190111 |
| ... |

他のテーブルと JOIN していけば、さらにいろいろなことができますね。

## あとがき

SQL Server で連番データを生成するには他にもいくつか方法があるのですが、 `sys.all_objects` のようなシステムテーブルを流用する方法だと、環境によってレコード数が異なるため、使い回すにはちょっと不安です。

ということで今回は安定的に指定個数の連番が得られる**再帰 CTE** を使った方法にしました。