---
title: Windows 10が最後のプリンタを勝手にデフォルトにしてしまう件
date: 2016-08-21
author: norikazum
tags: [その他, ライフハック]
---

こんにちは。

今回は、最近まで解決できていなかった、**Windows 10 で最後に使ったプリンタがデフォルトプリンタに設定されてしまうこと** の解消方法です。

## デフォルトプリンタの確認方法
以下の流れでデフォルトプリンタの設定を確認します。

1. Windowsスタートアイコンをクリックして、設定をクリック
<a href="images/fix-default-printer-issue-in-windows-10-1.png"><img src="images/fix-default-printer-issue-in-windows-10-1.png" alt="2016-08-06_01h12_28" width="260" height="258" class="alignnone size-full wp-image-2178" /></a>

2. デバイスをクリック
<a href="images/fix-default-printer-issue-in-windows-10-2.png"><img src="images/fix-default-printer-issue-in-windows-10-2.png" alt="2016-08-06_01h13_11" width="802" height="653" class="alignnone size-full wp-image-2179" /></a>

3. 既定となっているプリンタを確認する
<a href="images/fix-default-printer-issue-in-windows-10-3.png"><img src="images/fix-default-printer-issue-in-windows-10-3.png" alt="2016-08-06_01h15_28" width="802" height="653" class="alignnone size-full wp-image-2180" /></a>

## 改善策の設定方法
Windows 10の標準設定では、前項で確認したデフォルト(既定）のプリンタが最後に利用したプリンタで常に書き換わってしまいます。

使い方によっては便利なのかもしれませんが、私は非常に不便でしたので以下の方法で書き換わらないように変更します。

前項のデバイスを開くところまでは同様の手順です。

1. **有効にすると、最後に使ったプリンターが通常使うプリンターになります。**　をオフにします。
<a href="images/fix-default-printer-issue-in-windows-10-4.png"><img src="images/fix-default-printer-issue-in-windows-10-4.png" alt="2016-08-06_01h13_29" width="802" height="653" class="alignnone size-full wp-image-2182" /></a>

1. **オフ**になりました。
<a href="images/fix-default-printer-issue-in-windows-10-5.png"><img src="images/fix-default-printer-issue-in-windows-10-5.png" alt="2016-08-06_01h13_34" width="802" height="653" class="alignnone size-full wp-image-2183" /></a>

はい、これだけです。

## あとがき
パソコンに接続できるタイプのテプラプリンタを使っているのですが、テプラを使うと勝手にデフォルトになってしまうため、そのまま下記のエクセルみたいなものを印刷してしまうと、細切れになった文書が何枚も印刷される惨事になっていました。

<a href="images/fix-default-printer-issue-in-windows-10-6.png"><img src="images/fix-default-printer-issue-in-windows-10-6.png" alt="2016-08-06_01h24_19" width="1083" height="646" class="alignnone size-full wp-image-2184" /></a>

本記事の設定をした後はテプラを無駄にすることなく使用できています。

Windowsの気の効いた機能をOFFにして快適なプリンターライフをお楽しみください！

それでは、またお会いしましょう。