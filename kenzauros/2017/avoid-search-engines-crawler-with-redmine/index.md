---
title: Redmine を検索エンジンにクロール/インデックスされないようにする
date: 2017-05-30
author: kenzauros
tags: [Redmine, Web]
---

Redmine で運用しているサイトを検索エンジンに表示させたくないことはよくあると思います。露出が増えればその分攻撃も増えそうですし。

もちろん完全に隠すことはできませんが、検索結果に表示されないだけでも多少マシでしょう。

普通のホームページなら `robots.txt` を配置するか、 `<meta name="robots">` を記述するだけですが、 Redmine はテンプレートでページを出力しているので、ちょっと手順が必要です。

というわけで本記事では **Redmine を検索エンジンにクロール/インデックスされないようにする方法**をご紹介します。

## 前提条件

この記事は下記の環境を元に作業しました。

* CentOS 7
* Redmine 3.3.3.stable.16542
* インストールパス: `/var/lib/redmine`

Redmine は以前に紹介した Ansible でインストールしています。

* 参考記事: [redmine-centos-ansible で Redmine 3.2 のインストールが失敗する (CentOS 7.1)](/failed-to-install-redmine-with-ansible-on-centos7/)

## robots.txt の配置

**Redmine は標準で `robots.txt` を出力する**ようになっています。

実体はファイルではなく、 **welcome コントローラーが `robots.html.erb` テンプレートを使って書き出す**ようになっています。

まず `cd` で Redmine のディレクトリに移動します。 Redmine をインストールしたパスに移動してください。

```bash
# cd /var/lib/redmine
```

`robots.txt` を生成しているテンプレートを開きます。

```bash
# vi app/views/welcome/robots.html.erb
```

**2行目に `Disallow: /` を追加して保存**します。

これだけだと実際に反映されないので、**キャッシュをクリア**します。

```bash
# bundle exec rake tmp:cache:clear
```

`http://サイトアドレス/robots.txt` にアクセスして `Disallow: /` が表示されれば OK です。

## meta タグの追加

`robots.txt` だけでも効果があるかもしれませんが、リンクが貼られている場合などもあるので meta タグも追加しておきます。

ベースレイアウトのテンプレートファイル `app/views/layouts/base.html.erb` を開きます。

```bash
# vi app/views/layouts/base.html.erb
```

meta タグ周辺に下記のタグを追加します。

```html
<meta name="robots" content="noindex,nofollow">
```

変更を反映させるのにキャッシュクリアしてみましたが、効果がなかったので、 Redmine を再起動します。

**`restart.txt` を `tmp` ディレクトリに配置して Redmine にアクセスすれば再起動**がかかります。

```bash
# touch tmp/restart.txt
```

再起動後、トップページ等にアクセスして meta タグがでていることを確認したら restart.txt を消しておきましょう。

```bash
# rm -f tmp/restart.txt
```

