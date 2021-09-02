---
title: Materialize の datepicker (pickadate.js) で日付を設定する
date: 2016-06-09
author: kenzauros
tags: [JavaScript, jQuery, Materialize, Web]
---

[Materialize](http://materializecss.com/) の日付選択 [Date Picker](http://materializecss.com/forms.html#date-picker) は、内部的に [pickadate.js](http://amsul.ca/pickadate.js/) が使われています。

場合によっては動的に日付を設定したり、初期値を設定したりしたいことがあると思うのですが、単純に `input` の `value` に値を設定しても反映されません。

このため、ちょっと面倒ですが下記のように `picker` を取得し、その `.set('select', 値)` 関数を使います。

## Date Picker への変換と picker の取得
```
var $input = $('.datepicker').pickadate() // Date Picker
var picker = $input.pickadate('picker') // picker を取得
```

## 日付値の設定
```
// [年, 月, 日] のフォーマットで設定
picker.set('select', [2015, 3, 20])

// Date オブジェクトで設定
picker.set('select', new Date(2015, 3, 30))

// フォーマットを指定して日付文字列から値を設定
picker.set('select', '2016-04-20', { format: 'yyyy-mm-dd' })
```

## 参考
* [javascript - How to set the date in materialize datepicker - Stack Overflow](http://stackoverflow.com/questions/30324552/how-to-set-the-date-in-materialize-datepicker)
