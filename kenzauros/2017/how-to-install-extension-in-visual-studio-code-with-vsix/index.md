---
title: Visual Studio Code の拡張機能を VSIX ファイルからインストールする
date: 2017-06-06
author: kenzauros
tags: [Visual Studio Code, その他の技術]
---

**Visual Studio Code (VSCode)** ではすでに Marketplace で多くの拡張機能が公開されているため、大抵のことは Marketplace からインストールすることができます。

しかし Marketplace に公開できないときや、公開前に仲間内で試用したいときは、 **VSIX と呼ばれる拡張子が `*.vsix` のパッケージファイル**を使えば Marketplace 以外からでも拡張機能をインストールすることができます。

## インストール方法

ここでは VSIX ファイルはすでに入手済みとします。 VSIX ファイルはコンピューター上であれば、どこに置いておいても問題ありません。

1. アクティビティーバーの拡張機能をクリックするか、 `Ctrl+Shift+X` を押して**拡張機能**ウィンドウを表示します。
1. **...** をクリックしてメニューを開き、
1. **VSIX からのインストール...** を選択します。
  <a href="images/how-to-install-extension-in-visual-studio-code-with-vsix-1.png"><img src="images/how-to-install-extension-in-visual-studio-code-with-vsix-1.png" alt="" width="560" height="389" class="aligncenter size-full wp-image-4474" /></a>
1. `*.vsix` ファイルを選択して、
1. 開く(O) をクリックします。
  <a href="images/how-to-install-extension-in-visual-studio-code-with-vsix-2.png"><img src="images/how-to-install-extension-in-visual-studio-code-with-vsix-2.png" alt="" width="906" height="452" class="aligncenter size-full wp-image-4475" /></a>
1. インストールに成功すると、メッセージが表示されるので、 **今すぐ再度読み込む** をクリックして VSCode を再起動します。
  <a href="images/how-to-install-extension-in-visual-studio-code-with-vsix-3.png"><img src="images/how-to-install-extension-in-visual-studio-code-with-vsix-3.png" alt="" width="1352" height="52" class="aligncenter size-full wp-image-4479" /></a>

ちなみに拡張機能開発環境で VSIX ファイルを生成するにはプロジェクトルートで `vsce package` を叩くだけです。同じフォルダに `*.vsix` ファイルが生成されます。