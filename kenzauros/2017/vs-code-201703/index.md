---
title: Visual Studio Code 月次リリースレポート (2017/03 version 1.11)
date: 2017-04-14
author: kenzauros
tags: [Visual Studio Code, その他]
---

こんにちは、kenzauros です。

**Visual Studio Code** の 2017年3月度アップデート Version 1.11 が提供されています。

[Visual Studio Code March 2017 (version 1.11)](https://code.visualstudio.com/updates/v1_11)

今回はエディター系の変更で便利なものが多いので、そこだけを取り上げます。

### エディター (Editor) ドラッグ＆ドロップによるコピー機能の追加

他のエディターと同じような感じで (Windows の場合) Ctrl を押しながら選択範囲をドラッグ＆ドロップするだけで文字列の移動ができるようになりました。 ただし設定で `"editor.dragAndDrop"` を `true` にしておく必要があります。

### エンコード自動判定 (Auto guess encoding of files)

日本人待望のエンコード自動判定機能です。説明にも書かれていますが、エンコーディングを 100% 見分ける術はないので、判定と言うより推測といったほうが近いかもしれません。

`"files.autoGuessEncoding"` を `true` にしておくと自動推測が働きます。試した範囲では Shift JIS のファイルは正常に Shift-JIS として認識されました。

### よりファジーなマッチング (More Fuzzy Matching)

テキストエディターで文字を入力すると候補が表示されますが、これの評価がよりファジーになり、ふわっとした入力でもマッチする候補が表示されやすくなったようです。

### コメント中での IntelliSense (IntelliSense in comments)

コメントの中でインテリセンスが使えるようになりました。 

この機能は設定の "editor.quickSuggestions" を変更することで細かな制御ができるようになります。 

```
"editor.quickSuggestions": {
  "comments": false, // コメント内の IntelliSense
  "strings": true, // 文字列内の IntelliSense
  "other": true, // その他（通常の範囲）の IntelliSense
}
```
