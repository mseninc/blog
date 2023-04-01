---
title: "React で input の defaultValue の変更を反映させる"
date: 
author: kenzauros
tags: [React.js]
description: "React.js の非制御コンポーネントで初期値をマウント後に変更する方法を紹介します。初期値の変更を反映するには key 属性にも初期値を渡すことでコンポーネントを再描画します。"
---

React.js の フォーム要素には **制御コンポーネント (controlled component)** と **非制御コンポーネント (uncontrolled component)** があります。フォーム要素とは `input` や `textarea` などを指します。

- [非制御コンポーネント – React](https://ja.reactjs.org/docs/uncontrolled-components.html)

今回は**非制御コンポーネントで初期値 (`defaultValue`) を後から変更する方法**を紹介します。

## 非制御コンポーネントについて

ざっくり説明すれば、制御コンポーネントと非制御コンポーネントは下記のような違いがあります。

- 制御コンポーネント: `value` と `onChange` をバインドする ➡ React で値を管理する
- 非制御コンポーネント: `defaultValue` と `ref` をバインドする ➡ DOM で値を管理する

React のメリットを活かすために、通常は制御コンポーネントを使えばいいのですが、フォームでまとめて値を扱いたい場合など、非制御コンポーネントのほうが扱いやすい場合もあります。


## 非制御コンポーネントの初期値について

非制御コンポーネントの場合、最初に表示しておく値として、以下のように **`defaultValue`** を指定します。

```jsx:title=React非制御コンポーネント
<input defaultValue={initialValue} />
```

公式の説明にもあるとおり、この `defaultValue` は**コンポーネントのマウント時のみ設定**され、その後、仮に値を変更してもフォーム要素の値が書き換わることはありません。

> コンポーネントのマウント後に defaultValue 属性の値を変更しても DOM 内の値の更新は引き起こされません。
> <cite>[デフォルト値 - 非制御コンポーネント – React](https://ja.reactjs.org/docs/uncontrolled-components.html#default-values)</cite>

試しに下記の CodePen を開き、 [change] ボタンを押してみてください。 state 自体は `hoge` と `fuga` が入れ替わっているのですが、 `input` に表示される文字は変化しないはずです。

- [Update React input's defaultValue - CodePen](https://codepen.io/kenzauros/pen/dyqEQep)

通常はこの動きで問題ないのですが、まれに後から初期値を書き換えたいことがあります。たとえば、 `useEffect` で API から取ってきたデータを初期値として表示したい場合などです。


## `key` を指定して初期値の変更を反映する

結論から言うと、**初期値の変更をフォーム要素に反映するには `key` 属性を指定**します。 `key` 属性に渡す値は初期値、つまり `defaultValue` と同じ値です。

これにより、初期値が変更されたときはフォーム要素が再描画され、 `defaultValue` の値が表示されるというわけです。

試しに、さきほどの CodePen の 5 行目でコメントアウトされている部分を解除してみてください。

- [Update React input's defaultValue - CodePen](https://codepen.io/kenzauros/pen/dyqEQep)

おそらく [change] ボタンで `input` に表示される内容が切り替わると思います。

`key` 属性は配列の要素を `map` するときによく指定しますが、このような使い方も可能です。

当たり前ですが、**初期値を入れ替えて再描画するということはユーザーが入力中の内容は破棄**されますので、値が書き換わるタイミングに配慮しておかなければなりません。
