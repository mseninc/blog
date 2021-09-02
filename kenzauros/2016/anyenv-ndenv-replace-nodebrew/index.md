---
title: Node のバージョン管理を nodebrew から anyenv + ndenv に乗り換えました
date: 2016-09-30
author: kenzauros
tags: [Node.js, CentOS, Web]
---

**Node.js のバージョン管理**には **[nodebrew](https://github.com/hokaccha/nodebrew)** を使っていて大きな不満もなかったのですが、今回 **[anyenv](https://github.com/riywo/anyenv)** に乗り換えました。

## 乗り換えの動機

乗り換えの動機は、Node のグローバルインストールでした。

nodebrew は通常のインストール方法ではそれ自体がローカルにインストールされ、 nodebrew でインストールした node もその配下に展開されるため、基本的にユーザーごとにインストールすることになります。

システムワイドにどのユーザーでも Node が使えるようにしようと思うと、ディレクトリ移動やパーミッション設定、環境変数の追加などを自分でやる必要があり、ちょっと面倒です。

ということで標準でグローバルインストールに対応し、プロジェクトごとのローカルインストールにも対応しているらしい ndenv に移ることにしました。

## anyenv のインストール

インストール自体は git で clone するだけなのでお手軽です。ちなみに OS は CentOS 7.1 です。

```bash
# git clone https://github.com/riywo/anyenv /usr/local/anyenv
```

環境変数を設定するためにプロファイル用シェルスクリプトを作成します。

```bash
# echo 'export PATH=/usr/local/anyenv/bin:$PATH' >> /etc/profile.d/anyenv.sh
# echo 'export ANYENV_ROOT=/usr/local/anyenv'  >> /etc/profile.d/anyenv.sh
# echo 'eval "$(anyenv init -)"' >> /etc/profile.d/anyenv.sh
# exec $SHELL -l
```

なお、公式のインストール方法には `ANYENV_ROOT` の設定はないのですが、これを設定しないと `anyenv install` で下記のエラーが表示されて動きませんでした。

```bash
# anyenv install ndenv
anyenv-install: definition not found: ndenv
```

## ndenv のインストール

`anyenv install ndenv` で ndenv をインストールします。

```bash
# anyenv install ndenv
# exec $SHELL -l
# anyenv versions
```

## node のインストール

`ndenv install <バージョン>` で Node をインストールし、 `ndenv global <バージョン>` でグローバルに使える Node のバージョンを設定します。

```bash
# ndenv install -l
# ndenv install v6.5.0
# ndenv versions
# ndenv global v6.5.0
# node -v
```

ローカルでバージョンを設定するときは `ndenv local <バージョン>` で OK 。

## あとがき

ちなみに anyenv はその名の通り、 rbenv や phpenv などをインストールして、他の環境のバージョン管理も一括して行えます。

うーん、便利だ。