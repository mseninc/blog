---
title: "slick を React に移植する方法"
date: 
author: linkohta
tags: [slick, React, Web]
description: "slick を React に移植する方法を紹介します。"
---

link です。

Web ページ上でスライダーを作成できる **slick** というプラグインがあります。

便利ですが、 React でスクリプトとしてそのまま導入しようとするとエラーで正常に動作しません。

今回は React 上で slick と同じことをそのままできる **React Slick** というパッケージを紹介します。

## React Slick とは

jQuery のプラグインである slick を React でも使用できるようモジュール化したものになります。

slick のオプションをそのまま引き継いでいるため、スライダーの設定がそのまま React に引き継げます。

## 導入と動作確認

導入は npm でインストールするだけです。

```sh:title=React Slick導入
$ npm install react-slick
```

以下のコード例のように `<Slider>` を使ってその中に各種オプションを設定するだけでスライダーが作れます。

```tsx:title=スライダーの一例
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
}

return (
  <Slider {...settings}>
    <div><img src="/img1.png"></div>
    <div><img src="/img2.png"></div>
    <div><img src="/img3.png"></div>
  </Slider>
);
```

## 機能紹介

主なオプションを以下に紹介します。

### autoplay

スライドを自動再生します。

```js
Type: bool
Default: false
```

### infinite

コンテンツをループさせます。(例 : ① -> ② -> ③ -> ① ...)

```js
Type: bool
Default: true
```

### initialSlide

最初に表示するスライドを指定します。

```js
Type: int
Default: 0
```

### lazyLoad

画像の読み込むタイミングを指定します。

`progressive` は最初にまとめて、 `ondemand` は遅延読み込みをします。

```js
Type: ondemand | progressive
Default: null
```

### slidesToScroll

一度にスライドを何枚スクロールするか指定します。

```js
Type: int
Default: 1
```

### slidesToShow

フレーム内にスライドを何枚表示するかを指定します。

```js
Type: int
Default: 1
```

### speed

スクロール、フェードアニメーションの速度をミリ秒で指定します。

```js
Type: int
Default: 500
```

### pauseOnHover

`autoplay` が `true` の場合に自動再生をマウスホバーで一時停止します。

```js
Type: bool
Default: false
```

### arrows

「前」「次」のスライドを操作する矢印を表示します。

```js
Type: bool
Default: true
```

### centerMode

現在表示しているスライドを中央に配置し、次のスライドを少し見切れて表示させます。

```js
Type: bool
Default: false
```

### centerPadding

`centerMode` を指定した場合に見切れて表示をさせる割合を指定します。

```js
Type: string
Default: '50px'
```

### customPaging

`dots` が `true` の場合ドットナビをカスタムできます。

```js
Type: func
Default: (i) => {i + 1}
```

### dots

ドットナビを表示します。

```js
Type: bool
Default: false
```

### fade

スライドの切り替え方をフェードにします。

```js
Type: bool
Default: false
```

### nextArrow

`arrows` が `true` の場合に「次」の矢印の見た目を HTML でカスタムできます。

```js
Type: html
Default: NEXT
```

### prevArrow

`arrows` が `true` の場合に「前」の矢印の見た目を HTML でカスタムできます。

```js
Type: html
Default: Previous
```

## まとめ

今回は slick を React に移植する方法を紹介しました。

React でお手軽にスライダーを実装できるのでぜひ活用してみてください。

それではまた、別の記事でお会いしましょう。