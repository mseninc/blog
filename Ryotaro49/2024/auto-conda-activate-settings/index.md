---
title: "ログイン時に自動で Conda 環境の割り当てを行う"
date: 2024-09-23
author: Ryotaro49
tags: [Conda, Ubuntu, Ubuntu 22.04, bash, Python]
description: "Conda 環境をログイン時に自動で割り当てる方法を紹介します。手順は簡単で、.bash_profile に数行のコマンドを追加するだけです。"
---

Conda を使いたいとき、ログインするたびに毎回 conda activate をするのは面倒です。

そこで、Ubuntu へのログイン時に自動で Conda 環境の割り当てる方法を紹介します。

本記事では下記の環境で動作確認を行っています。

- Ubuntu 22.04.4 LTS
- Conda 24.5.0

## 方法

自動で Conda 環境の割り当てるユーザーの `/home/user/.bash_profile` に 以下を記載します。

`/home/user/.bash_profile` がない場合は新規作成してください。

```
. /path/to/conda/etc/profile.d/conda.sh
conda activate [Conda 環境名]
```

**Conda を初期化するスクリプトの起動コマンド**と**アクティベートコマンド**を記載することで、ユーザーログイン時に自動で Conda 環境を割り当てています。

`/path/to/conda` の部分には Conda のインストールパスを、[Conda 環境名] の部分はログイン時に activate したい環境名を記載してください。

## まとめ

`.bash_profile` とはユーザーが bash でログインした時に読み込まれる設定ファイルです。

今回はそこにコマンドを記載することでログイン時に自動 activate をするようにしました。

この記事がどなたかの役に立てれば幸いです。

それではまた。
