---
title: Laravel 9 の新しいアクセサとミューテータを使ってみた
date: 
author: kiyoshin
tags: [Laravel, PHP]
description: 
---

こんにちは。

**Laravel** の新しいバージョンとなる **Laravel 9** が 2022/02/08 にリリースされ、1ヵ月程度経過しました。

今回のバージョンは、 Laravel 6 以来の長期サポート (**LTS**) となるため、しばらくお世話になりそうです。

バージョンアップに伴い、いくつか新しい機能が追加されていますが、主にバックエンド側のプログラムを実装する機会が多い私としては、 [新たな記述方法が追加されたアクセサとミューテータ](https://laravel.com/docs/9.x/releases#eloquent-accessors-and-mutators) に興味津々です。

というわけで、さっそく使ってみたいと思います。

## Laravel 8 以前のアクセサとミューテータの書き方

さっそく使ってみるといいましたが、まずは従来のアクセサとミューテータについて触れておきたいと思います。

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    // アクセサ
    public function getZipCodeAttribute($value)
    {
        // 3桁-4桁の書式に変換
        return substr($value ,0,3) . '-' . substr($value ,3);
    }

    // ミューテータ
    public function setZipCodeAttribute($value)
    {
        // 全角数字を半角数字に変換し、半角数字のみを抜き出す
        $this->attributes['zip_code'] = preg_replace('/[^0-9]/', '', mb_convert_kana($value, 'n'));
    }
}
```

皆さんお馴染みの `get○○Attribute` や `set○○Attribute` のやつです。`○○` の部分は、アクセスする属性名をパスカルケースで記述する必要があります。

### アクセサ

```php
$user = \App\Models\User::find(1);

// DB には 5530001 と格納されているとする
dd($user->zip_code);

// 変換された '553-0001' が得られる
```

上記のように `zip_code` に「5530001」という値が保存されている場合、 `zip_code` へアクセスすると変換された値「553-0001」が得られるというものです。

### ミューテータ

```php
$user = new \App\Models\User;

$user->zip_code = '５５３－０００１';
$user->save();

// DB には '5530001' と保存される
```

上記のように `zip_code` に「５５３－０００１」を格納すると、全角数字を半角数字に変換し、半角数字のみ抜きだされた「5530001」が格納されることになります。

## Laravel 9 での新しいアクセサとミューテータの書き方

お待たせしました本題です。今回追加された記述方法で先ほどのアクセサとミューテータを実装してみたいと思います。

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute; // 👈 こちら追記が必要です

class User extends Model
{
    public function zipCode(): Attribute // 👈 この型宣言が重要
    {
        return new Attribute(
            // アクセサ : 3桁-4桁の書式に変換
            get: fn ($value) => substr($value ,0,3) . '-' . substr($value ,3),
            // ミューテータ : 全角数字を半角数字に変換し、半角数字のみを抜き出す
            set: fn ($value) => preg_replace('/[^0-9]/', '', mb_convert_kana($value, 'n')),
        );
    }
}
```

アロー関数を使ったりしているのもありますが、ずいぶんと見た目がかわってしまいました。

メソッド名に `get○○Attribute` や `set○○Attribute` のような接頭辞が不要になっており、メソッドを1つにまとめることができるようになりました。また、戻り値の型を `Illuminate\Database\Eloquent\Casts\Attribute` にしておかないとアクセサ・ミューテータは定義されないので注意してください。

## まとめ

個人的には、メソッドをまとめることができるようになった点が気に入りました。

今回は、アクセサとミューテータを両方実装したメソッドにしましたが、一方のみ実装したメソッドでも問題ありません。

Laravel 9 には今回紹介したもの以外にもいろいろと追加された要素がありますので、気に入ったものはどんどん紹介していければと思ってます。
