---
title: git sparse-checkout を無効にするには
date: 2020-05-04
author: kenzauros
tags: [Git]
---

**git で一部のディレクトリ・ファイルのみを同期するとき `sparse-checkout` という機能**を使います。有効にする方法は過去の記事を参照ください。

- [git sparse checkout で clone せずに一部のサブディレクトリだけを pull/checkout する](/git-sparse-checkout/)

今回は `sparse-checkout` を無効にしてすべてのオブジェクトをチェックアウトしたいときの方法を紹介します。

## 前提

下記のようにして `hoge/` のみをチェックアウトしている状態を仮定します。

```
git init
git remote add origin リポジトリのURL
git config core.sparsecheckout true
echo hoge/ > .git/info/sparse-checkout
git pull origin master
```

## sparse-checkout の解除方法

結論から書くと `sparse-checkout` を無効にするには下記のコマンドを順に叩きます。

```
echo "/*" > .git/info/sparse-checkout
git read-tree -mu HEAD
rm .git/info/sparse-checkout
git config core.sparsecheckout false
```

流れは下記のとおりです。

1. `.git/info/sparse-checkout` に全体を対象とするよう `/*` を指定する
2. `git read-tree` でツリー情報を読み込み直す
3. `.git/info/sparse-checkout` を削除
4. `sparsecheckout` を無効にする

`git read-tree` の詳細は下記を参照してください。

- [Git - git-read-tree Documentation](https://git-scm.com/docs/git-read-tree)

## Git 2.26 以降で `git sparse-checkout` コマンドが使える場合

### sparse-checkout の有効化

**Git 2.26 以降の場合、専用の `git sparse-checkout` コマンド**が用意されています。執筆時点での最新のバージョンは 2.26.2 でした。

- [Git - git-sparse-checkout Documentation](https://git-scm.com/docs/git-sparse-checkout)

冒頭の

```
git init
git remote add origin リポジトリのURL
git config core.sparsecheckout true
echo hoge/ > .git/info/sparse-checkout
git pull origin master
```

と同じように `sparse-checkout` を設定するには、下記のようになります。

```
git init
git remote add origin リポジトリのURL
git sparse-checkout init
git sparse-checkout set hoge/
git pull origin master
```

ほとんど変わりません。見た目は少しわかりやすくなったかな、程度ですかね。

### sparse-checkout の無効化

しかし、**無効にするときは `disable` を指定するだけ**なので、かなり簡潔になります。

```
git sparse-checkout disable
```

これだけです。 `git read-tree` をする必要がありません。

**Git 2.26 以降では `git sparse-checkout` コマンドを使うのがよい**でしょう。

ちなみに `disable` では `.git/info/sparse-checkout` は削除されませんので再度 `init` で有効にすれば、元の `sparse-checkout` の設定に戻すことができます。

### その他

**`git sparse-checkout` コマンドでは `.git/info/sparse-checkout` を直接編集しなくても、コマンドで対象パスの確認・変更・追加ができます。**

`add`, `set` でも `git read-tree` は自動的に行われますので、これ以外にコマンドを実行する必要がありません。

#### 確認

```
git sparse-checkout list
```

現在設定されている `.git/info/sparse-checkout` の内容が表示されます。

#### 追加

```
git sparse-checkout add piyo/
```

元々指定していたパスに加えて、指定したパスが追加されます。

#### 変更

```
git sparse-checkout set piyo/
```

元々の設定が消えて、指定したパスのみが設定されます。
