---
title: Visual Studio Code でエディターの水平分割やソースコード整形が可能に (2016/10 version 1.7)
date: 2016-11-11
author: kenzauros
tags: [Visual Studio Code]
---

**Visual Studio Code** の 2016年10月度アップデート Version 1.7 が提供されていますので、私が気になった部分を紹介します。

[Visual Studio Code October 2016 1.7](http://code.visualstudio.com/updates)

ただし 1.7 自体は不具合があり、修正された 1.7.1 がリリースされていますので、こちらを紹介します。

## ワークベンチ

### 水平分割レイアウトに対応

**これまでは垂直方向にしか分割できなかったエディターペインの分割が水平方向にもできるようになりました。**

これにより一行の長いソースコードでも複数を同時に表示して編集できるようになりました。

切り替え方法は下記の 4 種類です。まだこのあたりは日本語が完全ではありません。

* 表示メニューから "Toggle Editor Group Layout" を選ぶ
* コマンドパレットの "Toggle Vertical/Horizontal Editor Group Layout" を使う
* 「開いているエディター」の切り替えボタンを使う
* ショートカットキー: `Shift+Alt+1`

残念ながら水平分割と垂直分割を併用することはできません。

## エディター

### キーボードショートカットリファレンス

VS code 純正の **キーボードショートカットのチートシート** が提供されるようになりました。

VS code ヘルプメニューの "Keyboard Shortcuts Reference" から開くことができます。

実体は PDF ファイルなので、下記から OS 別にダウンロードすることもできます。

* [Windows](https://go.microsoft.com/fwlink/?linkid=832145)
* [macOS](https://go.microsoft.com/fwlink/?linkid=832143)
* [Linux](https://go.microsoft.com/fwlink/?linkid=832144)

マルチ OS で動作する Electron アプリらしい配慮ですね。

### ドキュメント全体/選択範囲のフォーマット整形

個人的にとてもうれしい、ソースコードの整形機能がつきました。これまでも拡張機能で対応できましたが、標準で使えるのはやはり便利です。

デフォルトのショートカットは下記の通りです。

* ドキュメント全体 `Shift+Alt+F`
* 選択範囲のみ `Ctrl+K Ctrl+F`

ただ標準では JavaScript, TypeScript, JSON, HTML などしか対応していないため、たとえば PHP を整形するには別途後述の "Formatters" カテゴリーの拡張機能をインストールする必要があります。

## 言語

### JavaScript IntelliSense

JavaScript 向けの IntelliSense が進化して ATA (Automatic Type Acquisition = 自動型取得) 機能が追加されました！という内容なのですが、 残念ながらバグがあり、 v1.7.1 ではとりあえず無効になっています。

詳しくはこのあたりを参照してください。

* [マイクロソフト、VS Codeのバージョン差し戻しの理由を説明 | マイナビニュース](http://news.mynavi.jp/news/2016/11/07/063/)

修正されたリリースを期待しましょう。

### HTML の中で CSS 補完

これはそのままの機能ですが、 HTML ファイルの中で CSS ファイルのコード補完、検証、色識別などが使えるようになりました。

HTML に直接記述する場合もあると思うので、割と便利な機能だと思います。

### TypeScript/JavaScript 保存時の自動修正

`vscode-eslint` や `vscode-tslint` といった拡張機能を利用しているとき、下記のオプションを `true` にしておくと、ファイルセーブ時に修正可能な warning を自動で修正してくれるようになりました。 (各linter で fixable なもののみだと思います。)

```
{
  "eslint.autoFixOnSave": true,
  "tslint.autoFixOnSave": true,
}
```

## 拡張機能

### "Keymaps" カテゴリーの新設

キーボードショートカットのマッピングを VS code 標準のものから変更するための拡張機能を示す "Keymaps" カテゴリーが新設されました。

同時に VS code と並んで人気のある **Atom や Sublime Text のキーマップ用拡張機能** が Microsoft から提供されるようになっています。

### "Formatters" カテゴリーの新設

同様にソースコードフォーマットを行う拡張機能のための "Formatters" カテゴリーも新設され、フォーマッターが探しやすくなりました。

### 拡張機能の無効化機能の追加

これまで VS code の拡張機能はインストールかアンインストールしかなかったのですが、 **無効化** ができるようになりました。

しかも、完全な無効化だけではなく、ワークスペース（プロジェクト）ごとの無効化にも対応していますので、「○○のプロジェクトではこの拡張機能は使わない」などの制御ができます。

## あとがき

このほかにいろいろあるのですが、割愛します。ごめんなさい(笑)

VS code は月次のアップデートでわかりやすいですね。どんどん機能強化されていっているので、今後も楽しみです。

