---
title: Laradock を Docker Compose v2 で動かす方法
date: 2022-12-21
author: k-so16
tags: [Docker, Laradock, 仮想化技術]
description: Docker Compose v2 で Laradock を動作させる方法を紹介します。
---

こんにちは。最近、 [Quasar](https://quasar.dev/) と [Vue.js](https://vuejs.org/) のアップグレード作業に奮闘している k-so16 です。
公式ドキュメントの移行ガイドを読みながら地道に頑張っています (笑)

あるプロジェクトで利用していた Laradock のバージョンが古く、 PGP エラーでコンテナーの作成に失敗したため、 Laradock のバージョンを上げることにしました。
Laradock のバージョンをあげたことで PGP エラーは解決したものの、今度は別のエラーが発生しました。

本記事では、 **Docker Compose v2 で Laradock を動作させる方法** を紹介します。

本記事で想定する読者層は以下の通りです。

- Docker および Docker Compose についての基礎知識を有している
- Laradock についての基礎知識を有している

## 実行環境

執筆の際に動作を確認した環境は以下の通りです。

- Windows 11 Pro 21H2
- Docker Desktop: v4.13.1
    - Docker: version 20.10.20
    - Docker Compsoe: version v2.12.1
- Laradock: v12.1

Docker Compose のバージョンが 2.x 系であれば、 OS に関係なく同じ現象が発生するはずです。

## エラーの内容

Laradock をビルドすると、以下のエラーが発生しました。

> WARN[0000] The "lXaL3lj6raFic6rFqr2" variable is not set. Defaulting to a blank string.
> Invalid template: "admin:$2y$10$lXaL3lj6raFic6rFqr2.lOBoCudAIhB6zyoqObNg290UFppiUzTTi"

`lXaL3lj6raFic6rFqr2` という変数を利用するような設定は書いていないはずなのに、変数が設定されていないと怒られています。
`.env` で該当の文字列を検索してみると、 `TRAEFIK_DASHBOARD_USER` という環境変数の値に含まれていました。

```bash:title=.env
TRAEFIK_DASHBOARD_USER=admin:$2y$10$lXaL3lj6raFic6rFqr2.lOBoCudAIhB6zyoqObNg290UFppiUzTTi
```

## 解決方法

環境変数 `TRAEFIK_DASHBOARD_USER` に含まれる *`$lXaL3lj6raFic6rFqr2` が変数として認識されてしまっていた* ことが原因でした。
シェル変数と同様に `$` から始まる文字列は変数として扱われます。[^1]

変数として扱われないようにするには、シェルと同様に **シングルクオーテーション (`'`) で値全体を囲みます。**

```bash:title=.env
TRAEFIK_DASHBOARD_USER='admin:$2y$10$lXaL3lj6raFic6rFqr2.lOBoCudAIhB6zyoqObNg290UFppiUzTTi'
```

環境変数の値をシングルクオーテーションで囲むことで、無事にビルドに成功してコンテナーを立ち上げることができました。

本記事を執筆する上で、以下の記事を参考にしました。

> - [laravel - Can&#39;t start service with Docker Version 4.11.0 (83626) - Stack Overflow](https://stackoverflow.com/questions/73229946/cant-start-service-with-docker-version-4-11-0-83626)

## まとめ

本記事のまとめは以下の通りです。

- Laradock を Docker Compose v2 で動作させる方法の紹介
    - 環境変数の値をシングルクオーテーションで囲む

以上、 k-so16 でした。
Docker について、また 1 つ知識が増えました (笑)

[^1]: 変数名の先頭はアルファベットのみが利用可能なため、 `$2y` や `$10` は変数として扱われない。