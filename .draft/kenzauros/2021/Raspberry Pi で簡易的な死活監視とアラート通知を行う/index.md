---
title: Raspberry Pi で簡易的な死活監視とアラート通知を行う
date: 2021-05-31
author: kenzauros
tags: [その他, ライフハック]
---


```sh
#!/bin/bash

try=3
ip_addresses="192.168.0.250 192.168.0.252 192.168.0.253"
mail_to="kenz@tinyjoker.net"
headers="References: <E1kgyqd-0004Lv-NB@gateway>"

errors=()
for ip in ${ip_addresses}
do
        ping ${ip} -c ${try}
        if [ $? -eq 1 ]; then
                if [ -e /tmp/pingfile${ip}.tmp ]; then
                        echo "TMP file already exsists"
                else
                        touch /tmp/pingfile_${ip}.tmp
                        errors+=(${ip})
                fi
        else
                rm -f /tmp/pingfile_${ip}.tmp
        fi
done

if [ ${#errors[@]} -ne 0 ]; then
        # Error
        echo ${errors} | mail -a"${headers}" -s"[ERROR] Unreacheable" ${mail_to}
else
        # Succeeded
        if [ ${NOTIFY_ANYWAY:-0} -eq 1 ]; then
                echo ${ip_addresses} | mail -a"${headers}" -s"[INFO] Available" ${mail_to}
        fi
fi

exit 0
```
- [決まった時間に処理する | Make.](http://make.bcde.jp/raspberry-pi/%E6%B1%BA%E3%81%BE%E3%81%A3%E3%81%9F%E6%99%82%E9%96%93%E3%81%AB%E5%87%A6%E7%90%86%E3%81%99%E3%82%8B/)