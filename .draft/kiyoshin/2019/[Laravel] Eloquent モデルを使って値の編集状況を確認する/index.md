---
title: "[Laravel] Eloquent モデルを使って値の編集状況を確認する"
date: 2019-04-10
author: kiyoshin
tags: [Laravel, Eloquent, その他]
---

入力フォームの入力内容によって、更新対象のレコードに変更が生じているかどうかをサーバーサイドで知りたい時の確認方法（いわゆるダーティーな状態を検知）を紹介したいと思います。

## 使用するメソッド isDirty()

メソッド名からも振る舞いが伝わってきますね。

以下、使用方法例です。

使用するファンクション
画面入力値がデータの更新前に対象レコードが

https://laravel.com/api/5.6/Illuminate/Database/Eloquent/Model.html#method_isDirty
https://laravel.com/api/5.6/Illuminate/Database/Eloquent/Model.html#method_wasChanged