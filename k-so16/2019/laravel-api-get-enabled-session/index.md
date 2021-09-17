---
title: "[Laravel] APIのレスポンスでセッションを有効にする方法"
date: 2019-07-22
author: k-so16
tags: [Laravel, Web]
---

こんにちは。最近、[Steam](https://store.steampowered.com/) で [Portal](https://store.steampowered.com/app/400/Portal/?l=japanese) と [Portal 2](https://store.steampowered.com/app/620/Portal_2/) がセールでそれぞれ 60円 (90%オフ)になっていて両方買ってしまった[^1] k-so16 です。

Laravel でログイン中のユーザー情報をAPI経由で取得しようとすると、 `Auth::check()` で認証されていないと判定され、ユーザーの情報が得られないという現象に見舞われました。

本記事では、Laravel でAPI経由でログインの状態を扱えるように設定する方法を紹介します。本記事の前提として、APIで返されるリソースにアクセストークンは入っていないものとします。

本記事が想定する読者層は以下の通りです。

- Laravel の ルーティングの設定について知っている
- Laravel の `Auth` の基本的な利用方法を知っている
- Cookie, セッションについて知っている

## 原因
Laravel から返ってくるAPIのレスポンスヘッダに、Cookieが付随していないことが原因でした。セッションが有効ではないので、ログイン状態が維持されず、 `Auth::check()` が `false` を返し、認証情報が得られませんでした。

APIではトークンによって認証情報を扱うことを想定しているので、Cookie やセッションが有効化されていないと考えられます。


## 解決方法
Laravel のデフォルトでは、 `route/web.php` に記述されるURLには Cookie やセッションに関するミドルウェアが動作しますが、 `route/api.php` にルーティングされているURLには動作しません。APIへのルーティングに設定されているレスポンスにも Cookie やセッションを有効化するために、 `app/Http/Kernel.php` に記述されている API のミドルウェアの設定に Cookie とセッションのミドルウェアを追加します。設定例は以下の通りです。

```PHP
protected $middleWareGroups = [
    // 中略
    'api' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Midleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        'throttle:60,1',
        'bindings',
    ],
];
```

`$middlewareGroups` の `web` に設定されているミドルウェアが `route/web.php` にルーティングされているURLに対して、 `api` に設定されているミドルウェアが `route/api.php` にルーティングされているURLに対して有効化されます。 Cookie やセッションのミドルウェアは、 `web` に設定されているものをコピペすれば、 `route/web.php` と同様に扱えます。

API に対してセッションを有効化する方法について、以下のページを参考にしました。

> [Laravelで「画面ログインしてるときだけ叩けるAPI」を実装した際の備忘録](http://koba5884.com/archives/11907413.html)


## 総括
本記事のまとめは以下の通りです。

- Laravel のデフォルトではAPIのレスポンスには Cookie やセッションは無効
- APIのルーティングに対して Cookie やセッションに関するミドルウェアを設定することで有効化

以上、 k-so16 でした。 Laravel について、また1つ詳しくなった気分になりました（笑）

[^1]: 最近はデスクトップで [Ubuntu](https://ubuntu.com/) か [FreeBSD](https://www.freebsd.org/) しか動かさなくなったのでプレイ出来るか不安だったが、意外と Ubuntu にも対応していて驚いた