---
title: FortiClientがアンインストールできないときの対処
date: 2021-09-17
author: norikazum
tags: [Fortigate, その他の技術]
---

こんにちは。

評価で利用していた端末から **FortiClientを削除しよう** と思ったところ、以下のように **アンインストールボタンがグレーアウトしてアンインストールができません** でした。

![](images/what-to-do-if-forticlient-cannot-be-uninstalled-1.jpg)

結論からですが、 **再度FortiClientをインストールすることでアンインストールできました** 。
インストールが正常に完了していなかった可能性もありますが、**2台の端末で同現象を確認** しました。

## Networld が公開している情報では無理だった
Networld が公開している、以下の情報が現象としては一致していたのですが、**①～④の手順を全て実施してもアンインストールが出来ない現象は解消しません** でした。

[10266 FortiClientのアンインストールができない](https://tec-world.networld.co.jp/faq/show/10266)

## 再度インストールするとアンインストールできた
では、改善に向けて手順です。

SCSK社の力をお借りし、以下のURLからインストーラーをダウンロードします。

[FortiGate： FortiClientソフトウェア ダウンロード ｜ SCSK株式会社](https://www.scsk.jp/product/common/fortinet/download_forticlient.html)

インストールしたバージョンが `6.0.9` なので [これがダウンロードリンク](ftp://helpscs.jp/FortiClient/win/6.0.9/FortiClientSetup_6.0.9.0277_x64.exe) なのですが、FTPサイトのためかChromeでダウンロードできませんでした。

少し手間が増えますが、WinSCP等のクライアントソフトからでダウンロードします。

WinSCPの設定は以下を参考にしてください。

```
転送プロトコル: FTP
ホスト名: helpscs.jp
匿名ログイン: チェック
```

![](images/what-to-do-if-forticlient-cannot-be-uninstalled-2.jpg)

これで接続が出来るので、`FortiClient → win → 6.0.9` と移動し `FortiClientSetup_6.0.9.0277_x64.exe` をダウンロードします。

![](images/what-to-do-if-forticlient-cannot-be-uninstalled-3.jpg)

ダブルクリックで実行し、以下のように進みます。（再起動が発生します）

![](images/what-to-do-if-forticlient-cannot-be-uninstalled-4.jpg)

![](images/what-to-do-if-forticlient-cannot-be-uninstalled-5.jpg)

![](images/what-to-do-if-forticlient-cannot-be-uninstalled-6.jpg)

![](images/what-to-do-if-forticlient-cannot-be-uninstalled-7.jpg)

![](images/what-to-do-if-forticlient-cannot-be-uninstalled-8.jpg)

再起動後に確認すると **アンインストールボタンが押せる** ようになっています。

![](images/what-to-do-if-forticlient-cannot-be-uninstalled-9.jpg)

これで無事、アンインストールができました。

![](images/what-to-do-if-forticlient-cannot-be-uninstalled-10.jpg)

アンインストール後にも **再起動が必要** でした。
![](images/what-to-do-if-forticlient-cannot-be-uninstalled-11.jpg)

手順はこれで以上です。

同じ現象でお困りのかたの助けになれば幸いです。
それでは次回の記事でお会いしましょう。



