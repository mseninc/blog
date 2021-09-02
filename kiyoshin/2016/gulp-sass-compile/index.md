---
title: Gulp.jsでSass(scss)に変更があれば自動でコンパイルしてCSSを出力する方法
date: 2016-09-03
author: kiyoshin
tags: [gulp, node, Web]
---

前回の記事の続きです。

前回は Node.js と Gulp.js をインストールするところまででした。

今回は Sass を自動的にコンパイル（変換）して CSS を出力するところまでやってみます。

## gulp-sass のインストール
Gulp.js で Sass をコンパイルする為に npm で gulp-sass をインストールします。

まずは、自分が開発する為に用意したプロジェクトフォルダに移動しましょう。

` cd c:\ユーザー名\myproject `
myproject のところは各自のプロジェクトフォルダで構いません。
今回は、前回記事で myproject というフォルダを作成したので、そのまま使用します。

` npm install -D gulp gulp-sass `
-D は --save-dev のショートハンド（短くしたコマンド）です。
gulp-sass をインストールして、myproject 内にある package.json の devDependencies 内に npmパッケージとバージョンを自動的に書き込みます。

package.json をテキストエディターで開き、devDependencies の箇所を確認してください。

```
  "devDependencies": {
    "gulp": "^3.9.1",
    "gulp-sass": "^2.3.2"
  },
```

このように記載されていれば成功です。
なお、バージョンは npm install したときの最新バージョンになります。

これで、gulp-sass のインストールが完了しました。

## プロジェクト内のフォルダ構成を決め、必要なファイルを作成する
Sass ファイルをコンパイルして CSS ファイルとして出力するので、**どこに Sass ファイルを置いて、どこに CSS を出力するか**のフォルダ構成を決めなければいけません。
今回は例として以下のフォルダ構成とします。

myproject
├── css
│└── // css ファイルの出力先
└── src
│└── sass
│  └── style.scss // Sass ファイル
└── index.html

手順としては以下の順番で作成できます。

1. myproject フォルダの中に テキストエディターで ファイル名を index.html にして、保存しましょう。
2. myproject フォルダの中に css と src という名前のフォルダを作成しましょう。
3. src というフォルダができたら、その中に sass という名前のフォルダを作成しましょう。
4. sass というフォルダができたら、その中にテキストエディターで ファイル名を sass.scss にして、保存しましょう。

では、少しだけ Sass がコンパイルできているかの確認用コードを記述していきましょう。

index.html の中に以下の様に記述します。

```
<!DOCTYPE html>
<html>
<title>test</title>
<meta charset="utf-8">
<link rel="stylesheet" href="css/style.css">
<head>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>
```

内容は CSS が適応されているかが確認できれば良いです。

続いて style.scss の中に以下の様に記述します。

```
$color-main: red; // color-main変数の中に red を格納
$color-sub: blue; // color-sub変数の中に blue を格納

h1 {
  color: $color-main; // h1 の文字色を変更
}
```

Sass では CSS ではできない、変数が使用できるという特徴があるので、使用してみます。

これで、フォルダ構成と確認様ファイルの準備が完了しました

## gulpfile.js に タスクを登録する
では、**Sass(.scss) ファイルに変更があれば、自動で CSS を出力するタスク**を gulpfile.js に書いていきましょう。

gulpfile.js がプロジェクトフォルダ内に無い方は、テキストエディターでファイル名を gulpfile.js にして、プロジェクトフォルダ内に保存してください。

gulpfile.js には以下の様に記述します。

```
'use strict'; // 厳格にエラーチェックを行うモードへ切替

const gulp = require('gulp'); // gulp コマンドの準備
const sass = require('gulp-sass'); // gulp-sass 

const SCSS_SRC = './src/sass/**/*.scss'; // scss ファイルの場所
const CSS_DEST = './css/'; // 出力場所

// scss をコンパイルするタスク
gulp.task('build:scss', function() { // build:scss というタスクを登録
  gulp.src(SCSS_SRC) // コンパイルする scss の場所
    .pipe(sass()) // gulp-sass で変換
    .pipe(gulp.dest(CSS_DEST)); // コンパイルした scss を指定場所に出力
});

// scss の変更を監視するタスク
gulp.task('scss:watch', function() { // build:scss というタスクを登録
  gulp.watch(SCSS_SRC, ['build:scss']); // 指定場所のファイルに変更があった場合、コンパイルするタスクを実行する
});

// gulp のデフォルトタスクとして scss:watch タスクを指定
gulp.task('default', ['scss:watch']);
```

これで、準備が整いました。
実際に Sass ファイルを変更して、HTML に反映されるか試してみましょう。

## 確認方法
` gulp `
コマンドプロンプト等で gulp コマンドを実行します。
このときに default に登録されたタスクが実行されます。

これで、さきほど記述した gulpfile.js が実行され、scss:watch のタスクによる、Sass ファイルへの監視が始まります。

<img src="images/gulp-sass-compile-1.png" alt="gulpwatch"/>

この監視状態は キーボードで ctrl + c を押すまで続きます。

これから、ファイルを変更するので、今はまだ監視状態にしておいてくださいね。

では、まず index.html をブラウザで開いてみましょう。

Hello World! と 赤色の文字で表示されているハズです。

確認したら、Sass ファイルの style.scss を以下の様に変更し保存してみましょう。

```
$color-main: red; // color-main変数の中に red を格納
$color-sub: blue; // color-sub変数の中に blue を格納

h1 {
  color: $color-sub; // h1タグの中の文字色を変更
}
```

h1 に適用させていた変数（$color-main）を $color-sub に変更しただけです。

これで、Sass ファイルの変更を感知して自動的に CSS を出力しました。

では、開いていた index.html を更新して確認してみましょう。

Hello World! と 青色の文字で表示されれば成功です！

## あとがき
今回は、gulp-sass を紹介しました。
これで、Sass は特にコンパイルを意識せずとも使える様になったので便利になりました。

次回は、JavaScript をコンパイルできる環境を作っていきます。