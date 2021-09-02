---
title: Laravel Mix (5.5) で ES6 async/await を変換できるようにするには
date: 2018-01-22
author: kenzauros
tags: [ES2015(ES6), ES2017, Laravel, Babel, Webpack, Web]
---

Laravel 5.5 のアセットコンパイラである **Laravel Mix** (Elixir から名前が変わった) のフロントエンドで async/await が使いたかったので設定しました。

## 概要

Mix の裏側ではバンドラーの [Webpack](https://webpack.js.org/) と JavaScript コンパイラーである [Babel](https://babeljs.io/) が動いています。

Webpack の設定変更は `webpack.mix.js` でできますが、今回は Babel の設定だけで実現できるので `webpack.mix.js` の編集は不要です。

## .babelrc を追加

プロジェクトルートに `.babelrc` を配置するとその設定を読み込んで Babel を実行してくれます。

今の Babel はコンパイルする機能の ON/OFF をプリセットで行うようになっているので、 `presets` にプリセットを指定します。

前は `["es2015", "stage-3"]` とやっていましたが、面倒なので **babel-preset-env** に乗り換えました。

```
{
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7"]
      }
    }]
  ]
}
```

## babel-preset-env のインストール

.babelrc に書いた **babel-preset-env** を使用するため、　npm でインストールしておきます。

```
npm i -D babel-preset-env
```

## 完了

あとは **`npm run dev`** するだけでコンパイルできちゃいます。
