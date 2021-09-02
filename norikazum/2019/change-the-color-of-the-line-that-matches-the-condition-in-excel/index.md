---
title: "[Excel] 解決：条件に一致した行全体の色を変える方法"
date: 2019-04-10
author: norikazum
tags: [Excel, その他, ライフハック]
---

こんにちは。

今回は、 **Excelの条件付き書式** を使って、 **条件に一致した行の色を変える** 方法を紹介します。

一部、うまくいかず **はまってしまった** のでその点についても記載します。

バージョンは、**Excel 2016** です。

以下のようなExcelを例に、各行のD列に対して以下の条件を設定します。
1. **完了** の場合 → 行全体を **グレー** に
2. **対応中** の場合 → なにもしない
3. **保留** の場合 → 行全体を **グレー** に
4. **回答待ち** の場合 → 行全体を **緑** に

<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-1.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-1.png" alt="" width="803" height="305" class="alignnone size-full wp-image-9274" /></a>

## 手順

1. **C4:F8** を選択し、 **条件付き書式** をクリックし **新しいルール** へ進みます
<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-2.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-2.png" alt="" width="1050" height="581" class="alignnone size-full wp-image-9275" /></a>

1. **数式を使用して、書式設定するセルを決定(①)** を選択し、 **(③)の位置を一度クリック**して、 **ステータスを示すセルを1つ(②)** をクリックし、 ③の数式に続けて **="完了"** を追記します。続けて **書式設定(④)** に進みます。
<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-3.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-3.png" alt="" width="1098" height="610" class="alignnone size-full wp-image-9276" /></a>

1. 完了はグレーなので **塗りつぶしでグレーを指定** します
<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-4.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-4.png" alt="" width="703" height="721" class="alignnone size-full wp-image-9277" /></a>

1. 画像の状態になるので、OKをクリックします
<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-5.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-5.png" alt="" width="474" height="481" class="alignnone size-full wp-image-9278" /></a>

1. これで完成のはずが・・・
<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-6.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-6.png" alt="" width="827" height="299" class="alignnone size-full wp-image-9279" /></a>
**全てグレーになってしまいました・・・**

## はまった部分

前項の手順 **2-③** で、**=$D$4="完了"** と記載しましたが、正しくは **=$D4="完了"** としなければ行けませんでした。**(Dと4の間の$は不要だった)**

先ほど作成した、ルールは残っているため修正します。

<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-7.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-7.png" alt="" width="1034" height="486" class="alignnone size-full wp-image-9281" /></a>

<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-8.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-8.png" alt="" width="892" height="373" class="alignnone size-full wp-image-9283" /></a>

修正して、こうなりました。
<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-9.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-9.png" alt="" width="474" height="481" class="alignnone size-full wp-image-9284" /></a>

OKを押すと、**完了だけがグレー** になりました。
<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-10.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-10.png" alt="" width="812" height="300" class="alignnone size-full wp-image-9285" /></a>

続けて同じように他の条件付き書式設定をします。
<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-11.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-11.png" alt="" width="892" height="373" class="alignnone size-full wp-image-9286" /></a>

想定通りになりました。

<a href="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-12.png"><img src="images/change-the-color-of-the-line-that-matches-the-condition-in-excel-12.png" alt="" width="827" height="311" class="alignnone size-full wp-image-9287" /></a>

## あとがき
**手順2-2** でExcelが自動でセルに対する書式を入力してくれるのですがこれを疑いもせずそのままに進んでいたためはまりました。。

自動で入力された、 **=$D$4="完了"** は **列方向(D)** も **行方向(4)** の両方が固定となっていましたが、**行方向は可変** のため、**数字の手前の$を削除** したところ解決した、ということでした。

**疑う気持ちは大切** w

それでは次回の記事でお会いしましょう。
