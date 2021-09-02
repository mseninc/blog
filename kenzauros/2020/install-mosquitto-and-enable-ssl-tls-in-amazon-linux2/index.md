---
title: EC2 の Amazon Linux 2 インスタンスに Mosquitto をインストールして SSL/TLS 認証を設定する
date: 2020-09-07
author: kenzauros
tags: [AWS, EC2, Amazon Linux 2, MQTT, Mosquitto]
---

**オープンソースの [MQTT](http://mqtt.org/) ブローカーである Mosquitto を EC2 の Amazon Linux 2 にインストール**してみます。

- [Eclipse Mosquitto](https://mosquitto.org/)

AWS にも IoT Core サービスにメッセージブローカーという MQTT ブローカーが存在しており、 TLS にも対応しているため、用途に合うようなら、こちらを利用するほうがいいかもしれません。

- [Device communication protocols - AWS IoT](https://docs.aws.amazon.com/iot/latest/developerguide/protocols.html)

## 前提条件・環境

- Amazon Linux 2
- Mosquitto 1.6.1

## Mosquitto のインストール

インストールとはいっても、 epel を有効にして、 yum でインストールするだけなので非常にお手軽です。

### インストール

```sh
$ sudo amazon-linux-extras install epel
$ sudo yum install mosquitto -y
```

### 開始・自動起動設定

systemctl start でサービスを開始し、 enable で自動起動設定をしておきます。

```sh
$ sudo systemctl start mosquitto
$ sudo systemctl enable mosquitto
```

特になにも設定しなければ標準の TCP 1883 ポートで起動します。

### 状態確認

systemctl status で状態を確認して、 `Active: active (running)` になっていれば OK です。

```sh
$ sudo systemctl status mosquitto
● mosquitto.service - Mosquitto MQTT v3.1/v3.1.1 Broker
   Loaded: loaded (/usr/lib/systemd/system/mosquitto.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2020-08-26 16:38:06 JST; 1 day 18h ago
     Docs: man:mosquitto.conf(5)
           man:mosquitto(8)
 Main PID: 18791 (mosquitto)
   CGroup: /system.slice/mosquitto.service
           └─18791 /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf
Hint: Some lines were ellipsized, use -l to show in full.
```

## 動作確認

なにはともあれ動作確認をしてみます。購読側 (subscriber) と 発行側 (publisher) で2つのターミナルを立ち上げます。

サブスクライブは `mosquitto_sub` 、パブリッシュは `mosquitto_pub` を使用します。

```sh
$ mosquitto_sub -t hoge -h localhost
```

を実行して購読状態にさせておき、別のターミナルで

```sh
$ mosquitto_pub -t hoge -h localhost -m "Hello, world"
```

のように送信して、購読側に下記のように表示されれば OK です。

```sh
Hello, world
```

## SSL/TLS による暗号化

デフォルトでは 1883 ポートで暗号化されない設定となっていますので、 **SSL/TLS での暗号化を有効にし、 8883 ポートで運用**することにします。

ここでは暗号化に自己署名の証明書を利用します。この流れでよくある「**オレオレ証明書**」です。すでに証明書がある場合は、この項は飛ばしてください。

### CA 認証局 証明書作成

#### 秘密鍵作成

まず CA の証明書を作成します。

```sh
$ sudo openssl genrsa -des3 -out ca.key 2048
Generating RSA private key, 2048 bit long modulus
................................................+++
.............................+++
e is 65537 (0x10001)
Enter pass phrase for ca.key:パスフレーズ
Verifying - Enter pass phrase for ca.key:パスフレーズ
```

秘密鍵 `ca.key` が生成されます。

#### 証明書作成

秘密鍵から証明書ファイルを生成します。 **Common name は `myca` など適当な名前**にしておきます。その他は特に入力不要です。

```sh
$ sudo openssl req -new -x509 -days 3650 -key ca.key -out ca.crt
Enter pass phrase for ca.key:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [XX]:
State or Province Name (full name) []:
Locality Name (eg, city) [Default City]:
Organization Name (eg, company) [Default Company Ltd]:
Organizational Unit Name (eg, section) []:
Common Name (eg, your name or your server's hostname) []:myca
Email Address []:
```

証明書 `ca.crt` が生成されれば OK です。

### サーバー証明書作成

#### 秘密鍵の作成

サーバーの秘密鍵を生成します。

```sh
$ sudo openssl genrsa -out server.key 2048
Generating RSA private key, 2048 bit long modulus
........................................................................................+++
........+++
e is 65537 (0x10001)
```

秘密鍵 `server.key` が生成されます。

#### CSR ファイルの作成

サーバーの秘密鍵を用いて **CSR (Certificate Signing Request; 証明書署名リクエスト)** ファイルを生成します。

こちらの **Common name には Mosquitto サーバーのホスト名**を指定します。それ以外は CA と同じくなんでもかまいません。

```sh
$ sudo openssl req -new -out server.csr -key server.key
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [XX]:JP
State or Province Name (full name) []:都道府県
Locality Name (eg, city) [Default City]:市町村
Organization Name (eg, company) [Default Company Ltd]:組織名
Organizational Unit Name (eg, section) []:部署名
Common Name (eg, your name or your server's hostname) []:ホスト名 (サーバーの FQDN など)
Email Address []:メールアドレス

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:<なし>
An optional company name []:<なし>
```

CSR `server.csr` が生成されます。

#### サーバー証明書を CA で認証

オレオレ認証局で認証したサーバー証明書を生成します。

```sh
$ sudo openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3650
Signature ok
subject=/C=JP/ST=都道府県/L=市町村/O=組織名/OU=部署/CN=ホスト名/emailAddress=メールアドレス
Getting CA Private Key
Enter pass phrase for ca.key:CA秘密鍵のパスフレーズ
```

証明書ファイル `server.crt` が生成されれば OK です。これがサーバー証明書になります。

### 証明書の配置

インストールディレクトリ (デフォルトでは `etc/mosquitto`) に移動し、 `certs` ディレクトリを作成し、 `server.crt`, `server.key`, `ca.crt` を配置します。
※コンフィグでパスを指定しますので、ディレクトリに決まりはありません。

鍵ファイルは読み取り専用にしておきます。

```sh
$ cd /etc/mosquitto/
$ sudo mkdir certs
$ sudo cp ~/server.{crt,key} ca.crt ./certs/
$ sudo chmod 400 ./certs/server.key
$ sudo chmod 444 ./certs/ca.crt
$ sudo chmod 444 ./certs/server.crt
$ ls -l /etc/mosquitto/certs/
total 12
-r--r--r-- 1 root root 1424 Aug 25 19:10 ca.crt
-r--r--r-- 1 root root 1306 Aug 25 19:09 server.crt
-r-------- 1 root root 1679 Aug 25 19:09 server.key
```

### コンフィグファイルの設定

コンフィグファイル **`/etc/mosquitto/mosquitto.conf` を修正して SSL/TLS を有効化**します。

```diff
-#port 1883
+port 8883

# "openssl rehash <path to capath>" each time you add/remove a certificate.
-#cafile
+cafile /etc/mosquitto/certs/ca.crt

# Path to the PEM encoded server certificate.
-#certfile
+certfile /etc/mosquitto/certs/server.crt

# Path to the PEM encoded keyfile.
-#keyfile
+keyfile /etc/mosquitto/certs/server.key
```

### 再起動

修正できたら Mosquitto を再起動します。

```sh
$ sudo systemctl restart mosquitto
```

ログを確認して 8883 ポートで起動していればとりあえず OK です。

```sh
$ tail -f /var/log/mosquitto/mosquitto.log
mosquitto[17422]: 1598417779: mosquitto version 1.6.10 starting
mosquitto[17422]: 1598417779: Config loaded from /etc/mosquitto/mosquitto.conf.
mosquitto[17422]: 1598417779: Opening ipv4 listen socket on port 8883.
mosquitto[17422]: 1598417779: Opening ipv6 listen socket on port 8883.
systemd[1]: Started Mosquitto MQTT v3.1/v3.1.1 Broker.
```

## ユーザー認証の設定

クライアントを**ユーザー名とパスワードで認証**するようにします。クライアント証明書を用いた認証方法もありますが、今回はユーザー名とパスワードにしました。

### ユーザーの作成

`mosquitto_passwd` コマンドでユーザーを作成します。はじめて作成するときは `-c` オプションをつけましょう。

```sh
$ sudo mosquitto_passwd -c /etc/mosquitto/mqttpass ユーザー名
Password: 
Reenter password: 

$ cat /etc/mosquitto/mqttpass 
ユーザー名:$6$7Y/7oiQLgaDcU53W$+pMc7mdqxO8JRlGEWw5qWY9iVXt4KkSYxauKvniEL87KT+2DS9HhivxuY5MEmxo80O22YYCb/E01NjbqpCNVfg==
```

パスワードファイルが生成されてユーザー名とハッシュ化されたパスワードが記録されていれば OK です。

他にユーザーが必要な場合は、同様にして追加します (`-c` オプションは不要です)。

### コンフィグファイルの修正

`/etc/mosquitto/mosquitto.conf` を下記のように修正します。

```diff
-#allow_anonymous true
+allow_anonymous false

-#password_file
+password_file /etc/mosquitto/mqttpass
```

これで**匿名認証が無効**になり、パスワードファイルに記載されたユーザー名とパスワードで認証されるようになります。

Mosquitto を再起動しておきます。

```sh
$ sudo systemctl restart mosquitto
```

## 動作確認

暗号化設定前と同様に mosquitto_sub/mosquitto_pub で動作確認します。

ポートを `-p 8883` で指定するほか、 `--cafile` で CA の証明書のパス、 `-u` でユーザー名、 `-P` でパスワードを指定します。

```sh
$ mosquitto_sub -t hoge -h ホスト名 -p 8883 --cafile /etc/mosquitto/certs/ca.crt -u ユーザー名 -P パスワード
```

を実行して購読状態にさせておき、別のターミナルで

```sh
$ mosquitto_pub -t hoge -m "Hello, encrypted world" -h ホスト名 -p 8883 --cafile /etc/mosquitto/certs/ca.crt -u ユーザー名 -P パスワード
```

のように送信して、購読側に下記のように表示されれば OK です。

```sh
Hello, encrypted world
```

ちなみに**ホスト名はサーバー証明書の Common name で入力した名前**でなければ接続できないはずです。無視して接続する際は `--insecure` オプションをつけるとよいそうです。
