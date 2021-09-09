---
title: "[AWS] API Gateway で直接 DynamoDB の項目を取得する方法"
date: 2021-08-28
author: junya-gera
tags: [API Gateway, DynamoDB, AWS]
---

こんにちは、じゅんじゅんです。先日、API Gateway から直接 DynamoDB へ書き込みを行う記事を投稿しました（[前編]()・[後編]()）。この記事では逆に **API Gateway で直接 DynamoDB のテーブルに登録されている項目を取得する方法**をご紹介します。

## 概要
今回は「勤怠を記録している Attendance テーブルから1週間分の項目を取得する API」 を作成します。

AWS コンソールの画面は 2021/ 時点のものです。

## 手順
