---
title: Laravel 5.5 withで特定カラムを取得する
date: 2018-03-09
author: hiroki-Fukumoto
tags: [PHP, Laravel, Web]
---

こんにちは！ふっくんです。

Laravelを使用されている方なら `with` メソッドには随分お世話になっていることでしょう。
今回は `with` で特定のカラムのみを取得する方法をご紹介します。

## with の復習

初めに、 `with` について復習しておくと **リレーションシップのテーブルのレコードを取得してくれる** メソッドですね！

例えば、以下のようなテーブルがあるとしましょう。

`groups`
|id|group_name|
|---|---|
|1|teamA|
|2|teamB|

`users`
|id|group_id|user_name|age|
|---|---|---|---|
|1|1|userA|24|
|2|1|userB|29|
|3|2|userB|22|

そして、以下のようなモデルがあるとします。

`Group.php`
```php
class Group extends Model
{
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
```

`User.php`
```php
class User extends Model
{
    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
```

この2つのモデルは `groups` が参照先、 `users` が参照元となっております。（groups : users = 1 : 多）

このモデルに対して、 `GroupController.php` で以下のように書くと、
```php
Group::with('users')->get();
```

レスポンスは、以下のようになります。
```json
[
  {
    id: 1,
    group_name: "teamA",
    users: [
      {
        id: 1,
        group_id: 1,
        user_name: "userA",
        age: 24
      },
      {
        id: 2,
        group_id: 1,
        user_name: "userB",
        age: 29
      }
    ]
  },
  {
    id: 2,
    group_name: "teamB",
    users: [
      {
        id: 3,
        group_id: 2,
        user_name: "userC",
        age: 22
      }
    ]
  }
]
```

これが、 `with` の役割です。

## with で特定カラムのみを取得する

さて、ここからが本題です。
上記のように、リレーションシップのテーブルのレコードを取得できたけど **全カラムは必要ない！！！** という時がしばしばあります。
では、上記のデータ構造を前提として、 `groups` に紐づく `users` のレコードの中から `user_name` のみを取得してみましょう。
`GroupController.php` で以下のように書いてみてください。

```php
Group::with('users:group_id,user_name')->get();
```

すると、レスポンスは以下のようになります。
```json
[
  {
    id: 1,
    group_name: "teamA",
    users: [
      {
        group_id: 1,
        user_name: "userA",
      },
      {
        group_id: 1,
        user_name: "userB",
      }
    ]
  },
  {
    id: 2,
    group_name: "teamB",
    users: [
      {
        group_id: 2,
        user_name: "userC",
      }
    ]
  }
]
```

はい！できました！！

`with` の中を解説しておくと、
`group_id` が外部キー
`user_name` が取得したいカラム
になります。

## ハマったところ
特定カラムを取得する方法はすぐにググると見つかったのですが、ハマった点がありました。
上記のような書き方をしても `with` の中身が **カラム名** で値が返ってくるのです。。。
こんな感じで。

```json
[
  {
    id: 1,
    group_name: "teamA",
    users: [
      {
        group_id: 1,
        user_name: " user_name",
      },
      {
        group_id: 1,
        user_name: " user_name",
      }
    ]
  }
]
```
Why?????

その時のコードはこんな感じでした。

```php
Group::with('users:group_id, user_name')->get();
```

え？何が違うの？？？？？

みなさんわかりましたか？
`users:group_id` の後ろの `,` の後ろに **半角スペースが入っていた** のです。
そんなのありかよ！！！（笑）
ってことで、何があっても、 **半角スペースをいれないでください！！**

あ、ちなみに
```php
Group::with('users:group_id,id,user_name,age')->get();
```
という風に、カラムはいくつでも指定することができます。
いくつ指定してもいいですが **半角スペースをいれないでください！！**