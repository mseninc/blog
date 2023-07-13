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



具体的な中身は下図のようになっています。

- リクエスト例



- レスポンス例


スタートラインに SIP メソッドなどが記載されており、ヘッダにリクエストの着信先や生成元、リクエストが経由したパスなどが記載されます。

ボディには、RTP で使う IP アドレスやポート番号、音声の圧縮方式などの情報が記載されます。  
このボディの記載方法は SIP では規定されておらず、SDP で決められています。

### 1. スタートライン

SIP の通信は、リクエストとレスポンスのやり取りで行われます。

SIP は HTTP を例に設計されたらしく、リクエストとレスポンスという仕組みは HTTP と同じになっています。

<table>
<caption>リクエスト</caption>
	<tr>
		<td>SIPメソッド</td>
		<td>説明</td>
	</tr>
	<tr>
		<td>INVITE</td>
		<td>セッション開始要求</td>
	</tr>
	<tr>
		<td>ACK</td>
		<td>セッション確立の確認</td>
	</tr>
	<tr>
		<td>BYE</td>
		<td>セッション終了</td>
	</tr>
	<tr>
		<td>CANCEL</td>
		<td>セッション確立のキャンセル</td>
	</tr>
	<tr>
		<td>REGISTER</td>
		<td>情報の登録</td>
	</tr>
	<tr>
		<td>OPTIONS</td>
		<td>サーバ機能問い合わせ</td>
	</tr>
	<tr>
		<td>PRACK</td>
		<td>暫定応答に対する確認</td>
	</tr>
	<tr>
		<td>INFO</td>
		<td>セッション内の情報通知</td>
	</tr>
	<tr>
		<td>SUBSCRIBE</td>
		<td>イベントの通知要請</td>
	</tr>
	<tr>
		<td>NOTIFY</td>
		<td>要請されたイベントの通知</td>
	</tr>
	<tr>
		<td>MESSAGE</td>
		<td>テキストメッセージなどの送信</td>
	</tr>
	<tr>
		<td>UPDATE</td>
		<td>セッションの変更</td>
	</tr>
	<tr>
		<td>PUBLISH</td>
		<td>ステータス情報の通知</td>
	</tr>
	<tr>
		<td>REFER</td>
		<td>転送指示</td>
	</tr>
</table>



<table>
<caption>レスポンス</caption>
	<tr>
		<td>ステータス</td>
		<td>コード</td>
		<td>メッセージ</td>
		<td>応答内容</td>
	</tr>
	<tr>
		<td rowspan="2">暫定応答（経過情報）<br>(コード：100～199)</td>
		<td>100</td>
		<td>Trying</td>
		<td>暫定応答</td>
	</tr>
	<tr>
		<td>180</td>
		<td>Ringing</td>
		<td>呼び出し中</td>
	</tr>
	<tr>
		<td>成功応答<br>(コード：200～299)</td>
		<td>200</td>
		<td>OK</td>
		<td>リクエスト成功</td>
	</tr>
	<tr>
		<td rowspan="2">転送応答<br>(コード：300～399)</td>
		<td>301</td>
		<td>Moved Permanently</td>
		<td>恒久的に移動した</td>
	</tr>
	<tr>
		<td>302</td>
		<td>Moved Temporary</td>
		<td>一時的に移動した</td>
	</tr>
	<tr>
		<td rowspan="6">リクエストエラー<br>(コード：400～499)</td>
		<td>400</td>
		<td>Bad Request</td>
		<td>リクエストが不正な構文</td>
	</tr>
	<tr>
		<td>401</td>
		<td>Unauthorized</td>
		<td>ユーザ認証が必要</td>
	</tr>
	<tr>
		<td>403</td>
		<td>Forbidden</td>
		<td>禁止されている</td>
	</tr>
	<tr>
		<td>404</td>
		<td>Not Found</td>
		<td>見つからなかった</td>
	</tr>
	<tr>
		<td>486</td>
		<td>Busy Here</td>
		<td>ビジー状態である（通話中など）</td>
	</tr>
	<tr>
		<td>487</td>
		<td>Request Terminated</td>
		<td>リクエストが終了させられた</td>
	</tr>
	<tr>
		<td rowspan="2">サーバーエラー<br>(コード：500～599)</td>
		<td>500</td>
		<td>Server Internal Error</td>
		<td>サーバー内部エラー</td>
	</tr>
	<tr>
		<td>503</td>
		<td>Service Unavailable</td>
		<td>サーバー利用不可</td>
	</tr>
	<tr>
		<td rowspan="2">グローバルエラー<br>(コード：600～699)</td>
		<td>600</td>
		<td>Busy Everywhere</td>
		<td>どの場所もビジー</td>
	</tr>
	<tr>
		<td>603</td>
		<td>Decline</td>
		<td>どの端末も参加できない</td>
	</tr>
</table>

### 2. ヘッダ

リクエストの着信先や生成元、リクエストが経由したパスなどが記載されます。

パラメータ | 内容
-- | --
Call-ID | ユニーク ID であり、セッションの識別に使用される
To | リクエストの着信先 URI
From | リクエストの生成元 URI
Contact | 以後、自分へのリクエストを送ってほしい URI
Cseq | 同一 Call-ID で何個目のリクエストかを表示
Via | リクエストが経由してきた経路。レスポンスを転送する経路として使われる。
Content-Type | ボディメッセージの MIME タイプ
Content-Length | ボディの長さ（バイト数）

※ URI (Uniform Resource Identifier) とは URL (Uniform Resource Locator) と URN (Uniform Resource Name) の総称

※ Content-Type は例として以下がある。
INVITE リクエスト：application/SDP
NOTIFY リクエスト：application/xpidftxml or application/cpim-pidftxml
MESSAGE リクエスト：text/plain

### 3. ボディ

ボディの記載方法について SIP では MIME (Multipurpose Internet Mail Extensions) 形式で記載することのみを規定しています。

具体的にどのように記載されるかは、使用する MIME Type に依存します。

使用される MIME は SDP (Session Description Protocol) が

[MIME Type一覧](https://manual.iij.jp/cwh/manual/37913919.html)

### SDP とは？

## SIP シーケンス (基本)


## SIP シーケンス (VoIP)



