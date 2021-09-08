---
title: Saxon-JS を使って Node.js 上で XML の XSLT 変換を行う
date: 2021-08-18
author: kenzauros
tags: [Node.js, Web, XML]
---

Node.js 上で XML を XSLT 変換したくなったので、方法を模索しました。

XSLT なにそれ食えるの？という方にはまったく用のない記事でございます。

ちなみに最終的は AWS Amplify 上で動かすことを前提にしています。今のところ成果物は無事 Amplify 上でビルドできています。

## 前提条件

- Node.js 12 以上
- [saxon-js 2.2.0](https://www.npmjs.com/package/saxon-js)
- [xslt3 2.2.0](https://www.npmjs.com/package/xslt3)
- XSLT について理解している方

## 試したパッケージ

### xslt-processor

[fiduswriter/xslt-processor: A JavaScript XSLT processor without native library dependencies](https://github.com/fiduswriter/xslt-processor)

おそらくこれが一番有名なのか、検索すると上位にでてくるのですが、開発自体は4年前で止まっていて、一部の機能が実装されていません。

変換したい XSL は `xsl:number` を含んでいたのですが、そこで `not implemented: number` というエラーが発生しました。

[xslt.js#L217-L218](https://github.com/fiduswriter/xslt-processor/blob/master/src/xslt.js#L217-L218) あたりを見ると見事に「実装されていない」とあります。

```js
case 'number':
    throw(`not implemented: ${nodename[1]}`);
```

ということで断念しました。

### xslt-ts

[backslash47/xslt: XSLT 1.0 TypeScript implementation](https://github.com/backslash47/xslt)

こちらは TypeScript の実装で、 README に従って `npm install xslt-ts xmldom-ts` と2パッケージを入れてやれば、動作しますが、 xslt の実装は xslt-processor と共通なのか、やはり `xsl:number` は実装されていません。

[xslt.ts#L199-L200](https://github.com/backslash47/xslt/blob/8f8ddf0282d1db720912a5835687642fd21745ac/src/xslt.ts#L199-L200)

## Saxon-JS

最終的に行き着いたのが、 **[Saxonica](https://www.saxonica.com/saxon-js/index.xml) 社の開発している Saxon-JS** でした。

- [Saxon-JS About Saxon-JS](https://www.saxonica.com/saxon-js/documentation/index.html)

ホームページは XSLT と同じく歴史を感じさせる趣ですが、現在でも継続して開発が続けられているのが素晴らしいですね。

ただし、無償で利用できるものの、ライセンスはオープンソースではありません（ソースコードは公開されているが、知的財産権は同社が保有）。

> Although the source code of Saxon-JS is made available, the product is not open source. The code is the intellectual property of Saxonica, except for open source components listed below.
>
> [Saxon-JS Licensing](https://www.saxonica.com/saxon-js/documentation/index.html#!conditions)

### インストール

`saxon-js` と `xslt3` をインストールします。いずれも Saxonica 社のパッケージです。

- [Saxon-JS Installing and running in Node.js](https://www.saxonica.com/saxon-js/documentation/index.html#!starting/installing-nodejs)

```sh
$ npm install saxon-js xslt3
```

### 事前準備: テンプレートの変換

少々不便な点ですが、 xsl テンプレートを事前に `.sef.json` という JSON 形式に変換しておく必要があります。

- [Saxon-JS Compiling stylesheets using Saxon-JS](https://www.saxonica.com/saxon-js/documentation/index.html#!starting/export/compiling-using-XX)

インストールした xslt3 モジュールで変換できます。

```sh
$ node_modules/.bin/xslt3 -xsl:path/to/stylesheet.xsl -export:path/to/stylesheet.sef.json -t -ns:##html5 -nogo
```

ちなみにこの変換も JS でできればいいのですが、公開されていないようなので CLI で事前にやっておくしかないようです。

> Using the JavaScript API
> There is no published API available at this release for compiling stylesheets using the XX compiler. This should be done using the command-line interface.
>
> [Saxon-JS Compiling stylesheets using Saxon-JS](https://www.saxonica.com/saxon-js/documentation/index.html#!starting/export/compiling-using-XX)


### XSLT 変換

基本的には **`SaxonJS.transform` 関数** にコンパイル済みのスタイルシート (`.sef.json`) と 変換元の XML を渡すだけです。

- [Saxon-JS SaxonJS.transform](https://www.saxonica.com/saxon-js/documentation/index.html#!api/transform)

なお、 `transform` の第2引数に `'async'` を渡すと Promise を返してくれますので、 async/await で使えます。ここではこの async バージョンのみ紹介します。

#### 結果を文字列で取得するとき

`destination` オプションに **`'serialized'`** を指定します。これで文字列にシリアライズされた状態の結果が得られます。

ちなみに `destination` を指定しないか、 `application` などにすると変換後のドキュメントがオブジェクト形式で得られますが、特に必要がなく使っていないため詳細は調べていません。

```js
import SaxonJS from 'saxon-js';

async function transformExample() {
    const { principalResult } = await SaxonJS.transform({
        stylesheetFileName: 'path/to/stylesheet.sef.json',
        sourceFileName: 'path/to/source.xml',
        destination: 'serialized',
    }, 'async');
    // 'principalResult' will be transformed text
    // Feel free to use result string!
}
transformExample();
```

#### 結果をファイルに出力するとき

結果をファイルに出力したい場合は `destination` オプションに **`'file'`** を指定します。

この場合、出力先のファイルを `baseOutputURI` オプションに URI 形式で渡す必要があります。

つまり、ローカルファイルシステムであれば `file:///` から始まる文字列でなければなりませんので、 Node.js の url モジュールにある `pathToFileURL` 関数で URI 形式に変換して渡します。

```js
import SaxonJS from 'saxon-js';
import { pathToFileURL } from 'url';

async function transformExample() {
    const { href: baseOutputURI } = pathToFileURL('path/to/output_file');
    await SaxonJS.transform({
        stylesheetFileName: 'path/to/template.sef.json',
        sourceFileName: 'path/to/source.xml',
        destination: 'file',
        baseOutputURI,
    }, 'async');
}
transformExample();
```

シリアライズされた文字列を `fs.writeFile` などで書き出してもあまり手間は変わりませんが、たぶん stream で書き込むのだと思うので、メモリ的には有利なんじゃないでしょうか（推測）。

## まとめ

Node.js 上で XML を XSLT 変換したくなったので、方法をご紹介しました。

1. `saxon-js`, `xslt3` をインストール
1. `.xsl` ファイルを `.sef.json` ファイルに変換
1. SaxonJS.transform 関数で XSLT 変換

とても便利なパッケージを提供してくださっている Saxonica 社に感謝します。
