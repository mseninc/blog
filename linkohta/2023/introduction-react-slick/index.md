---
title: "slick を React に移植する方法"
date: 2023-04-26
author: linkohta
tags: [slick, React, Web]
description: "Web ページ上でスライダーを作成できるプラグイン「slick」を紹介しています。"
---

link です。

Web ページ上でスライダーを作成できる **slick** というプラグインがあります。

便利ですが、 React でスクリプトとしてそのまま導入しようとするとエラーで正常に動作しません。

今回は React 上で slick と同じことをそのままできる **React Slick** というパッケージを紹介します。

## React Slick とは

jQuery のプラグインである slick を React でも使用できるようモジュール化したものになります。

slick のオプションをそのまま引き継いでいるため、スライダーの設定がそのまま React に引き継げます。

## 導入と動作確認

導入は npm で React プロジェクトにインストールするだけです。

```sh:title=React&nbsp;Slick導入
$ npm install react-slick
```

以下のコード例のように `<Slider>` を使ってその中に各種オプションを設定するだけでスライダーが作れます。

```tsx:title=スライダーの一例
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }
  
  return (
    <div>
      <Slider {...settings}>
        <div><img src={img1} alt='img1' /></div>
        <div><img src={img2} alt='img2' /></div>
        <div><img src={img3} alt='img3' /></div>
      </Slider>
    </div>
  );
}
```

![スライダー例](images/slider-example.png)

## 機能紹介

主なオプションを以下の表に紹介します。

| オプション | 説明 |
| - | - |
| autoplay | スライドを自動再生します。 |
| infinite | コンテンツをループさせます。(例 : ① -> ② -> ③ -> ① ...) |
| initialSlide | 最初に表示するスライドを指定します。 |
| lazyLoad | 画像の読み込むタイミングを指定します。<br>`progressive` は最初にまとめて、 `ondemand` は遅延読み込みをします。 |
| slidesToScroll | 一度にスライドを何枚スクロールするか指定します。 |
| slidesToShow | フレーム内にスライドを何枚表示するかを指定します。 |
| speed | スクロール、フェードアニメーションの速度をミリ秒で指定します。 |
| pauseOnHover | `autoplay` が `true` の場合に自動再生をマウスホバーで一時停止します。 |
| arrows | 「前」「次」のスライドを操作する矢印を表示します。 |
| centerMode | 現在表示しているスライドを中央に配置し、次のスライドを少し見切れて表示させます。 |
| centerPadding | `centerMode` を指定した場合に見切れて表示をさせる割合を指定します。 |
| customPaging | `dots` が `true` の場合ドットナビをカスタムできます。 |
| dots | ドットナビを表示します。 |
| fade | スライドの切り替え方をフェードにします・ |
| nextArrow | `arrows` が `true` の場合に「次」の矢印の見た目を HTML でカスタムできます。 |
| prevArrow | `arrows` が `true` の場合に「前」の矢印の見た目を HTML でカスタムできます。 |

## 参考サイト

- [akiran/react-slick: React carousel component](https://github.com/akiran/react-slick)
- [react-slick - npm](https://www.npmjs.com/package/react-slick)

## まとめ

今回は slick を React に移植する方法を紹介しました。

React でお手軽にスライダーを実装できるのでぜひ活用してみてください。

それではまた、別の記事でお会いしましょう。
