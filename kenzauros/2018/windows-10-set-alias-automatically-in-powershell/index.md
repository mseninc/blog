---
title: Windows 10 の PowerShell で起動時にコマンドのエイリアスを設定 (Set-Alias) するには
date: 2018-10-25
author: kenzauros
tags: [PowerShell, Docker, Windows]
---

私はあまりタイプが速くないので、 **`docker-compose` なんて毎回打ってられません**。

ということで PowerShell 上で簡単に叩けるようにしてみました。

## 実行ポリシーの変更

Windows 10 から**実行ポリシー**が厳しくなったらしいのですが、やりたいことができないので、とりあえず変更します。

**管理者権限**で PowerShell を起動し、下記のコマンドを実行します。

```bash
Set-ExecutionPolicy RemoteSigned -Force
```

## プロファイルの作成とエイリアスの定義

次にユーザー権限で PowerShell を起動します。

```bash
New-Item –type file –force $profile
notepad $profile
```

`New-Item` でプロファイルが作成されます。 **`.bashrc` みたいなもん**ですね。

開いたファイルに好きなだけ **`Set-Alias`** を書き連ねます。

```bash
Set-Alias dc docker-compose
Set-Alias d docker
Set-Alias g git
```

保存して終了します。

これで次回起動時からエイリアスが自動的に設定されるようになりました。

```bash
BEFORE > docker-compose up hogehoge
AFTER  > dc up hogehoge
```

楽ちんです！

## 参考

- [windows 10 - Cannot set Powershell ExecutionPolicy for CurrentUser - Server Fault](https://serverfault.com/questions/696689/cannot-set-powershell-executionpolicy-for-currentuser)
- [Windows10のPowerShellコンソールでaliasを設定する方法 - Rock'n'Hack ブログ](http://naga41.hatenablog.com/entry/2016/06/27/235409)