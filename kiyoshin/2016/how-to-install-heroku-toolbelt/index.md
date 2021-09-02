---
title: Herokuが便利になるToolbeltのインストール(Windows用)
date: 2016-06-10
author: kiyoshin
tags: [Heroku, Heroku Toolbelt, Windows]
---

## Heroku Toolbelt（ヘロク ツールベルト）とは
コマンドラインツール(コマンドプロンプト等）でHerokuを操作・管理できるツールです。Herokuでは、主にコマンドラインツールを使用するので、Herokuをコマンドで操作・管理できると、より便利になります。
## Heroku Toolbelt
Heroku Toolbeltのページはこちら
[https://toolbelt.heroku.com/](https://toolbelt.heroku.com/)
 
今回はHeroku ToolbeltのWindows用のツールをダウンロードします。赤枠の部分を選択しクリックしてください。

<img src="images/how-to-install-heroku-toolbelt-1.png" alt="heroku_toolbelt" width="1342" height="477" class="aligncenter size-full wp-image-705" />

ツールがダウンロードされたら、そのファイルをクリックして起動してください。  
次に下記の様なウインドウが開くので、開いたら[Next]をクリックします。

<img src="images/how-to-install-heroku-toolbelt-2.png" alt="installguide" width="497" height="385" class="aligncenter size-full wp-image-708" />

<img src="images/how-to-install-heroku-toolbelt-3.png" alt="heroku_toolbelt_guide" width="498" height="386" class="aligncenter size-full wp-image-710" />

<img src="images/how-to-install-heroku-toolbelt-4.png" alt="heroku_toolebelt_Fullinstall" width="498" height="383" class="aligncenter size-full wp-image-712" />

次に、[Install]をクリックしてください。

<img src="images/how-to-install-heroku-toolbelt-5.png" alt="heroku.install_ready" width="496" height="385" class="aligncenter size-full wp-image-713" />

最後に[Finish]を押すと、インストール完了です。

<img src="images/how-to-install-heroku-toolbelt-6.png" alt="install_finish" width="497" height="386" class="aligncenter size-full wp-image-715" />

これでHeroku Toolbeltはインストール完了しているので、Herokuを利用されている方は、試しにコマンドを使ってみましょう。

```heroku login```: Herokuにログインします。
```heroku logout```: Herokuをログアウトします。
```heroku create```: Herokuにappを作成する。
```heroku apps```: Herokuに上がっているdyno(アプリ)一覧を表示する。
```heroku run```: Herokuに実行させたいコマンドをrunの後ろに続けて打つ。
```heroku config```: Herokuの環境変数を確認できる。
```heroku open```: Herokuにアップしたアプリをブラウザで開いてくれる。
```git push heroku master```: Herokuにdeployする。

これ以外にも、Herokuコマンドはあるので、使えると便利になると思います。
コマンドについては以下のコマンドラインページを参考にしてみてください。

Heroku Toolbelt command line page 
[https://devcenter.heroku.com/categories/command-line](https://devcenter.heroku.com/categories/command-line)