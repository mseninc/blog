---
title: Laravel 9 の新しいアクセサとミューテータを使ってみた
date: 
author: kiyoshin
tags: [Laravel, PHP]
description: 
---

こんにちは。

**Laravel** の新しいバージョンとなる **Laravel 9** が 2022/02/08 にリリースされました。

今回のバージョンは、 Laravel 6 以来の長期サポート (**LTS**) となるため、しばらくお世話になりそうです。

バージョンアップに伴い、いくつか新しい機能が追加されていますが、主にバックエンド側のプログラムを実装する機会が多い私としては、 [新たな記述方法が追加されたアクセサとミューテータ](https://laravel.com/docs/9.x/releases#eloquent-accessors-and-mutators) に興味津々です。

というわけで、さっそく使ってみました。

## Laravel 8 以前のアクセサとミューテータの書き方

さっそく使ってみるといいましたが、まずは従来のアクセサとミューテータについて触れておきます。

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

皆さんお馴染みの `get●●Attribute` や `set●●Attribute` のやつです。`●●` の部分は、アクセスする属性名をパスカルケースで記述する必要があります。

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

お待たせしました。本題です。今回追加された記述方法で先ほどのアクセサとミューテータを実装してみます。

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute; // 👈 この追記が必要です

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

アロー関数を使っているのもありますが、ずいぶんと見た目が変わりました。

メソッド名に `get●●Attribute` や `set●●Attribute` のような接頭辞や接尾辞が不要になっており、メソッドを1つにまとめることができるようになりました。また、戻り値の型を `Illuminate\Database\Eloquent\Casts\Attribute` にしておかないとアクセサ・ミューテータとして動作しないので注意してください。

tinker で実際の動作を確認してみました。

```
>>> $user = new App\Models\User();
=> App\Models\User {#3493}
>>> $user->zip_code = '１２３ー４５６７';
=> "１２３ー４５６７"
>>> $user->zip_code
=> "123-4567"
```

アクセサが期待通りの値を返していることが確認できます。また、var_dump() 等でモデルの中身を確認すると `["zip_code"] => string(7) "1234567"` としっかり変換後の値が格納されてました。

### 戻り値の型宣言について

試しに戻り値の型を宣言しなかった場合の動作を確認してみました。

```php
public function zipCode()
{
    return new Attribute(
        // アクセサ : 3桁-4桁の書式に変換
        get: fn ($value) => substr($value ,0,3) . '-' . substr($value ,3),
        // ミューテータ : 全角数字を半角数字に変換し、半角数字のみを抜き出す
        set: fn ($value) => preg_replace('/[^0-9]/', '', mb_convert_kana($value, 'n')),
    );
}
```

これで実行してみると。。。

```
>>> $user = new App\Models\User();
=> App\Models\User {#3493}
>>> $user->zip_code = '１２３ー４５６７';
=> "１２３ー４５６７"
>>> $user->zip_code
=> "１２３ー４５６７"
>>>
```

`zipCode()` というファンクションは実装されていることになりますが、 `$user->zip_code` はただのプロパティーになってしまいます。

ちなみに、 `zipCode()` を呼び出してみると `Illuminate\Database\Eloquent\Casts\Attribute` のオブジェクトが返ってきました。

```
>>> $user->zipCode();
=> Illuminate\Database\Eloquent\Casts\Attribute {#3489
     +get: Closure($value) {#3491 …4},
     +set: Closure($value) {#3492 …4},
     +withObjectCaching: true,
   }
```

## まとめ

個人的には、メソッドをまとめることができるようになった点が気に入りました。

今回は、アクセサとミューテータを両方実装したメソッドにしましたが、一方のみ実装したメソッドでも問題ありません。

Laravel 9 には今回紹介したもの以外にもいろいろと追加された要素がありますので、気に入ったものはどんどん紹介していければと思ってます。
