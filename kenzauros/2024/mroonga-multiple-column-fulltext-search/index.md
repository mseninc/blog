---
title: "[MySQL/MariaDB] Mroonga で複数カラムに対してインデックスを使った全文検索する"
date: 
author: kenzauros
tags: [MySQL, MariaDB, Mroonga]
description: "今回は全文検索エンジン Mroonga がインストールされた MySQL/MariaDB で、複数のカラムに対してインデックスを使った全文検索する方法について紹介します。"
---

こんにちは、 kenzauros です。

今回は全文検索エンジン Mroonga がインストールされた MySQL/MariaDB で、複数のカラムに対してインデックスを使った全文検索する方法について紹介します。

## Mroonga とは

**Mroonga は MySQL/MariaDB 用の全文検索エンジン**です。MeCab や Bigram などの形態素解析器を使って日本語や英語のテキストを検索できます。

Groonga という全文検索エンジンをベースにしており、Groonga の機能を MySQL/MariaDB で利用できるようにしたものです。

本記事では下記の環境で動作確認を行っています。

- AlmaLinux 8.7
- MariaDB 10.6
- Mroonga 7.07

```sql:title=Mroongaのバージョン確認
SHOW VARIABLES LIKE 'mroonga_version';
mroonga_version | 7.07
```

## 前提

さて、今回は以下のようなテーブルを想定します。

`post_id` という ID カラムと、`title_ja` と `title_en` という日本語と英語のタイトルを持つテーブルです。

```sql:title=今回想定するpostsテーブル
CREATE TABLE IF NOT EXISTS blog.posts (
  post_id varchar(255) NOT NULL PRIMARY KEY COMMENT 'Post ID'
, title_ja varchar(255) COMMENT 'タイトル (日本語)'
, title_en varchar(255) COMMENT 'タイトル (英語)'
, FULLTEXT INDEX ftix_title_ja (title_ja) COMMENT 'tokenizer "TokenMecab"' -- タイトル (日本語)
, FULLTEXT INDEX ftix_title_en (title_en) COMMENT 'tokenizer "TokenBigram"' -- タイトル (英語)
) COMMENT 'Posts'
ENGINE = mroonga DEFAULT CHARSET=utf8mb4
;
```

ここで `title_ja` と `title_en` にはそれぞれ全文検索インデックスが設定されています。
日本語のほうは `TokenMecab` という形態素解析器を使ったインデックス、英語のほうは `TokenBigram` というバイグラムインデックスを使ったインデックスになっています。

## やりたいこと

やりたいことはシンプルで、「**日本語か英語のタイトルのいずれかにキーワードが含まれるレコードを取得したい**」です。

素直に書くと以下のようなクエリーになるでしょう。

```sql:title="title_ja"に「レーザー」または"title_en"に「laser」を含むレコードを検索
SELECT * FROM blog.posts
WHERE MATCH (title_ja) AGAINST ('レーザー' IN BOOLEAN MODE)
  OR MATCH (title_en) AGAINST ('laser' IN BOOLEAN MODE)
ORDER BY post_id
LIMIT 10;
```

このクエリーを `EXPLAIN` で見てみると、以下のようになります。

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | SIMPLE | posts | ALL | NULL | NULL | NULL | NULL | 7169017 | Using where |

せっかく作成した全文検索インデックスが使われず、 `posts` テーブルの全行をスキャンしていることがわかります。
なお、 `OR` ではなく `AND` の場合は、いずれか1つのインデックスが使われ、もう片方は全行スキャンされます。

実行環境により異なるかもしれませんが、いずれにしてもインデックスが有効に使われず、遅いクエリーになってしまいます。

### 補足: IN BOOLEAN MODE について

ちなみに、ここで `IN BOOLEAN MODE` をつけてブーリアンモードで検索しているのは、よくある検索エンジンと似た動きにするためです。

Mroonga の公式ドキュメントにも以下のように書かれています。

> 通常、デフォルトの `IN NATURAL LANGUAGE MODE` よりも `IN BOOLEAN MODE` の方が適切です。なぜなら `IN BOOLEAN MODE` はWeb検索エンジンのクエリーと似ているからです。多くのユーザーはWeb検索エンジンのクエリーに慣れています。
> <cite>[5.7.1. ブーリアンモード — Mroonga v13.05 documentation](https://mroonga.org/ja/docs/reference/full_text_search/boolean_mode.html)</cite>


## 解決策

### ALLOW_COLUMN フラグを有効にする

では、どうすればいいかというと、 MySQL の構文としての `MATCH () AGAINST ()` で複数条件を書くのではなく、 Groonga のクエリーを使います。

まず、 Groonga のクエリーで複数カラム指定を有効にするため、**`mroonga_boolean_mode_syntax_flags` 変数に `ALLOW_COLUMN` を追加**します。

※`mroonga_boolean_mode_syntax_flags` のデフォルト値は `SYNTAX_QUERY,ALLOW_LEADING_NOT` です。

> `ALLOW_COLUMN`
> 
> クエリー構文で `COLUMN:...` という構文を使えるようにします。これはMySQLのBOOLEAN MODEの構文とは互換性がありません。
> 
> この構文を使うと1つの `MATCH () AGAINST ()` の中で複数のインデックスを使うことができます。MySQLは1つのクエリーの中で1つのインデックスしか使えません。この構文を使うことでこの制限を回避することができます。
> 
> <cite>[5.3.2. mroonga_boolean_mode_syntax_flags - 5.3. サーバ変数の一覧 — Mroonga v13.05 documentation](https://mroonga.org/ja/docs/reference/server_variables.html#mroonga-boolean-mode-syntax-flags)</cite>

```sql:title=ALLOW_COLUMNフラグを有効にする
SET GLOBAL mroonga_boolean_mode_syntax_flags = "SYNTAX_QUERY,ALLOW_COLUMN,ALLOW_LEADING_NOT";
```

※ここでは `GLOBAL` で設定していますが、全体に影響するとまずい場合は必要に応じて `SESSION` で設定してください。

正しく設定されたか確認するには、以下のクエリーを実行します。

```sql:title=mroonga_boolean_mode_syntax_flagsの設定を確認する
SELECT VARIABLE_NAME, SESSION_VALUE, GLOBAL_VALUE
FROM INFORMATION_SCHEMA.SYSTEM_VARIABLES
WHERE VARIABLE_NAME IN ('mroonga_boolean_mode_syntax_flags');
```

少なくとも `SESSION_VALUE` が `SYNTAX_QUERY,ALLOW_COLUMN,ALLOW_LEADING_NOT` になっていれば OK です。

### ALLOW_COLUMN を使ったクエリー

やっと本題です。先ほどのクエリーを Groonga のクエリーに書き換えます。

下記のようになります。なお Groonga のクエリーを用いる場合、 `IN BOOLEAN MODE` は必須です（付けない場合は通常の自然言語検索になりました）。

```sql:title="title_ja"に「レーザー」または"title_en"に「laser」を含むレコードを検索
SELECT * FROM blog.posts
WHERE MATCH (title_ja) AGAINST ('title_ja:@レーザー title_en:@laser' IN BOOLEAN MODE)
ORDER BY post_id
LIMIT 10;
```

基本構文は **`カラム名:@キーワード`** です。全文検索を表す `@` の後にキーワードを指定します。

- [7.13.1.3.3. Full text search condition (with explicit match column) - 7.13.1. Query syntax — Groonga v14.0.2 documentation](https://groonga.org/docs/reference/grn_expr/query_syntax.html#full-text-search-condition-with-explicit-match-column)

ちなみにこのクエリーを `EXPLAIN` で見てみると、以下のようになります。

| id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | SIMPLE | posts | fulltext | ftix_title_ja | ftix_title_ja | 0 |  | 1 | Using where with pushed condition; Using filesort |

MySQL/MariaDB は Groonga のクエリーを解釈していないので、1カラムのみインデックスが使用されているように見えますが、実際には2つのカラムがインデックスを使って検索されています。

そのため、実行速度は劇的に速くなり、約 700 万行の `post` テーブルを使った場合、冒頭のクエリーで **5 秒以上かかっていたものが、 100ms 程度に短縮**されました。
全数チェックしたわけではありませんが、検索結果に表れる内容も同じでした。

### 発展

#### 3 つ以上のカラムを対象に検索する

全文検索対象のカラムが3つ以上の場合でも同様のアプローチが可能です。

たとえば以下は`title_ja`, `description_ja`, `title_en`, `description_en` の 4 カラムを対象に検索する例です。

```sql:title=3つ以上のカラムを対象に検索
SELECT * FROM blog.posts
WHERE MATCH (title_ja) AGAINST ('レーザー description_ja:@レーザー title_en:@laser description_en:@laser' IN BOOLEAN MODE)
ORDER BY post_id
LIMIT 10;
```

ちなみに `MATCH` 句に書いたカラム名は Groonga クエリー部分では上記のように省略できます。
省略せずに `title_ja:@レーザー` のように書いても問題ありません。

クエリーを機械的に生成する場合は、省略せずに明示的に書いたほうがいいでしょう。

#### 複数単語を含むクエリー

複数の単語を含むクエリーも可能ですが、この場合は条件を括弧 `()` で囲む必要があります。

```sql:title=「レーザー(laser)」または「プラズマ(plasma)」を含むレコードを検索
SELECT * FROM blog.posts
WHERE MATCH (title_ja) AGAINST ('title_ja:@(レーザ－ プラズマ) title_en:@(laser plasma)' IN BOOLEAN MODE)
ORDER BY post_id
LIMIT 10;
```

条件を括弧でくくらず `'title_ja:@レーザ－ 核融合 title_en:@laser fusion'` のようにした場合、スペースで区切られた「核融合」と「fusion」が `MATCH` 句の `title_ja` の条件として解釈されるようです。

#### BOOLEAN MODE の演算子を含むクエリー

`+`, `-` などのブーリアン演算子を含むクエリーも可能ですが、先頭に記号がくるとエラーになるため、この場合も条件を括弧 `()` で囲むのが無難です。

```sql:title=「レーザ－(laser)」と「核融合(fusion)」を"必ず"含むレコードを検索
SELECT * FROM blog.posts
WHERE MATCH (title_ja) AGAINST ('title_ja:@(+レーザ－ +核融合) title_en:@(+laser +fusion)' IN BOOLEAN MODE)
ORDER BY post_id
LIMIT 10;
```

ブーリアンモードの演算子についてはリファレンスを参照してください。

- [5.7.1. ブーリアンモード — Mroonga v13.05 documentation](https://mroonga.org/ja/docs/reference/full_text_search/boolean_mode.html)

#### 特殊文字のエスケープ

なお、 Groonga クエリーの特殊文字（`"` `(` `)` `\` など）を検索単語として含む場合は、バックスラッシュ `\` によるエスケープが必要です。詳細はリファレンスを参照してください。

- [7.13.1.2. Escape - 7.13.1. Query syntax — Groonga v14.0.2 documentation](https://groonga.org/docs/reference/grn_expr/query_syntax.html#escape)

#### 全文検索以外の検索

Groonga のドキュメントには、全文検索以外の検索方法も記載されています。

- [7.13.1.3. Conditional expression - 7.13.1. Query syntax — Groonga v14.0.2 documentation](https://groonga.org/docs/reference/grn_expr/query_syntax.html#conditional-expression)

一部を紹介します。

| クエリー | 説明 | 例 |
| --- | --- | --- |
|`カラム名:@キーワード` | [全文検索](https://groonga.org/docs/reference/grn_expr/query_syntax.html#full-text-search-condition-with-explicit-match-column) | `title_ja:@laser` |
|`カラム名:@"フレーズ"` | [フレーズ全文検索](https://groonga.org/docs/reference/grn_expr/query_syntax.html#phrase-search-condition-with-explicit-match-column) | `title_ja:@"laser plasma"` |
|`カラム名:キーワード` | [完全一致検索](https://groonga.org/docs/reference/grn_expr/query_syntax.html#equal-condition) | `title_ja:laser` |
|`カラム名:!キーワード` | [含まない検索](https://groonga.org/docs/reference/grn_expr/query_syntax.html#not-equal-condition) | `title_ja:!laser` |

なお、 Groonga のドキュメントには前方一致や後方一致なども記載されていましたが、私の環境ではうまく動作しませんでした。何かご存じの方がいれば教えていただけると幸いです。

## まとめ

Mroonga で複数カラムに対してインデックスを使った全文検索する方法について紹介しました。

検索機能をもったアプリではデータベースに対して、全文検索することも多いですが、ユーザーにとって検索速度はとても重要な要素です。

MySQL/MariaDB と Mroonga を使っている場合、本記事で紹介したカラムに対するクエリーを利用すれば、検索速度を向上させることができるかもしれません。

どなたかのお役に立てれば幸いです😁

## 参考

- [7.13.1. Query syntax — Groonga v14.0.2 documentation](https://groonga.org/docs/reference/grn_expr/query_syntax.html)
- [5.7.1. ブーリアンモード — Mroonga v13.05 documentation](https://mroonga.org/ja/docs/reference/full_text_search/boolean_mode.html)
- [5.3.2. mroonga_boolean_mode_syntax_flags - 5.3. サーバ変数の一覧 — Mroonga v13.05 documentation](https://mroonga.org/ja/docs/reference/server_variables.html#mroonga-boolean-mode-syntax-flags)
