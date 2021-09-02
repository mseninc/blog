---
title: Windows 10 Version 1703 の累積更新プログラム (KB4025342) がインストールできない
date: 2017-08-04
author: kenzauros
tags: [Windows 10, Windows Update, Windows]
---

**Windows 10** が Creators Update (Version 1703) にあがってからなんか調子悪いなーと感じたので、しばらく「インストールができない」と言われたまま放置していた累積更新プログラム **KB4025342** をちゃんとインストールしてみました。

## 自動ではインストールが完了しない

7月21日ごろから Windows Update に表示されてはいたものの、インストールを開始してもすぐに終わってしまい、適用されないままでした。

<a href="images/install-windows-10-update-kb4025342-for-version-1703-1.png"><img src="images/install-windows-10-update-kb4025342-for-version-1703-1.png" alt="" width="400"  class="aligncenter size-full wp-image-4953" /></a>

Windows Update の適用履歴を見てみると「**インストールに失敗しました**」が並んでいます。

再度 Windows Update から試してみましたが、状況は変わりませんでした。

## スタンドアロン インストーラーでのインストール

### インストーラーの入手

うまくいかないので Windows Update を使わずにスタンドアロンで動作するインストーラーを Microsoft のカタログからダウンロードします。

* [KB4025342 - Microsoft Update カタログ](http://www.catalog.update.microsoft.com/Search.aspx?q=KB4025342)

**Microsoft Update** で **KB4025342** を検索すると 4 件表示されます。

<a href="images/install-windows-10-update-kb4025342-for-version-1703-2.png"><img src="images/install-windows-10-update-kb4025342-for-version-1703-2.png" alt="" width="400"  class="aligncenter size-full wp-image-4961" /></a>

似たファイル名が並びますが、上の2つが「**累積**更新プログラム」、下の2つが「**差分**更新プログラム」と記載されています。どちらがいいのかわからなかったので、2種類とも落として試してみました。

なお、それぞれ 64ビット版 (x64) と 32ビット版 (x86) がありますので、自PC の環境を確認してダウンロードします。

右端の「ダウンロード」ボタンを押すと別ウィンドウでダウンロードダイアログが開くので、 `.msu` のリンクをクリックするとインストーラーがダウンロードできます。

<a href="images/install-windows-10-update-kb4025342-for-version-1703-3.png"><img src="images/install-windows-10-update-kb4025342-for-version-1703-3.png" alt="" width="400"  class="aligncenter size-full wp-image-4955" /></a>

結果、「**差分**更新プログラム」は下記のように表示されてインストールできませんでした。

<a href="images/install-windows-10-update-kb4025342-for-version-1703-4.png"><img src="images/install-windows-10-update-kb4025342-for-version-1703-4.png" alt="" width="352" height="179" class="aligncenter size-full wp-image-4962" /></a>

ということで「**累積**更新プログラム」をダウンロードします。

### インストール

ダウンロードした `.msu` ファイルをダブルクリックして実行し、 [はい] をクリックします。

<a href="images/install-windows-10-update-kb4025342-for-version-1703-5.png"><img src="images/install-windows-10-update-kb4025342-for-version-1703-5.png" alt="" width="352" height="209" class="aligncenter size-full wp-image-4956" /></a>

インストールが完了すると再起動を促されるので、それに従って再起動します。

<a href="images/install-windows-10-update-kb4025342-for-version-1703-6.png"><img src="images/install-windows-10-update-kb4025342-for-version-1703-6.png" alt="" width="400" class="aligncenter size-full wp-image-4957" /></a>

再起動後、Windows Update の適用履歴を見てみるとインストールが完了していることがわかります。

<a href="images/install-windows-10-update-kb4025342-for-version-1703-7.png"><img src="images/install-windows-10-update-kb4025342-for-version-1703-7.png" alt="" width="400"  class="aligncenter size-full wp-image-4958" /></a>

念のため、コマンドプロンプトで `systeminfo` を叩いてみると、 **KB4025342** が表示されました。

```
systeminfo | find "KB4025342"
```

<a href="images/install-windows-10-update-kb4025342-for-version-1703-8.png"><img src="images/install-windows-10-update-kb4025342-for-version-1703-8.png" alt="" width="606" height="391" class="aligncenter size-full wp-image-4959" /></a>

これで不具合が解消されることを祈るのみです。