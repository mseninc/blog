---
title: "serverless-plugin-typescript で layers を指定すると ENOENT: no such file or directory になる"
date: 2022-10-10
author: kenzauros
tags: ["Serverless Framework"]
description: "Serverless Framework v3 で serverless-plugin-typescript を Lambda レイヤーと併用してみたら ENOENT: no such file or directory エラーに見舞われましたので、仕方なくバージョンを下げて対応しました"
---

こんにちは、 kenzauros です。

**Serverless Framework v3 で serverless-plugin-typescript を Lambda レイヤーと併用するとエラー**に見舞われました。

解決法は、バージョンを下げただけなのですが、忘れそうなので記事にしました。

### 環境

今回の動作環境です。

- Ubuntu 20.04 on WSL2 on Windows 11 Pro
- Serverless Framework
    - Framework Core: 3.22.0 (local) 3.22.0 (global)
    - Plugin: 6.2.2
    - SDK: 4.3.2
- serverless-plugin-typescript **2.1.2**

この問題は serverless-plugin-typescript のバージョン 2.1.2 で発生します。


## 概要

Serverless Framework に serverless-plugin-typescript を使用しているプロジェクトで、 Lambda レイヤーを設定しようとしました。

```yml:title=serveless.yml
plugins:
  - serverless-plugin-typescript

layers:
  myLayer:
    package:
      artifact: .artifacts/myLayer.zip
```

- [Serverless Framework - AWS Lambda Layers](https://www.serverless.com/framework/docs/providers/aws/guide/layers)

特に問題なさそうに見えますが、なぜか **`ENOENT: no such file or directory` エラー**に見舞われました。

```:title=bash
$ sls package
～中略～
Error:
[OperationalError: ENOENT: no such file or directory, open '/home/kenzauros/hogehoge/.serverless/myLayer.zip'] {
  cause: [Error: ENOENT: no such file or directory, open '/home/kenzauros/hogehoge/.serverless/myLayer.zip'] {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: '/home/kenzauros/hogehoge/.serverless/myLayer.zip'
  },
  isOperational: true,
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: '/home/kenzauros/hogehoge/.serverless/myLayer.zip'
}
```

デプロイ用のディレクトリー (`.serverless`) に zip ファイルがないと言われています。もともと配置しているパス (`.artifacts/myLayer.zip`) ではないのが不可解です。

このプロジェクトではほかに serverless-layers プラグインも使っていたので、原因を突き止めるのに苦労しました。いろいろ削ぎ落としていき、最終的に *serverless-plugin-typescript と `layers` に絞っても発生した*ため、やっと原因がわかりました。

serverless-plugin-typescript のリポジトリにも Issue で報告されていました。

- [Lambda layer artifact: no such file or directory since version 2.12 · Issue #270 · serverless/serverless-plugin-typescript](https://github.com/serverless/serverless-plugin-typescript/issues/270)

やはり 2.1.2 のリリースで変更された部分が災いしているようです。

※2.1.2 は 2022/4/4 リリースで、 2022/10/4 時点でまだ修正版はでていません。


## 2.1.1 にダウングレードして解決

ということで、とりあえず問題ないバージョンだという 2.1.1 にダウングレードしました。

```:title=bash
npm install -D serverless-plugin-typescript@2.1.1
```

**これでようやくデプロイが完了**するようになりました🚀

バグの発生している 2.1.2 のリリースを見ると、この問題の直接の原因である部分のみの修正でした。この修正で `SERVERLESS_FOLDER` (`.serverless`) の直下のパスを見るようになっていました。

- [Release 2.1.2 (2022-04-04) · serverless/serverless-plugin-typescript](https://github.com/serverless/serverless-plugin-typescript/releases/tag/v2.1.2)
- [fix: Adding Serverless Layers Support by mmeyers-xomly · Pull Request #267 · serverless/serverless-plugin-typescript](https://github.com/serverless/serverless-plugin-typescript/pull/267/files)

ということは、ひとまず 2.1.1 で問題なさそうです。

このプラグイン、TypeScript を使う上ではとても便利だと思うのですが、いまいち使われてないのでしょうか😅
