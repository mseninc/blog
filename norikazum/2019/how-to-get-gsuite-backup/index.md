---
title: "[Google] GSuiteのバックアップを取得する方法"
date: 2019-11-29
author: norikazum
tags: [Google]
---

こんにちは。

今回は **Google のサービスをバックアップを取得する方法** を紹介します。

## 手順

手順は簡単です。

1. **Googleアカウントにログインした状態** で以下にアクセスします。
[自分のデータをダウンロード](https://takeout.google.com/settings/takeout)

1. **バックアップを取りたいサービスにチェックを入れ、次のステップへ** 進みます。
**GMailやGoogleドライブだけではなく、ハングアウトなど様々なサービス** が選択できます。
![](images/how-to-get-gsuite-backup-1.png)
![](images/how-to-get-gsuite-backup-2.png)

1. **アーカイブ形式を選択し、アーカイブを作成をクリックするとバックアップが開始** されます。
![](images/how-to-get-gsuite-backup-3.png)
**配信方法も複数選択肢が準備** されています。素晴らしい。
![](images/how-to-get-gsuite-backup-4.png)

**開始すると、以下のようなメール** が来ます。
![](images/how-to-get-gsuite-backup-5.png)

**完了すると、以下のようなメール** が来ます。
![](images/how-to-get-gsuite-backup-6.png)

**ダウンロードに進むと、指定したサイズで分割されておりそれぞれダウンロード** します。
タイミングの問題だったのか、1.9GB程度のサイズでも30分ほどかかった感じでした。
![](images/how-to-get-gsuite-backup-7.png)

あとは、解凍して適宜復元という感じです。

## あとがき
私は、解凍ソフトに昔から **Lhaplus** を利用しているのですが、ダウンロードしたバックアップデータをLhaplusで解凍すると **文字化け** します。

![](images/how-to-get-gsuite-backup-8.png)

↓

![](images/how-to-get-gsuite-backup-9.png)

**涙**

Googleもまだまだだな、と思っていたら、これは **Lhaplusが悪さ** をしているようで検索すると記事にされている方もいました。
[Googleドライブからダウンロードしたファイル名が文字化けする場合の対処方法 | TeraDas](https://www.teradas.net/archives/31267/)

確かに、 **7zipで解凍してみると文字化けしません** でした。

↓

![](images/how-to-get-gsuite-backup-10.png)

慣れ親しんだ解凍ソフトウェアを変えようかと悩む出来事でした。。

それでは次回の記事でお会いしましょう。
