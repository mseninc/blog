---
title: ドメインコントローラー冗長の正常性を確認する方法
date: 
author: hiratatsu04
tags: [Windows Server, Active Directory]
description: ドメインコントローラーが冗長化されている環境を移行（や新規構築）する場合、作業後にきちんと冗長化されているかの正常性を確認する必要があります。この記事では正常性の確認方法について、どのような方法があるのか、また確認した結果がどうなれば正常と言えるのか、についてまとめています。
---

こんにちは、ひらたつです。

先日 Active Directory 環境を移行する業務を任せていただきました。  
ドメインコントローラー2台で冗長化されている環境でした。

ドメインコントローラーが冗長化されている環境を移行（や新規構築）する場合、作業後にきちんと冗長化されているかの正常性を確認する必要があります。  
私の理解が浅かったため、教えていただいたり、調べらりしながら正常性の確認を進めました。

この記事では上記の経験を通して理解した正常性の確認方法について、どのような方法があるのか、また確認した結果がどうなれば正常と言えるのか、についてまとめております。

## 冗長化のしくみ
確認方法を述べる前に、前提知識として冗長化のしくみについて整理しようと思います。

### DFSR (Distributed File System Replication)
Active Directory 環境では DFSR (Distributed File System Replication) というしくみでサーバー間のフォルダが同期（複製、レプリケーション）されています。  
※DFSR は Windows Server 2008 から利用できるようになり、それまでは FRS (File Replication System) が使われていました。

DFSR では SYSVOL フォルダ（後述）に限らず、他のフォルダも同期できます。  
**このしくみを使ってドメインコントローラーを冗長化しています。**

冗長化の正常性を確認するには、**DFSR のしくみがきちんと動作しているか** を検証すればよいということになります。

> 複数のコンピュータのフォルダ間を関連付け、内部のファイルやフォルダを自動的に複製することで可用性の向上や負荷分散を図る機能である。
> 複数のコンピュータをグループ化し、グループ内の特定のフォルダの内容を自動的に複製する。

引用：[DFS 【Distributed File System】](https://e-words.jp/w/DFS.html)

### SYSVOL

SYSVOL とは、Active Directory 環境下で **ドメインコントローラー間で共有されるフォルダ** のことです。  
グループ・ポリシー・ファイルなどが共有されます。

> グループ・ポリシー・ファイルなどが配置され、ほかのドメイン・コントローラーにも複製されるようになっている。
> またNTドメインで共有フォルダとして利用されていたNETLOGON共有（ログオン時のスクリプトなどが置かれているフォルダ）もこのSYSVOLフォルダ内で共有されるため、下位互換のログオン・スクリプトやシステム・ポリシー・ファイルも自動的にほかのドメイン・コントローラーに複製される。

引用：[第7回　Active Directoryの導入](https://atmarkit.itmedia.co.jp/ait/articles/0301/30/news001_2.html)

NTドメインというのは、Active Directoryが登場する以前に使われていたしくみで、1990年代の Windows NT 時代のネットワーク管理で使われていたそうです。
今はほとんど使われていないみたいです。

## 確認方法

では、具体的な確認方法ですが、移行のフェーズや確認する対象でいくつかに分類されます。

| パターン1：<br>DC の移行を伴わない | パターン2：<br>DC の移行を伴う | パターン3：<br>DC の移行を伴う<br>+ SYSVOL 複製方式の移行を伴う |
| -- | -- | -- |
| 1. repadmin コマンド <br> 2. wmic コマンド <br> 3. フォルダ作成 | 左記 <br>+ 4. DFSR イベントの確認 | 左記 <br>＋ 5. dfsrmg コマンド |

それぞれの項目に対して、以下の3つに分けて整理しています。
1. 何が確認できるか
2. 確認手段
3. 結果の見方

### 1-1. `repadmin /replsummary` コマンド
1. ドメインコントローラー間でフォルダが複製されてからどのくらい時間が経ったか，また複製に失敗した情報がないかどうか，といった**情報の要約を一覧で確認**できます。

2. コマンドプロンプトを起動し、
```cmd
repadmin /replsummary
```
と入力し実行します。

3. 以下に出力例を載せています。
**失敗の数を表す「/」の左側のが0** であれば問題なく複製できています。

```cmd
C:\Users\Administrator>repadmin /replsummary
レプリケーションの要約開始時刻: 2023-01-25 09:21:25

レプリケーションの要約のためのデータ収集を開始します。
これにはしばらく時間がかかる場合があります:
  .....

ソース DSA          最大デルタ    失敗/合計 %%   エラー
 AD1                  23m:19s    0 /   5    0
 AD2                  28m:00s    0 /   5    0

宛先 DSA     最大デルタ    失敗/合計 %%   エラー
 AD1                  28m:00s    0 /   5    0
 AD2                  23m:19s    0 /   5    0
```

### 1-2. `repadmin /showrepl` コマンド
1. **ドメインコントローラー間でフォルダの複製が行われたかどうかが確認できます。** 最後に複製を行った日時が表示されます。
上記の `repadmin /replsummary` より詳細な情報が確認できます。

2. コマンドプロンプトを起動し、
```cmd
repadmin /showrepl
```
と入力し実行します。

3. 以下に出力例を載せています。
**①すべての試行が成功しているか**、**②最終同期時間は現在時刻と大幅に乖離していないか**、を確認します。

```cmd
C:\Users\Administrator>repadmin /showrepl

Repadmin: フル DC localhost に対してコマンド /showrepl を実行しています
Default-First-Site-Name\AD1
DSA オプション: IS_GC
サイト オプション: (none)
DSA オブジェクト GUID: 1f4f5cbf-5a0a-49b2-8086-4911d81904b2
DSA 起動 ID: 67bcfc10-00b0-484a-87c5-f37f00f19d68

==== 入力方向の近隣サーバーー======================================

DC=example,DC=ac,DC=jp
    Default-First-Site-Name\AD2 (RPC 経由)
        DSA オブジェクト GUID: 1d8e3247-c429-4a32-a677-71b67a19375f
       2023-01-25 09:08:38 の最後の試行は成功しました。

CN=Configuration,DC=example,DC=ac,DC=jp
    Default-First-Site-Name\AD2 (RPC 経由)
        DSA オブジェクト GUID: 1d8e3247-c429-4a32-a677-71b67a19375f
       2023-01-25 08:58:06 の最後の試行は成功しました。

CN=Schema,CN=Configuration,DC=example,DC=ac,DC=jp
    Default-First-Site-Name\AD2 (RPC 経由)
        DSA オブジェクト GUID: 1d8e3247-c429-4a32-a677-71b67a19375f
       2023-01-25 08:58:06 の最後の試行は成功しました。

DC=ForestDnsZones,DC=example,DC=ac,DC=jp
    Default-First-Site-Name\AD2 (RPC 経由)
        DSA オブジェクト GUID: 1d8e3247-c429-4a32-a677-71b67a19375f
       2023-01-25 08:58:06 の最後の試行は成功しました。

DC=DomainDnsZones,DC=example,DC=ac,DC=jp
    Default-First-Site-Name\AD2 (RPC 経由)
        DSA オブジェクト GUID: 1d8e3247-c429-4a32-a677-71b67a19375f
       2023-01-25 08:58:06 の最後の試行は成功しました。
```

### 2. `wmic` コマンド
1. **DFSRプロセスが稼働しているか**を確認できます。
2. コマンドプロンプトを起動し、
```
wmic /namespace:\\root\microsoftdfs path dfsrreplicatedfolderinfo get replicationgroupname,replicatedfoldername,state
```
と入力し実行します。  

3. **`state`が `4`であれば問題ありません。**
※ `state`は `4` 以外に以下の値が存在します。`4` 以外だとDFSRプロセスがうまく稼働していない可能性があります。
```
  0 = 初期化されていない
  1 = 初期化済み
  2 = 初期同期
  3 = 自動回復
  4 = 標準
  5 = エラー
```

#### wmic コマンドについて
wmic コマンドは WMI（Windows Management Instrumentation）を操作するためのコマンドです。  
WMI は、システムに関するさまざまなインベントリ情報を、取得・管理する機能を提供しています。  
参照：[WindowsでWMIとwmicコマンドを使ってシステムを管理する（基本編）](https://atmarkit.itmedia.co.jp/ait/articles/0804/18/news154.html)

### 3. 一方のドメインコントローラーの SYSVOL フォルダにファイルを作成する

1. SYSVOL の複製が正常に行われているかを確認することで、**DFSR サービス が正常であるかを判断できます。**
2. 一方のドメインコントローラー (DC1) の `C:\WINDOWS\SYSVOL\sysvol\<ドメイン名>\scripts` に `test.txt` など任意のファイルを作成し、編集します。　　
もう一方のドメインコントローラー (DC2) の `C:\WINDOWS\SYSVOL\sysvol\<ドメイン名>\scripts` に `test.txt` が存在し、中身を確認できることを確認します。　　
確認が終われば、`test.txt` を削除し、DC1 でもファイルが削除されていることを確認します。  
3. 上記の**ファイルの作成、削除の内容が同期されていれば問題ありません。**

### 4. DFS Replication イベントログを確認する
1. DFSR が有効でドメインコントローラーが複数台あり、ドメインコントローラーを新規構築・移行した場合に本イベントログが発生します。　　
DFSR プロセスが正常か異常かを確認できます。  
2. `[イベント ビューアー] > [アプリケーションとサービス ログ] > [DFS Replication]` を確認します。  
3. **イベントログにID : `4604` のイベントが記録されていれば正常に DFSR が稼働しています。**

### 5. `dfsrmig` コマンド
1. DC の移行を伴い、さらに SYSVOL 複製方式の移行を伴う場合に、本方法で **FRS から DFSR への移行状態の確認ができます。**
2. コマンドプロンプトを起動し、
```
dfsrmig /GetGlobalState
```
と入力し実行します。  
3. **以下のように表示されれば正常に移行が完了しています。**
```cmd
DFSR の現在のグローバル状態: '削除済み'
成功しました。
```

以上となります。

ご参考になれば幸いです。
