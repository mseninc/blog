---
title: "VoIP を実現する SIP とは？"
date:
author: hiratatsu04
tags: [SIP,ネットワークスペシャリスト]
description: ""
---

こんにちは、ひらたつです。

前回に引き続き、ネットワークスペシャリストの知識に関する記事です。

前回は第1回で、「[Ethernet のフレームフォーマットと各領域の説明](https://mseeeen.msen.jp/network-specialist-ethernet-frame-format/)」と題して Ethernet のフレームフォーマットについての記事を書きました。

流れ的に今回は *IP パケット* といきたかったのですが、学習に使っている本 ([情報処理教科書 ネットワークスペシャリスト 2023年版（ICTワークショップ）｜翔泳社の本](https://www.shoeisha.co.jp/book/detail/9784798177571)) では先に SIP (Session Initiation Protocol) が出てきました。

SIP が初耳で、尚且つ内容が良くわからず色々と調べて理解しましたのでその内容を整理しています。

同じようにネットワークスペシャリストを目指してる方の参考になれば幸いです。

## SIP とは？

> SIP (Session Initiation Protocol) とは **セッションを制御する** プロトコルであり、データの転送には主に *RTP (Real-time Transport Protocol)* が用いられる。  
> RTP などのデータ転送で必要な情報の記述には *SDP (Session Description Protocol)* が用いられる。

というような説明が多くの記事、本でされていますが、私は良く分かりませんでした。  
この文を読んで SIP、RTP、SDP の役割が分かれば以下の説明を読む必要はないかも知れません。（笑）

**SIP はセッションを制御するプロトコルであり、データを転送するわけではない。**

ここが私の中では非常に大切でした。

イメージは以下です。



SIP は **セッションの開始と終了のみを管理** して、データは別のプロトコルでやり取りされます。

データの通信で主に用いられるのが **RTP (Real-time Transport Protocol)** です。  
RTP の通信には相手の IP アドレスやポート番号、音声の圧縮方式の情報が必要です。

これらの情報を SIP でやり取りします。

ただ、SIP 自体はセッション制御だけの役割しかなく、IP アドレスやポート番号、音声の圧縮方式の情報をどう SIP フォーマットの中に記載するかのルールは決まっていません。  
この記載ルールを決めているのが **SDP (Session Description Protocol)** です。

従って、より正確なイメージは以下です。



このイメージや SDP については [SIP のフレーム構造](#sip-のフレーム構造) で詳細に整理します。

まとめると SIP は以下の特徴があります。
- セッションを制御する
- RTP を用いる時などに相手のIPアドレスやポート番号、サポートしている圧縮方式をハンドシェイクする


### RTP とは？

> RTP (Real-time Transport Protocol) は TCP/IP ネットワーク上で音声や動画のように連続するデータの流れをリアルタイムに伝送するための通信プロトコルです。
> <cite>[RTP/RTCPとは？【第2回】RTP/RTCPパケットにはどんな情報が含まれているか｜TECHブログ | 株式会社PALTEK](https://www.paltek.co.jp/techblog/techinfo/230201_01)</cite>

RTP は UDP を用いるアプリケーション層のプロトコルです。

プロトコルスタックは下図です。




RTP は UDP を用いますが、TCP を用いる RTSP (Real Time Streaming Protocol) もあるみたいです。  
詳細は別の機会で整理できたらと思います。

### プロトコルスタックでの位置付け

SIP は TCP/IP モデルの「アプリケーション層」に該当します。

従って、UDP か TCP を使用されますが、デフォルトでは UDP が使用されます。

また、SDP は SIP で用いられます。



### SIP は何に使われている？

> 現在の主な用途は電話、テレビ電話やインスタント・メッセージングのような双方向のリアルタイム通信である。
>
> <cite>[Session Initiation Protocol - Wikipedia](https://ja.wikipedia.org/wiki/Session_Initiation_Protocol)</cite>

SIP はセッションの制御を行うプロトコルですので、双方向の通信で用いられるみたいです。

Zoom や Skype、Line 電話などで VoIP (Voice over Internet Protocol) が使われていますが、VoIP にも SIP が使われています。

- Zoom

> Zoom の VoIP 電話サービス
> Zoom Phone は VoIP 業界のリーダーです。 Zoom Phone があれば、企業はコミュニケーション システムを最新化して、コストを削減し、生産性を向上させ、よりよいビジネス成果を達成することができます。
> 
> <cite>[VoIP 電話とは | Zoom](https://explore.zoom.us/ja/what-is-voip-phone/)</cite>

- Skype や Line 電話

> 　スマートフォンの普及に伴い、米Microsoftの「Skype」といったサービスだけでなく、NTTコミュニケーションズが提供する「050 plus」（関連記事）やNHN Japanの「LINE」（関連記事）など、音声通話ができる数多くのサービスが登場しています。これらのサービスは、従来の電話サービスが採用している回線交換方式ではなく、VoIP（Voice over IP）技術を用いたデータ通信による音声通話を可能としています。
> 
> <cite>[LINEやcommの通話の仕組みを解析―準備編 | 日経クロステック（xTECH）](https://xtech.nikkei.com/it/article/COLUMN/20121108/435987/)>

## SIP のフレーム構造

SIP のフレーム構造は下図です。



### 1. スタートライン

SIP の通信は、リクエストとレスポンスがのやり取りで行われます。

このリクエストとレスポンスは HTTP 

#### リクエスト

SIPメソッド | 説明
-- | --
INVITE | セッション開始要求
ACK | セッション確立の確認
BYE | セッション終了
CANCEL | セッション確立のキャンセル
REGISTER | 情報の登録
OPTIONS | サーバ機能問い合わせ
PRACK | 暫定応答に対する確認
INFO | セッション内の情報通知
SUBSCRIBE | イベントの通知要請
NOTIFY | 要請されたイベントの通知
MESSAGE | テキストメッセージなどの送信
UPDATE | セッションの変更
PUBLISH | ステータス情報の通知
REFER | 転送指示

#### レスポンス

ステータス | コード | メッセージ | 応答内容
-- | -- | -- | --
100～199：暫定応答（経過情報） | 100 | Trying | 暫定応答
180 | Ringing | 呼び出し中
200～299：成功応答 | 200 | OK | リクエスト成功
300～399：転送応答 | 301 | Moved   Permanently | 恒久的に移動した
302 | Moved   Temporary | 一時的に移動した
400～499：リクエストエラー | 400 | Bad   Request | リクエストが不正な構文
401 | Unauthorized | ユーザ認証が必要
403 | Forbidden | 禁止されている
404 | Not   Found | 見つからなかった
486 | Busy   Here | ビジー状態である（通話中など）
487 | Request   Terminated | リクエストが終了させられた
500～599：サーバーエラー | 500 | Server   Internal Error | サーバー内部エラー
503 | Service   Unavailable | サーバー利用不可
600～699：グローバルエラー | 600 | Busy   Everywhere | どの場所もビジー
603 | Decline | どの端末も参加できない

### 2. ヘッダ



### 3. ボディ



### SDP とは？

## SIP シーケンス (基本)


## SIP シーケンス (VoIP)



