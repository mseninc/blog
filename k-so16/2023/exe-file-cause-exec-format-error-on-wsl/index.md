---
title: "WSL 上の VSCode で \"Exec format error\" が発生して起動しなくなったときの対処方法"
date: 2023-09-04
author: k-so16
tags: [Visual Studio Code, WSL, Ubuntu]
description: "WSL から VSCode を起動しようとした際に \"Exec format error\" が発生して起動しなくなった場合の対処方法を紹介します。"
---

こんにちは。最近、 ジーンズを新調した k-so16 です。ウエストと丈がちょうど合うサイズのものを買えて、とても満足しています (笑)

普段、 Laravel や Vue でアプリ開発を進める際に、 WSL 上から **[Visual Studio Code](https://code.visualstudio.com/)** (以降 VSCode と表記) を利用しています。

ある日、いつも通り WSL から VSCode を起動しようとすると、 **次のようなエラーが表示されて起動しませんでした**。なお、 *Windows 側からは問題なく VSCode は起動した* ので、 VSCode の問題ではなさそうです。

```:title=VSCode&nbsp;を起動しようとして表示されたエラー
/mnt/c/Users/k-so16/AppData/Local/Programs/Microsoft VS Code/bin/code: 61: /mnt/c/Users/k-so16/AppData/Local/Programs/Microsoft VS Code/Code.exe: Exec format error
```

前日までは問題なく起動していたのに、急にエラーが出て起動しなくなってしまいました。これでは開発が進められないので、解決方法を模索しました。

本記事では、 WSL から VSCode を起動しようとした際に **`Exec format error`** が発生して起動しない場合の対処方法を紹介します。

本記事で想定する読者層は以下の通りです。

- WSL 上での VSCode の基本的な使い方を知っている

## 想定環境

今回のトラブルが発生した環境は以下の通りです。

- OS: Windows 11 Pro
    - バージョン: 22H2
- WSL2
    - カーネルバージョン: 5.15.90.1
    - OS: Ubuntu 22.04.2 LTS
- VSCode: バージョン 1.80.2

## 発生した事象

冒頭にも記載したように、 VSCode を起動しようとすると **`Exec format error`** というエラーが表示され、起動できませんでした。実は VSCode だけでなく、 Explorer など、ほかの Windows のプログラムも起動できなくなっていました。

```:title=bash&nbsp;のスクリプトから&nbsp;Explorer&nbsp;を起動しようとして表示されたエラー
bash: /mnt/c/Windows/explorer.exe: cannot execute binary file: Exec format error
```

どうやら、 **Windows の実行ファイルが WSL から起動できなくなっている** ようです。

## 解決方法

### 実際に解決できた方法

さっそくですが、解決方法を紹介します。 **以下のコマンドを実行** することで、 VSCode が WSL 上からも起動するようになりました。

```bash{numberLines:1}:title=解決方法のコマンド
sudo sh -c 'echo :WSLInterop:M::MZ::/init:PF > /usr/lib/binfmt.d/WSLInterop.conf'
sudo systemctl unmask systemd-binfmt.service
sudo systemctl restart systemd-binfmt
sudo systemctl mask systemd-binfmt.service
```

上記の解決方法は、以下の GitHub の issue 内のコメントに記載されていました。それぞれのコマンドについて、簡単に解説します。

> - [WSL2 (Preview) cannot run .exe files: exec format error: wsl.exe · Issue #8952 · microsoft/WSL](https://github.com/microsoft/WSL/issues/8952#issuecomment-1572193568)

1 行目は `WSLInterop.conf` という設定ファイルを作成しています。事前に `/usr/lib/binfmt.d/WSLInterop.conf` が存在するか確認しましたが、筆者の環境では存在しませんでした。

2 ~ 4 行目は `systemd-binfmt.service` のサービスの再起動をしています。 **`systemctl`** でサービスの起動、停止や稼働状況の確認などができます。

2 行目の `systemctl unmask` はサービスの `mask` を取り消すコマンドです。 `systemd-binfmt.service` を手動で再起動するために、このコマンドを実行しています。サービスの `mask` については 4 行目のコマンドの説明で後述します。

3 行目の `system restart` では、 `systemd-binfmt.service` のサービスを再起動しています。

4 行目の `systemctl mask` は **サービスの起動を無効化** します。サービスを `mask` すると、 **サービスの自動起動だけでなく、手動での起動も無効化** されます。

### 他に試行錯誤した方法

解決方法が見つかるまでの間に、いくつか別の手段も試行錯誤したので、その内容も合わせて記載します。

- WSL の再起動
- systemd の有効化設定の取り消し

まずは、 **とりあえず困ったときの再起動** 、ということで WSL を再起動してみました。残念ながら、今回は再起動では解決しませんでした。

次に、同様のエラーが発生しているという [GitHub の issue](https://github.com/microsoft/WSL/issues/8952) に記載されていた [issue コメント](https://github.com/microsoft/WSL/issues/8952#issuecomment-1268366772) の内容を試すことにしました。

コメントでは、 `/etc/wsl.conf` に追記した **`systemd` のサポートの有効化を取り消す** ことで解決したと記載されていました。コメント内の `/etc/wsl.conf` を確認してみると、 `systemd = true` の行をコメントアウトしていました。

```:title=コメントに記載されていた&nbsp;/etc/wsl.conf&nbsp;の一部
[boot]
#systemd = true
```

しかし、筆者の環境では、そもそも `systemd = true` を記載していなかったため、この方法は取れませんでした。

## 原因の調査

### 心当たり

「何もしていないのに壊れました。」と言いたい気持ちを抑えて、 **本当に心当たりがないのか** 考えてみました。よく考えると、 VSCode を起動する前に Ubuntu の **apt のパッケージをアップデート** したことを思い出しました。

何をアップデートしたか、ターミナルの表示からさかのぼろうとしましたが、 *WSL を再起動する際にターミナルを閉じてしまった* ため、この方法では調べられません。アップデートしたパッケージの履歴が見られないか調べてみると、 `/var/log/apt/history.log` に載っていることがわかりました。

> - [aptで行われた履歴を表示する « Linux &Laquo; Tech « Laddy in](https://www.laddy.info/2019/06/29352/)

### アップデートしたパッケージ

アップデートしたパッケージを `/var/log/apt/history.log` から確認してみます。

```:title=/var/log/apt/history.log
Start-Date: 2023-08-02  09:08:04
Commandline: apt upgrade
Requested-By: k-so16 (1000)
Upgrade: librsvg2-common:amd64 (2.52.5+dfsg-3, 2.52.5+dfsg-3ubuntu0.2), librsvg2-2:amd64 (2.52.5+dfsg-3, 2.52.5+dfsg-3ubuntu0.2)
End-Date: 2023-08-02  09:08:04
```

`librsvg2-common:amd64` と `librsvg2-2:amd64` の 2 つがアップデートされていました。どうやら SVG ファイルの描画ライブラリーのようです。正直、このアップデートが原因とは思いづらいですね。

> - [Debian -- sid の librsvg2-common パッケージに関する詳細](https://packages.debian.org/sid/librsvg2-common)
> - [Debian -- sid の librsvg2-2 パッケージに関する詳細](https://packages.debian.org/ja/sid/librsvg2-2)

おそらく、 apt のアップデートなど、何かの拍子に `/usr/lib/binfmt.d/WSLInterop.conf` が消えてしまって、起動できなくなったのかなと推測します。

## まとめ

本記事のまとめは以下の通りです。

- VSCode で `Exec format error` が表示されて起動しない場合の解決方法を紹介
    - 実行しているコマンドの内容を解説
- エラーの発生となった原因の調査
    - 直前でアップデートしたパッケージを調査
    - 直接の原因は不明

以上、 k-so16 でした。本記事が同じエラーに悩まされている方々の助けになれば幸いです。
