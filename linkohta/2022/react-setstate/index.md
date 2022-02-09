---
title: 【React】useState で値を更新しても反映されない事象の解決法
date: 
author: linkohta
tags: [Web]
description: 
---

link です。

JavaScript のプログラミングだけで作れる軽量なフレームワークの React について、 useState で値を更新しても反映されない場合があります。

今回は発生原因と解決法について書いていきます。

## ソースコード例

以下のコンポーネントを実行してみます。

```js
import { useState } from "react";

const Count = (props) => {
  const [count, setCount] = useState(0);

  const ButtonClick = () => {
    setCount(count + 1);
    props.setCount(count);
  }
  
  return (
    <div>
      <button onClick={ButtonClick}>Count Up</button>
      <span style={{paddingLeft: '1em'}}>ClickCount: {count}</span>
    </div>
  );
}

const Index = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Count setCount={(count) => setCount(count)}/>
      <span>Count: {count}</span>
    </div>
  );
}

export default Index;
```

上記のコードは、ボタンを押すと `<Count>` 側の `count` が 1 増えて、それと連動して `<Index>` 側の `count` も 1 増えるというものです。

![](images/2022-02-09_16h16_28.png)

ボタンを押すと ClickCount と Count が連動して 1 増えるはずですが増えません。

![](images/2022-02-09_16h16_32.png)

複数回ボタンを押すと値が遅れて反映されていることがわかります。

![](images/2022-02-09_16h16_38.png)

なぜこのような挙動になるのでしょうか。この挙動は React の useState の仕様に起因しています。

## useState の挙動

useState の setter は実行されると対応する state を更新し、再レンダリングを行います。

**この時、 state の更新はすぐには行われず、再レンダリングを行う際、実行された setter をまとめて非同期で更新します。**

そのため上記の例では `setCount` の直後に `props.setCount()` で `count` を代入しても、更新前の値が代入されるため、値がずれるという事象が発生していました。

## 解決法

### useEffect を用いて更新を行う

`useEffect` は指定した state が更新されるたびに実行される関数です。

この `useEffect` が実行されるのが **state が更新された後**であることを用いることで値の更新を確実に反映できます。

以下のコードのように `useEffect` の追加と `ButtonClick` を変更します。

```js
useEffect(() => {
  props.setCount(count);
}, [count]);

const ButtonClick = () => {
  setCount(count + 1);
}
```

### 新しい変数を用いて更新を行う

新しい変数を用意して更新する方法もあります。

以下のコードのように更新後の値を別の変数に保存して、その変数を state の更新に用いることで更新後の値を利用できます。

```js
const ButtonClick = () => {
  const newValue = count + 1;
  setCount(newValue);
  props.setCount(newValue);
}
```

## まとめ

useState 、というより React の state の挙動は React を正しく扱う上で避けられない問題だと思います。

フレームワークごとの独特の挙動を把握して、意図したとおりの動きをするアプリケーションを組んでいきたいと思います。

それではまた、別の記事でお会いしましょう。