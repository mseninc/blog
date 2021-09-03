---
title: Ant Design Vue の Table の行ごとに class 属性を設定する方法
date: 2020-11-18
author: junya-gera
tags: [Vue.js, Nuxt.js, Ant Design Vue, Web]
---

こんにちは。じゅんじゅんです。前回（[Ant Design Vue でバリデーションを設定してフォームの入力チェックを行う方法](/set-form-validation-in-ant-design-vue/)）に引き続き **[Ant Design Vue](https://www.antdv.com/docs/vue/introduce/)** のお話です。 Ant Design Vue のコンポーネントの 1つに `Table` というものがあります。これはデータベースから取得したデータを表形式で一覧表示するためのコンポーネントです。

この `Table` にもたくさんのオプションやイベントが備わっているのですが、その中でも**表示された一覧表の中で特定の行に `class` 属性を設定する**方法についてご紹介していきます。

## バージョン
Nuxt.js 2.14.0
Vue.js 6.14.8
Ant Design Vue 1.6.4

## Table を使って表を表示
まずは `<template>` の中で `<a-table>` タグを作成し、属性を記述していきます。
```
<a-table
  :columns="columns"
  :data-source="items"
  :custom-row="customRow"
>
```

今回はデータベースから取得した `items` というデータの一覧を表示させます。表示させるカラムは以下の 3つです。

```JS
<script>
const columns = [
  {
    title: '商品番号',
    width: 80,
    dataIndex: 'number',
  },
  {
    title: '商品名',
    width: 200,
    dataIndex: 'name',
    key: '0',
  },
  {
    title: '売価',
    dataIndex: 'price',
    width: 100,
    key: '1',
  },
```

## style に class を追加

例えば今回は**売価が 1000 円を超えている商品の行をピンクに表示させたい**としましょう。まずは `<style>` タグの中で、 `gteThousandYen` という `class` がついているレコードの `background` がピンクになるよう追記します。

ちなみに今回の開発では `stylus` を使用しています。
```
<style lang="stylus" scoped>
>>> tr.gteThousandYen
    th, td
      background pink
```

これで `style` 側の設定はできたので、あとは該当するレコードに `gteThousandYen` という `class` を付与することができれば良さそうです。

## customRow を使って class を設定
`<a-table>` の中で `:costom-row` というプロパティに `customRow` という変数がバインドされています。 **`data` の中でこの `customRow` に `class` を付与する条件を記述することによって、特定のレコードに `class` を設定する**ことができます。

```JS
data() {
  return {
    tableHeight: 600,
    columns,
    form: {},
    items: [],
    customRow(record) {
      return {
        class: {
          gteThousandYen: record.price >= 1000,
        },
      };
    },
  };
},

```
ここに記述した条件式（ `record.price >= 1000` ）が `true` になるレコードには `getThousandYen` という `class` が付与されます。

以上で、売価が 1000 円以上の商品の行をピンクで表示させることができました。

この方法は Vue JSX という構文に従った記述方法です。 Ant Design Vue の公式ドキュメントには `customRow` の説明の部分に Vue JSX の Github へのリンクが小さく載っているだけだったので、なかなか見つけにくくなっています。改めて公式のドキュメントや Github をしっかり読むことの必要性を感じました。

> - [Table - Ant Design Vue](https://www.antdv.com/components/table/)
> - [vuejs/babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx)