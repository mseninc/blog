---
title: "[Google] GSuiteのバックアップを取得する方法"
date: 2019-11-29
author: norikazum
tags: [Google, その他, ライフハック]
---

こんにちは。

今回は **Google のサービスをバックアップを取得する方法** を紹介します。

## 手順

手順は簡単です。

1. **Googleアカウントにログインした状態** で以下にアクセスします。
[自分のデータをダウンロード](https://takeout.google.com/settings/takeout)

1. **バックアップを取りたいサービスにチェックを入れ、次のステップへ** 進みます。
**GMailやGoogleドライブだけではなく、ハングアウトなど様々なサービス** が選択できます。
<a href="images/how-to-get-gsuite-backup-1.png"><img src="images/how-to-get-gsuite-backup-1.png" alt="" width="1809" height="1480" class="alignnone size-full wp-image-11004" /></a>
<a href="images/how-to-get-gsuite-backup-2.png"><img src="images/how-to-get-gsuite-backup-2.png" alt="" width="872" height="309" class="alignnone size-full wp-image-11005" /></a>

1. **アーカイブ形式を選択し、アーカイブを作成をクリックするとバックアップが開始** されます。
<a href="images/how-to-get-gsuite-backup-3.png"><img src="images/how-to-get-gsuite-backup-3.png" alt="" width="864" height="1025" class="alignnone size-full wp-image-11006" /></a>
**配信方法も複数選択肢が準備** されています。素晴らしい。
<a href="images/how-to-get-gsuite-backup-4.png"><img src="images/how-to-get-gsuite-backup-4.png" alt="" width="422" height="308" class="alignnone size-full wp-image-11007" /></a>

**開始すると、以下のようなメール** が来ます。
<a href="images/how-to-get-gsuite-backup-5.png"><img src="images/how-to-get-gsuite-backup-5.png" alt="" width="1437" height="1133" class="alignnone size-full wp-image-11008" /></a>

**完了すると、以下のようなメール** が来ます。
<a href="images/how-to-get-gsuite-backup-6.png"><img src="images/how-to-get-gsuite-backup-6.png" alt="" width="1413" height="1303" class="alignnone size-full wp-image-11009" /></a>

**ダウンロードに進むと、指定したサイズで分割されておりそれぞれダウンロード** します。
タイミングの問題だったのか、1.9GB程度のサイズでも30分ほどかかった感じでした。
<a href="images/how-to-get-gsuite-backup-7.png"><img src="images/how-to-get-gsuite-backup-7.png" alt="" width="447" height="697" class="alignnone size-full wp-image-11010" /></a>

あとは、解凍して適宜復元という感じです。

## あとがき
私は、解凍ソフトに昔から **Lhaplus** を利用しているのですが、ダウンロードしたバックアップデータをLhaplusで解凍すると **文字化け** します。

<a href="images/how-to-get-gsuite-backup-8.png"><img src="images/how-to-get-gsuite-backup-8.png" alt="" width="133" height="100" class="alignnone size-full wp-image-11486" /></a>

↓

<a href="images/how-to-get-gsuite-backup-9.png"><img src="images/how-to-get-gsuite-backup-9.png" alt="" width="657" height="655" class="alignnone size-full wp-image-11487" /></a>

**涙**

Googleもまだまだだな、と思っていたら、これは **Lhaplusが悪さ** をしているようで検索すると記事にされている方もいました。
[Googleドライブからダウンロードしたファイル名が文字化けする場合の対処方法 | TeraDas](https://www.teradas.net/archives/31267/)

確かに、 **7zipで解凍してみると文字化けしません** でした。

↓

<a href="images/how-to-get-gsuite-backup-10.png"><img src="images/how-to-get-gsuite-backup-10.png" alt="" width="686" height="640" class="alignnone size-full wp-image-11489" /></a>

慣れ親しんだ解凍ソフトウェアを変えようかと悩む出来事でした。。

それでは次回の記事でお会いしましょう。