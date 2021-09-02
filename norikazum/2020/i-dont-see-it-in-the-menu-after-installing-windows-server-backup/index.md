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
![](images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-1.png)

サーバーマネージャーのツール一覧にありません。
![](images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-2.png)

## 解決

この記事が、解決への道しるべでした。
[Windows Server バックアップのGUIが起動できない](https://social.technet.microsoft.com/Forums/ja-JP/9e145dcf-66fa-470c-b8b0-2be626c75918/windows-server-gui?forum=winserver8)

なんと、 **ネットワーク負荷分散をインストールすれば解決** するというものでした。
まさか・・・

騙されたと思って、インストールします。
![](images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-3.png)
↓
![](images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-4.png)

解決してしまいました・・・
![](images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-5.png)

起動も問題なし。
![](images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-6.png)

## あとがき

ネットワーク負荷分散は運用上不要なので、 **削除しても問題ないか確認** しました。

![](images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-7.png)
↓
![](images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-8.png)

**削除後も問題なく利用** できました。
![](images/i-dont-see-it-in-the-menu-after-installing-windows-server-backup-9.png)

利用できるようになり安心です。
原因について進展があれば追記します。コメントもいただけましたら幸いです。
