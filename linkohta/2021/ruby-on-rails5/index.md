---
title: 【2021年から Ruby on Rails をはじめる人向け】 Ruby on Rails 6 入門 Part 5 ～ CRUD を使う～
date: 2021-07-26
author: linkohta
tags: [Ruby on Rails, Web]
---

link です。

今回は Model の CRUD を使ってデータベースの情報の参照、更新、追加、削除を一通り実践してみましょう。

この記事は前回 [Ruby on Rails 6 入門 Part 4](https://mseeeen.msen.jp/ruby-on-rails4/) の続きです。

## 前提条件

- Windows 10
- Ruby on Rails 6

## CRUD とは

>CRUD（クラッド）とは、ほとんど全てのコンピュータソフトウェアが持つ永続性の4つの基本機能のイニシャルを並べた用語。その4つとは、Create（生成）、Read（読み取り）、Update（更新）、Delete（削除）である。ユーザインタフェースが備えるべき機能（情報の参照/検索/更新）を指す用語としても使われる。

>出展：[CRUD - Wikipedia](https://ja.wikipedia.org/wiki/CRUD)

**CRUD** とは大体のソフトウェアが行えるデータの読み書きを指します。この CRUD を行える API を作成していきましょう。

### データの作成

まず、`app/controller/people_controller.rb` に `add`、`create`、`person_params` のメソッドを追加します。

`add` はデータの作成画面に遷移した時に使われます。 `create` は作成したデータを保存するときに使われます。

`person_params` はフォームヘルパーでデータの書き込みを行うときに使います。`private` でクラス内でのみ呼び出せるメソッドにしています。

```rb
class PeopleController < ApplicationController
  protect_from_forgery
  # 中略
  def add
    @msg = "add new data."
    @person = Person.new
  end

  def create
    if request.post? then
      Person.create(person_params)
    end
    redirect_to '/people/index'
  end

  private
  def person_params
    params.require(:person).permit(:name, :age)
  end
end
```

`protect_from_forgery` は CSRF 対策として利用されるメソッドで、 form ヘルパーを使ったデータの更新などを行うときに必要です。後で必要になるのでここで追記します。

続いて、`app/views/people/add.html.erb` を作成して、中身を以下のようにします。
```html
<h1 class="display-4 text-primary">People#add</h1>
<p><%= @msg %></p>
<%= form_with model: @person, url: people_add_path do |form| %>
  <div class="form-group">
    <label for="name">Name</label>
    <%= form.text_field :name, class:"form-control" %>
  </div>
  <div class="form-group">
    <label for="age">Age</label>
    <%= form.text_field :age, class:"form-control" %>
  </div>
<%= form.submit class:"btn btn-primary" %>
<% end %>
```

`route.rb` に `get 'people/add'` と `post 'people/add', to: 'people#create'` を追記してルーティングしておくのも忘れないようにしましょう。

`rails s` で アプリを起動後、`localhost:3000/people/add` にアクセスして以下の画像のようになっていれば成功です。
![add](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h15_35.png)

追加できることも確認しておきましょう。
![add2](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h36_47.png)

データの追加ができていれば大丈夫です。
![add3](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h36_54.png)

### データの参照

`app/controller/people_controller.rb` に `show` のメソッドを追記します。
```rb
def show
  @msg = "Indexed data."
  @data = Person.find(params[:id])
end
```

続いて、`app/views/people/show.html.erb` を作成して、中身を以下のようにします。
```html
<h1 class=="display-4 text-primary">People#show</h1>
<p><%= @msg %></p>
<table class="table">
  <tr>
    <th>Id</th>
    <td><%= @data.id %></td>
  </tr>
  <tr>
    <th>Name</th>
    <td><%= @data.name %></td>
  </tr>
  <tr>
    <th>Age</th>
    <td><%= @data.age %></td>
  </tr>
</table>
```

加えて、`app/views/people/index.html.erb` を以下のように変更します。
```html
<h1 class="display-4 text-primary">People#index</h1>
<p><%= @msg %></p>
<table class="table">
  <tr>
    <th>Id</th><th>Name</th><th></th>
  </th>
  <% @data.each do |obj| %>
  <tr>
    <td><%= obj.id %></td>
    <td><a href="/people/<%= obj.id %>"><%= obj.name %></a></td>
  </tr>
  <% end %>
</table>
```

最後に、`route.rb` へ `get 'people/:id', to: 'people#show'` を追記してルーティングします。

`:id` が `params[:id]` で利用されるキーです。

Rails のルーティングは、 `route.rb` の上からの記載順にマッチします。そのため、**ここで追加したルーティングは `people` のルーティング中で一番最後に来るようにしましょう。**

`people/:id` のルーティングを先に定義すると、 `add` や後で追加する `delete` が `:id` のパラメーターとして認識されてしまいます。

`localhost:3000/people/index` にアクセスして、以下の画像のような画面になっていれば成功です。
![show](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h18_04.png)

ID をクリックすれば Person の情報にアクセスできます。
![show2](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h18_09.png)

### データの更新

`app/controller/people_controller.rb` に `edit` と `update` のメソッドを追記します。

`edit` は編集画面に移行するときに利用されるメソッドです。 `update` は編集内容を保存するときに利用されるメソッドです。
```rb
def edit
  @msg = "edit data.[id = " + params[:id] + "]"
  @person = Person.find(params[:id])
end
  
def update
  obj = Person.find(params[:id])
  obj.update(person_params)
  redirect_to '/people/index'
end
```

次に `app/views/people/index.html.erb` を以下のように変更します。

`Edit` リンクを追加して編集画面に移動できるようにしています。
```html
<h1 class="display-4 text-primary">People#index</h1>
<p><%= @msg %></p>
<table class="table">
  <tr>
    <th>Id</th><th>Name</th><th></th>
  </th>
  <% @data.each do |obj| %>
  <tr>
    <td><%= obj.id %></td>
    <td><a href="/people/<%= obj.id %>"><%= obj.name %></a></td>
    <td><a href="/people/edit/<%= obj.id %>">Edit</a>
  </tr>
  <% end %>
</table>
```

続いて、`app/views/people/edit.html.erb` を作成して、中身を以下のようにします。
```html
<h1 class="display-4 text-primary">People#edit</h1>
<p><%= @msg %></p>
<%= form_with model: @person, url: '' do |form| %>
  <div class="form-group">
    <label for="name">Name</label>
    <%= form.text_field :name, class:"form-control" %>
  </div>
  <div class="form-group">
    <label for="age">Age</label>
    <%= form.text_field :age, class:"form-control" %>
  </div>
<%= form.submit class:"btn btn-primary" %>
<% end %>
```

`route.rb` へ `get 'people/edit/:id', to: 'people#edit'` と `patch 'people/edit/:id', to: 'people#update'` を追記してルーティングします。

`localhost:3000/people/index` にアクセスして、 `edit` リンクを押してみましょう。
![edit](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h18_37.png)

`Edit` リンクから編集画面にアクセスして以下の画像のような画面になっているか確認しましょう。
![edit2](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h18_43.png)

編集できれば成功です。
![edit3](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h18_55.png)

### データの削除

`app/controller/people_controller.rb` に `delete` のメソッドを追記します。
```rb
def delete
  obj = Person.find(params[:id])
  obj.destroy
  redirect_to '/people/index'
end
```

続いて、 `app/views/people/index.html.erb` を以下のように変更します。

`Delete` リンクを追加しています。 `link_to` メソッド で確認画面付きのリンクを生成しています。
```html
<h1 class="display-4 text-primary">People#index</h1>
<p><%= @msg %></p>
<table class="table">
  <tr>
    <th>Id</th><th>Name</th><th></th>
  </th>
  <% @data.each do |obj| %>
  <tr>
    <td><%= obj.id %></td>
    <td><a href="/people/<%= obj.id %>"><%= obj.name %></a></td>
    <td><a href="/people/edit/<%= obj.id %>">Edit</a>
    <%= link_to("Delete", "/people/delete/#{obj.id}", method:"delete", data: { confirm: "このデータを削除しますか？" }) %>
  </tr>
  <% end %>
</table>
```

`route.rb` に `get 'people/delete/:id', to: 'people#delete'` を追記してルーティングすれば完了です。

`localhost:3000/people/index` にアクセスして、 `Delete` リンクを押してみましょう。
![delete](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h19_17.png)

以下の画像のようなウィンドウが出てきます。
![delete2](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h19_30.png)

`OK` ボタンを押して削除ができていれば完了です。
![delete3](https://mseeeen.msen.jp/wp-content/uploads/2021/07/2021-07-09_17h19_43.png)

最終的な `route.rb` は以下のようになると思います。
```rb
Rails.application.routes.draw do
  get 'people/index'
  get 'people/add'
  post 'people/add', to: 'people#create'
  get 'people/edit/:id', to: 'people#edit'
  patch 'people/edit/:id', to: 'people#update'
  delete 'people/delete/:id', to: 'people#delete'
  get 'people/:id', to: 'people#show'
end
```

ルーティングのコードの基本形は `HTTPメソッド 'コントローラー名/メソッド名'` もしくは `HTTPメソッド 'パス', to: 'コントローラー名#メソッド名'` です。

HTTP メソッドはデータの表示は get、データの新規作成は post、データの更新は patch、データの削除は delete を使う様にしましょう。

## まとめ

今回は Rails で CRUD を実現しました。次回は Rails でのデータ検索についてさらに詳しく勉強していきたいと思います。

それではまた次回にお会いしましょう。
