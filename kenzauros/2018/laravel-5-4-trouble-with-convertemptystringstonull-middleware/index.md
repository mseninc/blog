---
title: Laravel 5.4 以降でリクエストの空文字列が null になる (ConvertEmptyStringsToNull Middleware 問題)
date: 2018-02-26
author: kenzauros
tags: [PHP, Laravel, Web]
---

フロントエンド側から値を空文字列 `''` として送信しているにも関わらず、バックエンド側のデータベース保存時に「NULL は許可されていません」的なエラーに見舞われました。

データベース側が NULL 許容なら問題ないのですが、 Laravel のマイグレーションのデフォルトなんかだと `nullable()` をつけていない限り、 `NOT NULL` になっているので、当然ながら怒られてしまいます。

## 原因

原因は Laravel 5.4 で導入された **`ConvertEmptyStringsToNull` ミドルウェア**でした。

>[Release Notes - Laravel - The PHP Framework For Web Artisans](https://laravel.com/docs/5.4/releases)
Laravel 5.4 includes two new middleware in the default middleware stack: TrimStrings and  ConvertEmptyStringsToNull:

Readouble にも丁寧な説明があります。

>[HTTPリクエスト 5.4 Laravel](https://readouble.com/laravel/5.4/ja/requests.html)
Laravelのデフォルトグローバルミドルウェアスタックには、TrimStringsとConvertEmptyStringsToNullミドルウェアが含まれています。これらのミドルウェアは、App\Http\Kernelクラスにリストされています。これらのミドルウェアは自動的にリクエストの全入力フィールドをトリムし、それと同時に空の文字列フィールドをnullへ変換します。これにより、ルートやコントローラで、ノーマライズについて心配する必要が無くなります。

うーん、まぁ言っていることはわかりますし、便利なミドルウェアだと思いますが、デフォルトで入れるのは不親切な気がします。

## 解決方法

解決方法は Readouble にも明確に書かれています。

>[HTTPリクエスト 5.4 Laravel](https://readouble.com/laravel/5.4/ja/requests.html)
この振る舞いを無効にするには、App\Http\Kernelクラスの$middlewareプロパティからこれらのミドルウェアを削除することにより、アプリケーションのミドルウェアスタックから外してください。

というわけで、 `\app\Http\Kernel.php` を開き、不要なミドルウェア (今回は `ConvertEmptyStringsToNull`) をコメントアウトするなり削除するなりします。

```diff
protected $middleware = [
    \Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
    \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
    \App\Http\Middleware\TrimStrings::class,
-   \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    \App\Http\Middleware\TrustProxies::class,
];
```

まぁしかし `NULL` と空文字列の扱いは永遠の課題ですね。

## 参考

- [Laravel 5.4 auto convert empty text input to null?](https://laracasts.com/discuss/channels/laravel/laravel-54-auto-convert-empty-text-input-to-null)