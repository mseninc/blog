---
title: Markdown 記法のリンクを取得するブックマークレット MDLink
date: 2016-05-31
author: kenzauros
tags: [Markdown, Bookmarklet, その他, ライフハック]
---

Markdown でこういった記事を書いていると、参考サイトなどのリンクを貼ることがよくあります。

そんなときにいちいちタイトルをコピペ → URL をコピペってしてるとめんどくさいので、ブックマークレットを作って使っています。よろしければご活用ください。

## ブックマークレットの登録方法

<span style="font-size:200%"><a href="javascript:prompt('','['+document.title.replace(/([\[\]])/g,'\\$1')+']('+location.href+')');">MDLink</a></span>

* 方法1. 上の MDLink というリンクをドラッグして、ブラウザのブックマークバー（お気に入りバー）にドロップする
* 方法2. とりあえずブックマーク（お気に入り）ボタンを押して適当なページをブックマークし、ブックマークの編集で URL 部分に `javascript:prompt('MDLink','['+document.title.replace(/([\[\]])/g,'\\$1')+']('+location.href+')');` をコピペする

わからなければ "[ブックマークレット 登録方法](https://www.google.co.jp/search?q=ブックマークレット%20登録方法)" とかでググりましょう。

## 使い方

1. リンクを作成したいページで追加したブックマークレットをクリックする
2. 表示された Markdown をコピーする
3. 自由に使う

## ソースコード

内容はごく簡単で、 `[タイトル](URL)` の形式を prompt で表示しているだけです。

```javascript
prompt('MDLink','['+document.title.replace(/([\[\]])/g,'\\$1')+']('+location.href+')');
```

幸せな Markdown ライフをお過ごしください。