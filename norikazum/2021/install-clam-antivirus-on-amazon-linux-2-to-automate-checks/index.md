---
title: "[AWS] Amazon Linux 2 に Clam AntiVirus をインストールしてチェックを自動化する"
date: 2021-08-23
author: norikazum
tags: [Amazon Linux 2, AWS, ウィルス対策, ClamAV]
---

こんにちは。

今回は、オープンソースで提供されているアンチウイルスソフトウェア Clam AntiVirusをAmazon Linux2 にインストールします。

Clam AntiVirus のデーモンである、 **clamd を起動せず、clamscan コマンドで検査する方法** を紹介します。

Clam Antivirusについて以下のサイトが参考になります。
[Clam Antivirusに関するメモ](https://clamav-jp.osdn.jp/jdoc/clamav.html)

それでは、順番に進めましょう。

## 環境
- OS　Amazon Linux 2
- タイプ　t2.small (※)
- カーネル　4.14.232-177.418.amzn2.x86_64

**※ t2.micro では ウィルスパターンデータアップデートの際、メモリ不足で以下のエラーになることを確認しました**
```bash
Can't allocate memory (262144 bytes). [...] ERROR: Failed to load new database: Malformed database
```

## 手順

### インストール
```bash
# amazon-linux-extras install epel
# yum -y install clamav clamav-update clamd
```

### 定義ファイルの更新

**1回目**
```bash
# freshclam
ClamAV update process started at Wed Jul  7 14:39:01 2021
WARNING: Your ClamAV installation is OUTDATED!
WARNING: Local version: 0.103.2 Recommended version: 0.103.3
DON'T PANIC! Read https://www.clamav.net/documents/upgrading-clamav
daily database available for download (remote version: 26223)
Time:    5.3s, ETA:    0.0s [========================>]  102.40MiB/102.40MiB
Testing database: '/var/lib/clamav/tmp.2c43077cfe/clamav-b48ee2aae6b0ac1f9043ad42c10b078a.tmp-daily.cvd' ...
Database test passed.
daily.cvd updated (version: 26223, sigs: 3993721, f-level: 63, builder: raynman)
main database available for download (remote version: 59)
Time:    5.7s, ETA:    0.0s [========================>]  112.40MiB/112.40MiB
Testing database: '/var/lib/clamav/tmp.2c43077cfe/clamav-0616618c48332901652ab4156e6d993d.tmp-main.cvd' ...
Database test passed.
main.cvd updated (version: 59, sigs: 4564902, f-level: 60, builder: sigmgr)
bytecode database available for download (remote version: 333)
Time:    0.0s, ETA:    0.0s [========================>]  286.79KiB/286.79KiB
Testing database: '/var/lib/clamav/tmp.2c43077cfe/clamav-20e1a45e3e53f3660a4ccc1723316938.tmp-bytecode.cvd' ...
Database test passed.
bytecode.cvd updated (version: 333, sigs: 92, f-level: 63, builder: awillia2)
```

**2回目**
```bash
# freshclam
ClamAV update process started at Wed Jul  7 14:44:04 2021
WARNING: Your ClamAV installation is OUTDATED!
WARNING: Local version: 0.103.2 Recommended version: 0.103.3
DON'T PANIC! Read https://www.clamav.net/documents/upgrading-clamav
daily.cvd database is up-to-date (version: 26223, sigs: 3993721, f-level: 63, builder: raynman)
main.cvd database is up-to-date (version: 59, sigs: 4564902, f-level: 60, builder: sigmgr)
bytecode.cvd database is up-to-date (version: 333, sigs: 92, f-level: 63, builder: awillia2)
```

**Your ClamAV installation is OUTDATED!** と、古くなってるよ！ と警告されるのですが、以下のとおりアップデートが存在していないのでこのままにします。

```bash
# yum -y update clamav clamav-update clamd
Loaded plugins: extras_suggestions, langpacks, priorities, update-motd
217 packages excluded due to repository priority protections
No packages marked for update
```

`clamd@scan` サービスを起動する場合、 `freshclam` を実行する前に、サービスを起動するとエラーになりますので注意です。

コマンドで検査するため、以上で環境の準備は完了です。

## テスト
テスト用ウイルス Eicar をダウンロードして検出されるか確認します。

以下よりテストファイルをダウンロードします。
[Download Anti Malware Testfile – Eicar](https://www.eicar.org/?page_id=3950)

### チェックコマンド
ウィルスチェックは、`/usr/bin/clamscan` コマンドで実行できます。
引数に 検索場所 `/` をつけることで ルート以下全てを検索します。

オプションに以下の３つを追加します。

1. ウイルスに感染したファイルのみを標準出力する
    `--infected`
1. サブディレクトリごと再帰的に検査し、圧縮ファイルは再帰的に解凍して検査する
    `--recursive`
1. システムフォルダの除外する
    `--exclude-dir=^/sys --exclude-dir=^/proc --exclude-dir=^/dev`

まずは、ダウンロードしない状態でチェックしてみます。

検査コマンドは少々長いですが以下のようになります。

```bash
/usr/bin/clamscan --infected --recursive --exclude-dir=^/sys --exclude-dir=^/proc --exclude-dir=^/dev /
```

### Eicar ダウンロード前の実行結果

```bash
# /usr/bin/clamscan --infected --recursive --exclude-dir=^/sys --exclude-dir=^/proc --exclude-dir=^/dev /

----------- SCAN SUMMARY -----------
Known viruses: 8560862
Engine version: 0.103.3
Scanned directories: 19537
Scanned files: 100784
Infected files: 0
Data scanned: 3468.81 MB
Data read: 4231.22 MB (ratio 0.82:1)
Time: 873.180 sec (14 m 33 s)
Start Date: 2021:08:18 11:13:36
End Date:   2021:08:18 11:28:09
```

**Infected files: 0** となっているので **検出されていない** ということになります。

### Eicar ダウンロード後の実行結果

```bash
# wget https://secure.eicar.org/eicar.com.txt
--2021-08-18 11:32:23--  https://secure.eicar.org/eicar.com.txt
Resolving secure.eicar.org (secure.eicar.org)... 89.238.73.97, 2a00:1828:1000:2497::2
Connecting to secure.eicar.org (secure.eicar.org)|89.238.73.97|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 68 [text/plain]
Saving to: ‘eicar.com.txt’

100%[==================================>] 68          --.-K/s   in 0s

2021-08-18 11:32:23 (8.53 MB/s) - ‘eicar.com.txt’ saved [68/68]
```

では、チェックしてみます。

```bash
# /usr/bin/clamscan --infected --recursive --exclude-dir=^/sys --exclude-dir=^/proc --exclude-dir=^/dev /
/root/eicar.com.txt: Win.Test.EICAR_HDB-1 FOUND

----------- SCAN SUMMARY -----------
Known viruses: 8560862
Engine version: 0.103.3
Scanned directories: 19537
Scanned files: 100786
Infected files: 1
Data scanned: 3468.84 MB
Data read: 4231.24 MB (ratio 0.82:1)
Time: 879.173 sec (14 m 39 s)
Start Date: 2021:08:18 11:32:26
End Date:   2021:08:18 11:47:05
```

**Infected files: 1** となっているので **検出されている** ことになります。

## 検出時の隔離
前述までで検出は可能になりましたが、このままではウィルスファイルは放置されてしまいます。

ウィルスファイルが発見されたら、特定のフォルダに移動し隔離するようにします。

例として、`/var/tmp/clamav` フォルダに退避するようにします。
**退避フォルダは実行権限を与えない** ように設定します。

### 退避フォルダの作成
```bash
# mkdir /var/tmp/clamav
# chmod 600 /var/tmp/clamav
# ls -l /var/tmp | grep clamav
drw------- 2 root root  6 Aug 18 11:13 clamav
```

### 退避オプションを追加した実行結果

退避オプションは、`--move /var/tmp/clamav` となります。

検査コマンドは以下のようになります。

```bash
/usr/bin/clamscan --infected --recursive --exclude-dir=^/sys --exclude-dir=^/proc --exclude-dir=^/dev --move /var/tmp/clamav /
```

それでは実行してみましょう。

```bash
# /usr/bin/clamscan --infected --recursive --exclude-dir=^/sys --exclude-dir=^/proc --exclude-dir=^/dev --move /var/tmp/clamav /
/root/eicar.com.txt: Win.Test.EICAR_HDB-1 FOUND
/root/eicar.com.txt: moved to '/var/tmp/clamav/eicar.com.txt'

----------- SCAN SUMMARY -----------
Known viruses: 8560862
Engine version: 0.103.3
Scanned directories: 19537
Scanned files: 100786
Infected files: 1
Data scanned: 3468.90 MB
Data read: 4231.26 MB (ratio 0.82:1)
Time: 884.667 sec (14 m 44 s)
Start Date: 2021:08:18 12:18:14
End Date:   2021:08:18 12:32:58
```

**moved to '/var/tmp/clamav/eicar.com.txt'** の部分で退避されたことが分かります。

退避フォルダを確認しましょう。
```bash
# ls -l /var/tmp/clamav
total 4
-rw-r--r-- 1 root root 68 Jul  2  2020 eicar.com.txt
```
退避されていますね。

## チェックの自動化
前述までで、チェックすることはできましたが手動運用は大変なのでスクリプトを作成してcronに登録することで自動化します。

### スクリプト仕様
1. 実行時にパターンファイルをアップデート
1. ログフォルダは `/var/log/clamav`
1. ログ形式は `clamav_check_YYYYMMDD-HHMMSS.log` 
1. `Infected files: 0` 以外の場合 (ウィルスが検出された場合) にメールで通知する
1. メールタイトルは [ホスト名] **Caution** Malware found で固定
1. from アドレスは ホスト名@localhsot で固定

### 前提
1. 実行するサーバーから `sendmail` コマンドでメールが飛ばせること

`to=` の後に 通報したいメールアドレスを記載すればそのまま使えると思います。

### clam_check.sh
```bash
## clamav マルウェアチェック・通報スクリプト ##
## clamavが導入されていることが前提 ##
# メール通知のためメール送信できる設定が必要 ##
#!/bin/bash

### 変数 ###
## スクリプト実行時間を取得
time=`date +%Y%m%d-%H%M%S`

## ログディレクトリ
log_dir="/var/log/clamav"

## マルウェア除外ディレクトリ
move_dir="/var/tmp/clamav"

### フォルダがなければ作成する ###
if [ ! -d $log_dir ]; then
  # 存在しない場合は作成
  mkdir -p $log_dir
  chmod 700 $log_dir
else
  # 存在する場合は何もしない
  : # 何もしない
fi

if [ ! -d $move_dir ]; then
  # 存在しない場合は作成
  mkdir -p $move_dir
  chmod 600 $move_dir
else
  # 存在する場合は何もしない
  : # 何もしない
fi

## ログファイル
log_file="$log_dir/clamav_check_$time.log"

## マルウェア除外ディレクトリ(半角スペースで続ける)
exclude="--exclude-dir=^/sys --exclude-dir=^/proc --exclude-dir=^/dev --exclude-dir=^$move_dir"

## パターンファイルアップデートコマンド
clam_update=`date >> $log_file; echo "---パターンファイルアップデート処理開始---" >> $log_file; /usr/bin/freshclam 1>> $log_file 2>> $log_file`

## マルウェアチェックコマンド
check_cmd=`echo -e "\n" >> $log_file; date >> $log_file; echo "---マルウェアチェック処理開始---" >> $log_file; /usr/bin/clamscan --infected --recursive $exclude --move $move_dir / 1>> $log_file 2>> $log_file`

## メールタイトル
subject="[`hostname`] **Caution** Malware found"

## 送信元メールアドレス
from=`hostname`@localhost

## 送信先メールアドレス(可変)
to=example@example.com

## メール本文テキスト
body=/tmp/clamav_check_${time}.txt

### チェック関数 ###
function clam_check () {
    ## パターンファイルアップデート
    $clam_update

    ## チェックスクリプト実行
    $check_cmd

    ## メール本文作成処理
    echo "From: ${from}" >> ${body}
    echo "To: ${to}" >> ${body}
    echo "Subject: ${subject}" >> ${body}
    echo >> ${body}
    echo -n ${time} >> ${body}
    echo "時点" >> ${body}
    echo >> ${body}

    ## マルウェアが発見されなかったら
    if [ "$(cat ${log_file} | grep "Infected files: 0" )" ]; then
      : # 何もしない
    ## マルウェアが発見されたら
    else
      cat $log_file >> ${body}
      echo -n >> ${body}
      ## メール送付処理
      /usr/bin/cat ${body} | /usr/sbin/sendmail -i -t
    fi

    ## メール本文削除処理
    rm -rf ${body}
}

### 関数実行 ###
clam_check

### End Script ###
```

### ログファイル
ログファイルはこのような感じです。

**ウィルスが検知されなかった場合**
```bash
Thu Aug  5 15:00:01 JST 2021
---パターンファイルアップデート処理開始---
ClamAV update process started at Thu Aug  5 15:00:02 2021
daily.cld database is up-to-date (version: 26253, sigs: 1966181, f-level: 90, builder: raynman)
main.cvd database is up-to-date (version: 61, sigs: 6607162, f-level: 90, builder: sigmgr)
bytecode.cvd database is up-to-date (version: 333, sigs: 92, f-level: 63, builder: awillia2)


Thu Aug  5 15:00:02 JST 2021
---マルウェアチェック処理開始---

----------- SCAN SUMMARY -----------
Known viruses: 8558115
Engine version: 0.103.3
Scanned directories: 19594
Scanned files: 101007
Infected files: 0
Data scanned: 3455.73 MB
Data read: 4220.24 MB (ratio 0.82:1)
Time: 880.633 sec (14 m 40 s)
Start Date: 2021:08:05 15:00:02
End Date:   2021:08:05 15:14:42
```

**ウィルスが検知された場合**
```bash
Wed Aug 18 10:50:30 JST 2021
---パターンファイルアップデート処理開始---
ClamAV update process started at Wed Aug 18 10:50:30 2021
daily.cld database is up-to-date (version: 26266, sigs: 1968931, f-level: 90, builder: raynman)
main.cvd database is up-to-date (version: 61, sigs: 6607162, f-level: 90, builder: sigmgr)
bytecode.cvd database is up-to-date (version: 333, sigs: 92, f-level: 63, builder: awillia2)


Wed Aug 18 10:50:30 JST 2021
---マルウェアチェック処理開始---
/root/eicar.com.txt: Win.Test.EICAR_HDB-1 FOUND
/root/eicar.com.txt: moved to '/var/tmp/clamav/eicar.com.txt.001'

----------- SCAN SUMMARY -----------
Known viruses: 8560862
Engine version: 0.103.3
Scanned directories: 19534
Scanned files: 100776
Infected files: 1
Data scanned: 3468.79 MB
Data read: 4231.20 MB (ratio 0.82:1)
Time: 874.147 sec (14 m 34 s)
Start Date: 2021:08:18 10:50:30
End Date:   2021:08:18 11:05:04
```

### cron に登録
時間とパスは任意です。
```sh
30 1 * * * /root/clam_check.sh
```

## あとがき
サーバーの性能によっては、チェック実行により高負荷になり運用しているサービスに影響を与えてしまいますのでご利用は計画的に。

それでは次回の記事でお会いしましょう。