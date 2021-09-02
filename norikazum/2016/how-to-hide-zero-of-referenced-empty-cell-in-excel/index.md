---
title: Excelで空白セルを参照をすると結果が0になるのを防ぐ
date: 2016-10-14
author: norikazum
tags: [Excel, その他, ライフハック]
---

こんにちは。

タイトルが長くなってしまいましたが、Excelで請求書や納品書を作成する際に1つのシートの内容をそっくり別のシートに反映させたいようなケースはないでしょうか。

このような時に、単純に空欄セルを参照すると参照側のセルでは0と表示されてしまいます。

## このようなケースです

**Sheet1**を以下のような内容とします。

<a href="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-1.png"><img src="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-1.png" alt="2016-10-02_02h17_37" width="522" height="545" class="alignnone size-full wp-image-2994" /></a>

**Sheet2**で**Sheet1**のB3:E6の範囲を参照します。

Sheet2の各セルの値
```
B3=Sheet1!B3
B4=Sheet1!B4
B5=Sheet1!B5
B6=Sheet1!B6
C3=Sheet1!C3
C4=Sheet1!C4
C5=Sheet1!C5
C6=Sheet1!C6
D3=Sheet1!D3
D4=Sheet1!D4
D5=Sheet1!D5
D6=Sheet1!D6
E3=Sheet1!E3
E4=Sheet1!E4
E5=Sheet1!E5
E6=Sheet1!E6
```

すると以下のようになります。

<a href="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-2.png"><img src="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-2.png" alt="2016-10-02_02h14_29" width="571" height="552" class="alignnone size-full wp-image-2993" /></a>

**Sheet1**の空欄セルが**Sheet2**では**0**となってしまいました。

## 0を消す方法

このままでは、0と印字されてしまうので消したいですよね。

対処は**Sheet2**で以下の画像のように赤枠部分を選択し、右クリックから**セルの書式設定**を選択します。

<a href="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-3.png"><img src="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-3.png" alt="2016-10-02_03h06_00" width="536" height="548" class="alignnone size-full wp-image-2995" /></a>

↓

<a href="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-4.png"><img src="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-4.png" alt="2016-10-02_03h07_09" width="355" height="198" class="alignnone size-full wp-image-2996" /></a>

セルの書式設定から、ユーザー定義を選択し、赤枠の部分を一旦全て削除し、 `#` と入力し、OKをクリックします。

<a href="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-5.png"><img src="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-5.png" alt="2016-10-03_15h30_12" width="526" height="533" class="alignnone size-full wp-image-3019" /></a>

消えました！ `#` はゼロのときに不要な桁を表示しない記号なので、 0 の場合はなにも表示されなくなります。

<a href="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-6.png"><img src="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-6.png" alt="2016-10-02_03h10_44" width="529" height="554" class="alignnone size-full wp-image-2998" /></a>

## あとがき

試しに、**Sheet1** の備考欄に文字を入力してみます。

<a href="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-7.png"><img src="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-7.png" alt="2016-10-02_03h12_47" width="531" height="547" class="alignnone size-full wp-image-2999" /></a>

**Sheet2**でもばっちり反映されました。

<a href="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-8.png"><img src="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-8.png" alt="2016-10-02_03h13_24" width="509" height="546" class="alignnone size-full wp-image-3000" /></a>

ただし、以下のようなケースで注意が必要です。

<a href="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-9.png"><img src="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-9.png" alt="2016-10-02_03h22_03" width="535" height="550" class="alignnone size-full wp-image-3003" /></a>

↓

<a href="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-10.png"><img src="images/how-to-hide-zero-of-referenced-empty-cell-in-excel-10.png" alt="2016-10-02_03h22_48" width="525" height="549" class="alignnone size-full wp-image-3004" /></a>

上記のように、Sheet1 で **0** と入力すると、Sheet2では空欄になってしまいます。
0を表示したい場合は書式設定を標準や数値に変更する必要があります。


何かの参考になれば嬉しいです。
それでは次の記事でお会いしましょう。
