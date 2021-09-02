---
title: GSuiteで組織管理者からドライブの容量を増やす方法
date: 2019-03-25
author: norikazum
tags: [Google, GSuite, その他, ライフハック]
---

こんにちは。

ある日、GMailの上部にこんな通知があらわれました。
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-1.png)

こちらから確認すると、99%利用で枯渇寸前でした。
[ドライブ ストレージ](https://drive.google.com/u/1/settings/storage?i=u)

![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-2.png)

上記画面から容量を追加することも出来ますが、Googleサポートに確認するとこの場合、 **支払いが組織への一括請求とならない**ようで、管理者から容量を追加します。

## Google ドライブストレージのライセンスを有効にする
1. [管理コンソール](https://admin.google.com/msen.jp/AdminHome?hl=ja#) にアクセス
1. 左上の **三** から **アプリ → GSuite** と進みます
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-3.png)
1. **サービスを追加** をクリックします
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-4.png)
1. **Googleドライブストレージ** の **今すぐ追加** をクリックします
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-5.png)
1. **開始する** をクリックします
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-6.png)
1. **次へ** をクリックします ( **この画面で支払いは確定しません** )
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-7.png)
1. 支払い情報を確認し **次へ** をクリックします 
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-8.png)
1. **次へ** をクリックします
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-9.png)
**Google ドライブストレージがアクティブ** になり追加されたことが確認できます
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-10.png)

## ユーザーに容量追加オプションを適用する
1. 左上の **三** から **ディレクトリ → ユーザー** と進みます
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-11.png)
1. 追加する **ユーザーをチェック(①)** し、右上の **┇(②)** をクリックし **ライセンスを割り当てる(③)** をクリックします
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-12.png)
1. プランを選択し、 **割当** をクリックします (画像の20GBは最小単位です)
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-13.png)
プラン右の▼をクリックすると選択一覧がでます
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-14.png)

以上で完了です。

## 確認
再度、以下のリンクから確認してみます。
[ドライブ ストレージ](https://drive.google.com/u/1/settings/storage?i=u)

無事増えていました。

![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-15.png)

すぐにアクセスすると **!マーク** が表示されていましたが2,3分まってF5でページを更新すれば増えました。

## 参考リンク
公式の参考ページは以下のリンクになります。

[ユーザー向けのドライブ ストレージの追加購入 - G Suite 管理者 ヘルプ](https://support.google.com/a/answer/1726914)

## あとがき
ただ・・・、読んでいただき気づかれたかもしれませんが個人ページから増量する方が **100GBでも月250円** と安いように見えます。
![](images/how-to-increase-drive-capacity-from-organization-administrators-with-gsuite-16.png)

こちらは再度Googleに問い合わせをして続報を掲載したいと思います。

それでは次回の記事でお会いしましょう。