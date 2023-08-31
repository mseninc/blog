---
title: "[Git] 特定のコミットを含むブランチを検索する方法"
date: 2021-03-22
author: k-so16
tags: [Git]
---

こんにちは。最近、 [Netflix](https://www.netflix.com/jp/) を利用し始めた k-so16 です。以前から興味があった [フルハウス](https://www.netflix.com/jp/title/70155617) を楽しく視聴しています(笑)

業務で、あるファイルの変更がどのブランチに含まれているかを知りたいことがありました。目的の変更のコミットは分かっている前提として、 **目的のコミットハッシュを含むブランチを取得** できれば、特定のファイルの変更を含むブランチがわかります。

本記事では、特定のコミットハッシュを含むブランチを取得する方法を紹介します。

本記事で想定する読者層は以下の通りです。

- Git の基本的な操作を知っている

## 特定のコミットハッシュを含むブランチを取得する方法

特定のコミットハッシュを含むブランチを検索するには、 `git branch` コマンドの **`--contain`** オプションにコミットハッシュを引数として渡します。コミットハッシュは短縮形のハッシュでも完全なハッシュでも問題なく動作します。

以下にコマンド例を示します。 `$COMMIT_ID` にはコミットハッシュが入っている想定です。

- ローカルブランチを検索する場合

```bash:title=$COMMID_ID&nbsp;のコミットハッシュが含まれるローカルブランチを検索するコマンド
git branch --contain $COMMIT_ID
```

```:title=出力結果の例
  bar
  foo
* main
```

- リモートブランチを検索する場合

```bash:title=$COMMID_ID&nbsp;のコミットハッシュが含まれるリモートブランチを検索するコマンド
git branch -r --contain $COMMIT_ID
```

```:title=出力結果の例
  origin/bar
  origin/foo
  origin/HEAD -> origin/main
  origin/main
```

- ローカルとリモート両方合わせて検索する場合

```bash:title=$COMMID_ID&nbsp;のコミットハッシュが含まれるブランチを検索するコマンド
git branch -a --contain $COMMIT_ID
```

```:title=出力結果の例
  bar
  foo
* main
  remotes/origin/bar
  remotes/origin/foo
  remotes/origin/HEAD -> origin/main
  remotes/origin/main
```

本記事を執筆する上で以下の記事を参考にしました。

> [git - What command to use to see what branch my actual branch derived from? - Stack Overflow](https://stackoverflow.com/questions/39793560/what-command-to-use-to-see-what-branch-my-actual-branch-derived-from)

## まとめ

本記事のまとめは以下の通りです。

- 特定のコミットハッシュを含むブランチの取得方法を説明
    - `git branch` コマンドで `--contain` オプションを利用
    - ローカルブランチとリモートブランチでの検索方法を紹介

以上、 k-so16 でした。 Git の達人の道はまだまだ遠そうです(笑)
