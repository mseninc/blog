---
title: 題目「Quasar ことはじめ」で v-kansai の LT に登壇してきました
date: 2019-08-31
author: k-so16
tags: [Vue.js, その他, 〇〇奮闘記]
---

こんにちは。最近、久々に PC の中を軽く掃除した k-so16 です。 CPU とグラフィックボードのファン回りに溜まっていた埃を掻き出せて、少しスッキリしました。

8/21 に開催された [v-kansai Vue.js/Nuxt Meetup #9 (FJUG Osaka共催)](https://vuekansai.connpass.com/event/137411/) で、「Quasar ことはじめ」というタイトルで登壇してきました。今回は全枠 LT で、 [FJUG Osaka](https://fjug-osaka.connpass.com/) (Firebase Japan User) との共催でした。前半は Firebase に関する LT が、後半は Vue.js に関する LT が行われました。今回はトップバッターではなかったので、多少気が楽でした（笑）(Vue.js の LT 枠ではトップバッターでしたが)


## 発表内容
最近業務で使い始めた [Quasar](https://quasar.dev/) について発表しました。 5 分という短い時間での発表でしたので、概要とメリット、利用例などを簡単に紹介しました。発表資料は [こちら](https://speakerdeck.com/azuki/quasar-kotohazime) から閲覧できます。

発表概要は以下の通りです。

- Quasar の紹介
- Quasar のメリット
    - マルチプラットフォーム開発が容易
    - User Agent の識別が容易
- Quasar のインストール
    - Quasar CLI のインストール方法の紹介
- プロジェクトの作成とビルド
    - Quasar CLI を利用
- 今後の希望
    - Laravel-Mix でのコンパイル


## LT 全体の概要
全体的に、 Vue.js についての話が多かったように感じます。 Firebase の LT 枠でも、 Vue.js が関連していました。

勉強会全体での発表内容の例は以下の通りです。

- SPA のアプリ作成と運用で Vue.js と Firebase を学ぶ
- Firebase Dynamic Links の紹介
- Vue と Firestore で ToDoアプリの作成
- Vue CLI のを使ったテスト
- Nuxt 2.9 リリース
- GitHub Actions で Nuxt を Firebase にデプロイする

実際に使ってみた感想を聞くのは非常に面白く、どこで困ったか、どう解決したかは将来的に自分にも役立つ知見になりそうだと感じました。例えば、 Vue.js と Firebase で SPA を実際に作成して運用した話では、 Firebase の Cloud Firestore は 1 秒あたり 1 回しか書き込めず、同時にドキュメントへの書き込みが出来ないので、分散カウンタというものを利用することで、解決するようです。 Vuex の store と Firebase をリアクティブに紐づけるためには、 VuexFire を使うことで実現できるとのことでした。同様のものとして、 RxFire を使うという手段もあるようで、こちらは VuexFire より高度だそうです。

無料でも Firebase が使えるということで、いずれは使ってみたいなと思っているので、今回の発表内容は聴講していて非常に参考になりました。 Firebase を利用して、同じ問題に直面した時に、今回聴講した内容を思い出して解決出来たら良いなと思います。


## 所感
今回の発表では、 Quasar を知っている人がほとんど見受けられなかったので、 Quasar を知ってもらう良い機会でした。特に、 Electron や Cordova を簡単に利用できるというのは大きなメリットで、モバイルアプリケーションの開発に良さそうという感想も聞けたので、有意義な発表が出来たと思います。

何度か登壇はしましたが、まだ話す時は緊張気味で、途中で詰まったりすることがあるので、その点は改善が必要だと考えています。おそらく慣れの問題なので、とにかく場数をこなしたいと思います。