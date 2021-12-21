---
title: 【備忘録】DynamoDB で時間を扱う方法
date: 
author: linkohta
tags: [AWS, Web]
description: 
---

link です。

DynamoDB では通常のリレーショナルデータベースと異なり、 DateTime 型を扱うことができません。

そこで、 DynamoDB で文字列型とクエリを使って時間を扱う方法について書いていきます。

## 文字列で DateTime を表現

## クエリで期間を指定