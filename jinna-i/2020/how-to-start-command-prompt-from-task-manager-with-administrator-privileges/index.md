---
title: デスクトップが真っ黒で表示されないときにタスクマネージャーからコマンドプロンプトを管理者権限で起動する方法
date: 2020-08-24
author: jinna-i
tags: [Windows, Windows Server]
---

こんにちは、じんないです。

Windows にログオンした際、デスクトップがいつまでも表示されず真っ黒な状態で困っていたのですが、何とかしてコマンドプロンプト (管理者) を起動する方法を見つけたので紹介します。

ログのトレースなどでサーバーが高負荷な状態になっており、再起動しても戻らないといった非常にレアのケースで役に立てるかと思われます(笑)

<a href="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-1.png"><img src="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-1.png" alt="" width="1922" height="1112" class="alignnone size-full wp-image-13630" /></a>

## 前提条件

- Windows にログオンはできる
- Ctrl + Alt + Del キーが有効である

## コマンドプロンプトの起動方法

Windows にログオンし、`Ctrl + Alt + Del` キーを押下します。(リモートデスクトップ接続の場合は `Ctrl + Alt + End` キー)

タスクマネージャーを起動します。

<a href="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-2.png"><img src="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-2.png" alt="" width="1922" height="1112" class="alignnone size-full wp-image-13634" /></a>

[詳細] をクリックします。

<a href="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-3.png"><img src="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-3.png" alt="" width="380" height="381" class="alignnone size-full wp-image-13635" /></a>

[ファイル] > [新しいタスクの実行] をクリックします。

<a href="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-4.png"><img src="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-4.png" alt="" width="682" height="608" class="alignnone size-full wp-image-13636" /></a>

開く欄に `cmd.exe` を入力し、[OK] をクリックします。このとき、**`このタスクに管理者特権を付与して作成します。` にチェックを入れると管理者権限でコマンドプロンプトを起動できます**。

<a href="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-5.png"><img src="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-5.png" alt="" width="417" height="235" class="alignnone size-full wp-image-13637" /></a>

こんな感じでコマンドプロンプトが起動します。ここまでくればあとは何とでもなる感があるので安心できますね。

<a href="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-6.png"><img src="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-6.png" alt="" width="1922" height="1112" class="alignnone size-full wp-image-13640" /></a>

## 【おまけ】エクスプローラーが落ちてしまったときの復旧方法

エクスプローラー (Explorer.exe) が落ちてしまって真っ黒になってしまったときも、同様の方法で復旧することができます。

<a href="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-7.png"><img src="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-7.png" alt="" width="1922" height="1112" class="alignnone size-full wp-image-13649" /></a>

タスクマネージャーから [ファイル] > [新しいタスクの実行] をクリックし、開く欄に `Explorer` を入力して [OK] をクリックします。

<a href="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-8.png"><img src="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-8.png" alt="" width="422" height="236" class="alignnone size-full wp-image-13650" /></a>

エクスプローラーが復旧し、デスクトップやタスクバーが表示されるようになりました。

<a href="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-9.png"><img src="images/how-to-start-command-prompt-from-task-manager-with-administrator-privileges-9.png" alt="" width="1922" height="1112" class="alignnone size-full wp-image-13651" /></a>

どちらかというとこちらの方が遭遇するケースが多いかもしれませんね。

短い記事でしたが、お役に立てれば幸いです。

ではまた。

## 参考

[Server Coreでコマンド・プロンプトを表示させる－ ＠IT](https://www.atmarkit.co.jp/fwin2k/win2ktips/1104corecmd/corecmd.html)