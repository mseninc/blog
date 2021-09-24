---
title: ESET File Security for Linux v4.5 から v7.2 へバージョンアップする
date: 2021-09-13
author: jinna-i
tags: [セキュリティ, ESET, Linux, その他の技術]
---

こんにちは、じんないです。

キヤノンから ESET File Security for Linux v4.5 は2021年12月31日をもってサポート終了との案内がされていましたので、v7.2 へバージョンアップしてみました。
[【重要】Windows向けプログラム V6.x / V7.x、Linux Server向けプログラム V4.5、セキュリティ管理ツール V6.5 / V7.x のサポート終了について| ESETサポート情報](https://eset-support.canon-its.jp/faq/show/19104?site_domain=business#server)

![](images/2021-09-13_13h56_36.png)

条件を満たせば上書きインストールができるようですが、v4.5 → v7.2 は上書きインストールができないようなので、アンインストール後に新規インストールを行います。

## 想定環境

- OS: CentOS 7
- アップグレード前: ESET File Security for Linux v4.5
- アップグレード後: ESET File Security for Linux v7.2

## v4.5 のアンインストール

まずは v4.5 のアンインストールから行います。

## v.7.2 のインストール

## 参考
- [ESET File Security for Linux をバージョンアップしたい | ESETサポート情報](https://eset-support.canon-its.jp/faq/show/3234?site_domain=business)