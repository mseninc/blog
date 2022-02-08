---
title: Vue.js で絞り込み検索できるドロップダウンリスト (select) をつくる
date: 2018-07-23
author: kenzauros
tags: [Vue.js, Web]
---

今回は **Vue.js でつくる「絞り込みできるドロップダウンコンポーネント」**を紹介します。

そう、「あー、あのプルダウンに検索ついた『あれ』、あれでいいよ」とか「このドロップダウン、なんで検索すらできないの？」とか言われがちなのに、標準では存在しなくて毎回つくる羽目になって、すぐできるだろうと思ったら意外と手間がかかりまくるコントロールの選手代表です。はい。

とはいえ、さすが Vue ですので、 jQuery なんかの時代よりはずいぶんスマートに書くことができるようになっています。同じようなコンポーネントが欲しくなった人の助けになれば幸いです。

## 前提条件

- Vue.js v2
- ES2015 ぐらい
- シングルファイルコンポーネント
- Scoped SCSS

## なにはともあれサンプル

とりあえず実際の動作例をご覧ください。ソースコードも見られるので、参考にどうぞ。

<iframe src="https://codesandbox.io/embed/q7j0mjvwz9?fontsize=12&hidenavigation=1&module=%2FApp.vue" style="width:100%; height:400px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

なるべく汎用的にするため、必要最小限以外のスタイルはつけていませんので、オシャレ感はゼロ％です。

ドロップダウンにありがちな下向きの chevron などもありませんので、必要ならつけてあげてください。

## 実装の概要

基本的には **`FilterableDropdown.vue` だけ**をご自分のプロジェクトにコピペすれば OK です。

### コンポーネントの使用

下記のように **`items` に選択肢リストを渡し、 `v-model` で変数をバインドするだけ**で使用できます。また、 vee-validate も通常通り使用可能です。

```html
<FilterableDropdown :items="itemArray" v-model="selectedValue" />
```

その他のプロパティは ↓ のほうの [props](#props) を参照してください。

### template

コンポーネントを構成するテンプレートは下記のような感じです。

```html
<template>
  <div ref="wrapper" class="fd__wrapper">
    <input type="hidden" :name="name" :value="value">
    <input ref="textBox" type="text" class="fd__display-textbox" :disabled="disabled"
      :value="displayText" :placeholder="placeholder" readonly="readonly" @click="textBoxClicked">
    <div class="fd__list" v-show="showList">
      <div class="fd__filter-input">
        <input ref="filterTextBox" type="text" class="fd__filter-textbox" placeholder="Filter..." v-model="filterString">
      </div>
      <ul>
        <li class="fd__item" v-if="showEmptyItem" :value="emptyItemValue"
          @click.stop.prevent="itemClicked(null)">{{ emptyItemText || ' ' }}</li>
        <li class="fd__item" v-if="filteredItems.length > 0" v-for="item in filteredItems"
          :key="'item_'+(idKey ? item[idKey] : item)"
          :value="(valueKey ? item[valueKey] : item)"
          @click.stop.prevent="itemClicked(item)">
          {{ textKey ? item[textKey] : item }}
        </li>
        <li v-if="filteredItems.length === 0">No Items</li>
      </ul>
    </div>
  </div>
</template>
```

既存プロジェクトの名前となるべくかぶらないよう、 class 名にはプリフィックスとして `fd__` を付加していますが、プロジェクトに合わせて変更してください。ただしクラス名を変更した場合は、スタイル定義の他にも `mounted` でルート要素を探している部分を修正する必要があります。

`input[type=hidden]` は form 要素が送信されるときの実際の値を格納するために配置してあります。 Vue だけで完結するならこの input はなくてもかまいません。

1 つ目の `input[type=text]` が選択した値を表示するためのテキストボックスです。これがメイン要素で、この要素をクリックするとリストが開くという仕様です。

`div.fd__list` がリスト部分です。 `input.fd__filter-textbox` に入力した文字列でリストをフィルタリングして表示します。

実際の選択肢部分は `ul > li` にしていますが、 `div` でもいいと思います。この部分は `overflow-y: scroll` にして一定以上高さが伸びないようにします。

`v-if="showEmptyItem"` が書かれた要素は、選択を解除するための空要素を表示するためのものです。

また、絞り込んだ結果が 0 件の場合は最後の `li` 要素 (No Items) を表示します。

### script

Vue のスクリプト部分です。

#### data

```js
data() {
  return {
    filterString: null,
    showList: false
  };
},
```

`data` はフィルター文字列の `filterString` とリスト表示状態を制御する `showList` の 2 つだけです。

<a name="props"></a>
#### props

```js
props: {
  name: { type: String, default: "" }, // form 要素の name 属性
  value: { type: [String, Number, Boolean, Date], default: null } // 値
  placeholder: { type: String, default: "" }, // 未選択状態で表示するプレースホルダー文字列
  disabled: { type: Boolean, default: false }, // コンポーネントを無効にするかどうか
  showEmptyItem: { type: Boolean, default: false }, // 空選択肢を表示するか
  emptyItemText: { type: String, default: null }, // 空選択肢に表示する文字列
  emptyItemValue: { type: String, default: null }, // 空選択肢選択時に設定する値
  items: { type: Array, default: null }, // 選択肢の配列
  idKey: { type: String, default: null }, // (選択肢がオブジェクトの場合) 選択肢の一意な ID のキー
  valueKey: { type: String, default: null }, // (選択肢がオブジェクトの場合) 選択肢の値のキー
  textKey: { type: String, default: null }, // (選択肢がオブジェクトの場合) 選択肢の表示用文字列のキー
  filterTargetKey: { type: String, default: null }, // (選択肢がオブジェクトの場合) 選択肢の絞り込みに使う文字列のキー
  ignoreCase: { type: Boolean, default: true }, // フィルタリング時に大文字小文字を無視するかどうか
},
```

#### computed properties

- `filteredItems`: フィルタリング後の配列を返します。フィルターは正規表現で行っていますが、この `filter` メソッド部分の実装を変更することでフィルタリングのカスタマイズが可能です。
- `selectedItem`: 選択されている選択肢を取得します。
- `displayText`: 表示用の文字列を取得します。なにも選択されていないときは空文字列を返します。

#### methods

- `textBoxClicked`: メインのテキストボックスがクリックされたときに発生し、コンポーネントが無効でなければリストの表示/非表示を切り替えます。
- `itemClicked`: 各選択肢がクリックされたときに発生し、 `input` イベントを emit します。これにより、 `v-model` でバインドされた値が更新されます。
- `reset`: リストを非表示に切り替えて、フィルター文字列をクリアします。

#### watch

- `showList`: リストが表示されたときにフィルター文字列のテキストボックスにフォーカスを切り替えています。

#### mounted

ここは一番泥臭い部分ですが、**コンポーネント外をクリックされたときにリストを閉じる必要がある**ため、 `document` の `click` にイベントハンドラをバインドし、自分以外の上でイベントが発生したときは、リストを非表示にします。

クリックイベントが起きた要素 (`target`) からコンポーネントのルート要素 (`wrapper`) までさかのぼるために `Element.closest` メソッドを使っていますが、 IE にはこのメソッドがないため、 IE 対応が必要な場合は、 Polyfill を使って、定義してやってください。（詳細は MDN 下記ページの Polyfill 部分参照）

- [Element.closest() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/closest)

ちなみに `document.click` でやっているので、当然ながら、どこかで `stopPropagation()` された場合は、対応できません。他のコンポーネントとは仲良くやってください。

いずれにしろ、この部分だけどうしても DOM を意識せざるを得ず、なんとも悩ましいところです。

### style

スタイル定義はドロップダウンっぽく見えるようにしているだけなので、好みに合わせて調整してください。例では SCSS を使っているので、コンパイルできない場合はお手数ですが、 CSS に書き直してください。


## ソースコード

最後に gist にあげたソースコードを掲載しておきます。

- [Filterable Dropdown with Vue.js - gist](https://gist.github.com/kenzauros/06ebe8b1e57fc3759c1cf471cbd8c411)

```js
<template>
  <div ref="wrapper" class="fd__wrapper">
    <input type="hidden" :name="name" :value="value">
    <input ref="textBox" type="text" class="fd__display-textbox" :disabled="disabled"
      :value="displayText" :placeholder="placeholder" readonly="readonly" @click="textBoxClicked">
    <div class="fd__list" v-show="showList">
      <div class="fd__filter-input">
        <input ref="filterTextBox" type="text" class="fd__filter-textbox" placeholder="Filter..." v-model="filterString">
      </div>
      <ul>
        <li class="fd__item" v-if="showEmptyItem" :value="emptyItemValue"
          @click.stop.prevent="itemClicked(null)">{{ emptyItemText || '&nbsp;' }}</li>
        <li class="fd__item" v-if="filteredItems.length > 0" v-for="item in filteredItems"
          :key="'item_'+(idKey ? item[idKey] : item)"
          :value="(valueKey ? item[valueKey] : item)"
          @click.stop.prevent="itemClicked(item)">
          {{ textKey ? item[textKey] : item }}
        </li>
        <li v-if="filteredItems.length === 0">No Items</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterString: null,
      showList: false
    };
  },
  props: {
    name: { type: String, default: "" },
    value: { type: [String, Number, Boolean, Date], default: null },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    showEmptyItem: { type: Boolean, default: false },
    emptyItemText: { type: String, default: null },
    emptyItemValue: { type: String, default: null },
    items: { type: Array, default: null },
    idKey: { type: String, default: null },
    valueKey: { type: String, default: null },
    textKey: { type: String, default: null },
    filterTargetKey: { type: String, default: null },
    ignoreCase: { type: Boolean, default: true }
  },
  computed: {
    filteredItems() {
      if (!this.filterString) return this.items;
      if (!this.items || this.items.length === 0) return [];
      const flags = this.ignoreCase ? "i" : "";
      const regexp = new RegExp(this.filterString, flags);
      return this.items.filter(x => {
        const targetValue = this.filterTargetKey
          ? x[this.filterTargetKey]
          : JSON.stringify(x);
        return regexp.test(targetValue);
      });
    },
    selectedItem() {
      return this.items.find(
        x => this.value === (this.valueKey ? x[this.valueKey] : x)
      );
    },
    displayText() {
      const item = this.selectedItem;
      if (!item) return "";
      return this.textKey ? item[this.textKey] : item;
    }
  },
  methods: {
    textBoxClicked() {
      if (this.disabled) return;
      this.showList = !this.showList;
    },
    itemClicked(item) {
      if (item) {
        const value = this.valueKey ? item[this.valueKey] : item;
        this.$emit("input", value);
      } else {
        this.$emit("input", this.emptyItemValue || null);
      }
      this.reset();
    },
    reset() {
      this.showList = false;
      this.filterString = "";
    }
  },
  watch: {
    showList(val) {
      this.$nextTick(() => {
        if (val) {
          this.$refs.filterTextBox.focus();
        }
      });
    }
  },
  mounted() {
    const $this = this;
    document.addEventListener("click", function(e) {
      const target = (e.target || e.srcElement).closest(".fd__wrapper");
      if (target === $this.$refs.wrapper) return;
      $this.reset();
    });
  }
};
</script>

<style lang="scss" scoped>
.fd__wrapper {
  position: relative;
  width: 100%;
  * {
    font-size: 1rem;
  }
  input.fd__display-textbox,
  input.fd__filter-textbox {
    width: 100%;
  }
  .fd__list {
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;
    width: 100%;
    padding: 4px;
    border: solid 1px rgb(192, 192, 192);
    background: white;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
    margin-top: -1px;
    ul {
      margin: 4px 0 0 0;
      padding: 4px;
      overflow-x: auto;
      overflow-y: scroll;
      max-height: 40vh;
      li {
        padding: 4px 1px;
        cursor: pointer;
        list-style: none;
        line-height: 1;
        &.fd__item:hover {
          background: aliceblue;
        }
      }
    }
  }
}
</style>
```
