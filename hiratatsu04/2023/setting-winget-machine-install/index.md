---
title: "wingetコマンドで一括インストールするときに特定のユーザーではなくマシンインストールする"
date:
author: hiratatsu04
tags: [Windows, winget]
description: "業務 PC へのソフトウェア一括インストールを実施すると、サインインしているユーザー以外にはインストールされないソフトウェアがありました。ユーザーごとにソフトウェアをインストールするのは少し手間なので、マシンインストールできるようにしました。その方法を紹介します。"
---

こんにちは、ひらたつです。

弊社では業務で使用する PC のセットアップ時には、必要なソフトウェアを一括インストールしています。

一括インストールの方法は以下です。

1. インストール用の JSON ファイル (`winget.json`) を PC にダウンロードする
2. コマンドプロンプトを管理者権限で起動し、ダウンロード先のファイルパスに移動して、`winget import winget.json` を実行する

```json:title=winget.json
{
	"$schema" : "https://aka.ms/winget-packages.schema.2.0.json",
	"CreationDate" : "2022-01-29T15:37:38.042-00:00",
	"Sources" :
	[
		{
			"Packages" :
			[
				{
					"PackageIdentifier" : "Microsoft.VisualStudio.2022.Community"
				},
				{
					"PackageIdentifier" : "7zip.7zip"
				},
				...
				...
			],
			"SourceDetails" :
			{
				"Argument" : "https://winget.azureedge.net/cache",
				"Identifier" : "Microsoft.Winget.Source_8wekyb3d8bbwe",
				"Name" : "winget",
				"Type" : "Microsoft.PreIndexed.Package"
			}
		}
	],
	"WinGetVersion" : "1.1.13405"
}
```

ただ、上記の方法では、サインインしているユーザー以外にはインストールされないソフトウェアがありました。

`winget.json` の内容を変更することで、サインインしているユーザーに関係なくマシンインストールできると分かりました。

今回はマシンインストールする方法を紹介します。

## マシンインストールする方法

> scope の動作は、パッケージのインストール対象として、現在のユーザーとマシン全体のどちらが選択されるかに影響します。 対応するパラメーターは --scope で、同じ値 (user または machine) が使用されます。 [パッケージのインストール スコープに関する既知の問題](https://learn.microsoft.com/ja-jp/windows/package-manager/winget/troubleshooting#scope-for-specific-user-vs-machine-wide)を参照してください。
>
> ```bash
> "installBehavior": {
>    "preferences": {
>        "scope": "user"
>    }
> },
> ```

[scope - settings コマンド | Microsoft Learn](https://learn.microsoft.com/ja-jp/windows/package-manager/winget/settings#scope)

上記から、`Scope` に `machine` を指定すればよいと分かります。

ただ、では実際にどこで `Scope` を指定すればよいかが分かりませんでしたが、いろいろ試してみて以下の部分に `Scope` の指定を入れることでマシンインストールできました。

```json{11,15}:title=winget.json
{
	"$schema" : "https://aka.ms/winget-packages.schema.2.0.json",
	"CreationDate" : "2022-01-29T15:37:38.042-00:00",
	"Sources" :
	[
		{
			"Packages" :
			[
				{
					"PackageIdentifier" : "Microsoft.VisualStudio.2022.Community"
					"Scope": "machine"
				},
				{
					"PackageIdentifier" : "7zip.7zip"
					"Scope": "machine"
				},
				...
				...
			],
			"SourceDetails" :
			{
				"Argument" : "https://winget.azureedge.net/cache",
				"Identifier" : "Microsoft.Winget.Source_8wekyb3d8bbwe",
				"Name" : "winget",
				"Type" : "Microsoft.PreIndexed.Package"
			}
		}
	],
	"WinGetVersion" : "1.1.13405"
}
```

上記の例ではソフトウェアを 2 つしか指定していませんが、必要に応じてインストールしたいソフトウェアを増やしてください。

## 最後に

対象 PC にソフトウェアを一括でマシンインストールする方法を紹介しました。

PC のセットアップなど少し手間がかかる作業ですので、少しでも効率化いただけると幸いです。

では、次の記事でお会いしましょう。

## 参考

- [settings コマンド | Microsoft Learn](https://learn.microsoft.com/ja-jp/windows/package-manager/winget/settings)
- [VS Code を winget でインストールしてみた | DevelopersIO](https://dev.classmethod.jp/articles/winget-install-vscode/)
