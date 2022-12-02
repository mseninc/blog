---
title: OpenCV で画像を切り抜き・結合する方法
date:
author: linkohta
tags: [OpenCV, C++]
description: OpenCV で画像を切り抜き・結合する方法を紹介します。
---

link です。

大量の画像ファイルを特定のサイズで分割して並び替え、再結合することがありましたので、今回は OpenCV で画像を切り抜き・結合する方法を紹介します。

どちらもやり方は簡単です。

## 画像の切り抜き

画像の切り抜きは元の画像に ROI (`Rect`) を指定するとできます。

具体例は以下の通りです。

```cpp:title=画像の切り抜き
cv::Mat input_image = cv::imread("test.png", -1); // 切り抜きする画像の取得
cv::Rect crop_region = cv::Rect(100, 100, 300, 300); // 切り抜きする画像の範囲 (x, y, width, height) を Rect に入力
cv::Mat div_image = input_image(crop_region); // 切り抜き画像を取得
cv::imshow("切り抜き画像", div_image); // 画像を表示
```

これで `cv::Rect` で指定した範囲の画像が表示されます。

以下の画像は切り抜き元と切り抜き後の画像です。

![切り抜き元](images\2022-11-06_22h02_57.png)

![切り抜き例](images\2022-11-20_20h05_09.png)

## 画像の結合

画像の結合は縦方向に結合する方法と横方向に結合する方法の 2 通りがあります。

**画像の結合時には結合する方向のサイズが一致している必要があります。**

たとえば、縦方向なら画像の横幅が、横方向なら画像の縦幅が一致していないと結合できません。

### 縦方向に結合

縦方向に結合するには `cv::vconcat()` を利用します。

具体例は以下の通りです。

```cpp:title=縦方向に結合
cv::Mat input_image1 = cv::imread("test1.png", -1); // 結合する画像 1 の取得
cv::Mat input_image2 = cv::imread("test2.png", -1); // 結合する画像 2 の取得
cv::Mat concat_image; // 結合後の画像を保存するインスタンス
cv::vconcat(input_image1, input_image2, concat_image); // 画像を結合
cv::imshow("縦方向結合画像", concat_image); // 画像を表示
```

以下の画像は結合する画像と結合後の画像です。

![結合画像](images\2022-11-20_20h05_09.png)

![縦方向結合例](images\2022-11-20_22h01_37.png)

### 横方向に結合

横方向に結合するには `cv::hconcat()` を利用します。

具体例は以下の通りです。

```cpp:title=横方向に結合
cv::Mat input_image1 = cv::imread("test1.png", -1); // 結合する画像 1 の取得
cv::Mat input_image2 = cv::imread("test2.png", -1); // 結合する画像 2 の取得
cv::Mat concat_image; // 結合後の画像を保存するインスタンス
cv::hconcat(input_image1, input_image2, concat_image); // 画像を結合
cv::imshow("横方向結合画像", concat_image); // 画像を表示
```

以下の画像は結合する画像と結合後の画像です。

![結合画像](images\2022-11-06_22h02_57.png)

![横方向結合例](images\2022-11-20_21h58_58.png)

## まとめ

今回は OpenCV で画像を切り抜き・結合する方法を紹介しました。

それではまた、別の記事でお会いしましょう。
