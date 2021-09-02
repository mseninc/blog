---
title: タスクスケジューラーからコマンド(バッチ)で Windows Server バックアップの世代数を管理する
date: 2020-04-08
author: jinna-i
tags: [Windows Server, Windows Server バックアップ, Windows]
---

こんにちは、じんないです。

今回は Windows Server バックアップの保持世代数をコマンドから管理しようと思います。Windows Server バックアップは共有ネットワークドライブに保存する場合を除き、初回にフルバックアップを保存したあと、容量がある限り増分バックアップを続けます。最大 512 世代となっており、変更はできない仕様です。共有ネットワークドライブに保存する場合は、世代管理ができず毎回フルバックアップとなります。

[Windows Server バックアップにおける容量と世代管理について | Microsoft Docs](https://docs.microsoft.com/ja-jp/archive/blogs/askcorejp/windows_server_backup_space_management)

バックアップ保存先に使っているドライブを専用領域として確保しているのであればよいですが、そうでない場合はどんどん容量を食いつぶしてしまうので困ったものです。
`wbadmin` コマンドを使えばバックアップを削除することができるので、タスクスケジューラーと組み合わせて世代管理をしてみます。

## 想定環境

- Windows Server 2016
- バックアップの保存先: 外付け HDD
- 保持したい世代数: 21

## コマンドからバックアップを管理する
### まずはバックアップを確認

コマンドから Windows Server バックアップを管理するには `wbadmin` コマンドを使います。

まずは `wbadmin get versions` で現在保持されているバックアップを確認します。

```cmd
C:\Users\Administrator>wbadmin get versions
wbadmin 1.0 - バックアップ コマンド ライン ツール
(C) Copyright 2013 Microsoft Corporation. All rights reserved.

バックアップ時間: 2020/03/18 5:00
バックアップ対象: 1394/USB ディスク ラベル付き D:
バージョン識別子: 03/17/2020-20:00
回復可能: ボリューム, ファイル, アプリケーション, ベア メタル回復, システム状態
スナップショット ID: {c5ce0737-49e4-4dcd-b6ef-f5f8e4b1246e}

バックアップ時間: 2020/03/19 5:00
バックアップ対象: 1394/USB ディスク ラベル付き D:
バージョン識別子: 03/18/2020-20:00
回復可能: ボリューム, ファイル, アプリケーション, ベア メタル回復, システム状態
スナップショット ID: {4c9fba30-f510-4f0b-8047-3c92b0acebeb}

バックアップ時間: 2020/03/20 5:00
バックアップ対象: 1394/USB ディスク ラベル付き D:
バージョン識別子: 03/19/2020-20:00
回復可能: ボリューム, ファイル, アプリケーション, ベア メタル回復, システム状態
スナップショット ID: {9171cfe8-0259-49a5-8d7a-773bff3aaaeb}
　　：
以下省略
```

一覧で表示されて非常に見にくいので `find /i "バックアップ時間"` で抽出して `/c` で数をカウントします。

```cmd
C:\Users\Administrator>wbadmin get versions | find /i "バックアップ時間"
バックアップ時間: 2020/03/11 5:00
バックアップ時間: 2020/03/12 5:00
バックアップ時間: 2020/03/13 5:00
バックアップ時間: 2020/03/14 5:00
バックアップ時間: 2020/03/16 5:00
バックアップ時間: 2020/03/17 5:00
バックアップ時間: 2020/03/18 5:00
バックアップ時間: 2020/03/19 5:00
バックアップ時間: 2020/03/20 5:00
バックアップ時間: 2020/03/21 5:00
バックアップ時間: 2020/03/22 5:00
バックアップ時間: 2020/03/23 5:00
バックアップ時間: 2020/03/24 5:00
バックアップ時間: 2020/03/25 5:00
バックアップ時間: 2020/03/26 5:00
バックアップ時間: 2020/03/27 5:00
バックアップ時間: 2020/03/28 5:00
バックアップ時間: 2020/03/29 5:00
バックアップ時間: 2020/03/30 5:00
バックアップ時間: 2020/03/31 5:00
バックアップ時間: 2020/04/01 5:00
バックアップ時間: 2020/04/02 5:00
バックアップ時間: 2020/04/03 5:00
バックアップ時間: 2020/04/04 5:00
バックアップ時間: 2020/04/05 5:00
バックアップ時間: 2020/04/06 5:00
バックアップ時間: 2020/04/07 5:00

C:\Users\Administrator>wbadmin get versions | find /i "バックアップ時間" /c
27
```

これで 27 世代あることが分かります。

### バックアップを削除してみる

21 世代残すことが目的なのでバックアップを削除する必要があります。

どのようなコマンドが使えるのかヘルプを見てみます。今回の場合だと `-keepVersions` が使えそうです。

```cmd
C:\Users\Administrator>wbadmin delete backup -?
wbadmin 1.0 - バックアップ コマンド ライン ツール
(C) Copyright 2013 Microsoft Corporation. All rights reserved.

構文: WBADMIN DELETE BACKUP
  {-keepVersions:<コピーの数> | -version:<バージョン識別子> | -deleteOldest}
  [-backupTarget:<ボリューム名>]
  [-machine:<バックアップ コンピューター名>]
  [-quiet]

説明:  指定したバックアップを削除します。指定されたボリュームに
ローカル サーバーのバックアップ以外のバックアップが含まれている場合、
それらのバックアップは削除されません。
このコマンドを使用するには、Backup Operators グループまたは Administrators
グループのメンバーである必要があります。

パラメーター:
-keepVersions  保持する最新のバックアップの数を指定します。値には、正の整数を
               指定する必要があります。オプションの値に -keepVersions:0
               を指定すると、すべてのバックアップが削除されます。

-version       バックアップの MM/DD/YYYY-HH:MM 形式のバージョン識別子です。
               バージョン識別子が不明な場合は、コマンド プロンプトで
               「WBADMIN GET VERSIONS」と入力します。バックアップ専用の
               バージョンは、このコマンドを使用して削除できます。
               バージョンの種類を確認するには、WBADMIN GET ITEMS を使用します。

-deleteOldest  最も古いバックアップを削除します。

-backupTarget  削除するバックアップの保存場所を指定します。
               バックアップの保存場所は、ドライブ文字、
               マウント ポイント、または GUID ベースのボリューム パスです。
               この値は、ローカル コンピューターのバックアップではない
               バックアップの場所を指定する場合にのみ指定する必要があります。
               ローカル コンピューターのバックアップに関する情報は、
               ローカル コンピューターのバックアップ カタログにあります。

-machine       バックアップを削除するコンピューターを指定します。
               複数のコンピューターが同じ場所にバックアップされているときに
               便利です。-backupTarget が指定されている場合のみ
               使用できます。

-quiet         ユーザー プロンプトを表示せずにコマンドを実行します。

注釈: -keepVersions、-version、-deleteOldest のいずれかのパラメーターを
必ず 1 つ指定してください。

例:
WBADMIN DELETE BACKUP -version:03/31/2006-10:00
WBADMIN DELETE BACKUP -keepVersions:3
WBADMIN DELETE BACKUP -backupTarget:f: -deleteOldest
```

試しに1つ削除して 26 にしてみましょう。

```cmd
C:\Users\Administrator>wbadmin delete backup -keepVersions:26
wbadmin 1.0 - バックアップ コマンド ライン ツール
(C) Copyright 2013 Microsoft Corporation. All rights reserved.

バックアップを列挙しています...
27 個のバックアップが見つかりました。
削除操作後は 26 個になります。
バックアップを削除しますか?
[Y] はい [N] いいえ Y

バックアップ バージョン 03/10/2020-20:00 を削除しています (1/1)...
バックアップを削除する操作が完了し、
1 個のバックアップが削除されました。

C:\Users\Administrator>wbadmin get versions | find /i "バックアップ時間" /c
26
```

対話形式となるので、タスクから実行する場合は `-quiet` オプションを追加した方がよいです。
`-quiet` オプションを追加して 25 にしてみます。

```cmd
C:\Users\Administrator>wbadmin delete backup -quiet -keepVersions:25
wbadmin 1.0 - バックアップ コマンド ライン ツール
(C) Copyright 2013 Microsoft Corporation. All rights reserved.

バックアップを列挙しています...
26 個のバックアップが見つかりました。
削除操作後は 25 個になります。
バックアップ バージョン 03/11/2020-20:00 を削除しています (1/1)...
バックアップを削除する操作が完了し、
1 個のバックアップが削除されました。

C:\Users\Administrator>wbadmin get versions | find /i "バックアップ時間" /c
25
```

よさそうな感じです。保持世代数を下回っている場合はどうなるのか。気になるところなのでもう一度 26 で実行してみます。

```cmd
C:\Users\Administrator>wbadmin delete backup -quiet -keepVersions:26
wbadmin 1.0 - バックアップ コマンド ライン ツール
(C) Copyright 2013 Microsoft Corporation. All rights reserved.

バックアップを列挙しています...
見つかったバックアップ コピーの数: 25
保存するバックアップ コピーの数: 26
見つかったバックアップ コピーの数が、保存するように指定したバックアップ
コピーの数以下であるため、バックアップ コピーは削除されません。

C:\Users\Administrator>wbadmin get versions | find /i "バックアップ時間" /c
25
```

ちゃんと数が管理されているようです。**”日”** ではなく **"バックアップの数"** というのが味噌ですね。
使えそうなのでこれをタスク実行してみます。

## タスクで実行する

タスクスケジューラーの使い方は割愛しますが、今回のコマンドを操作に指定してあげればいいです。

- 操作: プログラムの開始
- プログラム/スクリプト: `C:\Windows\System32\wbadmin.exe`
- 引数の追加: `delete backup -quiet -keepVersions:21`

wbadmin コマンドのヘルプに注意書きがありましたが、**タスクの実行時に使うユーザーアカウントは Backup Operators グループまたは Administrators グループのメンバーを指定します。**

タスク実行後、世代数が 21 となっていることを確認しました。

```cmd
C:\Users\Administrator>wbadmin get versions | find /i "バックアップ時間" /c
21
```

バッチ化したい場合はコマンドをバッチファイルにしてタスクスケジューラーから実行するようにしてあげればよいと思います。

ではまた。

## 参考

[Windows Serverバックアップで古い世代のバックアップを削除する - 徒然なるままに](http://norimaki2000.blog48.fc2.com/blog-entry-1487.html?sp)