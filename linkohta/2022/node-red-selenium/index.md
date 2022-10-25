---
title: Node-Red で Web スクレイピングをする方法
date: 
author: linkohta
tags: [Node-Red, Selenium, Web]
description: Node-Red で Web スクレイピングをする方法を説明します。
---

link です。

Web スクレイピングを自動で行う方法として Selenium などが存在します。

今回は Node-Red 上で Selenium を利用できるノードを導入して Web スクレイピングをする方法を紹介します。

## 想定環境

- Windows 10 以降
- Docker 4

## Node-Red と Selenium のコンテナーを作成

今回は簡単に導入可能な Docker イメージを利用して Node-Red と Selenium のコンテナーを作成します。

### Node-Red のコンテナー作成

以下のコマンドを実行します。

```bash:title=Node-Redのコンテナー作成
docker run -it -p 1880:1880 -v node_red_data:/data --name mynodered nodered/node-red
```

`localhost:1880` にアクセスして以下の画像のような画面が表示されれば OK です。

![Node-Red 初期画面](image/2022-08-14_14h38_46.png)

### Selenium のコンテナー作成

以下のコマンドを実行します。

```bash:title=Seleniumのコンテナー作成
docker run -d -p 4444:4444 --shm-size="2g" selenium/standalone-firefox:4.4.0-20220812
```

`localhost:7900` にアクセスして以下の画像のような画面が表示されれば OK です。

こちらは Selenium の動作を確認できる noVNC の画面です。

初期パスワードは `secret` に設定されています。

![noVNC 初期画面](image/2022-10-25_23h44_15.png)

## Node-Red に webdriver ノードをインストール

Node-Red に webdriver ノードをインストールします。

右上のメニューから**パレットの管理**を選択します。

![パレットの管理](image/2022-08-14_14h45_59.png)

**ノードを追加**タブを選択して `node-red-contrib-simple-webdriver` を検索して、ノードを追加します。

![ノードを追加](image/2022-08-14_14h58_03.png)

ノードの追加に成功すると以下のノード一式がパレットに追加されていると思います。

![webdriver ノード](image/../images/2022-08-14_14h58_52.png)

## Web スクレイピングをさせてみる

`http://172.17.0.3:4444`

## 参考サイト

- [Dockerで実行する : Node-RED日本ユーザ会](https://nodered.jp/docs/getting-started/docker)
- [SeleniumHQ/docker-selenium: Docker images for Selenium Grid](https://github.com/SeleniumHQ/docker-selenium)

## まとめ

今回はNode-Red で Web スクレイピングをする方法を紹介しました。

Node-Red 上であれば Web スクレイピングの手順が容易に可視化できるため、ぜひ活用してみてください。

それではまた、別の記事でお会いしましょう。