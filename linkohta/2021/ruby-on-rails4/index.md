---
title: 【2021年から Ruby on Rails をはじめる人向け】 Ruby on Rails 6 入門 Part 4 ～データベースを使う～
date: 2021-06-25
author: linkohta
tags: [Ruby on Rails, Web]
---

link です。炭水化物の取りすぎには気を付けましょう。

今回は Rails での Model とデータベースの使い方を解説します。

この記事は[Ruby on Rails 6 入門 Part 3](https://mseeeen.msen.jp/ruby-on-rails3/)の続きです。

## 前提条件

- Windows 10
- Ruby on Rails 6

## Model とは

MVC アーキテクチャで実際のデータとその処理を行う部分です。また、データの変更を View に通知するのもモデルの役目です。

今回は Model のデータを保存するのにデータベースを使います。

## データベースの準備

**データベース管理システム (DBMS)** はいろいろあります。 Rails がデフォルトで指定している **SQLite** はファイルベースであるため、 DBMS のインストールは不要です。

他の DBMS を使いたい場合、 PC と Rails のプロジェクトに使いたい DBMS をインストールする必要があります。

今回は SQLite のまま進めていきます。

## Model を用意する

早速 Model を作ってみましょう。コンソールを起動して、 `cd` で Rails のプロジェクトまで移動します。

その後、 `rails generate model Person age:integer name:string` と入力しましょう。

`app/models/Person.rb` と `db/migrate/日時_create_people.rb` が生成されるはずです。

このコマンドは `Person` という名前の Model と `People` テーブルを `age` と `name` のカラム付きで生成するというものです。

`Person.rb` の中身は、
```rb
class Person < ApplicationRecord
    
end
```
という風に空ですが、**今は中身を書く必要はありません。**

`db/migrate/日時_create_people.rb` はデータベースに Model に対応したテーブルを作成するためのものです。ちなみに `Person` が `People` になっているのは、テーブル名が自動的に Model 名の複数形になるからです。

ここで作成されたファイルはデータベースをマイグレーションする際に使用します。

次にテーブルの中にテスト用のデータを作りましょう。

`db/migrate/seeds.rb` を開いて、
```rb
Person.create(name:'Taro', age:37)
Person.create(name:'Jiro', age:35)
```
を追加します。

最後にコンソールに
```
> rails db:migrate
> rails db:seed
```
と入力しましょう。

`rails db:migrate` はデータベースをマイグレーションするコマンドです。

`rails db:seed` はデータベースに `seeds.rb` のテスト用データを入力してくれるコマンドです。

これでデータベースが生成され、 `seeds.rb` のデータが入力されました。

## Model のデータを利用する

`rails generate controller People index` で `index` 関数付きの `PeopleController` を生成して中身を
```rb
def index
  @header = 'studyRails'
  @footer = 'link'
  @msg = 'Person Data'
  @data = Person.all
end
```
と書き換えます。

`@data = Person.all` で People テーブルの Person のデータをすべて `@data` に代入しています。

次に `views/people/index.html/erb` の中身を以下のように書き換えましょう。
```html
<h1 class="display-4 text-primary">People#index</h1>
<p><%= @msg %></p>
<table class="table">
  <tr>
    <th>Id</th><th>Name</th>
  </th>
  <% @data.each do |obj| %>
  <tr>
    <td><%= obj.id %></td>
    <td><%= obj.name %></td>
  </tr>
  <% end %>
</table>
```

因みに**上の erb コードは Bootstrap のスタイルを適用していない**ので、適用したい場合は[前回の記事](https://mseeeen.msen.jp/ruby-on-rails3/)を参考にしてやってみてください。

`rails s` で起動して、下のような画面になっていれば OK です。**下の画面は Bootstrap を適用しています。**
![model](https://mseeeen.msen.jp/wp-content/uploads/2021/06/2021-06-02_15h31_21.png)

## まとめ

今回は Model の解説と Rails でデータベースを使うための手順を紹介しました。

次回はデータベースを実際に操作するための CRUD について勉強していきます。