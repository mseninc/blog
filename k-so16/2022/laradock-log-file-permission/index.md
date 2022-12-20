---
title: 昨日まで動作していた Laradock がエラーを返すようになったときの解決方法の模索
date: 
author: k-so16
tags: [Web, Laravel, Laradock, Docker]
description: つい昨日まで正常に動いていた Laradock が急に動かなくなる現象に直面したので、その原因と解決方法を紹介します。
---

こんにちは。最近、やっと [Kingdom Hearts](https://www.jp.square-enix.com/kingdom/) のストーリーをクリアした k-so16 です。
終盤、同じ敵を相手に 4, 5 回くらいゲームオーバーになって、かなり苦戦していましたが、やっとの思いでクリアできました (笑)

現在携わっている業務で、 Laradock を使って Laravel を利用しています。
いつも通り、コンテナーを起動して Web アプリの動作を確認しようとしたら、 Laravel のレスポンスが 500 エラーを返していました。

*昨日まで問題なく動いていて Laravel のソースコードを変更したわけでもない* のに、急に 500 エラーを返したので、とても困惑しました。
コンテナー回りで何か操作ミスをしたのかなと思い、コンテナーを再ビルドしてみたり、 Laravel のパッケージをインストールし直したりと奮闘していました。

本記事では、 **筆者が直面したエラーの原因と解決方法** を紹介します。

本記事で想定する読者層は以下の通りです。

- Laravel についての基礎知識を有している
- Laradock についての基礎知識を有している
- UNIX/Linux のファイルの権限に関する基礎知識を有している

## 実行環境

執筆の際に動作を確認した環境は以下の通りです。

- Windows 11 Pro 21H2
- Windows Subsystem for Linux Version 2
    - Ubuntu 22.04.1 LTS
- Docker Desktop: v4.14.1
    - Docker: version 20.10.21
    - Docker Compsoe: version v2.12.2
- Laradock: v12.1

## エラーの発生原因と解決方法

まず、 *エラーを返していた理由* と、 *エラーが発生する原因となった経緯* について説明します。
その後、その **解決方法** を紹介します。

### エラーの理由と発生原因

**Laravel のログファイルに対して書き込み権限がなかったこと** が原因でした。
筆者の環境ではログのドライバーを `daily` に設定していたので、ログのファイル名は `storage/logs/laravel-{日付}.log` という形式で生成されています。
500 エラーが起きた日のログファイルを確認してみると、他のログファイルは所有者が `laradock` になっているのに対し、このファイルだけ *所有者が `root`* になっていました。

ログファイルの所有者が `root` になっていると、 workspace コンテナーの Web サーバーへアクセスされた際に  *書き込み権限がないため、ログを書き込めず* 500 エラーが発生します。

著者の環境で `storage/logs` の各ファイルの所有者を確認すると、 `laravel-2022-12-08.log` だけ所有者が `root` になっていました。

```bash{16}:title=ログファイルの権限の確認
root@b543595f5c4b:/var/www# ls -l storage/logs/
total 1028
-rw-r--r-- 1 laradock laradock   1957 Nov  2 02:57 laravel-2022-11-02.log
-rw-r--r-- 1 laradock laradock  70636 Nov  7 02:57 laravel-2022-11-07.log
-rw-r--r-- 1 laradock laradock  75714 Nov 15 05:05 laravel-2022-11-15.log
-rw-r--r-- 1 laradock laradock 192387 Nov 16 04:31 laravel-2022-11-16.log
-rw-r--r-- 1 laradock laradock  98262 Nov 17 05:55 laravel-2022-11-17.log
-rw-r--r-- 1 laradock laradock  98144 Nov 18 02:26 laravel-2022-11-18.log
-rw-r--r-- 1 laradock laradock  63788 Nov 21 02:20 laravel-2022-11-21.log
-rw-r--r-- 1 laradock laradock  98689 Nov 22 03:02 laravel-2022-11-22.log
-rw-r--r-- 1 laradock laradock  38286 Nov 24 05:58 laravel-2022-11-24.log
-rw-r--r-- 1 laradock laradock  84612 Nov 25 02:57 laravel-2022-11-25.log
-rw-r--r-- 1 laradock laradock  86380 Dec  5 04:15 laravel-2022-12-05.log
-rw-r--r-- 1 laradock laradock  21227 Dec  6 02:32 laravel-2022-12-06.log
-rw-r--r-- 1 laradock laradock   8071 Dec  7 01:22 laravel-2022-12-07.log
-rw-r--r-- 1 root     root      37350 Dec  8 02:37 laravel-2022-12-08.log
```

500 エラーが返ってくるようになったのは、ちょうど 2022/12/08 でした。
この日は workspace コンテナーに入って、 `artisan` コマンドで作業をしていたのですが、サブコマンドを typo した際にログファイルが生成され、エラーメッセージが記録されました。

デフォルトでは、 *workspace コンテナーに入ると `root` ユーザーとしてログイン* します。
*操作しているユーザーが `root`* だったので、 **この日のログファイルの所有者も `root`** になってしまいました。

### 解決方法

**ログファイルの所有者を `laradock` に変えること** で解決しました。
Laradock の workspace コンテナーに入り、以下のコマンドを実行することで所有者を `laradock` に変更できます。

```bash:title=ログファイルの所有者の変更
sudo chown laradock:laradock storage/logs/laravel-*.log
```

これで無事に workspace コンテナーの Web サーバーから正常にレスポンスが返るようになりました。

## 防止策

今回のトラブルの防止策として、以下の 2 つの方法を考えました。

- コンテナーに入る際のユーザーを指定
- コンソールログと Web のログを分離

### コンテナーに入る際のユーザーの指定方法

*コンテナーに入った際のログインユーザーが `root` になっていた* ことが今回のトラブルの発生の取っ掛かりといえます。
*コンテナーを操作するユーザーを指定* できれば、トラブルを回避できたはずです。
workspace コンテナーの場合、 `laradock` ユーザーとして操作できれば、少なくともファイル権限に関するトラブルは避けられたはずです。

Docker Compose の `exec` コマンドのヘルプを見てみると、 **`--user` オプション** を使うことでユーザーを指定できると記載されていました。
実際に、以下のコマンドを実行すると、 workspace コンテナーに `laradock` ユーザーとして入ることができました。

```bash:title=ログインユーザーの指定
# ホスト側のシェル
$ docker compose exec --user laradock workspace bash
# コンテナー側のシェル
laradock@5b0db194b72c:/var/www$ whoami
laradock
laradock@5b0db194b72c:/var/www$
```

### コンソールログと Web のログを分離する方法

ユーザーを指定してコンテナーに入る方法では、毎回ユーザーを指定しなければなりません。
うっかりユーザーを指定し忘れて、 `root` ユーザーでコマンドを実行する可能性もあります。

*コンソールから出力されるログと Web のログで出力先のファイルが分ける* ことで、 **ログの所有者を分ける** ことができ、権限がないという事態を防げるはずです。

Laravel では、 **[`runningInConsole()`](https://laravel.com/api/9.x/Illuminate/Contracts/Foundation/Application.html#method_runningInConsole)** というメソッドでコンソールから実行されたかを判定できます。
コンソールで実行された場合は `true`, そうでなければ `false` を返します。
*`app()->runningInConsole()`* と記述することで実行できます。

`aoo()->runningInConsole()` でコンソールから実行されているかを判定し、その結果に応じて出力先を変えるようにします。
ログファイルの出力先は `config/logging.php` の `'path'` に指定します。

ログファイルの出力先の設定例は以下の通りです。
以下の例では、ログのドライバーは `daily` が指定されている想定です。

```php{3}:title=config/logging.php
'daily' => [
    'driver' => 'daily',
    'path' => app()->runningInConsole() ? storage_path('logs/console.log') : storage_path('logs/laravel.log'),
    'level' => 'debug',
    'days' => 14,
],
```

上記の設定の場合、コンソールログは *`storage/logs/console-{日付}.log`* に、その他のログは *`storage/logs/laravel-{日付}.log`* に出力されます。

これで、 `root` ユーザーで `artisan` コマンドを実行しても、ログの出力先が分離されるので、 Web アプリケーション側が動かなくなる事態を回避できるようになりました。

本記事を執筆する上で、以下の書籍を参考にしました。

> [PHPフレームワーク Laravel Webアプリケーション開発 バージョン 5.5 LTS対応](https://www.socym.co.jp/book/1184)

## まとめ

本記事のまとめは以下の通りです。

- Laradock で急に 500 エラーを返すようになった原因と解決方法を紹介
    - *`root` ユーザーでログファイルが生成されてしまった* ことが原因
    - **Laravel のログファイルの所有者や権限を適切に修正** することで解決
- コンテナーに入る際のユーザーを変更する方法を紹介
    - Docker Compose の `exec` コマンドで `--user` オプションを使って指定可能
- ログファイルの出力先を分離させる方法を紹介

以上、 k-so16 でした。
Docker って難しいですね (笑)
