---
title: Laravel 5.5 + PHP 7.2 で count のエラー (Warning) が発生
date: 2018-07-30
author: kenzauros
tags: [PHP, PHP 7, Laravel, Web]
---

こんにちは、kenzauros です。

とあるプロジェクトで **Laravel 5.5** を使っているものがあるのですが、最近手元の開発環境を更新して **PHP 7.2** にしたところ、下記のエラーに見舞われて一部の機能が動かないという事態になりました。

```
ErrorException in Builder.php line ...:
count(): Parameter must be an array or an object that implements Countable
```

## 原因

**PHP 7.2 で `count(NULL)` が Warning を吐くようになった**ことが原因でした。

- [PHP: count - Manual](http://php.net/manual/ja/function.count.php)
- [countable ではない型をカウントしたときの警告 - PHP 7.2.x 下位互換性のない変更点](http://php.net/manual/ja/migration72.incompatible.php#migration72.incompatible.warn-on-non-countable-types)

まぁ、つまり「NULL チェックしてね」ということなので、 `count(NULL)` がエラーになるのはいいのですが、マイナーバージョンでいきなり変更されるとビビりますね。

本番環境で起こる可能性があるかと思うとゾッとします。

## 対策

すでに先人がいろいろ検討されていますが、今のところ Laravel 本体に手をいれるか、 **PHP 7.2 以降なら Warning を吐かないようにしてやる**しかないようです。

- [Laravel not compatiable with php 7.2 · Issue #20248 · laravel/framework](https://github.com/laravel/framework/issues/20248)

**`routes/web.php` の冒頭**に下記のように追記します。
※ `public/index.php` では効果がありませんでした。

```php
<?php

if (version_compare(PHP_VERSION, '7.2.0', '>=')) {
    error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
}
```

もちろん php.ini で設定してもよいとは思います。いずれにしろ、**すべての Warning を抑制してしまうので、開発環境としてはそれでいいのか感はあります**。

本来は Laravel のバージョンを更新するほうがいいのですが、現状ではフレームワークバージョンはあまり上げたくないのと、今から大規模に Laravel 5.5 で開発することはないので、とりあえず今回の回避策でしのぎます。


## 参考サイト

- [PHP7.2のcountにハマった話](https://qiita.com/masaki-ogawa/items/1671d110b2286ececd09)
- [【PHP】関数 count() にスカラー値を渡したときの挙動と、PHP7.2でのその変更点 | バシャログ。](http://bashalog.c-brains.jp/18/02/07-100000.php)
