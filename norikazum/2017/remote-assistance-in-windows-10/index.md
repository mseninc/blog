---
title: 遠隔操作でHELP！Windows 10 でリモートアシスタント機能を利用する
date: 2017-02-10
author: norikazum
tags: [Windows 10, その他, ライフハック]
---

こんにちは。

弊社は、コミュニケーションツールにSlackを利用していますが、互いが遠隔地にいてもすぐに連絡が取れる状態にあっても、「ちょっと操作をみてみないと分からないな」ということが発生します。

そんなときに、Windows標準のリモートアシスタント機能を利用しています。

今回はこの手順について紹介したいと思います。

本記事ではWindows 10について紹介しますが、Windows7, 8では手順が異なるようで注意が必要です。

また、弊社で実施した際に、依頼者・支援者の双方がVPNに接続している状態ではうまく接続できなかったのでVPNに接続している状態でうまくいかなかった場合は一度切断後に試してみてください。


## 操作される側（依頼者）からの操作

### リモートアシスタントツールを起動する

左下のWindowsマークをクリックし、 **msra** とタイプします。

<a href="images/remote-assistance-in-windows-10-1.png"><img src="images/remote-assistance-in-windows-10-1.png" alt="" width="169" height="300" class="alignnone size-medium wp-image-3666" /></a>

このような画面がでます。

<a href="images/remote-assistance-in-windows-10-2.png"><img src="images/remote-assistance-in-windows-10-2.png" alt="" width="300" height="251" class="alignnone size-medium wp-image-3667" /></a>

### 招待する手続きを実施

<a href="images/remote-assistance-in-windows-10-3.png"><img src="images/remote-assistance-in-windows-10-3.png" alt="" width="300" height="251" class="alignnone size-medium wp-image-3668" /></a>

招待ファイルを添付で送付しようと思いますので、**この招待をファイルに保存する** を選択します。

<a href="images/remote-assistance-in-windows-10-4.png"><img src="images/remote-assistance-in-windows-10-4.png" alt="" width="300" height="251" class="alignnone size-medium wp-image-3669" /></a>

デスクトップ上に保存します。

### 保存されたファイルを**信頼できる支援者** に送付

<a href="images/remote-assistance-in-windows-10-5.png"><img src="images/remote-assistance-in-windows-10-5.png" alt="" width="140" height="101" class="alignnone size-full wp-image-3670" /></a>

### 支援者からの接続待ち

以下のウィンドウが画面上に現れます。
接続用パスワードが記載されているので支援者に伝えます。

<a href="images/remote-assistance-in-windows-10-6.png"><img src="images/remote-assistance-in-windows-10-6.png" alt="" width="300" height="87" class="alignnone size-medium wp-image-3687" /></a>

ここまでが**操作される**側から支援者への依頼となります。


## 操作する側（支援者）の操作

### 依頼者のPCに接続する

前項で紹介した、依頼者より送られてきたバイナリファイルを実行すると、以下のような画面が出ます。

続けて、依頼者より送られてきた（接続待ちの画面に表示されている）パスワードを入力し、OKをクリックします。

<a href="images/remote-assistance-in-windows-10-7.png"><img src="images/remote-assistance-in-windows-10-7.png" alt="" width="300" height="226" class="alignnone size-medium wp-image-3675" /></a>


ここまでが**操作する**側の手順となります。


## 支援者の接続を許可

前項までの手順が完了すると、以下の画面が依頼者のPCに出ます。
確認して、許可します。

<a href="images/remote-assistance-in-windows-10-8.png"><img src="images/remote-assistance-in-windows-10-8.png" alt="" width="300" height="191" class="alignnone size-medium wp-image-3681" /></a>

許可すると、依頼者側の待ち受け画面が以下のようになります。

<a href="images/remote-assistance-in-windows-10-9.png"><img src="images/remote-assistance-in-windows-10-9.png" alt="" width="300" height="87" class="alignnone size-medium wp-image-3682" /></a>

また、支援者側からデスクトップの操作を要求されると以下の画面になります。
確認し、許可をしてください。

<a href="images/remote-assistance-in-windows-10-10.png"><img src="images/remote-assistance-in-windows-10-10.png" alt="" width="300" height="110" class="alignnone size-medium wp-image-3683" /></a>

許可後に、依頼者のデスクトップは支援者側で操作できます。

以上までが 支援者にWindowsリモートアシスタントを使って操作してもらう流れになります。

## あとがき

先日、けんけんに支援してもらったとき、けんけん側では私の画面が以下のような表示になっていたようです。

<a href="images/remote-assistance-in-windows-10-11.png"><img src="images/remote-assistance-in-windows-10-11.png" alt="" width="300" height="300" class="alignnone size-medium wp-image-3685" /></a>

えらく伸びて見れる状態ではないですね(笑)

原因は、2画面にしていることでした。

操作される側は、VPNと合わせて事前にデュアルディスプレイを解除して1つの画面で使っている状態で利用されることをお勧めします。

参考にしてください。
それでは次回の記事でお会いしましょう。