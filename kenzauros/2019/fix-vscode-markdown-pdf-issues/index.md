---
title: "[VSCode] markdown-pdf で相対パスの CSS が読み込めない問題を解決した分家バージョンを作りました"
date: 2019-08-31
author: kenzauros
tags: [Markdown, Visual Studio Code, PlantUML, その他の技術]
---

VSCode の拡張機能 **[yzane/vscode-markdown-pdf](https://github.com/yzane/vscode-markdown-pdf)** はこれまでも何度か本ブログでも取り上げていますが、 **VSCode で markdown を PDF に変換するのに最適なツール**です。

- [Visual Studio Code で Markdown から PDF を一発生成する拡張機能 markdown-pdf](https://mseeeen.msen.jp/vscode-markdown-pdf-extension/)
- [VSCode markdown-pdf でヘッダーやフッターをいい感じに設定する](https://mseeeen.msen.jp/vscode-markdown-pdf-v1-header-footer-settings/)

ただ、**VSCode 側のバージョンアップによる仕様変更のせいで、現行バージョンの 1.2.0 は不具合がでています**。

## 改善バージョン

本家 [yzane/vscode-markdown-pdf](https://github.com/yzane/vscode-markdown-pdf) をフォークさせていただきました。

- [kenzauros/vscode-markdown-pdf](https://github.com/kenzauros/vscode-markdown-pdf)

v1.2.1 として改良版をリリースしました。

- [v1.2.1 · kenzauros/vscode-markdown-pdf](https://github.com/kenzauros/vscode-markdown-pdf/releases/tag/1.2.1_kenzauros)

改善点は下記の通りです。

- 相対パス指定の CSS が読み込めないという問題を修正
- PlantUML の開始終了タグ, 画像フォーマットを指定できるように変更

※複数の変更が混ざっているのと 2件目は別の方が PR を出してくださっているので PR は出していません。

上記リリースから zip ファイルで **VSIX (拡張機能パッケージ) ファイル**がダウンロードできます。 VSIX のインストール方法は過去記事を参照してください。

- [Visual Studio Code の拡張機能を VSIX ファイルからインストールする](https://mseeeen.msen.jp/how-to-install-extension-in-visual-studio-code-with-vsix/)

## 改善点

### CSS 相対パス問題

私が一番困ったのは**相対パス指定の CSS が読み込めない**という問題です。私の環境ではワークスペースごとの CSS 設定を行いたいことが多く、複数のユーザーで作業することを考えると、絶対パス指定したくないことが多いので困ってしまいました。

すでに何名かが Issue を挙げていますが、この問題は markdown-pdf のバグというわけではなく、「もともと動いていたのに VSCode 側のバージョンアップで動かなくなった」感じです。

- [Relative CSS does not work · Issue #126 · yzane/vscode-markdown-pdf](https://github.com/yzane/vscode-markdown-pdf/issues/126)

主な原因は

> From version 1.33, vscode.Uri.parse(href) returns file URI scheme such as file:///relative_path.css when href is a relative path such as relative_path.css.
(Version 1.32 returns the same string as href)
> **バージョン 1.33 から vscode.Uri.parse(href) としたときに href が相対パスのときに file:///relative_path.css のようなパスを返すようになった**

ということらしいです。

というわけでそれを修正したのがこのコミット ([fb74708](https://github.com/kenzauros/vscode-markdown-pdf/commit/fb74708deb98653a30225e6190deb9482369ac4a)) です。

### PlantUML 開始終了タグ問題

こちらは markdown 中で PlantUML を記述している際、 VSCode のプレビュー機能だと <code class="hljs">```plantuml</code> で区切る必要があるのですが、 markdown-pdf の場合 <code class="hljs">```</code> がついていると単なるコードブロックとして表示されてしまうという、仕様の違いがありました。

#### VSCode markdown プレビューでの書き方 (要 PlantUML 拡張)

```
 ```plantuml
 @startuml
 hogehoge
 @enduml
 ```
```

#### markdown-pdf での書き方

```
 @startuml
 hogehoge
 @enduml
```

後者だと編集時にプレビューで見えなくて不便なので、同様に困っている人がいないかと思ったら、こちらはすでに PR まで出ていました。

- [Option to specify the plantuml delimiter by andre-stoesel · Pull Request #104 · yzane/vscode-markdown-pdf](https://github.com/yzane/vscode-markdown-pdf/pull/104)

markdown-pdf は内部で Makdown パーサーとして [markdown-it](https://github.com/markdown-it/markdown-it) を **PlantUML の変換に [markdown-it-plantuml](https://github.com/gmunguia/markdown-it-plantuml)** を利用しています。

markdown-it-plantuml には [オプション](https://github.com/gmunguia/markdown-it-plantuml#advanced-usage) が用意されており、 **`openMarker`**, **`closeMarker`** を指定できます。

というわけで、 markdown-pdf からもこの 2 つのオプションを渡せるようにした、というのが変更点です。 PR の改修内容でほぼ問題なかったので、そのままコミットをマージさせていただき、タイポのみ修正しました。

あとこれに加えて画像のフォーマットを指定する **`imageFormat`** オプションも追加しています。

`.vscode/settings.json` では下記のように指定すればいい感じになるはずです。

```js
{
  "markdown-pdf.styles": [".vscode/markdown-pdf.css"],
  "markdown-pdf.plantumlOpenMarker": "```plantuml",
  "markdown-pdf.plantumlCloseMarker": "```",
  "markdown-pdf.plantumlImageFormat ": "svg"
}
```

## あとがき

大変有益な拡張機能を開発してくださっている [yzane](https://github.com/yzane) さんに感謝申し上げます。

本バージョンは本家が更新されたら、削除する予定です。