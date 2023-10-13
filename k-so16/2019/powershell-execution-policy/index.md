---
title: "[PowerShell] ExecutionPolicyがRestrictedな環境でスクリプトを実行する方法"
date: 2019-05-24
author: k-so16
tags: [PowerShell, Windows]
---

こんにちは。最近、[IKEA](https://www.ikea.com/jp/ja/store/tsuruhama)で[PC用デスク](https://www.ikea.com/jp/ja/catalog/products/00352629/)と[チェア](https://www.ikea.com/jp/ja/catalog/products/S19297195/)を購入した k-so16 です。

ある業務の作業を効率化するために、手動で行っていた作業を自動化すべく、PowerShellでスクリプトを組みました。ローカルの環境で問題なく動作することを確認したので、スクリプトを動かしたい環境に移して実行しようとしたところ、 `ExecutionPolicy` が `Restricted` に設定されている環境だったので、動作しませんでした。

`ExecutionPolicy` を変更すれば解決するのですが、スクリプトを実行したいマシンが運用環境だったので、変更は望ましくありませんでした。Windowsのバッチファイルに書き直すのも手間ですので、なんとか実行できる抜け道がないかを探しました。

本記事では、 `ExecutionPolicy` が `Restricted` な環境のマシンで、PowerShellのスクリプトを実行する方法を、Powershell初心者のk-so16が紹介します。

本記事の想定する読者層は以下の通りです。

- PowerShell初心者
- PowerShellの `ExecutionPolicy` を知らない


## PowerShellの `ExecutionPolicy`
PowerShellの `ExecutionPolicy` については、[PowerShellの `Set-ExecutionPolicy` のドキュメント](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6)内の **-ExecutionPolicy** セクションで、以下のように説明されています。

- `AllSigned`
  - すべてのスクリプトやコンフィグに信頼できる発行元による署名を要求する
  - ローカルのコンピューターで書かれたものも署名を要求する
- `Bypass`
  - 警告やプロンプトによる催促によってブロックされない
- `Default`
  - デフォルトの `ExecutionPolicy` を設定する
  - Windowsクライアントでは `Restricted`に、サーバーでは`RemoteSigned` に設定される
- `RemoteSigned`
  - インターネットからダウンロードされたスクリプトやコンフィグに対して、信頼できる発行元による署名を要求する
- `Restricted`
  - コンフィグを読み込んだり、スクリプトを実行しない
- `Undefined`
  - スコープ内で `ExecutionPolicy` が設定されていない
  - Group Policyが設定されていない場合、スコープに割り当てられた `ExecutionPolicy` を削除する
- `Unrestricted`
  - すべてのコンフィグを読み込み、スクリプトを実行する
  - インターネットからダウンロードされた、信頼性のないスクリプトはプロンプトで実行前に権限を確認する

Windowsクライアントのデフォルト設定では、 `ExecutionPolicy` が `Restricted` に設定されているので、PowerShellのスクリプトを作成しても、実行ができません。かといって、Windowsのバッチファイルに書き直したくもないので、なんとかPowerShellのスクリプトを実行する時だけ `ExecutionPolicy` を変えられないものかと、いろいろと調べてみました。
 

## `ExecutionPolicy`を一時的に変更してスクリプトを実行
結論からいうと、 `powershell` コマンドからスクリプトを実行する際に、 `-ExecutionPolicy` オプションで、 `Bypass` を指定すれば実行できるようになりました。つまり、 `HogeGenerator.ps1` というPowerShellスクリプトを実行するためには、次のコマンドを実行します。

```powershell:title=ExecutionPolicy&nbsp;を変更して&nbsp;PowerShell&nbsp;のスクリプトを実行するコマンド
powershell -ExecutionPolicy Bypass -File \path\to\HogeGenerator.ps1
```

今回の問題を解決する上で、こちらの記事が非常に参考になりました。

> [PowerShellのExecutionPolicyのスコープとかについて詳しく](https://qiita.com/kikuchi/items/59f219eae2a172880ba6)

## 総括
本記事のまとめです。

- Powershellのスクリプトが実行できない場合は `ExecutionPolicy` を確認する
-  `powershell` コマンドの `-ExecutionPolicy` オプションを利用して一時的に `ExecutionPolicy` を変更する

以上、k-so16でした。Windowsって、難しい... (-_-;)