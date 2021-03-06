---
title: API Blueprintを使ってAPI設計書を作成する
date: 2020-10-12
author: junya-gera
tags: [その他]
---

こんにちは、じゅんじゅんです。9月から始まった、フロントエンドにNuxt.js、バックエンドにNode.jsを使用した新システムの開発の際、最初にDB、APIの設計を行いましたが、その際API Blueprintという言語を使ってAPI設計書を作成しました。

私自身Blueprintを触ったのは初めてで（存在も知らなかった）、参考文献があまり多くなく、英語で書かれたチュートリアルを読みながら基本的な書き方を学んでいきました。

英語を読む練習にはなりましたが、書き方を知るだけで結構な時間がかかってしまったので、備忘録も兼ねてまとめてみようと思います。

ちなみにこの記事ではBlueprintの基本的な書き方の解説にとどめ、API設計自体の解説は行いません。


## API Blueprintの特徴
API BlueprintはWeb APIの仕様を記述できる言語であり、Markdownを拡張した形式で書くことができます（拡張子はapib）。ところどころBlueprint特有のルールがあるので少し戸惑いますが、そこに気を付ければ簡単に設計書を作ることができるので効率化に繋がります。

Markdown拡張方式で記述したapibファイルをaglioというツールを使用してHTML化します。

## APIの名前とメタデータを指定
最初にメタデータを設定し、設計書の名前と説明を記述します。
```
FORMAT: 1A

# 掲示板
なんやかんや話し合う掲示板
```
1Aは現在のBlueprintのバージョンを指します。