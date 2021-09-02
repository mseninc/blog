---
title: Windows 7 で Windows Update が進まない件の対応
date: 2016-12-13
author: jinna-i
tags: [Windows, Windows 7, Windows Update, その他, ライフハック]
---

こんにちは、じんないです。

今回は、Windows 7でWindows Updateを進めていると、**更新プログラムを確認しています・・・**から全く進まない件の対策について紹介します。

## 概要
Windows 10を使われている方も多いと思いますが、システム評価などでまだまだWindows 7を使われるかたも多いと思います。
弊社はまさにシステム評価でWindows 7を新規でインストールし、一旦最新にしようとWindows Updateを実施しました。

Service Pack 1までは順調だったのですが、その後のWindows Updateで現象は発生しました。

<a href="images/windows-7-windows-update-not-proceed-1.png"><img src="images/windows-7-windows-update-not-proceed-1.png" alt="2016-12-02_06h30_27" width="797" height="555" class="alignnone size-full wp-image-3267" /></a>

1時間・・・
2時間・・・
3時間・・・　ここから変わりません。(笑)
実際にはもっと待ちましたｗ


## 対策

### 対策を実施するときの注意点
対策は基本的に次項のKBをダウンロードし、スタンドアロンインストールをしていく流れになりますが、インストールする際は**LANケーブルを抜くなど、物理的に外部との通信を遮断する**ことをおすすめします。

### 以下のKBを順番に適用

* [KB3177725](http://www.catalog.update.microsoft.com/Search.aspx?q=KB3177725)
* [KB3138612](http://www.catalog.update.microsoft.com/Search.aspx?q=KB3138612)
* [KB3185911](http://www.catalog.update.microsoft.com/Search.aspx?q=KB3185911)
* [KB3020369](http://www.catalog.update.microsoft.com/Search.aspx?q=KB3020369)
* [KB3172605](http://www.catalog.update.microsoft.com/Search.aspx?q=KB3172605)

### 検索していますから進まなくなった場合

もし、Windows Updateを実施している状態からインストールを試みるとインストールも進まない状態になる可能性がありますのでその場合は**コントロールパネル→管理ツール→サービス**から**Windows Update**を再起動してから再度実施してください。

**検索していますから進まない**
<a href="images/windows-7-windows-update-not-proceed-2.png"><img src="images/windows-7-windows-update-not-proceed-2.png" alt="Windows Updateが検索していますから進まない" width="382" height="139" class="alignnone size-full wp-image-3271" /></a>

**Windows Updateサービスを再起動すると、一旦エラーになる。**

<a href="images/windows-7-windows-update-not-proceed-3.png"><img src="images/windows-7-windows-update-not-proceed-3.png" alt="2016-12-02_06h43_44" width="818" height="592" class="alignnone size-full wp-image-3269" /></a>


## 再度、更新プログラムの確認
無事に、KB3172605までインストールが終わったら、LANケーブルを再度接続し更新プログラムを確認します。
PCのスペックにもよるかと思いますが、約5分で更新プログラムの確認が終わりました。
あとはインストールするだけです。

<img src="images/windows-7-windows-update-not-proceed-4.png" alt="j-windows7-002" width="800" height="560" class="alignnone size-full wp-image-3293" />

## 目的のKBが適用されているかを確認する方法
コマンドプロンプトを開き、以下を実行します。例としてKB3172065を確認する場合です。
`systeminfo | find "KB3172605"`

適用されていればこのように出力されます。
<img src="images/windows-7-windows-update-not-proceed-5.png" alt="j-windows7-003" width="343" height="58" class="alignnone size-full wp-image-3295" />

もし、何も出力されなかった場合はそのKBは適用されていません。

## あとがき
途中から今回のような事例になった場合は[KB3172605](http://www.catalog.update.microsoft.com/Search.aspx?q=KB3172605)のみの適用で解決するようですが、
新規インストールをした場合、[KB3172605](http://www.catalog.update.microsoft.com/Search.aspx?q=KB3172605)を適用するには[KB3020369](http://www.catalog.update.microsoft.com/Search.aspx?q=KB3020369)を先に適用しておく必要があったりと少しややこしい部分がありますね。

仮想マシンであれば、最新の状態でテンプレート化しておくのも良いのではないでしょうか。

ではまた。

