---
title: "Gatsby で KaTeX を適用しました"
date: 
author: Lee-juNu
tags: [KaTex, 数式, マークダウン]
description: "Gatsby で gatsby-remark-katex をインストールし KaTex を書けるようにする方法。
インストールから初めて簡単な出力まで書いてみました。"
---

## 挨拶

こんにちは「リリ」です。ブログで何を書くかを悩んでいた時がありましたが昔趣味でいじっていた Shader に関して少し書いてみたいと思って Katex を適用しました。
今日は**KaTeX**、**適用方法**そして簡単に書き方を書きたいと思います。

## なぜ KaTeX だったのか？
1. イメージではなく SVG で出力されるためブラウザ、大きさに関係なくきれいに描かれる。
2. SVG で描かれる分 LaTeX、MathJax より早くレンダリングされる。
3. インストール後適用までが簡単だったため。

## Gatsby に適用する方法


[gatsby-remark-katex](https://www.gatsbyjs.com/plugins/gatsby-remark-katex/)

1. KaTeX の Plugin をインストールします。

```shell:title=インストール
npm install gatsby-transformer-remark gatsby-remark-katex katex
```

2. gatsby-config.js を探して下記のコードを追加しましょう

```js:title=gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-katex`,
          options: {
            // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
            strict: `ignore`
          }
        }
      ],
    },
  },
],
```

`gatsby-transformer-remark` がすでに存在している場合は、下記のコードのように一部入れることで適用できます。


```js{5-11}:title=gatsby-config.js
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-katex`,
          options: {
            // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
            strict: `ignore`,
          },
        },
        {
          resolve: `gatsby-remark-images`,
          options: {
            showCaptions: true,
            markdownCaptions: true,
            maxWidth: 630,
          },
        },
      ],
    },
  },
```

最後には js に css を適用すれば終わりです。
私の場合は Poster を作ってくれる js にインポートさせました。

## 確認と簡単な数式

無事に適用が終わったのか確認するためロゴを出力してみます。

```:title=KaTex&nbsp;出力
${\KaTeX}$
```
${\KaTeX}$

無事に出力されるのが確認されました。では少し数式を書いてみます。


### 数式 - インライン出力
インラインでの表現は $ で囲む形を作れば出力可能です。

```:title=インライン入力
$x+y=5$
```
$x+y=5$

### 数式 - ディスプレイモード
中央そろえで並びながら複数行の出力する「ディスプレイモード」は $$ で囲む形になります。改行は \\ を使って行います。

```:title=数式ボックス入力
$$
x+y=5\\
x+2y=7\\
x=3\\
y=2
$$
```

$$
\begin{cases} 
x+y=5\\
x+2y=7\\
\end{cases}\\
x=3\\
y=2
$$

## 詳細な数式の入力方法は次の記事で…

もともとは今回の記事で続いて数式を書いていく計画でしたが長くなると判断し記事を分けることにしました。
この記事を書く前から少しずつフォーマットを作っていましたので早めに持ってこられるよう頑張ります。
次に来るときはドキュメント風になりそうですね。
