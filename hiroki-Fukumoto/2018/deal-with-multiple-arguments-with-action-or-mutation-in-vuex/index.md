---
title: Vuex で Action, Mutation に第3引数を渡したくなったら
date: 2018-05-25
author: hiroki-Fukumoto
tags: [JavaScript, Vue.js, Web]
---

こんにちは。ふっくんです。

Vuexを使用していて `Action` や `Mutation` に第三引数を渡したいときありますよね？

私は少しハマったのですが、結論から言うと**`Action` や `Mutation` に第三引数は渡せません！**

ドキュメントにもちゃんと書いてますね。

> [API リファレンス · Vuex](https://vuex.vuejs.org/ja/api.html)
> ストアにミューテーションを登録します。ハンドラ関数は第一引数に state を常に受け取り(モジュール内で定義されていれば、モジュールのローカルステートを受け取り)、指定されていれば第二引数に payload を受け取ります。

`action` , `mutation` ともに `指定されていれば第二引数を受け取る` とあり、第三引数のことは書いていませんね。

**そう、`Action` や `Mutation` に第三引数という概念がありません！**

## Action, Mutation に引数として複数の値を渡す

上記のことを踏まえて、コンポーネントからactionを実行するソースコードを書いてみます。

**エラーとなる渡し方**

component

```javascript
const id = 1
const name = 'userA'
this.$store.dispatch('testAction', id, name)
```

action

```javascript
testAction({ commit }, id, name) {
  const userData = 'userId:' + id ', userName:' + name
  commit('testMutation', userData)
}
```

**正しい渡し方**

component

```javascript
const id = 1
const name = 'userA'
this.$store.dispatch('testAction', { userId: id, userName: name })
```

action

```javascript
testAction({ commit }, { userId, userName }) {
  const userData = 'userId:' + userId ', userName:' + userName
  commit('testMutation', userData)
}
```

引数に複数の値を渡したい場合は `{ userId: id, userName: name }` のように、オブジェクトとして渡すとオッケーです！