---
title: Raspberry Pi で DDNS + L2TP VPN サーバーを作る
date: 2021-05-31
author: kenzauros
tags: [その他, ライフハック]
---

[Raspberry Pi Imager を使って Raspberry Pi OS をインストールする (ヘッドレスインストール対応 2020年6月版)](/install-raspberry-pi-os-with-raspberry-pi-imager/)


### no-IP (DDNS 設定)

```sh
wget http://www.noip.com/client/linux/noip-duc-linux.tar.gz
sudo tar zxvf noip-duc-linux.tar.gz
cd noip-2.1.9-1/
sudo make
sudo make install
sudo cp debian.noip2.sh /etc/init.d/noip2
sudo chmod +x /etc/init.d/noip2
sudo vi /etc/rc.lcal
sudo /etc/init.d/noip2 stop
sudo /usr/local/bin/noip2 -C
sudo /etc/init.d/noip2 start
sudo /usr/local/bin/noip2 -S
```

### L2TP VPN

```sh
sudo apt-get install strongswan xl2tpd
/usr/lib/ipsec/charon --version
xl2tpd --version
sudo vi /etc/ipsec.conf
```

[RaspberryPi3をDDNS+OpenVPNサーバにするまでの備忘録 - Qiita](https://qiita.com/tororu/items/aabf609a5f7e6dfc7485)
[Raspberry Pi L2TP/IPsec VPNサーバの構築 | Ingenious Site](https://www.ingenious.jp/raspberry-pi/l2tp-ipsec-vpn/)