---
title: "[FortiGate] SSL VPN に二要素認証 (Slack) を設定する"
date: 2023-03-08
author: jinna-i
tags: [FortiGate]
description: "FortiGate 60F で SSL VPN に二要素認証を設定してみます"
---

こんにちは、じんないです。

昨今のコロナ禍によるテレワークの増加に伴い、VPN を使用して社内の環境へアクセスするケースも増加しています。また、それに伴って **VPN 装置の脆弱性を悪用した攻撃も増加**しています。

[2023年も続くランサムウエア攻撃の脅威、狙われ続ける病院とVPN装置 | 日経クロステック（xTECH）](https://xtech.nikkei.com/atcl/nxt/column/18/02294/00005/)

脆弱性への対処として最新のパッチを適用することももちろんですが、**VPN 接続のセキュリティを向上させることも必須**と言えるのではないでしょうか。

今回は FortiGate 60F で SSL VPN に二要素認証を設定してみます。二要素認証に必要なトークンは **Slack** (メール経由) へ通知させてみようと思います。

## 想定環境

- FortiGate 60F
- Forti OS v6.4.11
- FortiClient VPN 7.0.7.0345
- Slack を利用している

すでに ユーザ名・パスワードによる SSL VPN が構成されていることを前提としています。

## 準備
### SMTP サーバの設定

まず、トークンを送信するために **SMTP サーバの設定が必要**です。

FortiGate の Web インタフェースへログインし左ペイン `システム > 設定` から SMTP サーバを設定します。

![](images/005.png)


### Slack メールアドレスの取得

Slack を開きトークン受信用のメールアドレスを取得します。お持ちのメールアドレスでもかまいません。

自分のダイレクトメッセージチャンネルの右クリックメニューから、`会話の詳細を表示する` を開きます。

![](images/001.png)

インテグレーションタブから `この会話にメールを送信する` をクリックします。

![](images/002.png)

自分のチャンネルへ投稿されるメールアドレスを取得します。後で使用しますのでメモしておきましょう。**このメールアドレスは後からでも参照できます**。

![](images/003.png)


## 二要素認証の設定
### ユーザ定義の設定

左ペイン `ユーザ&認証 > ユーザ定義` から `新規作成` をクリックします。

![](images/004.png)

今回は LDAP ユーザを設定します。このあたりはお使いの環境に合わせて読み替えてください。

`リモート LDAP ユーザ` を選択し次へ進みます。

![](images/006.png)

認証先の LDAP サーバを指定し、次へ進みます。

![](images/007.png)

二要素認証を設定するユーザを選択し、右クリックメニューから `選択したものを追加` します。

![](images/008.png)

### 二要素認証の有効化とメールアドレスの設定

ターミナルソフトから FortiGate のコマンドラインインタフェースへログインします。

※ E メールベースの二要素認証は**コマンドラインインタフェースからのみ**有効化できるようです。

以下のコマンドを入力し二要素認証の有効化とトークン送付先のメールアドレスを設定します。

```
fw1 # config user local

fw1 (local) # edit <ユーザ名>

fw1 (ユーザ名) # set two-factor email

fw1 (ユーザ名) # set email-to <Slack のメールアドレス>

fw1 (ユーザ名) # end
```

ユーザの数だけ繰り返し設定します。

Web インタフェースへ戻り、前項で作成したユーザの編集画面を開きます。**E メールベースの二要素認証が有効化**され、メールアドレスが設定されていることが確認できます。

![](images/009.png)


## 動作確認

通常どおり FortiClient VPN からユーザ名とパスワードを入力し接続します。

![](images/010.png)

するとトークンを入力する項目が表示されるので Slack に通知されるトークンを入力し、OK をクリックします。

![](images/011.png)

Slack へはこのように通知されます。

![](images/012.png)

入力したトークンに誤りがなければ接続が完了します。

![](images/013.png)

## トークンの有効期限が切れる場合

メールの遅延やトークンの入力間違い等で二要素認証に失敗し接続できないことがあります。**トークンの有効期限は60秒**です。

FortiGate のコマンドラインインタフェースから以下のコマンドを実行することでトークンの有効期限を延長できます。

今回の例ではタイムアウトを120秒に設定しました。

```bash
fw1 # config system global

fw1 (global) # set remoteauthtimeout 120

fw1 (global) # set two-factor-email-expiry 120

fw1 (global) # end
```

今のところデフォルトでも特に問題なく接続できていますが、時間切れになる場合は試してみてはどうでしょうか。

ではまた。

## 参考

- [Emailを使ったワンタイムパスワード設定～FortiGateのVPNで使える二要素認証～｜技術ブログ｜C&S ENGINEER VOICE](https://licensecounter.jp/engineer-voice/blog/articles/20210129__fortigatevpn_emailfortitoken.html)
- [Troubleshooting Tip: SSL-VPN and two-factor expiry... - Fortinet Community](https://community.fortinet.com/t5/FortiGate/Troubleshooting-Tip-SSL-VPN-and-two-factor-expiry-timers/ta-p/191661?externalID=FD47443)
