---
title: 【React】useState で値を更新しても反映されない事象の解決法
date: 
author: linkohta
tags: [Web]
description: 
---

link です。

JavaScript のプログラミングだけで作れ、かつ、軽量なフレームワークの React ですが、 useState で値を更新しても反映されないという事象が発生したことがあったので発生原因と解決法について書いていきます。

## ソースコード例

以下のコンポーネントを実行してみます。

```js
import { useState } from "react";

const Count = () => {
  const [count, setCount] = useState(0);

  const ButtonClick = () => {
    setCount(count + 1);
    props.setCount(count)
  }
  
  return (
    <div>
      <button onClick={ButtonClick}>Count Up</button>
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

ボタンを押すと `count` が 1 増えるはずですが増えません。

複数回ボタンを押すと値がずれていることがわかります。

なぜこのような挙動になるのでしょうか。この挙動は React の useState の仕様に起因しています。

## useState の挙動

useState の setter は実行されると対応する state を更新し、再レンダリングを行います。

**この時、 state の更新はすぐには行われず、再レンダリングを行う際、実行された setter をまとめて非同期で更新します。**

そのため上記の例では `setCount` の直後に `alert` で `count` を呼び出しても、更新前の値が読み込まれるため、値がずれるという事象が発生していました。

## 解決法

### コールバック関数を用いて更新を行う



### 新しい変数を用いて更新を行う