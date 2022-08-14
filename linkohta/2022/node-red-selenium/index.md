---
title: Node-Red で Web スクレイピングをする方法
date: 
author: linkohta
tags: [Web, Node-Red, Selenium]
description: Node-Red で Web スクレイピングをする方法を説明します。
---

link です。

## 想定環境

- Windows 10 以降
- Docker 4

## Node-Red と Selenium のコンテナーを作成

Node-Red と Selenium のコンテナーを作成します。

### Node-Red のコンテナー作成

```bash:title=Node-Redのコンテナー作成
docker run -it -p 1880:1880 -v node_red_data:/data --name mynodered nodered/node-red
```

### Selenium のコンテナー作成

```bash:title=Seleniumのコンテナー作成
docker run -d -p 4444:4444 --shm-size="2g" selenium/standalone-firefox:4.4.0-20220812
```

## Node-Red に webdriver ノードをインストール

Node-Red に webdriver ノードをインストールします。
`node-red-contrib-simple-webdriver`

## Web スクレイピングをさせてみる

`http://172.17.0.3:4444`

## 参考サイト

- [Dockerで実行する : Node-RED日本ユーザ会](https://nodered.jp/docs/getting-started/docker)
- [SeleniumHQ/docker-selenium: Docker images for Selenium Grid](https://github.com/SeleniumHQ/docker-selenium)

## まとめ