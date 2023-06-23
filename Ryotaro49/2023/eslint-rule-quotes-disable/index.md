---
title: 'ESLint で特定のファイルのルールを変更する方法'
date:
author: Ryotaro49
tags: [ESLint, JavaScript]
description: 'ESLint で特定のファイルのルールを変更する方法を紹介します。'
---

こんにちは、 Makky です。

先日、とある JS ファイルを作った時に「**String must use singlequote**(文字列にはシングルクォートが必要ですよ！)」という Lint エラーがでてきていました。

```js{4}:title=Lintエラー
 App •  ERROR  •  UI  Reported by ESLint:
[eslint]
/index.js
    3:11  error  Strings must use singlequote  quotes
```

基本的に Lint エラーになっているのは、コーディング規約違反ですので、本来は修正すべきです。

ただ、背景として自動生成したソースコードをそのまま使うため、 Linter のルールを適用させたくないということがありました。

そこで今回は、クォートを例として、**特定のファイルのみ**別のルールを適用する方法を紹介します。

## 想定環境

- エディター: VS code v1.79.2
- Linter: ESLint v8.27.0

## 設定方法

以下のように、`overrides` を使用して新しいルールを `.eslintrc.js` に記述します。

ただし、すでに `rules` がある場合は、**すでにある `rules` と `overrides` を同レベルの階層に記述してください。**

```js{4}:title=ファイルパスを指定してルールを設定
  rules: {
    quotes: ["error", "single"],
  },
  overrides: [ // overrides を使用して新しくルールを作ります。
    {
      files: ["./src/index.js"], // ここでファイルを指定します。
      rules: {
        quotes: ["off"],
      },
    },
  ],
```

`overrides` の中で `files` を記述し、ファイルを指定します。

**指定したファイル**のみ `overrides` の中の `rules` のルールが適用されています。

これで、ダブルクォートを使っても Lint エラーは出なくなりました。

### プロジェクト全体とファイルごとで、異なるルールを適用したい場合

`fruit.js` と`language.js` というファイルがあるとします。

```js{numberLines:1}:title=fruit.js
{
  apple: 'りんご', // シングルクォート
  grapes: "ぶどう", // ダブルクォート
  banana: `バナナ`, // バッククォート
}
```

```js{numberLines:1}:title=language.js
{
  JP: 'jp', // シングルクォート
  US: "us", // ダブルクォート
};
```

以下のコードは `rules` (プロジェクト全体) ではエラーが出るように、`overrides` (ファイルごと) では無効化するように設定しました。

```js:title=.eslintrc.js
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

```js{4}:title=結果：Lintエラー
 App •  ERROR  •  UI  Reported by ESLint:
[eslint]
/language.js
  3:7  error  Strings must use singlequote  quotes  //"us", ダブルクォート
```

出力結果は、 *`overrides` で指定していないファイル*( `language.js` )でシングルクォート以外を使用しているため、エラーが出ます。

**指定したファイル**( `fruit.js` )ではエラーが出ません。

これで、*プロジェクト単位、ファイル単位*で**異なるルール**を設定できました。

### プロパティの仕様

以下は ESLint のエラーレベルと説明を表にまとめたものです。

| エラーレベル | 説明                                                             |
| ------------ | ---------------------------------------------------------------- |
| `off`        | ルールを無効にする、ESLint の実行結果は成功とする。 |
| `warn`       | 警告として表示されるが、ESLint の実行結果は成功とする。                       |
| `error`      | エラーとして表示され、終了コードを1（失敗）とし、ESLint の実行結果は失敗とする。                       |

ESLint のエラーレベルは 3 段階ありますので使い分けができます。

#### `fruit.js` を例に挙動を見ていく。

```js{numberLines:1}:title=fruit.js
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

```js{4-5}:title=結果：Lintエラー
 App •  ERROR  •  UI  Reported by ESLint:
[eslint]
/fruit.js
    3:11  error  Strings must use singlequote  quotes // "ぶどう", ダブルクォート
    4:11  error  Strings must use singlequote  quotes // `バナナ`, バッククォート
```

**ESLint の実行結果は失敗となり、 Lint エラーが出ます。**

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

```js{4-5}:title=結果：Lintエラー(warning)
 App •  WARNING  •  UI  Reported by ESLint:
[eslint]
/fruit.js
    3:11  warning  Strings must use singlequote  quotes // "ぶどう", ダブルクォート
    4:11  warning  Strings must use singlequote  quotes // `バナナ`, バッククォート
```

**ESLint の実行結果は成功するが、 `warning` として Lint エラーが出ます。**

##### `quotes` のあとに `off` のみを記述する。

```js:title=例：すべてのクォートにルールを適用したいとき
quotes: "off" // offのみを記述
```

```js:title=結果
App •  READY  • Compiled: "UI"
```

**ESLint の実行結果は成功し、 Lint エラーも出ません。**

`quotes` のあとに `off` のみを記述することによって**すべて**のクォートに対してのルールを設定できます。
（ダブルクォート、シングルクォート、バッククォートのルールを無効化しています。）

## まとめ

- ファイル単位で適用範囲を分ける

  - *プロジェクト全体*を指定してクォートを `許可・制限` したいときは **`rules` の中に記述する。**
  - *ファイル*を指定してクォートを `許可・制限` したいときは **`overrides` の中に記述する。**

- クォートの種類でルールを分ける
  - *特定*のクォートを `許可`しそれ以外を `制限` したいときは **`quotes: ["error 又は warn", "特定のクォート"]`**
  - *すべて*のクォートを `許可` したいときは **`quotes: "off"`**

## 最後に

私の個人的な話なのですが、最初は日本語のサイトのみを参考にしました。

日本語のサイトのみでは、調べ方が悪かったのか問題を解決できませんでした。

しかし、英語のドキュメントを参考にするとすぐに欲しかった情報にたどり着き、解決できました！

この体験から、英語の読解力を上げて英語のドキュメントも読むことを選択肢にいれれば、エンジニアとしての問題解決力に直結するんだなと思いました。

これからも積極的に英語に触れていって、英語力を鍛えていこうと思います 💪

それではまた。

## 参考

- [Documentation - ESLint](https://eslint.org/docs/latest/rules/quotes#rule-details)
