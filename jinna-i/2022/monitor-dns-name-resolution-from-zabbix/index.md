---
title: "[Zabbix] net.dns や net.dns.record を使って DNS の名前解決ができているか監視する"
date: 
author: jinna-i
tags: [Zabbix]
description: 
---

こんにちは、じんないです。

DNS サーバーに正引き (A レコード)・逆引き (PTR レコード) のリクエストを送り、名前解決が正常にできているかを確認したいことがあります。

今回は Zabbix Agent のアイテム `net.dns` や `net.dns.record` を使って DNS サーバーを監視する方法を紹介します。

## 想定環境

- Zabbix Server 5.0 LTS
    - Zabbix Agent 5.0 LTS

- DNS サーバー: 192.168.10.12
- 名前解決対象サーバー：test.jinna-i.net (192.168.10.99)

Zabbix Server に Zabbix Agent がインストールされているオールインワン構成を想定しています。

リクエストを送信する先の DNS サーバーは Windows でも Linux (BIND) でもどちらでも問題ありませんでした。

## レコードの有無を確認する net.dns

`net.dns` は指定した DNS サーバーに特定レコードの名前解決のリクエストを送り、その**レコードが存在する場合は `1`** を、**存在しない場合は `0`** を返すアイテムです。

フォーマットはこんな感じです。 `net.dns[<DNS サーバーの IP>,<名前解決対象のレコード>,<レコードタイプ>,<timeout>,<count>,<protocol>]`

たとえば、DNS サーバー `192.168.10.12` に対し、test.jinna-i.net の A レコードが存在するか確認する場合は下記になります。

`net.dns[192.168.10.2,jinna-i.net,A]`

※ 詳細な説明は割愛しますが <timeout>, <count>, <protocol> は省略可能です。

レコードがある場合は下記のように 1 を返します。
※ zabbix_get コマンドで Zabbix Server 上から実行しています。 

```
# レコードが存在する場合
[jinna-i@zabbix ~]$ zabbix_get -s 127.0.0.1 -k "net.dns[192.168.10.12,test.jinna-i.net,A]"
1

# レコードが存在しない場合
[jinna-i@zabbix ~]$ zabbix_get -s 127.0.0.1 -k "net.dns[192.168.10.12,test.jinna-i.net,A]"
0
```

トリガーを作成する場合は、この戻り値を判断して対象のレコードが存在するかどうかをチェックすればよいでしょう。

### 逆引き (PTR レコード) は形式に注意

逆引き (PTR レコード)をする場合はちょっと注意が必要です。

下記のように IP アドレスを指定すると、**Pointer レコードが存在するにもかかわらず '0' が返ってきます**。 

`net.dns[192.168.10.12,192.168.10.99,PTR]`

逆引きする場合は、**逆引きを表す表記 `<逆向きの IP アドレス>.in-addr.arpa.` で指定**する必要があります。

今回のケースでは、`net.dns[192.168.10.12,99.10.168.192.in-addr.arpa.,PTR]` です。

これで Pointer レコードが存在する場合は `1` が返ってきます。

```
[jinna-i@zabbix ~]# zabbix_get -s 127.0.0.1 -k "net.dns.[192.168.10.12,99.10.168.192.in-addr.arpa.,PTR]"
1
```

言われると「そうか」となるのですが、なかなか情報がなくハマりました。

## レコードの情報をそのまま取ってくる net.dns.record

`net.dns.record` は指定した DNS サーバーに特定レコードの名前解決のリクエストを送り、レコードが存在すればレコードの情報を文字列として返すアイテムです。

フォーマットは `net.dns` と同じです。


**正引き**
```
# レコードが存在する場合
[jinna-i@zabbix ~]# zabbix_get -s 127.0.0.1 -k "net.dns.record[192.168.10.12,test.jinna-i.net,A]"
test.jinna-i.net   A        192.168.10.99

# レコードが存在しない場合
[jinna-i@zabbix ~]# zabbix_get -s 127.0.0.1 -k "net.dns.record[192.168.10.12,test.jinna-i.net,A]"
ZBX_NOTSUPPORTED: Cannot perform DNS query.
```

**逆引き**
```
# レコードが存在する場合
[jinna-i@zabbix ~]# zabbix_get -s 127.0.0.1 -k "net.dns.record[192.168.10.12,99.10.168.192.in-addr.arpa.,PTR]"
99.10.168.192.in-addr.arpa PTR      test.jinna-i.net

# レコードが存在しない場合
[jinna-i@zabbix ~]# zabbix_get -s 127.0.0.1 -k "net.dns.record[192.168.10.12,99.10.168.192.in-addr.arpa.,PTR]"
ZBX_NOTSUPPORTED: Cannot perform DNS query.
```

`net.dns.record` はトリガーに使うというより、ちゃんとレコードの情報が取れているかなとモニタリング用途として使うのが良いのかなと思います。

ではまた。

## 参考
[Zabbix Manual](https://www.zabbix.com/documentation/5.0/en/manual/config/items/itemtypes/zabbix_agent)
