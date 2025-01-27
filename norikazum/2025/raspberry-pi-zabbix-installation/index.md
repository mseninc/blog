---
title: "Raspberry PiにZabbixをインストールする方法"
date: 
author: norikazum
tags: [Raspberry Pi,Zabbix]
description: ""
---

こんにちは。

Raspberry PiにZabbixをインストールしようとした際に、公式リポジトリからのインストールでエラーが発生し、ソースからのビルドが必要になりました。本記事では、インストール流れについて解説します。

具体的には、以下のようなエラーが表示され、Zabbix公式リポジトリがRaspberry Piのアーキテクチャ（armhfやarm64）をサポートしていないことが原因であることが判明しました。

```
N: リポジトリ 'https://repo.zabbix.com/zabbix/7.0/debian bookworm InRelease' がアーキテクチャ 'armhf' をサポートしないため設定ファイル 'main/binary-armhf/Packages' の取得をスキップ
N: リポジトリ 'https://repo.zabbix.com/zabbix/7.0/debian bookworm InRelease' がアーキテクチャ 'arm64' をサポートしないため設定ファイル 'main/binary-arm64/Packages' の取得をスキップ
W: http://raspbian.raspberrypi.com/raspbian/dists/bookworm/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
```

利用した Raspberry Pi OS は以下のとおりです。

```
# cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
NAME="Debian GNU/Linux"
VERSION_ID="12"
VERSION="12 (bookworm)"
VERSION_CODENAME=bookworm
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

## 必要なソフトウェアのインストール
各ソフトウェアを以下のコマンドを利用してインストールします。

### Apache のインストールと起動
```
apt install apache2
systemctl enable apache2
systemctl start apache2
```

### PHP のインストール
```
apt install php php-gd php-bcmath php-xml php-mbstring php-ldap php-mysql php-curl php-fpm
```

### mariadb のインストールと初期化
```
apt install mariadb-server
mysql_secure_installation

```

`mysql_secure_installation` は以下の流れで進めます。

```
# mysql_secure_installation

NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!

In order to log into MariaDB to secure it, we'll need the current
password for the root user. If you've just installed MariaDB, and
haven't set the root password yet, you should just press enter here.

Enter current password for root (enter for none):
OK, successfully used password, moving on...

Setting the root password or using the unix_socket ensures that nobody
can log into the MariaDB root user without the proper authorisation.

You already have your root account protected, so you can safely answer 'n'.

Switch to unix_socket authentication [Y/n] Y
Enabled successfully!
Reloading privilege tables..
 ... Success!


You already have your root account protected, so you can safely answer 'n'.

Change the root password? [Y/n] Y
New password:
Re-enter new password:
Password updated successfully!
Reloading privilege tables..
 ... Success!


By default, a MariaDB installation has an anonymous user, allowing anyone
to log into MariaDB without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.

Remove anonymous users? [Y/n] Y
 ... Success!

Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? [Y/n] Y
 ... Success!

By default, MariaDB comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.

Remove test database and access to it? [Y/n] Y
 - Dropping test database...
 ... Success!
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

Reload privilege tables now? [Y/n] Y
 ... Success!

Cleaning up...

All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!
```

設定したパスワードでログインできることを確認します。
```
# mysql -u root -p
Enter password:
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 41
Server version: 10.11.6-MariaDB-0+deb12u1 Debian 12

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>
```

## Zabbix の 構築

### ソースのダウンロードと配置

Zabbix のソースをダウンロードします。
今回のバージョンは、7.0LTS です。

```
curl -O https://cdn.zabbix.com/zabbix/sources/stable/7.0/zabbix-7.0.8.tar.gz
tar xvfz zabbix-7.0.8.tar.gz
mv zabbix-7.0.8 /usr/local/src/
```

### ユーザーの作成

```
addgroup --system --quiet zabbix
adduser --quiet --system --disabled-login --ingroup zabbix --home /var/lib/zabbix --no-create-home zabbix
```

### 必要なモジュールのインストール

```
apt install libpcre3-dev libevent-dev libmariadb-dev libcurl4-openssl-dev libssh2-1-dev libsnmp-dev libopenipmi-dev libxml2 libxml2-dev libldap2-dev golang gettext
```

### ビルドとインストール
※ 今回は `--enable-server` `--enable-agent` `--enable-proxy` でインストールしていますが必要に応じて調整ください。※他のモジュールも同様。

```
cd /usr/local/src/zabbix-7.0.8/
./configure --enable-server --enable-agent --enable-proxy --with-mysql --enable-ipv6 --with-net-snmp --with-libcurl --with-libxml2 --with-openipmi --with-ssh2 --with-ldap
make
make install
```

### ログフォルダの作成
mkdir /var/log/zabbix
chown zabbix:zabbix /var/log/zabbix

## プロセスフォルダの作成
mkdir /var/run/zabbix

## DB の初期化

### DB の作成
DB名: zabbix
DBユーザー名: zabbix
パスワード: password

```
create database zabbix character set utf8mb4 collate utf8mb4_bin;
create user 'zabbix'@'localhost' identified by 'password';
grant all privileges on zabbix.* to 'zabbix'@'localhost';
SET GLOBAL log_bin_trust_function_creators = 1;
```

### スキーマーのインポート
```
cd /usr/local/src/zabbix-7.0.8/database/mysql
cat schema.sql  | mysql -u zabbix -p -D zabbix
cat images.sql  | mysql -u zabbix -p -D zabbix
cat data.sql  | mysql -u zabbix -p -D zabbix
```

### log_bin_trust_function_creators の無効化
```
mysql -u root -p
SET GLOBAL log_bin_trust_function_creators = 0;
quit;
```

### php.ini の調整
以下のDiffのとおり `/etc/php/8.2/apache2/php.ini` を設定します。

```diff
--- /etc/php/8.2/apache2/php.ini.org    2025-01-27 13:13:25.575836891 +0900
+++ /etc/php/8.2/apache2/php.ini        2025-01-27 13:15:07.139999729 +0900
@@ -406,7 +406,7 @@
 ; Maximum execution time of each script, in seconds
 ; https://php.net/max-execution-time
 ; Note: This directive is hardcoded to 0 for the CLI SAPI
-max_execution_time = 30
+max_execution_time = 300

 ; Maximum amount of time each script may spend parsing request data. It's a good
 ; idea to limit this time on productions servers in order to eliminate unexpectedly
@@ -416,7 +416,7 @@
 ; Development Value: 60 (60 seconds)
 ; Production Value: 60 (60 seconds)
 ; https://php.net/max-input-time
-max_input_time = 60
+max_input_time = 300

 ; Maximum input variable nesting level
 ; https://php.net/max-input-nesting-level
@@ -700,7 +700,7 @@
 ; Its value may be 0 to disable the limit. It is ignored if POST data reading
 ; is disabled through enable_post_data_reading.
 ; https://php.net/post-max-size
-post_max_size = 8M
+post_max_size = 16M

 ; Automatically add files before PHP document.
 ; https://php.net/auto-prepend-file
@@ -852,7 +852,7 @@

 ; Maximum allowed size for uploaded files.
 ; https://php.net/upload-max-filesize
-upload_max_filesize = 2M
+upload_max_filesize 16M

 ; Maximum number of files that can be uploaded via a single request
 max_file_uploads = 20
 ```

### Zabbix の起動

```
# zabbix_server
#
```

### ui 整備

以下の流れで実施します。
```
mkdir /var/www/html/zabbix
cd /usr/local/src/zabbix-7.0.8/ui
cp -a . /var/www/html/zabbix
chown -R www-data:www-data /var/www/html/zabbix
systemctl restart php8.2-fpm
systemctl restart apache2
```

ここまでで、以下のURLにすると初期設定が始まります。

http://192.168.111.250/zabbix

## Zabbix の初期設定
以下の流れで実施します。

![](images/2025-01-27_13h11_49.png "")
![](images/2025-01-27_13h17_25.png "")
![](images/2025-01-27_13h17_47.png "")
![](images/2025-01-27_13h18_06.png "")
![](images/2025-01-27_13h18_25.png "")
![](images/2025-01-27_13h21_31.png "")

以上でセットアップが完了です。
ユーザー名: Admin
パスワード: zabbix でログインが可能です。

![](images/2025-01-27_13h11_49.png "")

