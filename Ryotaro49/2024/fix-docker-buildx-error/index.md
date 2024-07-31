---
title: "[Docker] ERROR: BuildKit is enabled but the buildx component is missing or broken エラーの解決方法"
date:
author: Ryotaro49
tags: [Docker, Ubuntu, Ubuntu 22.04]
description: "Docker の ERROR: BuildKit is enabled but the buildx component is missing or broken エラー解決法を紹介します。破損したファイルが残っていることが原因の場合があるため、そのファイルを削除することで対処します。"
---

タイトルの通り docker build した時の `ERROR: BuildKit is enabled but the buildx component is missing or broken` エラー解決法を紹介します。

本記事では下記の環境で動作確認を行っています。

- Ubuntu 22.04.4 LTS
- Docker version 27.0.3

## 解決方法

以下のコマンドで不要なファイルを削除しましょう。

```bash:title=不要なファイルを削除
rm /home/user/.docker/cli-plugins/docker-buildx
```

これで正常に build できると思います。

## エラーの原因

著者の場合は、docker buildx のプラグインファイルが破損していることが原因でした。

おそらく破損した原因は、Docker Desktop を使っているにもかかわらず、wsl に Docker をインストールしていたことが原因です。

そのあとにアンインストールをしたのですが、不要なファイルが削除されずに残ってしまっていました。

ちなみに Not Found と書かれているファイルが残っていました。 😅

```bash:title=/home/user/.docker/cli-plugins/docker-buildx
$ cat docker-buildx
Not Found
```

同じエラーで困っている方のお役に立てれば幸いです。

それではまた。
