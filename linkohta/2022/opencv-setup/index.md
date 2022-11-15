---
title: Visual Studio で OpenCV を使う手順
date:
author: linkohta
tags: [OpenCV, Visual Studio]
description: Visual Studio で OpenCV を使う手順について紹介します。
---

link です。

OpenCV を使って画像処理をする機会があったので Visual Studio で OpenCV を使う手順を紹介します。

## 想定環境

OpenCV は C#, Python, Java など様々な言語で利用可能ですが、今回は C++ で利用します。

- Windows 10 以降
- Visual Studio 2022
- C++14 以降

## OpenCV のインストール

OpenCV の[公式サイト](https://opencv.org/releases/)から Windows の圧縮ファイルをダウンロードして解凍します。

解凍したファイルはわかりやすい場所に設置しましょう。

続いて、解凍したフォルダの `build\x64\vc15\bin` に移動します。

そこにある `opencv_world460.dll` と `opencv_world460d.dll` を `C:\Windows\System32` にコピーしてインストール完了です。

Visual Studio の NuGet でプロジェクトに直接インストールする方法もあります。

しかし、**そちらは現在、正常にビルドができない**ため、今回は公式サイトから直接ダウンロードする方法を取ります。

## Visual Studio で OpenCV を使えるようにする

次は Visual Studio で OpenCV を使えるように設定します。

まずは新規プロジェクトを作成して、プロジェクトの設定を開きます。

![プロジェクトの設定](images\2022-10-30_15h42_18.png)

構成を「すべての構成」に変更し、「C/C++」の「追加のインクルードディレクトリ」に `OpenCV のフォルダ \build\include` を設定します。

![追加のインクルードディレクトリ](images\2022-10-30_22h17_02.png)

続いて、「リンカー」の「追加のライブラリディレクトリ」に `OpenCV のフォルダ \build\x64\vc14\lib; OpenCV のフォルダ \build\x64\vc15\lib` を設定します。

![追加のライブラリディレクトリ](images/2022-10-30_22h17_21.png)

最後に「リンカー → 入力」の「追加の依存ファイル」に `opencv_world460.lib;opencv_world460d.lib;` を設定して準備完了です。

![](images/2022-10-30_22h38_14.png)

## OpenCV で画像を表示させてみる

さっそく画像を表示させてみましょう。

`main()` を以下のように書き換えます。

```cpp:title=main.cpp
#include "opencv2/opencv.hpp"
#include <filesystem>

namespace fs = std::filesystem;
using namespace cv;

int main(int argc, char* argv[]) {
    if (argc > 1) {
		cv::Mat input_image = cv::imread(argv[1], -1);
		cv::namedWindow("test", cv::WINDOW_AUTOSIZE);
		cv::imshow("test", input_image);
		cv::waitKey(0);
	}
	return 0;
}
```

`imread()` で指定したパスの画像を読み込み、 `namedWindow()` で作成したウィンドウに `imshow()` で表示するという流れになっています。

`waitKey()` は何か入力があるまでウィンドウを表示させ続けるためのコマンドです。

次にビルド設定を `Release` に指定してビルドします。

ビルドして出力されたアプリケーションに適当な画像データをクリック＆ドラッグして画像を表示するウィンドウが表示されることを確認しましょう。

![画像表示ウィンドウ](images\2022-11-06_22h02_57.png)

## 参考サイト

- [Home - OpenCV](https://opencv.org/)

## まとめ

今回は Visual Studio で OpenCV を使う手順について紹介しました。

次回は OpenCV で画像の分割と結合をやってみましょう。

それではまた、別の記事でお会いしましょう。
