---
title: Active Directory環境でSYSVOLとNETLOGONの共有状況を確認する方法
date: 
author: hiratatsu04
tags: []
description: ACtive Directory環境を新規構築する場合や移行する場合に、ドメインコントローラ間でファイルが適切に共有できていないと冗長化に失敗していることになります。この記事ではドメインコントローラ間でSYSVOLとNETLOGONの共有が適切に行われているかの確認方法をまとめています。
---

ACtive Directory環境を新規構築する場合や移行する場合に、ドメインコントローラ間でファイルが適切に共有できていないと冗長化に失敗していることになります。
折角

この記事ではドメインコントローラ間でSYSVOLとNETLOGONの共有が適切に行われているかの確認方法をまとめています。

全7項目あります。
目的に応じて使い分けてください。

## 想定環境
- ドメインコントローラは冗長化している
- Windows Server 2019

## 確認方法

1. `repadmin /showrepl`コマンド
2. `repadmin /replsummary`コマンド
3. `net share`コマンド
4. `wmic /namespace:\\root\microsoftdfs path dfsrreplicatedfolderinfo get replicationgroupname,replicatedfoldername,state`コマンド
5. DFS Replicationイベントログを確認する
6. 一方のドメインコントローラのSYSVOLフォルダにファイルを作成する
7. `dfsrmig /GetGlobalState`コマンド

### `repadmin /showrepl`コマンド
１．何が確認できるか  
各パーティションについて複製したドメインコントローラと**最後に複製を行った日時**が分かります。

２．確認方法  
コマンドプロンプトを起動し、
```
repadmin /showrepl
```
と入力し実行します。

３．結果の確認方法  
以下に結果のサンプルを載せています。
この結果から、**①最終複製時間、②複製にエラーが生じていないか**、を確認します。
```
結果サンプル
```


### `repadmin /replsummary`コマンド
1. 何が確認できるか  
ドメイン・コントローラ間で複製されてからどのくらい時間が経ったか，また複製に失敗した情報がないかどうか，といった**複製の実行状況が一覧で表示され**簡単に確認できます。

2. 方法
コマンドプロンプトを起動し、
```
repadmin /replsummary
```
と入力し実行します。

3. 結果の確認方法
以下に結果のサンプルを載せています。
この結果から、**「/」の左側が0**であれば失敗がないということです。
```
結果サンプル
```

### `net share`コマンド



### `wmic /namespace:\\root\microsoftdfs path dfsrreplicatedfolderinfo get replicationgroupname,replicatedfoldername,state`コマンド

### DFS Replicationイベントログを確認する:

### 一方のドメインコントローラのSYSVOLフォルダにファイルを作成する

### `dfsrmig /GetGlobalState`コマンド


