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
<a href="images/change-windows-language-by-group-policy-1.png"><img src="images/change-windows-language-by-group-policy-1.png" alt="" width="1016" height="488" class="alignnone size-full wp-image-6474" /></a>

言語を変更する対象のOSはWindows Server 2012R2 または、Windows Server 2016です。

## 事前準備
### 言語の追加

まず、前提としてOSに対象の言語がインストールされていないといけません。

[コントロールパネル] > [時計、言語、および地域] > [言語]を参照します。

[言語の追加]をクリックします。
<a href="images/change-windows-language-by-group-policy-2.png"><img src="images/change-windows-language-by-group-policy-2.png" alt="" width="794" height="638" class="alignnone size-full wp-image-6462" /></a>

今回は例として**英語**を追加します。
<a href="images/change-windows-language-by-group-policy-3.png"><img src="images/change-windows-language-by-group-policy-3.png" alt="" width="799" height="641" class="alignnone size-full wp-image-6467" /></a>

英語の中でもたくさんあるので、**英語(米国)**を選択します。
<a href="images/change-windows-language-by-group-policy-4.png"><img src="images/change-windows-language-by-group-policy-4.png" alt="" width="797" height="639" class="alignnone size-full wp-image-6468" /></a>

この状態だとまだ追加されていないので、[オプション]をクリック。
<a href="images/change-windows-language-by-group-policy-5.png"><img src="images/change-windows-language-by-group-policy-5.png" alt="" width="798" height="640" class="alignnone size-full wp-image-6470" /></a>

[言語パックをダウンロードしてインストールします]をクリック。
<a href="images/change-windows-language-by-group-policy-6.png"><img src="images/change-windows-language-by-group-policy-6.png" alt="" width="797" height="637" class="alignnone size-full wp-image-6471" /></a>

インストールが完了すると、**利用可能**という表示に変わります。これで準備は完了です。
<a href="images/change-windows-language-by-group-policy-7.png"><img src="images/change-windows-language-by-group-policy-7.png" alt="" width="800" height="640" class="alignnone size-full wp-image-6473" /></a>

## グループポリシーの作成

[グループポリシーの管理]を開き、グループポリシーオブジェクト（GPO：Group Policy Object）を作成します。

今回は**ChangeLanguage**と名付けました。
<a href="images/change-windows-language-by-group-policy-8.png"><img src="images/change-windows-language-by-group-policy-8.png" alt="" width="376" height="556" class="alignnone size-full wp-image-6479" /></a>

ChangeLanguageを右クリックし、グループポリシー管理エディターを開いて[ユーザーの構成] > [ポリシー] > [管理テンプレート] > [コントロールパネル] > [地域と言語のオプション]を参照します。 

**選択されたユーザーに対してWindowsが使用するUI言語を制限する**をクリック。
<a href="images/change-windows-language-by-group-policy-9.png"><img src="images/change-windows-language-by-group-policy-9.png" alt="" width="1181" height="572" class="alignnone size-full wp-image-6480" /></a>

**有効**に変更し、[ユーザーを次の言語に制限する]で**英語**を選択します。
<a href="images/change-windows-language-by-group-policy-10.png"><img src="images/change-windows-language-by-group-policy-10.png" alt="" width="700" height="643" class="alignnone size-full wp-image-6481" /></a>

編集したGPO(ChangeLanguage)を対象のOU(English)にリンクします。
<a href="images/change-windows-language-by-group-policy-11.png"><img src="images/change-windows-language-by-group-policy-11.png" alt="" width="1134" height="252" class="alignnone size-full wp-image-6484" /></a>

設定は以上です。

## 対象ユーザーでログオン

対象のOU(English)に所属するユーザー(EngUser1)でサーバーにログオンしてみます。

スタートメニューが**英語**表記に変わりました。
<a href="images/change-windows-language-by-group-policy-12.png"><img src="images/change-windows-language-by-group-policy-12.png" alt="" width="1066" height="784" class="alignnone size-full wp-image-6487" /></a>

コントロールパネルも英語になっています。こっちのほうがスタイリッシュでいいですね。笑
<a href="images/change-windows-language-by-group-policy-13.png"><img src="images/change-windows-language-by-group-policy-13.png" alt="" width="798" height="637" class="alignnone size-full wp-image-6488" /></a>

補足として、Microsoft OfficeなどはOSの言語を追加しただけでは変更されません。

Microsoft Officeの言語を変更したい場合は、別途言語パックのインストールが必要です。

参考：[Office 2016 用言語アクセサリ パックのインストール](https://support.microsoft.com/ja-jp/help/4026353/office-install-the-language-accessory-packs-for-office-2016)

ではまた。