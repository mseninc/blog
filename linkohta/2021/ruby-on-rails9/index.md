---
title: 【2021年から Ruby on Rails をはじめる人向け】 Ruby on Rails 6 入門 Part 9 ～ Scaffold で簡単に Web アプリを実装する方法～
date: 
author: linkohta
tags: [Ruby on Rails, Web]
---

link です。

今回は CRUD を簡単に生成してくれる **Scaffold** を使って、簡単な Web アプリを実装してみましょう。

この記事は [Ruby on Rails 6 入門 Part 8](/ruby-on-rails8/) の続きです。

## 前提条件

- Windows 10
- Ruby 3
- Ruby on Rails 6

## Scaffold とは

Scaffold は工事現場で使う足場、土台の意味で、 Model の CRUD を自動で生成してくれる Rails の機能です。

コンソールで `rails g scaffold モデル名 カラム 1 : 型 カラム 2 : 型...` と入力するだけで CRUD を実装した Controller, View, Model のすべてを自動で生成してくれます。

ただし、自動生成されるのは CRUD だけなので Search(検索) などの別機能は自分で実装する必要があります。

この Scaffold を使って、簡単なメールアプリを実装してみましょう。

## メールアプリの実装



## まとめ

今回は Scaffold を使って簡単な Web アプリを実装してみました。

それではまた、別の記事でお会いしましょう。
