---
title: 【備忘録】OpenCV で画像を分割・結合する方法
date: 
author: linkohta
tags: [OpenCV, C++]
description: OpenCV で画像を分割・結合する方法を紹介します。
---

link です。

画像データを扱っていると画像の分割・結合を一括で行いたい時があると思います。

今回は OpenCV で画像を分割・結合する方法を紹介します。

どちらもやり方は簡単です。

## 画像の分割

画像の分割は元の画像に `Roi(Rect)` を指定してやることでできます。

具体例は以下の通りです。

```cpp:title=画像の分割
cv::Mat input_image = cv::imread("test.png", -1); // 分割する画像の取得
cv::Rect crop_region = cv::Rect(10, 20, 200, 200); // 分割する画像の(x, y, width, height)をRectに入力
cv::Mat div_image = input_image(crop_region); // 分割画像を取得
cv::imshow("分割画像", div_image); // 画像を表示
```

これで `cv::Rect` で指定した範囲の画像が表示されます。

## 画像の結合

画像の結合は縦方向に結合する方法と横方向に結合する方法の 2 通りがあります。

### 縦方向に結合

縦方向に結合するには `cv::vconcat()` を利用します。

具体例は以下の通りです。

```cpp:title=縦方向に結合
cv::Mat input_image1 = cv::imread("test1.png", -1); // 結合する画像 1 の取得
cv::Mat input_image2 = cv::imread("test2.png", -1); // 結合する画像 2 の取得
cv::Mat concat_image; // 結合後の画像を保存する
cv::vconcat(input_image1, input_image2, concat_image); 
cv::imshow("縦方向結合画像", concat_image); // 画像を表示
```

### 横方向に結合

横方向に結合するには `cv::hconcat()` を利用します。

具体例は以下の通りです。

```cpp:title=横方向に結合
cv::Mat input_image1 = cv::imread("test1.png", -1); // 結合する画像 1 の取得
cv::Mat input_image2 = cv::imread("test2.png", -1); // 結合する画像 2 の取得
cv::Mat concat_image; // 結合後の画像を保存する
cv::hconcat(input_image1, input_image2, concat_image); 
cv::imshow("縦方向結合画像", concat_image); // 画像を表示
```

## まとめ

今回は OpenCV で画像を分割・結合する方法を紹介しました。

それではまた、別の記事でお会いしましょう。