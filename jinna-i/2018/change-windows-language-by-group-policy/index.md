---
title: グループポリシーで特定OUのユーザーでWindowsにログオンしたときにOSで使用する言語を変更する
date: 2018-01-25
author: jinna-i
tags: [Windows, Windows Server, もくもく会]
---

こんにちは、じんないです。

今回はグループポリシーを使って、特定のOUに所属しているユーザーアカウントでログオンしたときにWindowsで使用する言語を変更する方法を紹介します。

海外のスタッフやメンバーが共用のPCを利用したり、リモートデスクトップをする場合などに便利です。

## 想定環境

今回は、**ALL Users**配下の**EnglishというOUを対象**とし、このOUに所属しているユーザーでログオンした場合にWindowsが使用する言語（今回は英語）を変更します。
テストユーザーとして、EngUser1を作成しています。
![](images/change-windows-language-by-group-policy-1.png)

言語を変更する対象のOSはWindows Server 2012R2 または、Windows Server 2016です。

## 事前準備
### 言語の追加

まず、前提としてOSに対象の言語がインストールされていないといけません。

[コントロールパネル] > [時計、言語、および地域] > [言語]を参照します。

[言語の追加]をクリックします。
![](images/change-windows-language-by-group-policy-2.png)

今回は例として**英語**を追加します。
![](images/change-windows-language-by-group-policy-3.png)

英語の中でもたくさんあるので、**英語(米国)**を選択します。
![](images/change-windows-language-by-group-policy-4.png)

この状態だとまだ追加されていないので、[オプション]をクリック。
![](images/change-windows-language-by-group-policy-5.png)

[言語パックをダウンロードしてインストールします]をクリック。
![](images/change-windows-language-by-group-policy-6.png)

インストールが完了すると、**利用可能**という表示に変わります。これで準備は完了です。
![](images/change-windows-language-by-group-policy-7.png)

## グループポリシーの作成

[グループポリシーの管理]を開き、グループポリシーオブジェクト（GPO：Group Policy Object）を作成します。

今回は**ChangeLanguage**と名付けました。
![](images/change-windows-language-by-group-policy-8.png)

ChangeLanguageを右クリックし、グループポリシー管理エディターを開いて[ユーザーの構成] > [ポリシー] > [管理テンプレート] > [コントロールパネル] > [地域と言語のオプション]を参照します。 

**選択されたユーザーに対してWindowsが使用するUI言語を制限する**をクリック。
![](images/change-windows-language-by-group-policy-9.png)

**有効**に変更し、[ユーザーを次の言語に制限する]で**英語**を選択します。
![](images/change-windows-language-by-group-policy-10.png)

編集したGPO(ChangeLanguage)を対象のOU(English)にリンクします。
![](images/change-windows-language-by-group-policy-11.png)

設定は以上です。

## 対象ユーザーでログオン

対象のOU(English)に所属するユーザー(EngUser1)でサーバーにログオンしてみます。

スタートメニューが**英語**表記に変わりました。
![](images/change-windows-language-by-group-policy-12.png)

コントロールパネルも英語になっています。こっちのほうがスタイリッシュでいいですね。笑
![](images/change-windows-language-by-group-policy-13.png)

補足として、Microsoft OfficeなどはOSの言語を追加しただけでは変更されません。

Microsoft Officeの言語を変更したい場合は、別途言語パックのインストールが必要です。

参考：[Office 2016 用言語アクセサリ パックのインストール](https://support.microsoft.com/ja-jp/help/4026353/office-install-the-language-accessory-packs-for-office-2016)

ではまた。