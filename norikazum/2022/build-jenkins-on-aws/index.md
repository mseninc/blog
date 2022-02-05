---
title: Amazon EC2 上に Jenkins を構築する
date: 
author: norikazum
tags: [AWS,Jenkins]
description: 
---

こんにちは。

今回は フリーでオープンソースの **自動化サーバー の Jenkins を Amazon EC2 上に構築** してみたいと思います。

**サクッと構築** するために、 **Supported Images さんから提供されている AMI を利用します** 。

## 手順
1. **AWS コンソールにログイン** します
1. **EC2 ダッシュボード → インスタンス → インスタンスを起動** へ進みます
1. **検索枠に Jenkins を入力**し、**Jenkins on Ubuntu 18.04** を選択します
![](images/2022-02-05_13h48_51.jpg)
![](images/2022-02-05_13h49_15.jpg)
1. タイプは t2.micro にしました
![](images/2022-02-05_13h49_49.jpg)
1. 設定は変更せず作成します。このあたりは適宜調整してください
![](images/2022-02-05_13h50_15.jpg)
![](images/2022-02-05_13h50_24.jpg)
![](images/2022-02-05_13h50_47.jpg)
1. 起動完了です
![](images/2022-02-05_13h54_26.jpg)

## EC2 調整
1. 外部からアクセスするため、作成された **インスタンスにElastic IP 割り当て** ます
![](images/2022-02-05_14h11_08.jpg)
1. **セキュリティグループは自動で作成・割り当て** され、**8080/tcp と 22/tcp が 公開** されているので必要に応じて調整します
![](images/2022-02-05_14h13_54.jpg)

## Jenkins の設定
1. 以下の流れで **SSHアクセス** します。(他の方法でもOK) 
    1. `ssh -i "jenkins.pem" ubuntu@ElasticIP` で接続
    1. `sudo su-` で root に昇格
    1. `cat /var/lib/jenkins/secrets/iniialAdminPassword` で 初期パスワードを出力しメモする
1. http://ElasticIP:8080 にアクセスし、**前項で確認した初期パスワードを入力** します
    ![](images/2022-02-05_14h16_25.jpg)
1. 推奨プラグインをインストールしてもらうことにします
    ![](images/2022-02-05_14h25_36.jpg)
    ![](images/2022-02-05_14h25_59.jpg)
1. 初期ユーザーの情報を入力します
    ![](images/2022-02-05_14h27_44.jpg)
1. これで完了です
    ![](images/2022-02-05_14h29_20.jpg)
    ![](images/2022-02-05_14h30_04.jpg)

## Jenkins のアップデート

バージョンは、`2.204.1` でしたので 執筆時の最新LTSが `2.319.2` でしたのでアップデートします。

[Jenkins download and deployment](https://www.jenkins.io/download/)

1. SSHアクセスし、root になります
1. 以下のコマンドを実行します
    ```bash
    systemctl stop jenkins
    cd /usr/share/jenkins/
    mv jenkins.war{,.bak}
    wget https://get.jenkins.io/war-stable/2.319.2/jenkins.war
    systemctl start jenkins
    ```
1. 再度Jenkinsアクセス→ログインしアップデートされたことを確認します
    ![](images/2022-02-05_14h49_17.jpg)
1. 警告が出ているので対応します
- プラグインのアップデート
    ![](images/2022-02-05_14h51_12.jpg)
    ![](images/2022-02-05_14h54_45.jpg)
    ![](images/2022-02-05_14h55_14.jpg)

1つ警告が残りましたが、エージェントの設定はこの記事では割愛しますのでこれでセットアップ完了とします。
![](images/2022-02-05_15h03_04.jpg)

**とても簡単** に構築できました。
**AMIご提供者様に感謝** です。

この環境を使った評価はまた別記事にしようと思います。
それでは次回の記事でお会いしましょう。
