---
title: "Hyper-VのチェックポイントをPowerShellから削除する方法"
date: 2024-09-16
author: norikazum
tags: [Hyper-V,PowerShell]
description: "Arcserve UDP使用後、Hyper-Vのチェックポイントが削除できず、PowerShellコマンド「Remove-VMCheckpoint」で無事に削除できた手順を紹介します。"
---

こんにちは。

今回は、Hyper-V のチェックポイントを PowerShell で削除する記事です。

発生したシーンとして、評価のため Arcserve UDP をサーバーにインストールし、
バックアップの取得を試行していたのですが、気付いたらチェックポイントが取得されていました。

![ARCSERVE UDP でチェックポイントが作成された](images/2024-07-23_18h42_54.png "ARCSERVE UDP でチェックポイントが作成された")

`Arcserve UDP` は本運用には至らなかったのでアンインストールしました。

その後、Hyper-Vマネージャーからチェックポイントが作成されていることに気付き、
**削除しようと思いましたが、右クリックを押しても削除メニューが出てきません** でした。

![右クリックで削除が出てこない](images/2024-07-23_18h46_03.png "右クリックで削除が出てこない")

調べたところ、以下のコマンドで削除できました。

```powershell:title=Remove-VMCheckpoint&nbsp;usage
Remove-VMCheckpoint -VMName "仮想マシンの名前" -Name "チェックポイントの名前"
```


では、やってみましょう。

準備するのは、"仮想マシンの名前" と "チェックポイントの名前" ですが、
Hyper-Vマネージャーからコピーするのが視覚的で分かり易いでしょう。

![仮想マシンの名前をコピー](images/2024-07-23_18h50_15.png "仮想マシンの名前をコピー")
![チェックポイントの名前をコピー](images/2024-07-23_18h50_27.png "チェックポイントの名前をコピー")

パラメーターの準備ができたので、コマンドを組み立てます。
その後、PowerShellを管理者で起動し、実行します。

例として、`仮想マシンの名前=vm1`, `チェックポイントの名前をコピー=chekpoint1` とします。

```powershell:title=vm1のchekpoint1を削除するコマンド
Remove-VMCheckpoint -VMName "vm1" -Name "chekpoint1"
```

実行結果は以下のようになります。
![PowerShellプロンプトの状況](images/2024-07-23_18h54_57.png "PowerShellプロンプトの状況")

Hyper-Vマネージャー上は、統合が始まったあとにチェックポイントが無事消えました。
![チェックポイントの統合](images/2024-07-23_18h56_39.png "チェックポイントの統合")
![チェックポイントが無事削除できた](images/2024-07-23_18h56_51.png "チェックポイントが無事削除できた")

なぜ、Hyper-Vマネージャーで削除が出ないのかは追及できていませんが、
削除前に `Arcserve UDP` をアンインストールしてしまったのが怪しいと思っています。

それでは次回の記事でお会いしましょう。
