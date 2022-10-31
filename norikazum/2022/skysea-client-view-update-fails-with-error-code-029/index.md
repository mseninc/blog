---
title: 【解決】SKYSEA Client Viewのアップデートがエラーコード029で失敗する
date: 
author: norikazum
tags: [skysea]
description: 
---

こんにちは。

今回は、社内で利用している SKYSEA Client View を 16系から18系にバージョンアップした際、**特定の端末がエラーコード029で失敗** ました。

これを解決した経緯を記事にします。

## 前提
SKYSEA Client View のマスタサーバー及びデータサーバーはアップデート済みで、マスタサーバーからシステムアップデートを実施した際に起きたエラーです。

本記事ではサーバー側のアップデートや端末のアップデート手順は割愛します。

## 現象

アップデートを実行すると、以下のエラーで中断しました。
![](images/2022-10-31_11h51_34.png)

リトライしても同様にダメでした。

## 原因
SKYSEA保守契約窓口に問合せしたところ、このエラーは **インストーラーやアップデーターでのレジストリへのアクセス、サービスの登録に失敗しているエラーである** とのことでした。

大きくわけて、以下の2点が問合せ時点で確認されているようでした。
1. ウイルス対策ソフト等により、レジストリへの書き込みがブロックされたり、サービスの登録が失敗して発生するケース
1. 偶発的な問題で発生していたケース

1のケースは **Acronis社製のバックアップソフトにて事例を確認している** とのことで今回はこのケースに当てはまっていました。

対象製品を利用している環境の場合、以下サービスを停止することで改善するケースを連絡されました。

- Acronis Managed Machine Service
- Acronis Scheduler2 Service
- Acronis Agent Core Service
- Acronis Active Protection Service
- Acronis Cyber Protection Service

## 対処
提案された停止サービスを端末で確認すると以下の5サービスが該当していました。
![](images/2022-10-31_11h51_34.png)

ファイル名から指定して実行から `services.msc` を実行してこれらのサービスを停止しようと試みましたが、`Acronis Active Protection (TM) Service` と `Acronis Cyber Protection Service` は停止がグレーアウトされていて選択できませんでした。

色々と試したところ、以下の手順でサービスを停止することができました。

### サービスから停止

1. ファイル名から指定して実行から `services.msc` を実行
1. `Acronis Agent Core Service` を停止 ※このとき同時に `Acronis Managed Machine Service Mini` が停止される
1. `Acronis Scheduler2 Service` を停止

### タスクマネージャーから停止
1. ファイル名から指定して実行から `taskmgr` を実行  
1. `CyberProtectHomeOfficeMonitor.exe` のタスクを終了 
1. `anti_ransomware_service.exe` のタスクを終了
1. `cyber-protect-service.exe` のタスクを終了

これでサービスが停止しました。
![](images/2022-10-31_13h44_11.png)

この状態で再度SKYSEA Client Viewをインストールしたところ無事成功しました。
お困りの方のお役に立てれば幸いです。

それでは次回の記事でお会いしましょう。
