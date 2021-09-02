---
title: "[CentOS7] カーネルがハングアップしているので修復した"
date: 2017-04-17
author: norikazum
tags: [CentOS, Linux]
---

こんばんは。

先日、社内サーバを一斉に再起動するとあるサーバーが起動していないことが分かりました。
ESXi上の仮想マシンですが、コンソールを眺めていると、以下のメッセージが不定期に出力されていました。

`"echo 0 > /proc/sys/kernel/hung_task_timeout_secs" disables this message.`

![](images/centos-fix-kernel-hang-up-1.png)

## 対処
エラーにある、**dm-0** という部分はLVMのデバイス名なので、以下のコマンドを利用してどのパーティションかを特定します。

`# cat /sys/block/dm-0/name`

![](images/centos-fix-kernel-hang-up-2.png)

結果は、**centosroot** とでました。

おっとroot領域・・・。
ちなみに、dm-1 はswap領域でした。

エラーメッセージを素直に読み取って、`echo 0 > /proc/sys/kernel/hung_task_timeout_secs` を反映します。
実行するコマンドは、`echo 0 /proc/sys/kernel/hung_task_timeout_secs > /etc/sysctl.conf` です。

実行後、再起動します。

## あとがき
対処療法かもしれませんが、、こちらの環境ではこれで改善しました。
それでは次回の記事でお会いしましょう。