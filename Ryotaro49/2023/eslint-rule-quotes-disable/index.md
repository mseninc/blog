---
title: 'ESLint で特定のファイルのルールを変更する方法'
date:
author: Ryotaro49
tags: [ESLint, JavaScript]
description: 'ESLint で特定のファイルのルールを変更する方法を紹介します。'
---

こんにちは、 Makky です。

先日、とある JS ファイルを作った時に「**String must use singlequote**(文字列にはシングルクォートが必要ですよ！)」という Lint エラーがでてきていました。

```js:title=Lintエラー
 App •  ERROR  •  UI  Reported by ESLint:
[eslint]
/index.js
    3:11  error  Strings must use singlequote  quotes
```

基本的に Lint エラーになっているのは、コーディング規約違反ですので、本来は修正すべきです。

ただ、背景として自動生成したプログラムを組み込む際に、そのプログラムが Lint エラーを吐いていたので、 Lint エラーを無視させたいということがありました。

そこで今回は、クォートを例として、特定のファイルのみ Lint エラーが出ないように設定する方法を紹介します。

## 想定環境

- エディター: VS code v1.79.2
- Linter: ESLint v8.27.0

## 設定方法

以下のように、`overrides` を使用して新しいルールを記述します。

ただし、すでに `rules` がある場合は、**`rules`の外に `overrides` を記述してください。**

```js:title=ファイルパスを指定してルールを設定
  overrides: [               // overrides を使用して新しくルールを作ります。
    {
      files: ["./src/index.js"], // ここでファイルを指定します。
      rules: {
        quotes: ["off"],
      },
    },
  ],
```

`overrides` の中で `files` を記述し、ファイルを指定します。

これで、ダブルクォートを使っても Lint エラーは出なくなりました。
**指定したファイル**のみ `overrides` の中の `rules` のルールが適用されています。

### プロジェクト全体とファイルごとで、異なるルールを適用したい場合

`fruit.js` と`language.js` というファイルがあるとします。

```js:title=fruit.js
{
  apple: 'りんご', // シングルクォート
  grapes: "ぶどう", // ダブルクォート
  banana: `バナナ`, // バッククォート
}
```

```js:title=language.js
{
  JP: 'jp', // シングルクォート
  US: "us", // ダブルクォート
};
```

以下のコードは `rules` (プロジェクト全体) ではエラーが出るように、`overrides` (ファイルごと) では無効化するように設定しました。

```js:title=eslintrc.js
module.exports = {
  root: true,

  rules: {
    quotes: ["error", "single"], // rules にシングルクォート以外を使うとエラーが出るように設定
  },
  overrides: [
    {
      files: ["fruit.js"],
      rules: {
        quotes: ["off"], // overrides にクォートのルールを無効化するように設定
      },
    },
  ],
};
```

```js:title=結果：Lintエラー
 App •  ERROR  •  UI  Reported by ESLint:
[eslint]
/language.js
  3:7  error  Strings must use singlequote  quotes  //"us", ダブルクォート
```

出力結果は、 *`overrides` で指定していないファイル*(language.js)でシングルクォート以外を使用しているため、エラーが出ます。

ですが、**指定したファイル**(fruit.js)ではエラーが出ません。

これで、*プロジェクト単位、ファイル単位*で**異なるルール**を設定できました。

### プロパティの仕様

以下は ESLint のエラーレベルと説明を表にまとめたものです。

| エラーレベル | 説明                                                             |
| ------------ | ---------------------------------------------------------------- |
| `off`        | ルールを無効にする、エラーが表示されないためコードは実行される。 |
| `warn`       | 警告として表示されるが、コードは実行される                       |
| `error`      | エラーとして表示され、コードは実行されない                       |

ESLint のエラーレベルは 3 段階ありますので使い分けができます。

#### `fruit.js` を例に挙動を見ていく。

```js:title=index.js
{
  apple: 'りんご', // シングルクォート
  grapes: "ぶどう", // ダブルクォート
  banana: `バナナ`, // バッククォート
}
```

##### シングルクォート以外のクォートがあった場合に `error` を出すようにしてみる。

```js:title=例：シングルクォート以外をエラーとしたいとき
quotes: ["error", "single"] // 引数の1番目にエラーレベル、2番目に対象を書く
```

```js:title=結果：Lintエラー
 App •  ERROR  •  UI  Reported by ESLint:
[eslint]
/fruit.js
    3:11  error  Strings must use singlequote  quotes // "ぶどう", ダブルクォート
    4:11  error  Strings must use singlequote  quotes // `バナナ`, バッククォート
```

結果は、**コードは実行されず Lint エラーが出ます。**

ダブルクォートとバッククォートを使用したところだけエラーが出ているので、正しい結果が出ています。

ダブルクォート、バッククォートも同じようにできます。
それぞれ以下のように対応しています。

| クォートの種類   | 値         |
| ---------------- | ---------- |
| シングルクォート | `single`   |
| ダブルクォート   | `double`   |
| バッククォート   | `backtick` |

##### シングルクォート以外のクォートがあった場合に `warning` を出すようにしてみる。

```js:title=例：シングルクォート以外をwarningとしたいとき
quotes: ["warn", "single"] // 引数の1番目にエラーレベル、2番目に対象を書く
```

```js:title=結果：Lintエラー(warning)
 App •  WARNING  •  UI  Reported by ESLint:
[eslint]
/fruit.js
    3:11  warning  Strings must use singlequote  quotes // "ぶどう", ダブルクォート
    4:11  warning  Strings must use singlequote  quotes // `バナナ`, バッククォート
```

結果は、**コードは実行されて `warning` として Lint エラーが出ます。**

##### `quotes` のあとに `off` のみを記述する。

```js:title=例：すべてのクォートにルールを適用したいとき
quotes: "off" // offのみを記述
```

```js:title=結果
App •  READY  • Compiled: "UI"
```

結果は、**コードは実行され Lint エラーも出ません。**

`quotes` のあとに `off` のみを記述することによって**すべて**のクォートに対してのルールを設定できます。
（ダブルクォート、シングルクォート、バッククォートのルールを無効化しています。）

## まとめ

- ファイル単位で適用範囲を分ける

  - *プロジェクト全体*を指定してクォートを `許可・制限` したいときは **`rules` の中に記述する。**
  - *ファイル*を指定してクォートを `許可・制限` したいときは **`rules の外`の `overrides` の中に記述する。**

- クォートの種類でルールを分ける
  - *特定*のクォートを `許可`しそれ以外を `制限` したいときは **`quotes: ["error 又は warn", "特定のクォート"]`**
  - *すべて*のクォートを `許可` したいときは **`quotes: "off"`**

## 最後に

私の個人的な話なのですが、最初は日本語のサイトのみを参考にしました。

日本語のサイトのみでは、調べ方が悪かったのか問題を解決できませんでした。

ですが、英語のドキュメントを参考にするとすぐに欲しかった情報にたどり着き、解決できました！

この体験から、英語の読解力を上げて英語のドキュメントも読むことを選択肢にいれれば、エンジニアとしての問題解決力に直結するんだなと思いました。

これからも積極的に英語に触れていって、英語力を鍛えていこうと思います 💪

それではまた。

## 参考

- [Documentation - ESLint](https://eslint.org/docs/latest/rules/quotes#rule-details)
