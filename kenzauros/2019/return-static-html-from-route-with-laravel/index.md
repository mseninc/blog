---
title: "[Laravel] Route で静的な HTML を返す"
date: 2019-07-19
author: kenzauros
tags: [Laravel, Web]
---

こんにちは、kenzauros です。

SPA のアプリを作っていて、とりあえず **Laravel で静的な HTML を返す**ようにしたかったので、やってみました。

## 前提

- Laravel 5.8

## ソースコード

なにも難しいことはないのですがパッとでてこないのでメモです。

たとえば `routes/web.php` のルート (`/`) で `public/index.html` の中身を返す場合、下記のようにします。

```php
Route::get('/', function () {
    return \File::get(public_path() . '/index.html');
});
```

`retrun view('ビュー名');` のように View インスタンスを返す代わりに、  `return File::get(public_path() . '/index.html');` のように、 Fileクラスのgetメソッドを用いて、ファイルの中身を返すように置き換えます。

## 参考

- [How to route to a custom html file in public folder?](https://laracasts.com/discuss/channels/laravel/how-to-route-to-a-custom-html-file-in-public-folder)
