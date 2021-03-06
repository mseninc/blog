---
title: 題目「Vue.js と Chart.js でチャートを描画する」でフロントエンドLT会 - vol.3に登壇してきました
date: 2021-07-08
author: k-so16
tags: [Vue.js, その他, 〇〇奮闘記]
---

こんにちは。最近、近所の [KALDI](https://www.kaldi.co.jp/) で [Tindy](https://www.asolodolce.it/en/Filled--Pastries/Tindy/Tindy--Filled-with-hazelnut-cream) というお菓子を買って食べてみた k-so16 です。海外のお菓子なので結構甘いのかなと思いましたが、甘すぎず美味しいと感じました笑

6/30 に開催された [フロントエンドLT会 - vol.3](https://rakus.connpass.com/event/214484/) に「Vue.js と Chart.js でチャートを描画する」という題目で登壇してきました。個人的な開発で **[vue-chartjs](https://vue-chartjs.org/)** を利用してみたので、何かしらの勉強会で vue-chartjs に関する発表をしたいと思っていたところ、今回のイベントが目に留まったので、登壇することにしました。しばらく登壇していなかったので、そろそろ登壇したいなとも思っていたので、ちょうどタイミングが良かったように感じました。

本記事では、イベントの概要や様子についてご紹介します。

## 発表内容

Vue.js でチャートを描画するライブラリ vue-chartjs について、導入方法と基本的な使い方や実用例を紹介しました。発表資料は [こちら](https://speakerdeck.com/azuki/vue-dot-js-to-chart-dot-js-detiyatowomiao-hua-suru) から閲覧できます。

今回のイベントでは、発表の持ち時間は 5 分または 10 分から選べたので、 10 分枠で発表することにしました。

発表概要は以下の通りです。

- vue-chartjs の紹介
    - vue-chartjs の特徴を紹介
    - インストール手順の説明
- vue-chartjs の基本的な使い方の説明
    - 各チャートの描画で共通する処理の説明
    - 描画データの設定方法の説明
    - チャートごとの描画方法の説明
        - 例として棒グラフと線グラフの描画方法を説明
- リアクティブなチャートの描画方法の説明
    - `reactiveProp` の概要を説明
    - リアクティブなチャートをデモで実演
- vue-chartjs の利用例を紹介

個人で vue-chartjs を利用してみて、 Vue.js を知っていると **結構手軽にチャートを描画できて便利** だと感じたので、今回の登壇で紹介してみようと思いました。データの更新に併せてチャートの描画も変化させたい場合は、 **`reactiveProp`** を利用することで **Vue.js のリアクティブシステム同様に実現できる** のも面白い点だと思います。リアルタイムな投票結果の描画などに使ったら面白いかもしれませんね。

## イベント全体の発表概要

今回のイベントでは、筆者の発表も含めて全体で 12 枠の発表がありました。今回のイベントは少し遅れて参加したので、残念ながら最初の発表だけ聞けませんでした。

全体の発表は以下の通りです。

- Vue CLI のプロジェクトに Vite を導入
- 新規開発を止めずに Angular から React にリプレイス
- Next.js, Nest.js, Prisma2 で Web サービス作成
- 未経験からみた React の良い点と苦労点
- Vue Composition API と TypeScript で TypeError に遭遇した話
- React と Amplify でアプリケーション開発
- SVG でボーンアニメーションを作る方法
- 投げ銭機能付き Qiita のようなサービスを作った話
- throttle の活用方法
- フィーチャーグラフを利用した開発方法
- VSCode Remote Containers による開発

今回のイベントでは、特に Next.js, Nest.js, Prisma2 による Web サービスの開発についての発表が面白いと感じました。この発表では、フロントエンドもバックエンドもすべて JavaScript を使って Web サービスを開発するといった内容でした。

フロントエンドには React のフレームワークである **Next.js** を用いていました。発表では、 **ISR** (Incremental Static Regeneration) を用いて静的なページを生成してキャッシュさせることで、 **コンテンツの配信を高速化** できることが Next.js の利点と紹介されていました。 

サーバーサイドには **Nest.js** を利用していました。元々は Ruby on Rails (以降 Rails と表記) で API サーバーを作成していたようですが、フロントエンドとサーバーサイドで言語が違い、頭の切り替えが少し大変なこと、 Rails は API サーバーを立てるだけの用途には少し大げさと感じていたそうです。

Nest.js はフロントエンドと同様に JavaScript で記述できるため、頭の切り替えが不要になり、さらに **TypeScript** を利用すれば、 **フロントエンドとサーバーサイドで型定義も共有できる** ことがメリットとして述べられていました。また、 Nest.js の方が Rails よりも API サーバーとしてのアーキテクチャが最適化されているとも述べられていました。

OR マッパー (以降 ORM と表記) には **Prisma2** を利用していました。 Prisma2 は **ドキュメントが充実** していて扱いやすいことが利点として挙げられていました。

筆者は Prisma2 は初耳だったので、 sequelize 以外の ORM を知る良いきっかけになりました。個人的に sequelize のドキュメントは少し読みづらいと感じていたので、ぜひとも Prisma2 も使ってみて比較してみたいと思いました。

筆者はフロントエンドに Nuxt.js, バックエンドに Express, ORM に sequelize という組み合わせで Web アプリケーション開発に携わった経験はあるのですが、 Next.js, Nest.js, Prisma2 という組み合わせでの開発はしたことがないので、どのような違いがあるか関心を持ちました。今までフロントエンドのフレームワークは Vue.js しか使ったことがないので、 React を使ってみて、どういった場面で使いやすいかを比較してみたいところです。

## 所感

途中で Zoom の接続が切れるというトラブルにも見舞われましたが、発表自体はそこそこスムーズに進められたと思います。 Zoom だとデモを動かした際に聴講者のリアクションがリアルタイムに分からないのは少し寂しいようにも感じましたが、発表後に司会の方がチャットや Twitter のコメントや質問等を読んでくださったので、ある程度聴講者の感想を知ることができました。

また、今回の発表用のデモを作成するにあたって、 **インストール手順や動作確認手順は改めて確認しておくと良い** という知見を得られたのも良い経験となりました。デモ用のプロジェクトを作成したのですが、なぜか動作しないという事象に見舞われました。調べてみたところ、 vue-chartjs と一緒にインストールする **chart.js の 3.x 系が vue-chartjs に対応していない** ことが原因でした。そのため、 2.x 系の chart.js を指定してインストールする必要がありました。公式ドキュメントには明記されていなかったので、これから利用する方にとって良い知見を共有できたのではないかと考えています。

外部のイベントへの参加回数がかなり落ちてしまったので、今回を機に積極的に聴講したり登壇したりしていきたいと思います。