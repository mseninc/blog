---
title: Laravel 6.0 がリリースされました (Laravel 6 Is Now Released)
date: 2019-09-04
author: kenzauros
tags: [PHP, Laravel, Web]
---

昨日 **Laravel 6.0 の正式リリース**がアナウンスされました。

> [Laravel 6 Is Now Released - Laravel News](https://laravel-news.com/laravel-6)

変更点をざっと確認したので、感想を交えて紹介します。

## Laravel 6.0 Is the New LTS

5 系は 5.1 と 5.5 が LTS (Long-Term Support) バージョンですが、 **6 系は 6.0 が LTS バージョン**になるようです。

**Laravel 6.0 のサポート期限は バグフィクスが 2021/9/3 まで、セキュリティ修正が 2022/9/3 まで**だそうです。

## Semantic Versioning (semver)

6.0 以降は**セマンティックバージョニング (semver)** を採用するそうです。バージョン番号のパーツに意味づけをして互換性などがわかるようにしましょうという取り組みです。

Node のパッケージなんかではバージョンを `~` とか `^` とかで指定するので、おなじみですね。

基本的には下記のような規則です。 `Major.Minor.Patch` というバージョン番号に対して、

- Major: 後方互換性を保証しないバージョンアップ
- Minor: 後方互換性を保証した機能追加などのバージョンアップ
- Patch: 後方互換性を保証したバグの修正によるバージョンアップ

という意味づけを与えたものが semver ということです。

昔からある程度こういった意味付けは行われてきたと思いますが、それを体系化したものですね。これまでの Laravel は Minor バージョンアップでも後方互換性がないことが多かったので、助かりますね。

## Improved Authorization Responses

`Gate::inspect` メソッドを使って、認可 (Authorization) 周りのエラーメッセージをエンドユーザーに提供できるようになりました。

```php
$response = Gate::inspect('view', $flight);

if ($response->allowed()) {
    // User is authorized to view the flight...
}

if ($response->denied()) {
    echo $response->message();
}
```

認可失敗時の処理はいずれにしても独自に実装する必要がありそうなので、今のところ劇的に便利になる気はしません。

## Job Middleware

こちらも今のところ Job Middleware によって何がハッピーになるのかよくわかっていません。

## Lazy Collections

実際に**要素がイテレーションされるタイミングまで評価を遅延する `LazyCollection`** が導入されました。

> [Lazy Collections](https://laravel.com/docs/6.0/collections#lazy-collections)

.NET の LINQ に慣れている私としては、これまでの Collection だと、メソッドごとに処理が走るのが精神衛生上よくなかったので、個人的にはこれがすばらしいです。

新しい `LazyCollection` (`Illuminate\Support\LazyCollection` クラス) だと LINQ とまではいかないまでも実際に値が参照されるときまで評価が遅延されるようです。

しかもファイルやデータベースからデータを取る系のメソッドだと、必要な分しかメモリーに読み込まれませんので、今さら感もありますが、とりあえず大きな改善です。

**`LazyCollection` を生成するには `LazyCollection::make` メソッド**を使います。

たとえばファイルの中身を順次読み取る `LazyCollection` を生成するには下記のようにします。 PHP のジェネレーター構文である **`yield`** が使われており、.NET の `IEnumerable<T>` + `yield return` のような感覚で実装できそうですね。

```php
use Illuminate\Support\LazyCollection;

LazyCollection::make(function () {
    $handle = fopen('log.txt', 'r');

    while (($line = fgets($handle)) !== false) {
        yield $line; // 実際にイテレーションされるまで行が読み込まれない
    }
});
```

データベース系では Eloquent のクエリービルダーに `cursor` メソッドが追加されています。このメソッドは `LazyCollection` のインスタンスを返します。

```php
$users = App\User::cursor()->filter(function ($user) {
    return $user->id > 500;
});

foreach ($users as $user) { // ここでイテレーションされるまで `filter` の評価は遅延される
    echo $user->id;
}
```

`LazyCollection` について下記の注意が載っています。

> Methods that mutate the collection (such as shift, pop,  prepend etc.) are are not available on the LazyCollection class.

要するに `shift`, `pop` ような破壊的にコレクション自体を変更するようなメソッドは `LazyCollection` では使えませんよ、ということです。どちらかというとコレクションというよりは `Enumerable` なデータ構造なので当たり前なんですが、このあたり配列操作に慣れた方は注意が必要です。

`Enumerable` なクラスは Laravel というより独立したパッケージに追加してほしいぐらいです。

## Eloquent Subquery Enhancements

こちらは名前の通り SQL の **サブクエリ** に相当するものを Eloquent で扱えるようにしたもののようです。

下記の記事にまとまっていて、ソースコードがわかりやすいです。

> [Eloquent Subquery Enhancements in Laravel 6.0 - Laravel News](https://laravel-news.com/eloquent-subquery-enhancements)

これまではサブクエリ的なものをやろうとすると、かなり泥臭いソースになっていたので、これは期待できそうです。

## Laravel UI

フロントエンドのスキャフォールディングが [laravel/ui](https://github.com/laravel/ui) パッケージに独立したそうです。

あまりスキャフォールディングが必要でない場合も多いので、このほうがスッキリしていいのかもしれません。