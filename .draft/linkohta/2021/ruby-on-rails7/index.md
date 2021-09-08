---
title: 【2021年から Ruby on Rails をはじめる人向け】 Ruby on Rails 6 入門 Part 7 ～ Rails でバリデーションチェックを自動で行う方法～
date: 2021-08-23
author: linkohta
tags: [Ruby on Rails, Web]
---

link です。

今回は Rails 上でバリデーションチェックを行う方法について勉強していきます。

この記事は [Ruby on Rails 6 入門 Part 6](/ruby-on-rails6/) の続きです。

## 前提条件

- Windows 10
- Ruby 3
- Ruby on Rails 6

## バリデーションチェック

前回紹介した ActiveRecord にはバリデーション機能が備わっています。

この機能を使って、オブジェクトがデータベースに保存される前にオブジェクトの状態を検証する方法を勉強していきましょう。

`app/model/Person.rb` を開いて、以下のように書き換えます。
```rb
class Person < ApplicationRecord
  validates :name, presence: true
end
```

これは、モデルのオブジェクトをデータベースに保存するときにバリデーションを行うプロパティを指定しています。

上述の例では、 `Person` モデルの `name` プロパティを指定しています。

続けて、 `app/controller/people_controller.rb` の `create` メソッドを以下のように書き換えます。
```rb
def create
  if request.post? then
    if Person.create(person_params).valid? then
      redirect_to '/people/index'
    else
      @msg = "Name が入力されていません"
      render 'add'
    end
  end
end
```

上述の例を用いて解説していきます。

`Person.create` を実行すると、モデル内に記述された `validetes` の内容に基づいてデータベースにオブジェクトを保存するかを決定します。

オブジェクトが保存されたか否かは `valid?` プロパティで取得できます。

`valid?` プロパティが `true` なら、オブジェクトを保存後、`people/index` に画面を遷移します。

`false` なら、オブジェクトを保存せず、 `@msg` を使ってエラーメッセージを表示しています。

## バリデーションヘルパー

## バリデーションエラー

## 参考サイト

[Active Record バリデーション - Railsガイド](https://railsguides.jp/active_record_validations.html)

## まとめ

今回は ActiveRecord バリデーションを使って Rails 上でバリデーションチェックを行う方法を勉強しました。

それではまた、別の記事でお会いしましょう。