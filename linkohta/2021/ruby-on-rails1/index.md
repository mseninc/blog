---
title: 【2021年から Ruby on Rails をはじめる人向け】 Ruby on Rails 6 入門 Part 1 ～ Hello World! ～
date: 2021-04-21
author: linkohta
tags: [Ruby on Rails, Web]
---

初めまして、4月から入社した link です。趣味は RPG ツクールでのゲーム制作です。

主に Web アプリの開発に関することなどを書いていけたらと思っています。

お手軽に Web アプリの開発をしたい！という人は大勢いると思いますが、 Web アプリの開発といっても言語やフレームワークはたくさんあります。

その中で直感的にコードを書けると評判の Ruby を使った **Ruby on Rails** の勉強をしていきたいと思います。

## Ruby on Railsとは

> Ruby on Rails （ルビーオンレイルズ）は、オープンソースの Web アプリケーションフレームワークである。 RoR または単に Rails と呼ばれる。その名にも示されているように Ruby で書かれている。また Model View Controller （MVC）アーキテクチャに基づいて構築されている。

出典：[Ruby on Rails - Wikipedia](https://ja.wikipedia.org/wiki/Ruby_on_Rails)

要するにお手軽にWebアプリを製作するためのアプリケーションフレームワークの一種ですね。

## インストール

### Ruby のインストール

では、さっそくインストールしていきましょう。Ruby をインストールする方法として、

* サードパーティのパッケージ管理ツールを使う（Linux, Mac）
* ソースコードから Ruby をコンパイルする
* [RubyInstaller](https://rubyinstaller.org/) を使う（Windows）

の３つが存在します。

今回は RubyInstaller を使ってインストールしましょう。

ダウンロードページに行くと WITH DEVKIT と WITHOUT DEVKIT の二種類があります。 **Ruby on Rails に必要なソフトが一通り入っているのは WITH DEVKIT です。**

x86 と x64 は Windows に応じて選んでくださいね。

**RubyInstaller を起動すると色々なデベロッパーツールをインストールするかのチェック項目がありますが、全てチェックしたままインストールしましょう。**

成功していれば、 `ruby 3.0.0p0 (2020-12-25 revision 95aff21468) [x64-mingw32]` という風な文字が返ってきます。

### Ruby on Rails のインストール

続いて、 Ruby on Rails をインストールします。コマンドプロンプトで `gem install rails` と入力しましょう。

インストールが完了したら、 `gem update` と打って最新版にしておくのも忘れずに。

**最後に [Node.js](https://nodejs.org/ja/) をインストールしましょう。現在の Ruby on Rails では必要になります。**

## Hello World! する

まず、プログラミングの最初の儀式として Hello World! を表示するページを Rails で作ってみましょう。

### プロジェクトの作成

`rails new studyRails` と打ってみましょう。これで studyRails というフォルダが生成されるはずです。

`cd` で studyRails フォルダに移動して `rails s` と打てば作成した studyRails の Web アプリが起動するはずです。

後は、 `localhost:3000` にアクセスすれば、下にあるような画像が出てくるはずです。

![スタート画面](https://mseeeen.msen.jp/wp-content/uploads/2021/04/rails-300x281.png)

### Controller の生成

さて、このままではこの画面を表示するだけなので、関数を追加して Hello World! を表示できるようにしましょう。

`rails generate controller start` と入力します。すると、`app/controllers` に **start_controller.rb というファイルが生成されるはずです。**

これが **Controller** です。このファイルに関数を書き込んでいきます。中を覗くと

```rb
class StartController < ApplicationController
end
```

となっているはずです。

これを

```rb
class StartController < ApplicationController
    def hello()
        render:plain => ('Hello World!')
    end
end
```

としましょう。

### routes の設定

次は先ほど生成した HelloController から関数を呼び出せるように **routes** の設定をします。

`config` の中に `route.rb` というファイルがあるはずです。それを開くと、

```rb
Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
```

となっているはずなので、これを、

```rb
Rails.application.routes.draw do
  get 'hello' => 'start#hello'
end
```

としましょう。

簡単に説明しておくと、 **GET メソッドで `/hello` とリクエストを送ると StartContoroller の hello というメソッドを呼び出すというコード** です。

書き換え終わったら、今度は `localhost:3000/hello` にアクセスしてみましょう。

Hello World! という文字がブラウザに表示されるはずです。

これで Hello World! を表示できました。

## まとめ

今回は Ruby on Rails をインストールして Hello World! を表示するところまでやりました。

次回以降はフォームやクエリの設定や View の説明と Ruby の細かい文法について話をしていきたいと思います。