---
title: "ThinkPad の Fn キーと Ctrl キーを入れ替える方法"
date: 2023-08-02
author: r-Funakoshi
tags: [ThinkPad]
description: "Lenovo の ThinkPad を使用する方向けに Ctrl キーと Fn キーの機能を入れ替える方法を紹介します。"
---

こんにちはリーフです。

弊社では主に Lenovo 社の PC である **ThinkPad** を使用しており、先日新しい PC のセットアップを行いました。

新しく入社された方に操作してもらいながら設定していましたが、`Ctrl + C` などのキーボードショートカットがうまく反応しないという話を聞きました。

様子をみていると、どうやら単純に Fn (ファンクション)キーと Ctrl (コントロール)キーを押し間違えていたようです。

一般的に販売されている多くのノート PC は **Ctrl Fn** の順番でキーが配置されているのに対し
ThinkPad は **Fn Ctrl** の順番でキーが配置されています。

それにより初めて ThinkPad を使った方が、普段と同じように打鍵することで押し間違いが発生していたというわけです。

また、Lenovo の PC でも Ctrl Fn の順番でキーが配置されているものもあります。

そこでいくつかのノート PC を見比べてみましたが、ThinkPad と NEC 社製の PC だけキー配置が異なりました。

![Lenovo社(ThinkPad)](images/lenovo.png)

![NEC社](images/nec.png "NEC社")

![HP社](images/hp.png "HP社")

![Dell社](images/dell.png "Dell社")

![mouse社](images/mouse.png "mouse社")

![dynabook社](images/dynabook.png "dynabook社")

![富士通社](images/fujitsu.png "富士通社")

Ctrl Fn の順番で配置されていることが圧倒的に多いことが分かります。

そんなキー配置の ThinkPad ですが実は2つのキーの機能を入れ替える機能が備わっています。

キーを入れ替える方法は2つありますのでそれぞれ紹介します。

場合によって使い分けてみてください。

### 環境
- 確認PC：Lenovo ThinkPad P14s Gen 3
- BIOS バージョン：1.34

### Lenovo Vantage を使用する方法
こちらは比較的簡単に変更が可能ですが、Lenovo Vantage のアプリが必要です。

基本的には標準インストールではありますが、何らかの理由で PC にインストールされていない場合は2つ目の方法もご検討ください。

1. Lenovo Vantage を起動し、右上の「ハンバーガーボタン🍔」>「入力およびアクセサリ」を選択

![Lenovo Vantage](images/lenovovantage.png "Lenovo Vantage")

2. 下にスクロールし、「**Fn キーと Ctr キーの入れ替え**」を ON にする

![Fn キーと Ctr キーの入れ替え](images/on.png "Fn キーと Ctr キーの入れ替え")

以上で完了です。とっても簡単ですね。

### BIOS 設定画面から変更する方法
こちらは少し手順が複雑ですが、別途アプリが必要ありません。
また、BIOS (バイオス) 画面ということもあり、使用している OS が Windows でなくても変更できます。

まず BIOS 画面を表示します。
以下は Windows OS での BISO 画面表示方法です。

※以下の手順を行うとPCが再起動します。
編集中のファイルがある場合、あらかじめ保存してください。

1. 設定を開き、「システム」>「回復」を選択
![システム設定](images/01.png "システム設定")

2. 回復オプションで「今すぐ再起動」を選択
![回復オプション](images/02.png "回復オプション")
![今すぐ再起動](images/03.png "今すぐ再起動")

3. オプションの選択で「トラブルシューティング」>「詳細オプション」
![トラブルシューティング](images/001.jpg "トラブルシューティング")
![詳細オプション](images/002.jpg "詳細オプション")

4. 詳細オプションで「UEFI ファームウェアの設定」>「再起動」と選択
![UEFI ファームウェアの設定](images/003.jpg "UEFI ファームウェアの設定")
![再起動](images/004.jpg "再起動")

5. BIOS 設定画面が開いたら「Config」>「Keyboard/Mouse」を選択
![config](images/005.jpg "config")

6. 「Fn and Ctrl Key swap」を **ON** に変更し設定を**保存**
![Fn and Ctrl Key swap](images/006.jpg "Fn and Ctrl Key swap")
![保存](images/007.jpg "保存")

以上で完了です。

PC を起動しキーの機能が入れ替わっていることを確認してください。

### さいごに
今回は ThinkPad の Fn キーと Ctrl キーの機能を入れ替える方法を紹介しました。

どなたかの悩みが解消できれば幸いです。

ではまた、リーフでした。🍃
