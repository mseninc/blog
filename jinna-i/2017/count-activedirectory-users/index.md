---
title: Active Directory で特定のOUに所属するユーザー数をカウントする
date: 2017-08-11
author: jinna-i
tags: [ActiveDirectory, Windows Server, Windows]
---

こんにちは、じんないです。

Active Directoryの特定のOUに、ユーザーが何人所属しているのか調べる方法をまとめました。

ドメインの規模を見積もったり、Active Directory連携システムでの確認など、使える場面が多いかと思います。

今回は細かい情報はいいから、ユーザー数だけ教えてくれって方にぴったりな情報をお届けします。

確認方法は3パターン。

いずれもActive Directoryがインストールされたサーバーで実施します。


## 想定環境

OS：Windows Server 2012 R2
対象OU：User配下の **Staff**
ドメイン： **jinnai.net**

<a href="images/count-activedirectory-users-1.png"><img src="images/count-activedirectory-users-1.png" alt="" width="772" height="475" class="alignnone size-full wp-image-4976" /></a>

Windows Server 2008 R2でも動作確認済みです。

## GUIから確認する

**Active Directoryユーザーとコンピューター** を起動します。
<a href="images/count-activedirectory-users-2.png"><img src="images/count-activedirectory-users-2.png" alt="" width="772" height="475" class="alignnone size-full wp-image-4977" /></a>

**表示** ＞ **カスタマイズ** の順にクリックします。
<a href="images/count-activedirectory-users-3.png"><img src="images/count-activedirectory-users-3.png" alt="" width="771" height="474" class="alignnone size-full wp-image-4978" /></a>

**説明バー** にチェックを入れ、 **OK** をクリックします。
<a href="images/count-activedirectory-users-4.png"><img src="images/count-activedirectory-users-4.png" alt="" width="391" height="457" class="alignnone size-full wp-image-4979" /></a>

すると、説明バーにオブジェクトの数が表示されます。
<a href="images/count-activedirectory-users-5.png"><img src="images/count-activedirectory-users-5.png" alt="" width="772" height="475" class="alignnone size-full wp-image-4980" /></a>

注意点としては、カウントするのはあくまでオブジェクトの数でありユーザー数ではないことです。

グループやコンピューターが同じOUに所属している場合はフィルターする必要があります。

フィルターのアイコンをクリックします。
<a href="images/count-activedirectory-users-6.png"><img src="images/count-activedirectory-users-6.png" alt="" width="772" height="475" class="alignnone size-full wp-image-4991" /></a>

**次の種類のオブジェクトのみを表示** を選択し、**ユーザー** にチェックを入れてOKをクリックします。
<a href="images/count-activedirectory-users-7.png"><img src="images/count-activedirectory-users-7.png" alt="" width="457" height="395" class="alignnone size-full wp-image-4992" /></a>

これでユーザー数のみが表示されるようになります。


## PowerShellから確認する

Windows PowerShellを起動し、以下のコマンドを実行します。

```
$UsersArray = Get-ADUser -SearchBase "OU=Staff,OU=User,DC=jinnai,DC=net" -Filter *

$UsersArray.count
```

**"OU=Staff,OU=User,DC=jinnai,DC=net"** の部分は環境にあったDNに変更してください。

Get-ADUserで取ってきたデータを一旦配列に入れ、そのデータの数をカウントします。

デフォルトでは一度にとってこれる件数が500件に制限されています。

多数のユーザーがいる場合は、以下のオプションを指定することで無制限にすることができます。

```
-ResultSetSize $null
```

<a href="images/count-activedirectory-users-8.png"><img src="images/count-activedirectory-users-8.png" alt="" width="997" height="331" class="alignnone size-full wp-image-4981" /></a>

また、Get-ADUserが無いよって怒られた場合は以下コマンドを実行してモジュールをインポートしてみてください。

```
Import-Module ActiveDirectory
```


## コマンドプロンプトから確認する

コマンドプロンプトを起動し、以下のコマンドを実行します。

```
C:\Users\administrator>dsquery user "OU=Staff,OU=User,DC=jinnai,DC=net" | find /c /v ""
```

**"OU=Staff,OU=User,DC=jinnai,DC=net"** の部分は環境にあったDNに変更してください。
<a href="images/count-activedirectory-users-9.png"><img src="images/count-activedirectory-users-9.png" alt="" width="677" height="493" class="alignnone size-full wp-image-4985" /></a>

## まとめ

ざっと見たいときやコマンドラインに不慣れな場合は最初に紹介したGUIから確認する方法がいいですね。

ユーザー数が多い場合はPowerShellやコマンドプロンプトから確認してみてください。

ではまた。