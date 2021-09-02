---
title: 【2021年から Ruby on Rails をはじめる人向け】 Ruby on Rails 6 入門 Part 3 ～ Bootstrap 5 の適用～
date: 2021-05-31
author: linkohta
tags: [Bootstrap, Ruby on Rails, Web]
---

link です。だんだん暖かくなってきましたね。ここから暑くなってくるまであっという間だと思いますが。

この記事は、前回[Ruby on Rails 6 入門 Part 2](https://mseeeen.msen.jp/ruby-on-rails2/)の続きです。

今回は ERB テンプレートに Bootstrap を適用する方法と ERB テンプレートを使って、 Controller 共通のレイアウトを設定する方法、今までの内容に +α してメッセージ投稿機能を作ってみたいと思います。

## Bootstrap の適用

**Bootstrap** とは、ウェブサイトや Web アプリケーションを作成するフロントエンド Web アプリケーションフレームワークです。

Bootstrap を使うことで Web デザインの知識がなくとも、整ったデザインの Web ページが作成できます。

**この記事を書いた時点での最新バージョンは `5.0.1` となっています。**

適用方法はとても簡単です。

[Bootstrap の公式サイト](https://getbootstrap.com/docs/5.0/getting-started/introduction/)に行き、 Get started ボタンを押します。
![bootstrap1](https://mseeeen.msen.jp/wp-content/uploads/2021/05/2021-05-19_16h26_34.png)

遷移先のページの **CSS** という項目の HTML コードをコピーします。 `Copy` ボタンを押せばクリップボードにコピーしてくれます。
![bootstrap2](https://mseeeen.msen.jp/wp-content/uploads/2021/05/2021-05-19_16h26_40.png)

`app/views/start/index.html.erb` を開いて、 `<head>` と `</head>` の間に先ほどコピーした CSS のコードをペーストしましょう。

続けて、
```html
<%= text_field_tag(:input) %>
<%= submit_tag("send") %>
```
となっている個所を
```html
<%= text_field_tag(:input, "", {class:"form-control"}) %>
<%= submit_tag("send", {class:"btn btn-primary"}) %>
```
と書き換えます。

画像のようになっていれば適用が成功しています。
![成功例](https://mseeeen.msen.jp/wp-content/uploads/2021/05/2021-05-07_10h55_48.png)

`class:...` となっている個所が Bootstrap のデザインを適用する箇所というわけですね。

## 共通のレイアウトの設定

Rails のレイアウトは **`app/views/layouts` 内にある ERB テンプレート**で決定されます。

`app/views/layouts` に `start.html.erb` を作成して、中身を
```html
<html>
<head>
    <title><%= @title %></title>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
    <%= stylesheet_link_tag 'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
</head>
<body class="container text-body">
    <%= render template:'layouts/start_header' %>
    <%= yield %>
    <%= render template:'layouts/start_footer' %>
</body>
</html>
```
と書きます。

これが `StartController` で使用される共通の ERB テンプレートです。

`<%= csrf_meta_tags %>` は**クロスサイトリクエストフォージェリ対策**です。詳しくは、 [Rails セキュリティガイド](https://railsguides.jp/security.html)に記載されていますが、**Webアプリケーションの脆弱性を利用した攻撃への対策です。**

`<%= csp_meta_tag %>` は **Content Security Policy (CSP)** を設定するためのヘルパーです。 CSP とは クロスサイトスプリクティング (XSS) の脆弱性による影響範囲を少なくするための仕組みです。

`<body>` タグの中に
```html
<%= render template:'layouts/start_header' %>
<%= yield %>
<%= render template:'layouts/start_footer' %>
```
という文があります。

**`render template:...` が別のテンプレートの中身を埋め込み、 `yield` が Controller の関数に対応した View を埋め込むというものです。**

続いて `app/views/layouts` 内に `start_header.html.erb` と `start_footer.html.erb` を作成して、中身をそれぞれ

**start_header.html.erb**
```html
<h1 class="display-4 text-center mt-1 mb-4 text-primary">
    <%= @header %>
</h1>
```

**start_footer.html.erb**
```html
<div class="mt-5 text-right small text-dark border-bottom border-dark">
    <%= @footer %>
</div>
```

としましょう。

それぞれのタグの中身を弄れば、 Header と Footer の設定ができます。

最後に、 `app/controller/start_controller.rb` を
```rb
class StartController < ApplicationController
    layout 'start'
    def index()
        @title = "Hello Rails!:"
        @header = "studyRails"
        @footer = "link"
        if request.post?
            @msg = params[:input]
        else
            @msg = "Not POST"
        end
    end
end
```
と書き換えましょう。

画像のように出ていれば成功です。
![成功例2](https://mseeeen.msen.jp/wp-content/uploads/2021/05/2021-05-07_15h01_11.png)

## メッセージ投稿機能を作ってみる

ここまでの内容とデータを保存する Ruby のコードを使ってメッセージ投稿機能を作ってみましょう。

まず、新しい Controller を作成します。 `rails generate controller msgboard index` とターミナルに入力しましょう。

これで、 `index` 関数があらかじめ宣言された `msgboard_controller.rb` が生成され、 `routes.rb` に `get 'msgboard/index'` が自動的に追加されます。

Controller に作る関数があらかじめ決まってる場合は、これを使うと簡単に自動生成してくれるので便利です。

続いて、 `app/views/layouts/msgboard.html.erb` と `app/views/msgboard/index.html.erb` と `app/controller/msgboard_controller.rb` を以下のように書き換えましょう。

**msgboard.html.erb**
```html
<html>
<head>
    <title>メッセージボード</title>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
    <%= stylesheet_link_tag 'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
</head>

<body class="container text-body">
    <%= render template:'layouts/start_header' %>
    <%= yield %>
    <%= render template:'layouts/start_footer' %>
</body>
</html>
```
**index.html.erb**
```html
<%= form_tag(controller: "msgboard", action: "index") do %>
    <div class="form-group">
        <label for="name">名前</label>
        <%= text_field_tag("name", "", {class:"form-control"}) %>
    </div>
    <div class="form-group">
        <label for="mail">メール</label>
        <%= text_field_tag("mail", "", {class:"form-control"}) %>
    </div>
    <div class="form-group">
        <label for="msg">メッセージ</label>
        <%= text_field_tag("msg", "", {class:"form-control"}) %>
    </div>
        <%= submit_tag("Send", {class:"btn btn-primary"}) %>
<% end %>

<table class="table mt-4">
    <tr>
        <th style="width:50%">メッセージ</th>
        <th>名前</th>
        <th>メール</th>
    </tr>
    <% @msg_data.each do |key,obj| %>
    <tr>
        <td class="msg"><%= obj['msg'] %></td>
        <td class="name"><%= obj['name'] %></td>
        <td class="mail"><%= obj['mail'] %></td>
    </tr>
    <% end %>
</table>
```
**msgboard_controller.rb**
```rb
class MsgboardController < ApplicationController
  layout 'msgboard'

  def initialize
    super
    begin
      @msg_data = JSON.parse(File.read("data.txt"))
    rescue => exception
      @msg_data = Hash.new
    end
    File.write("data.txt", @msg_data.to_json)
  end

  def index
    @header = 'メッセージボード'
    @footer = 'studyRails'
    if request.post? then
      obj = MyData.new(params['name'], params['mail'], params['msg'])
      @msg_data[@msg_data.length] = obj
      data = @msg_data.to_json
      File.write("data.txt", data)
      @msg_data = JSON.parse(data)
    end
  end
end

class MyData
  attr_accessor :name
  attr_accessor :mail
  attr_accessor :msg

  def initialize(name, mail, msg)
    @name = name
    @mail = mail
    @msg = msg
  end
end
```

`initialize` 関数は Java や C# などでいうところの**コンストラクタ**に当たります。**インスタンスが生成されるときに自動的に実行されるメソッドです。**

`index` 関数で、ユーザーがフォームに入力した内容を JSON 形式に変換して、 `data.txt` にデータの読み書きを行っています。

`attr_accessor` はインスタンス変数の setter/getter の両方を定義してくれるメソッドです。 getter のみの `attr_reader` 、 setter のみの `attr_writer` も存在します。

最後に、忘れずに `config/route.rb` に `post 'msgboard/index'` を付け足しましょう。 `localhost:3000/msgboard/index` にアクセスして、下のような画面が出ていれば成功です。
![msgboard1](https://mseeeen.msen.jp/wp-content/uploads/2021/05/2021-05-11_15h42_22.png)

フォームに何かを入力して、 `Send` ボタンを押すと、
![msgboard2](https://mseeeen.msen.jp/wp-content/uploads/2021/05/2021-05-11_15h43_10.png)

下のような画面になるはずです。
![msgboard3](https://mseeeen.msen.jp/wp-content/uploads/2021/05/2021-05-11_15h44_02.png)

これでメッセージ投稿機能が出来ました。

## まとめ

今回は Bootstrap を適用して、 ERB テンプレートを使って、 Controller 共通のレイアウトを設定する方法を勉強し、メッセージ投稿機能を作ってみました。

次回は、より Web アプリの作成を便利にするために、 Ruby on Rails でデータベースを使う方法を勉強していきたいと思います。