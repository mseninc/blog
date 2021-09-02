---
title: "[Windows Server] Windows Server バックアップをインストールしてもメニューに表示されない"
date: 2020-04-30
author: norikazum
tags: [Windows Server, Windows Server バックアップ, Windows]
---

こんにちは。

無料で気軽に使える Windows Server バックアップは重宝されると思います。

今回は、**Windows Server 2016の環境** で、 **Windows Serverバックアップの機能をインストールしているのに** も関わらず、 **メニューに表示されず利用できない** 現象が発生したので解決までの経緯を記事にします。

## 現象

このとおりインストールは完了しているのですが、
<a href="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-1.png"><img src="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-1.png" alt="" width="785" height="557" class="alignnone size-full wp-image-12619" /></a>

サーバーマネージャーのツール一覧にありません。
<a href="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-2.png"><img src="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-2.png" alt="" width="360" height="776" class="alignnone size-full wp-image-12620" /></a>

## 解決

この記事が、解決への道しるべでした。
[Windows Server バックアップのGUIが起動できない](https://social.technet.microsoft.com/Forums/ja-JP/9e145dcf-66fa-470c-b8b0-2be626c75918/windows-server-gui?forum=winserver8)

なんと、 **ネットワーク負荷分散をインストールすれば解決** するというものでした。
まさか・・・

騙されたと思って、インストールします。
<a href="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-3.png"><img src="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-3.png" alt="" width="788" height="555" class="alignnone size-full wp-image-12621" /></a>
↓
<a href="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-4.png"><img src="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-4.png" alt="" width="781" height="554" class="alignnone size-full wp-image-12622" /></a>

解決してしまいました・・・
<a href="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-5.png"><img src="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-5.png" alt="" width="377" height="808" class="alignnone size-full wp-image-12623" /></a>

起動も問題なし。
<a href="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-6.png"><img src="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-6.png" alt="" width="1287" height="850" class="alignnone size-full wp-image-12626" /></a>

## あとがき

ネットワーク負荷分散は運用上不要なので、 **削除しても問題ないか確認** しました。

<a href="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-7.png"><img src="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-7.png" alt="" width="786" height="552" class="alignnone size-full wp-image-12624" /></a>
↓
<a href="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-8.png"><img src="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-8.png" alt="" width="783" height="558" class="alignnone size-full wp-image-12625" /></a>

**削除後も問題なく利用** できました。
<a href="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-9.png"><img src="images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-9.png" alt="" width="405" height="782" class="alignnone size-full wp-image-12627" /></a>

利用できるようになり安心です。
原因について進展があれば追記します。コメントもいただけましたら幸いです。
