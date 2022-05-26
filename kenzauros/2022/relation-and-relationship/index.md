---
title: 関係データベースにおけるリレーションとリレーションシップの関係
date: 
author: kenzauros
tags: [データベース]
description: データベースの代表格であるリレーショナルデータベースにおいて、混同されがちな「リレーションシップ」と「リレーション」という単語について、いくつかの記事や DBMS のリファレンスも含めて考察します。
---

今月号のソフトウェアデザイン誌を読んでいて、ある言葉が気になりました。

日本の IT エンジニアの 8 割（主観）が間違えている言葉、それが「**リレーション**」と「**リレーションシップ**」です。いずれも*リレーショナルデータベース (RDB; relational database)* の文脈で使われます。

この 2 単語は実際に弊社の勉強会や教育の場面でも何度か話題になったことがあります。今回、出版物である雑誌でも揺らぎがあったので、あらためて調べてみました。

なお最初に断っておきますが、本記事は誤りを否定するものではなく、できるだけ正しい用語を使っていければいいな、という話題の提起が目的です。


## 「リレーション」と「リレーションシップ」

はじめに主題である「リレーション」と「リレーションシップ」について、この記事での理解を説明しておきます。

ざっくり言えば **「リレーション」≒「テーブル」**、 **「リレーションシップ」＝「テーブル間の関係性」** です。図で表すと下記のようになります。

![「リレーション」と「リレーションシップ」](images/image-of-relation-and-relationship.png)

### リレーション

リレーション (relation; 関係) は、もともと [Edgar F Codd](https://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%89%E3%82%AC%E3%83%BC%E3%83%BBF%E3%83%BB%E3%82%B3%E3%83%83%E3%83%89) 氏が考案した「*関係モデル*」において、データ集合を表す言葉として導入されました。その論文はオンラインでも読むことができますので、興味のある方は見てみてください。

> The term **relation** is used here in its accepted mathematical sense. Given sets S1, S2, ..., Sn, (not necessarily distinct), R is a **relation** on these n sets if it is a set of n tuples each of which has its first element from S1, its second element from S2, and so on.
> <cite>E. F. Codd. 1970. [A Relational Model of Data for Large Shared Data Banks (大規模共有データバンク向けデータのリレーショナル・モデル)](https://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf), p.379</cite>

要約すると、**「リレーション」は「タプルの集まり」** であると解釈できます。また、ここでタプルとは「組」のことであり、テーブルにおける「行」に相当します。

逆説的ではありますが、その「行」を集めたものが「テーブル」であり、つまり「リレーション」だということです。

厳密には関係データベースの「テーブル」と関係モデルの「リレーション」には機能上の差異がありますが、概念上は同じのものだと言えます。

### リレーションシップ

一方の "relationship" は下記のように "relation" どうしの「つながり」を感じさせます。

- friendship (フレンドシップ; 友好関係)
- partnership (パートナーシップ; 協力関係)
- skinship (スキンシップ)

つまり「**リレーションシップ**」というのは「**テーブル間の関係(性)**」を指すものです。しばしば ER 図で「線」として表されます。外部キー (FK) で明示的にこの関連を定義することもあります。

ただし、日本語で言うとこれもまた「関係」となるところがややこしいところです。

「relation」＝「関係」、「relationship」＝「関連」という使い分けを導入している例も見られますが、正式な定義は見当たりません（ご存じの方がいらっしゃれば教えてください）。

そもそも日本語の「関係」と「関連」があいまいというか、どちらでも使える場合が多いので、そのような使い分けに意味があるのかも疑問です。


## データベースの文脈における「リレーション」の使われ方

### Software Design 誌の記事

[Software Design 2022年6月号](https://amzn.to/38GUv6N) に「後悔しないAWSデータベースの選び方」という記事が掲載されており、その一部に下記のような説明がありました。

> コッド博士が提唱したデータ関係モデルでは、～～～略～～～関係・関連データが持つ項目値そのものに基づかせるというものでした。<br>
> ～～～略～～～*それぞれのデータは独立したものとし、各データに関係・関連を持たせたいデータの項目を持たせることにより定義*します。<br>
> 図2では*一対多の関係・関連*を持たせた例となっていますが、一対一、多対多の関係とすることもできます。
> <cite>Software Design 2022年6月号 p.76-77</cite>

同 p.99 にも別の著者による記述があります。

> リレーションを組まないようにする
>
> DynamoDB は*リレーションを組むのが苦手*です。
> <cite>Software Design 2022年6月号 p.99</cite>

前者は一対多や多対多などの表現でわかるとおり「リレーションシップ」のことを説明しています。日本語で「関係・関連」と併記しているにもかかわらず、なぜか 2 単語が同じ意味を指すかのように扱われています。この文に「リレーション」という単語はでてきませんが、代わりに「関係」という単語が同じ意味で混同されているようです。

後者では、 DynamoDB はそもそもリレーショナルデータベースではないため苦手も何もないはずですが、ここでは「関係性を持たせるのが苦手」という意味で書かれているようです。


### Google 検索の結果

そこで「RDB」や「RDB リレーション」などで Google 検索してみて、どのようなページがあるか見てみました。およそ検索結果の1ページ目に載ってくるページをいくつか取り上げました。

#### 誤って使われている例

> リレーションとはテーブル同士の関係を設定し、関連付けるものである。
> <cite>[リレーショナルデータベース | IT用語辞典 | 大塚商会](https://www.otsuka-shokai.co.jp/words/relational-database.html)</cite>

まさに「リレーションシップ」のことが「リレーション」として記述されています。「IT用語辞典」なのに少し残念です。

> （リレーショナルデータベースの）“リレーション”とはテーブル同士の関係を設定し、関連付けるものである。
> <cite>[リレーショナルデータベース（RDB）とは？ - ZDNet Japan](https://japan.zdnet.com/keyword/%E3%83%AA%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%8A%E3%83%AB%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%EF%BC%88RDB%EF%BC%89/)</cite>

こちらも用語辞典的な感じですが、大塚商会のIT用語辞典と同様の説明でした。

> DBのリレーションとは？？
> 
> ・文字通り「関係」を表す。<br>
> ・テーブル同士の関係のことである。
> <cite>[DBのリレーション - Qiita](https://qiita.com/miriwo/items/b44c8299c218fc367613)</cite>

こちらの Qiita の記事も結構上位に出てくるページですが、やはり「リレーションシップ」の代わりに「リレーション」が使われています。

> テーブルとテーブルをつなぐリレーション
>
> リレーションとは、テーブルとテーブルを繋ぐ共通のキー(key)となります。Excelで言うところの別シートのデータを紐づける意味と同じです。
> <cite>[Webに関わる人に覚えてほしいデータベースとSQLの基礎 | 東京のWeb制作会社 クーシー（COOSY）](https://coosy.co.jp/blog/web-database-base/)</cite>

こちらも「リレーションシップ」の代わりに「リレーション」が使われているパターンです。

> リレーション（英：relation）とは「リレーションシップ」のこと。<br>
> 用語の中身としてはアレとコレの「関係性」のことです。<br>
> E-R図で出てくる線のこととも言えます。<br>
> あるいはデータベースの話で出てきたら「テーブル」のことらしいです。
> <cite>[リレーション (relation)とは｜「分かりそう」で「分からない」でも「分かった」気になれるIT用語辞典](https://wa3.i-3-i.info/word11596.html)</cite>

こちらは『リレーション（英：relation）とは「リレーションシップ」のこと』という少しカオスな説明ですが、要するに「リレーションシップの略がリレーションだ」ということでしょう。
この記事のおもしろいのは、ついでのような説明で「リレーション＝テーブルのことらしい」とも説明されていることです。

#### 正しく使われている例

反して、リレーションが本来の「関係」として説明されていたページです。

> データは表に似た構造で管理されるが、関係（リレーション）と呼ぶ概念でモデル化される。
> <cite>[関係データベース - Wikipedia](https://ja.wikipedia.org/wiki/%E9%96%A2%E4%BF%82%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9)</cite>

Wikipedia では「表に似た構造のリレーション（関係）」＝「テーブル」だとしていますので、正しそうですね。

> そこでテーブルをタプルの集合としてみて論ずるとき、 テーブルのことをリレーションという。
> <cite>[RDB (リレーショナル・データベースの概要)](http://www.cs.reitaku-u.ac.jp/infosci/rdb/rdb01.html)</cite>

こちらも大学の記事なので少し学術的ではありますが、正しいですね。

> RDBでは、表はリレーション(relation)と呼ばれ、表の列は例えば、社員番号、氏名、保険証記号、保険証番号、保険者番号、基本給などの項目になり、これらを属性 (attribute) と呼びます。
> <cite>[リレーショナルデータベース | 地理空間情報技術ミュージアム Museum of GIS Technology](http://mogist.kkc.co.jp/word/f287791b-2df3-4f44-a084-c70a3cff1d93.html)</cite>

こちらも同様で、おおむね正しそうな説明です。

全体的に見て「リレーション」を「関係」として説明しているページのほうが少ない印象です。逆にわかりやすく説明されている記事ほど、混同しているイメージがあります。


## 実際の RDBMS ではどうか

「関係データベース」の実装である *RDBMS* (relational database management system) では、どのような扱いになっているのでしょうか。

### PostgreSQL

たとえば PostgreSQL ですでに存在するテーブルと同名のテーブルを作ろうとすると、 `ERROR: Relation 'TABLE_NAME' already exists` とエラーになります。

公式リファレンスの用語集に以下の記述があります。

> Relation
>
> The generic term for all objects in a database that have a name and a list of attributes defined in a specific order. *Tables, sequences, views, foreign tables, materialized views, composite types, and indexes are all relations.*
> <cite>[PostgreSQL: Documentation: 14: Appendix M. Glossary](https://www.postgresql.org/docs/14/glossary.html)</cite>

PostgreSQL 上ではテーブルやビューなど「表っぽいもの」が「リレーション」として定義されていることがわかります。

> Table
>
> A collection of tuples having a common data structure (the same number of attributes, in the same order, having the same name and type per position). *A table is the most common form of relation* in PostgreSQL.
> <cite>[PostgreSQL: Documentation: 14: Appendix M. Glossary](https://www.postgresql.org/docs/14/glossary.html)</cite>

また、テーブルが最も一般的な「リレーション」であるとも書かれています。

### SQL Server

SQL Server は "relation" という表現は公式リファレンスで直接的に使われていないようです。

> A table contains a collection of rows, also referred to as records or tuples, and columns, also referred to as attributes.
> <cite>[Databases - SQL Server | Microsoft Docs](https://docs.microsoft.com/en-us/sql/relational-databases/databases/databases?view=sql-server-ver15)</cite>

ただ上記のように「タプル・属性の集合で構成される」と表現されているので、関係データモデルでいう「リレーション」ということになります。

また、用語集では "relational database" が下記のように定義されています。

> relational database
>
> A database or database management system that *stores information in tables as rows and columns of data*, and conducts searches by using the data in specified columns of one table to find additional data in another table.
> <cite>[SQL Server Glossary - TechNet Articles - United States (English) - TechNet Wiki](https://social.technet.microsoft.com/wiki/contents/articles/1145.sql-server-glossary.aspx)</cite>

情報を行と列（≒リレーション）で保存する DBMS だと定義されています。

### Oracle

Oracle も比較的明瞭に "relation" はタプルの集合であり、その集合を保存するのが "relational database" だとしています。

> relation
> 
> *A set of tuples*.
> 
> relational database
> 
> A database that conforms to the relational model, *storing data in a set of simple relations*.
>
> <cite>[Glossary - Database Concepts - Oracle Help Center](https://docs.oracle.com/cd/E11882_01/server.112/e40540/glossary.htm#CNCPT89131)</cite>

### MySQL

MySQL ではマニュアルや用語集を見ても "relation" という単語は見当たりません。 "relationship" は外部キー制約の文脈で登場します。

> A foreign key *relationship* involves a parent table that holds the initial column values, and a child table with column values that reference the parent column values. A foreign key constraint is defined on the child table.
> <cite>[MySQL :: MySQL 8.0 Reference Manual :: 13.1.20.5 FOREIGN KEY Constraints](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)</cite>

ついでに "relation" の代わりに "relational" を覗いてみると、下記のような記述があります。

> relational
>
> An important aspect of modern database systems. The database server encodes and enforces relationships such as one-to-one, one-to-many, many-to-one, and uniqueness.
> <cite>[MySQL :: MySQL 8.0 Reference Manual :: MySQL Glossary](https://dev.mysql.com/doc/refman/8.0/en/glossary.html)</cite>

ありゃ、なんと MySQL では relational database の *"relational" は "relationship" の機能をもつデータベースを指す*かのような記述になっています。

OSS として最も普及している MySQL を無視できませんが、ただでさえあいまいな DBMS なのに用語の定義もあいまいとは難儀ですね😅

とはいえ "relationship" を "relation" としている記述は見当たりませんでしたので、 "relationship" の定義は他の DBMS とずれはなさそうです。

## 「関係モデル」と「ER モデル」

さて、ここまで「リレーションシップ」という言葉が誤用される傾向にあることを見てきました。

この原因はおそらく **「関係モデル」と「ER (Entity-Relationship) モデル」** の存在だと思います。

「関係モデル」は前述のとおり RDB の基本的な概念となっているモデルで、「ER モデル」はデータモデリングに使われる「ER 図」で表現するモデルです。
また、「リレーション」は「関係モデル」の、「リレーションシップ」は「ER モデル」の用語です。

*リレーショナルデータベースでは「ER モデル」で設計し「関係モデル」を元にした RDBMS で実装する*という流れ上、この 2 単語の混同が起こりやすいのだと考えられます。

また、前述のとおり日本語に訳すといずれも「関係」だったり「関連」だったりすることも混同の原因でしょう。

## まとめ

実際のところ日本語以外の記事でも "relationship" の意味で "relation" が使われている例は、すぐに発見できました。総合すると、下記のようなパターンがありそうです。

1. 「リレーションシップ」を略として「リレーション」と呼んでいる（*省略*パターン）
2. 「リレーションシップ（テーブル間の関係性）」のことを「リレーション」だと思っている（*誤認*パターン）

いずれも「リレーション」が「テーブル」の概念だということが念頭にない、ということは共通しているように見えます。

1 の省略パターンは理解できますが、同じデータベース界隈で「リレーション」という単語がある以上、文章体ではそこを略すべきではないと思います。

ということで冒頭に書いた下記の対応関係はやはり誤りではなく、ある程度正確な定義だと言えそうです。

- **「リレーション」≒「テーブル」**
- **「リレーションシップ」＝「テーブル間の関係性」**

また概念上の「関係モデル」をリスペクトする意味でも、各種リファレンスに従う意味でも、 **「テーブル間の関係性」は「リレーションシップ」として、「リレーション」とは区別する**のが望ましいと考えます。

ご意見あれば GitHub 等でいただければ幸いです。
