---
title: 【2021年から Ruby on Rails をはじめる人向け】 Ruby on Rails 6 入門 Part 8 ～ Rails で Model 連携（アソシエーション）を行う方法～
date: 
author: linkohta
tags: [Ruby on Rails, Web]
---

link です。

今回は Rails 上で Model 連携 （アソシエーション）を行う方法について勉強していきます。

この記事は [Ruby on Rails 6 入門 Part 7](/ruby-on-rails7/) の続きです。

## 前提条件

- Windows 10
- Ruby 3
- Ruby on Rails 6

## Model アソシエーション

Railsでは、アソシエーションとは 2 つの Active Record の Model どうしのつながりを指します。

アソシエーションの勉強をするにあたって先にプログラムの下準備を済ませておきましょう。

### 下準備：Model とデータベースの用意

まずは、今回利用する Model と Controller を生成します。

コンソールを開いて、以下のコードを入力します。
```
$ rails generate model Schools name:string
$ rails generate model Students school_id:integer
```

これで `Schools` Model と `Students` Model が生成されました。

続いて、 `People` Model にカラムを追加します。 `rails generate migration AddDetailsToPeople student_id:integer` を入力します。

これで、 `db/migration/yyyymmddhhmmss_add_details_to_people.rb` が自動生成されます。これはマイグレーション時にカラムを追加するファイルです。

カラムが追加されるのに合わせて、いったん DB の中身をリセットします。 `rails db:reset:migrate` を入力します。

エラーを吐く場合は `db/development.sqlite3` を削除して、 `rails db:migrate` を入力しましょう。

追加 Model と変更後の Model に合わせた初期値を用意するため、 `db/seed.rb` を以下のように変更します。
```rb
Person.create(name:'Ichiro', age:15, student_id:1)
Person.create(name:'Taro', age:15, student_id:2)
Person.create(name:'Jiro', age:14, student_id:3)
School.create(name:'A')
School.create(name:'B')
Student.create(school_id:1)
Student.create(school_id:2)
Student.create(school_id:2)
```

`rails db:seed` を入力して、初期値を追加しましょう。

これで必要な Model とデータベースの用意は完了です。

### アソシエーションの設定

アソシエーションの設定を記述していきます。

`Person` Model を以下のコードに変更します。
```rb
class Person < ApplicationRecord
    # 前回のバリデーションチェックで追加した内容
    belongs_to :student
end
```

`School` Model を以下のコードに変更します。
```rb
class School < ApplicationRecord
    has_many :students
end
```

`Student` Model を以下のコードに変更します。
```rb
class Student < ApplicationRecord
    belongs_to :school
    has_one :person
end
```

これでアソシエーションの設定は完了です。

細かい説明は後程記述しますが、 `School` は複数の `Student` を持ち、 `Student` は特定の `School` に持たれつつ、特定の `Person` を持つという関係にあります。

### Controller と View の記述

Controller と View をそれぞれ追加していきます。

コンソールに以下のコードを入力して、 `schools_controller.rb` と `students_controller.rb` を自動生成します。
```
$ rails generate controller Schools index show
$ rails generate controller Students index show
```

`app/controllers/schools_controller.rb` を以下のように変更します。
```rb
class SchoolsController < ApplicationController
  def index
    @header = 'studyRails'
    @footer = 'link'
    @msg = 'School Data'
    @data = School.all
  end

  def show
    @msg = "Indexed data."
    @data = School.find(params[:id])
  end
end
```

`app/controllers/students_controller.rb` を以下のように変更します。
```rb
class StudentsController < ApplicationController
  def index
    @header = 'studyRails'
    @footer = 'link'
    @msg = 'Student Data'
    @data = Student.all
  end

  def show
    @msg = "Indexed data."
    @data = Student.find(params[:id])
  end
end
```

続いて、 View を書き換えます。

`app/views/school/index.html.erb` を以下のように変更します。
```html
<h1 class="display-4 text-primary">Schools#index</h1>
<p><%= @msg %></p>
<table class="table">
  <tr>
    <th>Id</th><th>Name</th>
  </th>
  <% @data.each do |obj| %>
  <tr>
    <td><%= obj.id %></td>
    <td><a href="/schools/<%= obj.id %>"><%= obj.name %></a></td>
  </tr>
  <% end %>
</table>
```

`app/views/school/show.html.erb` を以下のように変更します。
```html
<h1 class="display-4 text-primary">Schools#show</h1>
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
  <% @data.students.each do |obj| %>
  <tr>
    <th>Student</th>
      <td><a href="/students/<%= obj.id %>"><%= obj.id %></a></td>
  </tr>
  <% end %>
</table>
```

`app/views/student/index.html.erb` を以下のように変更します。
```html
<h1 class="display-4 text-primary">Students#index</h1>
<p><%= @msg %></p>
<table class="table">
  <tr>
    <th>Id</th><th>School Id</th><th>Person Id</th>
  </th>
  <% @data.each do |obj| %>
  <tr>
    <td><%= obj.id %></td>
    <td><%= obj.school_id %></td>
    <td><%= obj.person.id %></td>
  </tr>
  <% end %>
</table>
```

`app/views/school/show.html.erb` を以下のように変更します。
```html
<h1 class="display-4 text-primary">Students#show</h1>
<p><%= @msg %></p>
<table class="table">
  <tr>
    <th>Id</th>
    <td><%= @data.id %></td>
  </tr>
  <tr>
    <th>School Id</th>
    <td><a href="/schools/<%= @data.school_id %>"><%= @data.school_id %></a></td>
  </tr>
  <tr>
    <th>Person Id</th>
    <td><a href="/people/<%= @data.person.id %>"><%= @data.person.id %></a></td>
  </tr>
</table>
```

最後に `config/route.rb` に以下のコードが追加されているかを確認しましょう。

コードが追加されていなかったり、この通りになっていなければ追記、修正してください。
```rb
get 'students/index'
get 'students/:id', to: 'students#show'
get 'schools/index'
get 'schools/:id', to: 'schools#show'
```

これでソースコードの修正は完了です。

## アソシエーションの種類

以下は各アソシエーションの解説です。

### has_one

1 対 1 関係で従属させる側の Model に記述されます。

上述の例では、 `Students` が該当しています。

### has_many

1 対多関係で従属させる側の Model に記述されます。

上述の例では、 `Schools` が該当しています。

### belongs_to

`has_one`, `has_many` ともに従属させられる側の Model に記述されます。

上述の例では、 `has_one` 関係の場合は `People` 、 `has_many` 関係の場合は `Students` が該当しています。

## 参考サイト

[Active Record の関連付け - Railsガイド](https://railsguides.jp/association_basics.html)

## まとめ

今回は Rails 上で複数のモデルを連携させる方法を勉強しました。

次回は CRUD を自動生成する機能である Scaffold について勉強します。

それではまた、別の記事でお会いしましょう。
