---
title: Linuxでポート番号からプロセスIDを調べる方法
date: 2016-06-15
author: norikazum
tags: [Linux]
---

HTTPサービスであればTCP 80番ポート、HTTPS(SSL)サービスであればTCP 443番ポートのように、サーバサービスはそれぞれのポートの待ち受けをしているケースが多いと思います。

ポート番号の説明は、[ウィキペディア](https://ja.wikipedia.org/wiki/TCP%E3%82%84UDP%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8B%E3%83%9D%E3%83%BC%E3%83%88%E7%95%AA%E5%8F%B7%E3%81%AE%E4%B8%80%E8%A6%A7)に任せるとして、待ち受けているポート番号が一体どのプロセスで動いているのか分からない・・・といった自体に遭遇することがあります。

そういったケースでの調査方法の流れについて説明したいと思います。

## シナリオ

35604ポートは一体どんなプロセスなのか？というケースを考えてみます。

```
# netstat -tanu
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:35604           0.0.0.0:*               LISTEN
・・・省略
```

などの方法で35604/tcpが待ち受けていることが分かったとします。

## 調査手順

`lsof -n -P -i:調べたいポート番号` というコマンドを使います。今回のシナリオに当てはめるとこうなります。

```
# lsof -n -P -i:35604
COMMAND     PID    USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
rpc.statd 26694 rpcuser    9u  IPv4 11730835      0t0  TCP *:35604 (LISTEN)
```

上記の調査で、rpc.statd というプロセスID26694が該当するということが分かりました。

### 調査で分かったサービスを強制停止する場合

通常は、`service`コマンドや、`systemctl`コマンドでサービスを停止させることが好ましいですが、前項で判明したプロセスIDを強制的に停止する場合は以下の流れで実施します。

プロセスIDを確認する。

```
# ps -ef | grep 26694
root     11460 14276  0 22:34 pts/0    00:00:00 grep --color=auto 26694
rpcuser  26694     1  0  3月19 ?      00:00:00 /usr/sbin/rpc.statd --no-notify
```

プロセスを強制停止する。

```
# kill -9 26694
```