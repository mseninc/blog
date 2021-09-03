---
title: "[zabbix 4.0] アクティブチェックが失敗するときの確認点"
date: 2019-04-25
author: jinna-i
tags: [zabbix]
---

こんにちは、じんないです。

Zabbix サーバーからアクティブチェックの監視項目を増やそうとしたときになかなか値が取得できず、ハマってしまったのでメモしておきます。アクティブではない普通の監視(パッシブという)では何ら問題なかったのですが、少し繊細なようですね。

アクティブチェックとパッシブチェックについて少し触れておきます。

**アクティブチェック**

  - 通信の方向: zabbix_agent → zabbix_server
  - 値の取得: エージェントがサーバーにチェックリストの一覧をもらいに行き、それに対応する値を送信
  - ポート: サーバー側で 10051/TCP が開いていれば OK
  - 用途: ログ監視等

**パッシブチェック**

  - 通信の方向: zabbix_server → zabbix_agent
  - 値の取得: サーバーがエージェントに対してリクエストを送信し、それに対応する値を返す
  - ポート: エージェント側で 10050/TCP が開いていれば OK
  - 用途: ステータス、リソース監視等

詳しい話は[公式ドキュメント](https://www.zabbix.com/documentation/2.0/jp/manual/appendix/items/activepassive)を参照してください。

## 環境
- Zabbix 4.0.7 (TLS)
  - CentOS 7 上に構築
- 通信に使うポートはデフォルト
  - Server: 10051/TCP
  - Client: 10050/TCP
  ※ ファイアウォールはそれぞれ開放済みとする

## 確認点

### エージェント側で active check がエラーなく起動しているか

アクティブチェックに失敗する場合、まずはエージェントのログで問題がないかをチェックします。

- Windows: `C:\＜展開場所＞\zabbix_agentd.log`
- Linux: `/var/log/zabbix/zabbix_agentd.log`

**ダメなときは以下のメッセージが出ています**。これが出てる場合はサーバーとエージェントとの通信ができていません。アイテムやトリガーではなく、設定 (config) に問題があるんだと思ってください。
> active check configuration update from [＜zabbix server の IP＞:10051] started to fail (cannot connect to [[＜zabbix server の IP＞]:10051]: Connection refused.)

**OK なときはこんなメッセージです**
> agent #5 started [active checks #1]

### エージェント側のホスト名と Zabbix Server に登録されているホスト名が大文字小文字含めて合っているか

たとえば、`zabbix_agentd.conf` に `Hostname=Host01` と書いていて、サーバー側のホスト登録の時に `host01` となっていた場合はダメです。
こうなっていた場合は同じになるよう設定してください。

`HostnameItem=system.hostname` で自動取得している場合は要注意です。Windows の場合ではすべて大文字になるようです。

**ダメなときはこんなメッセージが出ます**
> no active checks on server [＜zabbix server の IP＞:10051]: host [＜エージェントのホスト名＞] not found

### サーバーの ListenIP を明示的に指定しているか

サーバー側の設定でリッスンする IP を明示的に指定しているか確認します。ここでは `127.0.0.1` のようなループバックアドレスではなく、エージェントで指定している IP アドレスを指定します。

- `/etc/zabbix/zabbix_server.conf`
```bash
### Option: ListenIP
#       List of comma delimited IP addresses that the trapper should listen on.
#       Trapper will listen on all network interfaces if this parameter is missing.
#
# Mandatory: no
# Default:
# ListenIP=0.0.0.0

ListenIP=＜zabbix server の IP＞
```

エージェント側の `ServerActive=＜zabbix server の IP＞` で指定する IP アドレスと合わせておく必要があります。

※ デフォルトが、`ListenIP=0.0.0.0` なんで問題なさそうな気はするのですが・・・。またわかれば追記します。

ではまた。

## 参考
[サーバーログにfailed : host \[\] not foundが出力されます | 日本Zabbixユーザー会](http://www.zabbix.jp/node/779)
[zabbix-agentのactive checkが動作しない。 - shig**のブログ](https://blog.goo.ne.jp/shigen417/e/2ca73de8a50e9c7978151d9344cf98d1)
