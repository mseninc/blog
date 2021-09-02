---
title: PHP で Slack のチャンネルにファイルをアップロードする
date: 2019-01-21
author: kenzauros
tags: [PHP, Slack, Web]
---

とある Web サーバーから **PHP を使って Slack にファイルをアップロード**したくなったのですが、意外とやっている方が少なかったのでいろいろ試しました。

## 環境

- PHP 7.1.2 (on XServer)

## API トークンの取得

トークンの取得は [Slack API 推奨Tokenについて - Qiita](https://qiita.com/ykhirao/items/3b19ee6a1458cfb4ba21) を参考にさせていただきました。

OAuth Access Token をコピーしておきます。

<a href="images/upload-files-to-slack-channel-by-php-1.png"><img src="images/upload-files-to-slack-channel-by-php-1.png" alt="" width="760" height="787" class="aligncenter size-full wp-image-8606" /></a>

スコープ (Scopes) にはファイル書き込みのため `files:write:user` が必要です。必要であればメッセージ投稿のため `chat:write:user` か `chat:write:bot` も付与しておきましょう。

<a href="images/upload-files-to-slack-channel-by-php-2.png"><img src="images/upload-files-to-slack-channel-by-php-2.png" alt="" width="755" height="701" class="aligncenter size-full wp-image-8605" /></a>

## PHP スクリプト

```php
<?php

$params = [
    'token' => 'xoxp-xxxxxxxxxxx-xxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'channels' => '#hoge',
    'file' => new CURLFile('./hogehoge.zip'),
    'filename' => 'hogehoge.zip',
    'filetype' => 'zip',
    'initial_comment' => 'This is a hogehoge file.',
    'title' => 'HOGEHOGE',
];

$ch = curl_init();
// curl_setopt($ch, CURLOPT_VERBOSE, 1); // デバッグ出力
curl_setopt_array($ch, [
    CURLOPT_URL => 'https://slack.com/api/files.upload',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $params,
]);

$response = curl_exec($ch);
curl_close($ch);
```

curl 系のメソッドを使うので PHP 5.5 以降が必要です。

multipart/form-data で送信するので `CURLOPT_POSTFIELDS` には普通の連想配列を渡します。

`file` パラメーターには `new CURLFile('./hogehoge.zip')` のような形で `CURLFile` を作って渡します。

## 参考

- [PHP: cURL 関数 - Manual](http://php.net/manual/ja/ref.curl.php)
- [files.upload method | Slack](https://api.slack.com/methods/files.upload)
- [PHPでcURL POSTするときは、ちゃんとエンコードしましょう（しなくても動くからこそ！！） - Qiita](https://qiita.com/mochieer/items/ff140b5fd30deddf7ff8)
- [PHPでcURLのクソ仕様 &quot;@&quot; を回避する - Qiita](https://qiita.com/mpyw/items/c2d2f9cf67072e926721)