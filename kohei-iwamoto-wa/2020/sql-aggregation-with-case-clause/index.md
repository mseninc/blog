---
title: SQLを使用した集計 ～CASE式編～
date: 2020-11-09
author: kohei-iwamoto-wa
tags: [SQL]
---

## はじめに

はじめまして、10月からMSENに入社したこうへいと申します。前職では、某企業の社内SEとして働いていました。

前職では、SQLを用いてデータの集計をすることがたまにあり、データ集計時に役に立ったSQLの機能をここで紹介していきたいです。今回はSQLのCASE式について書いていきます。
　
## CASE式を用いた集計

SQLを用いた集計は、SELECT文と集約関数（SUM、COUNT、MAX、MIN、AVG）やGROUP BY句、WHERE句を使えば、基本的に問題なく集計を行うことができますが、性別ごとで集計したい等、場合分けしたい時、役に立つSQLの構文があります。それがCASE式です。

| id | 部署 |名前 | 性別 |
| --: |:-- |:- | :-- |
| 1 | 経理 |太郎 | 男 |
| 2 | 経理 |花子 | 女 |
| 3 | 経理 |一郎 | 男 |
| 4 | 人事 |正子 | 女 |
| 5 | 経理 |三郎 | 男 |
| 6 | 人事 | 四郎 | 男 |
| 7 | 人事 | 文也 | 男 |
| 8 | 経理 | 孝弘 | 男 |
| 9 | 経理 | 桜 | 女 |
| 10 | 経理 | 京介 | 男 |

上記のemployeesテーブルがあり、各部署ごとで男性と女性が何人在籍しているか集計したいとしたらどのように集計しますか？

```SQL
SELECT 
  department
, COUNT(sex) AS count_male
FROM
  employees
WHERE 
  sex = '男'
ORDER BY 
  department
;

SELECT 
  department
, COUNT(sex) AS count_female
FROM
  employees
WHERE
  sex = '女'
ORDER BY
  department
;
```

他にやり方はあると思いますが、最も単純に考えると上記のようにSQLを男女別で２回発行する方法が考えられます。なぜならば、WHERE句で男女どちらかを絞ろうとすると片方の集計しかできません。

しかし、SQLでsexカラムが「男」の場合と「女」の場合で処理を「分岐」させることができれば、男女別で集計をすることが可能です。以下のSQLがCASE式を用いた例です。

```SQL
SELECT
  department
, SUM(CASE WHEN sex = '男' THEN 1 ELSE 0 END) AS count_male
, SUM(CASE WHEN sex = '女' THEN 1 ELSE 0 END) AS count_female
FROM
  employees
GROUP BY
  department
;
```

| department | count_male | count_female | 
| --: | :-- | :-- |
| 人事 | 2 | 1 |
| 経理 | 5 | 2 |
 
```CASE WHEN sex = '男' THEN 1 ELSE 0 END``` では、どういう処理が行われているのでしょうか？

sexカラムが'男'の場合は、１を男以外の場合は0と場合分けを１レコードごとで処理していきます。
CASE式単体では、場合分けするだけの機能しかありませんが、SUM,AVG,COUNTなどの集約関数やGROUP BY句と併用することで真価を発揮します。

上記の例では、SUM関数の中でCASE式でsexカラムが男であれば、１をそれ以外であれば０と1レコードずつ分岐させることにより、sexカラムに男と登録されているレコードの集計をすることができます。CASE式をもう一行書いてsex = '女'とすることで1つのSQLで男女別の集計ができます。もし集計をする機会があれば、CASE式は強力な味方になるので、使ってみることをお勧めします。

## まとめ

今回は、SQLのCASE式について書いてきましたが、SQLは他にも便利な機能を備えています。普段使わない機能を使ってみるのも新しい発見があるかもしれません。SQLの便利機能を見つけたら、紹介していければと思っています。

## 参考文献

- ミック著　翔泳社　達人に学ぶSQL徹底指南書　第２版　初級者で終わりたくないあなたへ
- ミック著　翔泳社　SQLゼロからはじめるデータベース操作　第２版
