---
title: npm install 中に git の接続タイムアウトがでるのを回避する
date: 2018-04-02
author: kenzauros
tags: [Node.js, CentOS, Git, npm, Web]
---

**CentOS 7** で構築されたサーバーに Laravel アプリをデプロイしていて、npm install でハマったので、メモです。

## npm install でなぜか git エラー

元々ちょっと古い状態でデプロイされていたため、 npm をアップデートし、一旦 node_modules を削除して npm install をやり直したところ、 **npm install でか長時間停止したあと、エラーで落ちる**、という現象に見舞われました。

エラーメッセージは下記の通り。npm のバージョンは v5.8.0 です。

```bash
npm ERR! Error while executing:
npm ERR! /usr/local/bin/git ls-remote -h -t git://github.com/josdejong/jsonlint.git
npm ERR! 
npm ERR! fatal: unable to connect to github.com:
npm ERR! github.com[0: 192.30.255.113]: errno=接続がタイムアウトしました
npm ERR! github.com[1: 192.30.255.112]: errno=接続がタイムアウトしました
npm ERR! 
npm ERR! 
npm ERR! exited with error code: 128
```

メッセージからすると git プロトコルで github にアクセスしようとしてできなくて落ちてるらしいのですが、 誰もそんなことは頼んでいません。

しかもエラーメッセージからはどのパッケージが原因かがさっぱりわかりません。

## git を https に強制

いずれにしろ内部的にやってるということは必要なんだろう、ということで、 git プロトコルを https に読み返させることにしました。

git config コマンドでの設定はこちら。

```
git config --global url."https://".insteadOf git://
```

グローバル設定なので注意してください。

これで無事 npm install が通りました。それにしてもやっぱり npm install 遅いですね。


## 参考

- [fatal: unable to connect to github.com: の時に試すこと - Qiita](https://qiita.com/task-k/items/6cf9b17e65771fbf9205)
- [Ubuntuでのgitコマンドエラー - にわかSteamerのメモ帳](http://aniharu.hatenablog.com/entry/2016/04/28/143847)