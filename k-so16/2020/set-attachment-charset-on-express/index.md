---
title: "[Node.js] Express から Shift_JIS の CSV ファイルを文字化けさせずにダウンロードする方法"
date: 2020-11-23
author: k-so16
tags: [Node.js, Express, Web]
---

こんにちは。最近、初めて麻婆豆腐を作ってみた k-so16 です。改良点などはありますが、及第点の出来になって安心しました。

Express から **動的に生成した CSV のテキストをクライアントにファイルとしてダウンロードさせる** 際に、 Excel で開かれることを想定して文字コードを **Shift_JIS** に設定したい場合があります。この場合、 CSV のテキストの文字コードを Shift_JIS に変換するほかに、 **レスポンスヘッダーの `Content-Type` の `Charset` も `Shift_JIS` に設定する必要があります。**

Express のプログラム側でレスポンスヘッダーに設定したにも関わらず、実際のレスポンスでは **UTF-8** となっており、ダウンロードした Excel を開くと **文字化け** を起こしてしまいました。

本記事では、 Express から Shift_JIS の CSV ファイルを文字化けさせずにダウンロードする方法を紹介します。

本記事で想定する読者層は以下の通りです。

- HTTP リクエスト・レスポンスの基礎知識を有している
- Express の基本的な使い方を知っている

## HTTP レスポンスとファイルのダウンロード

### ファイルのダウンロード

まず、 HTTP レスポンスのボディデータをブラウザ側でファイルとしてダウンロードさせる方法について説明します。

Web サーバーから PDF や一部のテキストファイルをブラウザが受け取った際に、本来ファイルとして保存させたいにも関わらず、ブラウザによってはファイルとして保存するのではなく、 **内容を画面上に表示する場合があります。** [^1] わざわざダウンロード場所を聞かれずにファイルの内容を確認したい場合には便利な機能なのですが、ファイルとして保存したい場合には少々おせっかいな機能にもなってしまいます。

レスポンスのデータをブラウザにファイルとしてダウンロードさせるには、 HTTP レスポンスヘッダに **`Content-Disposition: attachment`** を指定します。ファイル名を指定する場合は、 `attachment; filename=hoge.csv` のように `attachment` の後ろに **`filename=ファイル名`** を付け加えます。この際に、 `attachment` と `filename` の区切りとして、 **セミコロン (`;`) が必須** であることに注意してください。

ファイル名 `hoge.csv` としてデータをファイルとして保存させるには、以下のような記述になります。

```
Content-Disposition: attachment; filename=hoge.csv
```

### ファイルの MIME タイプと文字コードの指定

ダウンロードするファイルの形式を指定するためには、 **`Content-Type` に指定したい MIME タイプを設定** します。例えば、PDF であれば MIME タイプは `application/pdf` となり、プレーンテキストを指定したい場合は `text/plain` となります。テキストファイルの文字コードを指定する際には、併せて **`charset`** も MIME タイプの後ろに指定します。

先程の `hoge.csv` を MIME タイプ `text/csv` として、文字コード `Shift_JIS` として指定するには、以下のような記述になります。

```
Content-Type: text/csv; charset=Shift_JIS
```

## `Content-Type` の `Charset` が書き換わらない原因

Express では **`set()`** を用いることでレスポンスヘッダのフィールドに値を設定できます。 `set('Content-Type', 'Shift_JIS')` のように、第 1 引数にヘッダーのフィールドを、第 2 引数に設定値を指定します。

Express では文字列を `send()` すると、デフォルトでレスポンスヘッダーの文字コードに UTF-8 を自動的に設定するようです。 Express の `response.js` のソースコードを確認すると、 `send()` の定義内に以下のコードが記述されていました。

- [express/response.js](https://github.com/expressjs/express/blob/508936853a6e311099c9985d4c11a4b1b8f6af07/lib/response.js#L163)

```js
// write strings in utf-8
if (typeof chunk === 'string') {
  encoding = 'utf8';
  type = this.get('Content-Type');
  // reflect this in content-type
  if (typeof type === 'string') {
    this.set('Content-Type', setCharset(type, 'utf-8'));
  }
}
```

`send()` に渡された引数 (`chunk`) が文字列型の場合、`charset` が UTF-8 に設定されるよう **ハードコーディング** されていました。 `send()` の引数に文字列を指定すると、 `set()` で文字コードを指定しようがそんなことはお構いなしに UTF-8 を文字コードとしているようです。

以下は実際のレスポンスヘッダーでは `Content-Type` に `UTF-8` が設定されてしまうコードの例です。

```js
res.set({
  'Content-Type': 'application/octet-stream; charset=Shift_JIS',
  'Content-Disposition': 'attachment; filename=hoge.csv',
}).send(csvText);
```

## 解決方法

文字列の中身が UTF-8 なので、文字コードを明示的に変換する必要があります。文字列の代わりに文字コードを変換した後の **`Buffer`** を `send()` の引数に渡すことで、 `set()` で指定した文字コードが反映されます。

Shift_JIS の CSV ファイルとして送るためには、 CSV の文字コードを Shift_JIS に変換したものを `Buffer` に変換する必要があります。この変換処理には **[iconv-lite](https://www.npmjs.com/package/iconv-lite)** が便利です。 **`encode()`** メソッドを利用すると、文字列を指定した文字コードに変換したものを `Buffer` で返却します。

以下は実際のレスポンスヘッダーの `Content-Type` にも `Shit_JIS` が設定されるコードの例です。

```js
import iconv from 'iconv-lite';

res.set({
  'Content-Type': 'application/octet-stream; charset=Shift_JIS',
  'Content-Disposition': 'attachment; filename=hoge.csv',
}).send(iconv.encode(csvText, 'Shift_JIS'));
```

本記事を執筆する上で、以下の記事を参考にしました。

> - [Express.js で charset を UTF-8 以外にする方法](https://qiita.com/satosystems/items/a62c9a2f9c2712b5a1ea)

## まとめ

本記事のまとめは以下の通りです。

- Express ではテキストを `send()` すると文字コードに UTF-8 が設定される
    - `set()` による文字コードの指定に関わらず UTF-8 が自動的に設定される
- Express の文字コードを指定するには `Buffer` を `send()` に渡す
    - 変換後の文字コードを `Buffer` に変換して `send()` する

以上、 k-so16 でした。本記事が Express での文字コードの設定でハマっている人の助けになれば幸いです。

[^1]: 一時ファイルとして保存されることはあるが、ここではユーザーが指定した場所 (またはブラウザの既定値の場所) に保存されないことを指す。