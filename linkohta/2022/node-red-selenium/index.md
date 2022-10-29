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

![Node-Red 初期画面](images/2022-08-14_14h38_46.png)

### Selenium のコンテナー作成

以下のコマンドを実行します。

```bash:title=Seleniumのコンテナー作成
docker run -d -p 4444:4444 --shm-size="2g" selenium/standalone-firefox:4.4.0-20220812
```

`localhost:7900` にアクセスして以下の画像のような画面が表示されれば OK です。

こちらは Selenium の動作を確認できる noVNC の画面です。

初期パスワードは `secret` に設定されています。

![noVNC 初期画面](images/2022-10-25_23h44_15.png)

## Node-Red に webdriver ノードをインストール

Node-Red に webdriver ノードをインストールします。

右上のメニューから**パレットの管理**を選択します。

![パレットの管理](images/2022-08-14_14h45_59.png)

**ノードを追加**タブを選択して `node-red-contrib-simple-webdriver` を検索して、ノードを追加します。

![ノードを追加](images/2022-08-14_14h58_03.png)

ノードの追加に成功すると以下のノード一式がパレットに追加されていると思います。

![webdriver ノード](images/2022-08-14_14h58_52.png)

## Web スクレイピングをさせてみる

さっそく Web スクレイピングをさせてみましょう。

今回は Mseeeen のトップページの標語「Beyond our knowledge」を取得してみます。

ノードを以下の画像のように設置します。

![設置ノード](images\2022-10-26_23h28_01.png)

その後、各ノードの設定を以下のようにします。

- `open browser`
  - ブラウザを開きます、サーバーはポート番号 4444 の URL を Docker の Selenium コンテナーのログから探して入力します。画像の例だと `172.17.0.2:4444` です。 
![open browser](images\2022-10-26_23h28_20.png)
![Selenium ログ](images\2022-10-26_23h55_14.png)
- `navigate`
  - 指定したページに遷移します
![navigate](images\2022-10-26_23h28_34.png)
- `get text`
  - 指定した要素の文字列を取得します
![get text](images\2022-10-26_23h29_16.png)

`inject` ノードをクリックして動作させます。

しばらくすると以下の画像のようにメッセージが表示され、取得したテキストが `payload` に保存されていることがわかります。

![取得結果](images\2022-10-26_23h29_51.png)

ちなみに取得中は以下の画像のように noVNC でブラウザが動いていることがわかります。

![取得中の noVNC](images\2022-10-26_23h30_58.png)

## 参考サイト

- [Dockerで実行する : Node-RED日本ユーザ会](https://nodered.jp/docs/getting-started/docker)
- [SeleniumHQ/docker-selenium: Docker images for Selenium Grid](https://github.com/SeleniumHQ/docker-selenium)

## まとめ

今回はNode-Red で Web スクレイピングをする方法を紹介しました。

Node-Red 上であれば Web スクレイピングの手順が容易に可視化できるため、ぜひ活用してみてください。

それではまた、別の記事でお会いしましょう。