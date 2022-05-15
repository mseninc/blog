---
title: Ruby on Rails 入門 Part 10 ～ Rails と React を組み合わせて使う～
date: 
author: linkohta
tags: [Web, Ruby, Ruby on Rails, React]
description: 
---

link です。

今回は **React** と Rails を組み合わせる方法について勉強していきます。

なお、 Rails 7 が新たにリリースされていますが、今回、紹介する方法は Rails 7 でも利用できます。

## 前提条件

- Windows 10 以降
- Ruby on Rails 6 以降
- Ruby 3 以降

## React とは

React とは、ユーザーインターフェースを作成することに特化した JavaScript ライブラリです。

React の特徴として JavaScript 内に HTML の様な独自の記法（JSX）を記述する点が挙げられます。

>React はユーザインターフェイスを構築するための、宣言型で効率的で柔軟な JavaScript ライブラリです。複雑な UI を、「コンポーネント」と呼ばれる小さく独立した部品から組み立てることができます。
>
>出典 : [チュートリアル：React の導入 – React](https://ja.reactjs.org/tutorial/tutorial.html)

## Rails + React で ToDo アプリを作ってみる

Rails には View の機能を排して Web API として運用する API モードという機能があります。

この Rails の API モードと React を組み合わせて ToDo Web アプリを作ってみたいと思います。

### API モードで Rails プロジェクトを作成

まず、 API モードで Rails プロジェクトを作成します。

```:title=APIモードで作成
$ rails new ReactRails --api
$ rails g controller task index show
$ rails g model task name:string is_complated:boolean
```

### React プロジェクトを作成

```:Reactプロジェクトを作成
$ npx create-react-app react-frontend
```

## まとめ

今回は Rails + React で ToDo アプリを作ってみました。

## 参考サイト

- [チュートリアル：React の導入 – React](https://ja.reactjs.org/tutorial/tutorial.html)
- [Rails による API 専用アプリケーション - Railsガイド](https://railsguides.jp/api_app.html)