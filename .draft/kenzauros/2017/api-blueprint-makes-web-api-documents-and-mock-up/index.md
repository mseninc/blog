---
title: API Blueprint で Web API の仕様書とモックアップとテストを一度に作る
date: 2017-02-13
author: kenzauros
tags: [Node.js, API Blueprint, その他]
---

ここ10年ほどの間に **Web API**、特に RESTful な API は一気に市民権を獲得しました。

SPA (Single Page Application) や別サービスからの連携のためには欠かせないものになっています。

今回はそんな Web API の仕様書とモックアップ、テストを同時に作ることができる **[API Blueprint](https://apiblueprint.org/)** をご紹介します。

## Web API 開発のジレンマ

さて Web API を開発するにあたっては、

1. 仕様書を書き、
2. フロントエンド開発者に対してモックアップを提供し、
3. テストを書き、
4. 実装し、
5. 利用方法を書いたリファレンスを書く、

といったステップが必要で、考えただけで憂鬱です。

**1, 5 はドキュメント作成であり、 2, 3 は API の動作には本質的に関係のないもの**です。

しかも 1 の仕様書が完璧な設計なら 5 のリファレンスは不要なはずですが、その過程で仕様が進化している可能性も高く、結局は一から見直して作り直しということが多いでしょう。

仕様書を Word なんかで書き出したとしたら、 2 週間後にはその修正だけで丸一日を費やすことになることでしょう。おまけに差分をとったり他のドキュメントとの整合をとったりも極めて煩雑です。

また、本来は 2 のモックアップや 3 のテストは設計から一意に生成できるはずのものであり、プログラマーがこれらのために書くソースコードも、結局のところ「仕様書の翻訳」に近いものになります。

怠け者エンジニア代表の私にとって、これは苦痛以外のなにものでもありません。

基本的に好きでプログラマーをやっているエンジニアは、同じことを繰り返し行うことや無駄なことを嫌う人種が多いはずです。必要なものとわかっていながらも実際の動作部分であるドキュメントやテストを書くのも嫌いなことが多いでしょう。（テストは書きましょう・笑）

こんなことをせざるを得ないのは「1 と 2～4 をつなぐツール」がないからに他なりません。そこで多くの人が様々なソリューションを考えているわけですが、なかなか便利かつ簡単なものはありませんでした。

## API Blueprint が変える Web API 開発

ずらずら書いたジレンマを **API Blueprint は（ほぼ）解決**してくれます。

具体的には前述の 1～5 のうち実装以外を一回の記述で実現でき、**プログラマーがすべきことは 1. 仕様を書く、 2. 実装する という 2 つに絞られ**、本業にほぼ専念することができます。

**API Blueprint 自体は Markdown の派生の一つ**であり、方言にすぎません。

しかし、この方言の仕様がきっちり定められており過不足がほとんどないことから、これを解釈して動作するさまざまなツールが開発されています。もちろんオープンソースで MIT ライセンスです。

下記に API Blueprint の主なツールを紹介します。他のツールは [公式ページ](https://apiblueprint.org/tools.html) に多数掲載されています。

* レンダラー: API Blueprint を HTML などのユーザーフレンドリーな形のドキュメントを作成します。
    * [danielgtaylor/**aglio**: An API Blueprint renderer with theme support that outputs static HTML](https://github.com/danielgtaylor/aglio)
* モックアップ: API Blueprint に書かれた API を模擬するサーバーを実行し、サンプルの応答を返します。
    * [localmed/**api-mock**: Creates a mock server based on an API Blueprint](https://github.com/localmed/api-mock)
* テスト: API Blueprint に従って指定したサーバーに対する HTTP アクセスを行って、正しい応答が変えるかどうかをテストします。
    * [apiaryio/**dredd**: Language-agnostic HTTP API Testing Framework](https://github.com/apiaryio/dredd)

このほか、統合ツールとしては [Apiary](https://apiary.io/) が有名です。

* [Apiary | Platform for API Design, Development & Documentation](https://apiary.io/)

## API Blueprint 実践

さて、 Apiary のような統合環境を使うのでなければ個別に環境構築が必要です。といってもほとんどのツールはパッケージマネージャーからインストールできるので大した手間ではありません。

今回用いる aglio, api-mock, dredd はすべて Node.js のパッケージですので、 `npm` コマンド一発でインストールできます。

### 事前準備

Web API 開発者で Node.js がインストールされていないというのは少ないかもしれませんが、もし入っていなければインストールします。バージョンはなるべく新しいものを利用すればいいでしょう。執筆時点での最新は v6.9.5 です。

ここでは Windows 環境を前提とします。もちろん Linux でも macOS でも vagrant 環境でもかまいません。

ついでに一部の Node モジュールのビルドに必要なので **Python 2.7** も入っていなければ入れておきます。

* [Node.js ダウンロード](https://nodejs.org/ja/download/)
* [Python 2.7](https://www.python.org/downloads/)

Windows の場合はダウンロードしたインストーラーを実行すれば基本的に OK です。念のため再起動して環境変数でつまづくことのないようにしておきましょう。

以上で事前準備は完了です。

### API Blueprint をはじめる

できれば **Markdown 対応か API Blueprint 対応のエディター**を使いましょう。私は **Visual Studio Code** を使用しています。

vscode には **API Elements** という拡張機能があり、 API Blueprint をサポートしていますが、基本は Markdown なので Markdown が編集できれば OK です。

適当なディレクトリを作り、`npm init` して aglio をインストールします。

```
npm init
npm i -g aglio
```

動作確認のため、とりあえず `index.apib` を作り、下記の内容で保存します。

```
FORMAT: 1A

# Polls

Polls is a simple API allowing consumers to view polls and vote in them.
```

できたら aglio をサーバーモードで起動します。

```bash
aglio -i index.apib -s
```

エラーなく立ち上がっていれば、 `http://localhost:3000` で API リファレンスが表示されます。

ちなみに静的な HTML に変換するには下記のコマンドを実行します。

```bash
aglio -i index.apib -o output.html
```

前置きが長くなったので、実践的な API 定義は次回ご紹介します。