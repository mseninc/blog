---
title: "Amazon Linux 2 の swap 領域を拡張する方法"
date: 
author: hiratatsu04
tags: [Amazon Linux 2,EC2,AWS]
description: "システムを運用しているとメモリーが枯渇してしまうことがあると思います。直接的な解決方法としてはメモリー増設だと思いますが、一時的なメモリー消費量が増えている場合では swap 容量を増やす対処も考えられます。そこで今回は、ｆAmazon Linux 2 環境で swap 領域を拡張する方法を紹介します。"
---

こんにちは、ひらたつです。

システムを運用しているとメモリーが枯渇してしまうことがあると思います。

直接的な解決方法としてはメモリー増設だと思いますが、一時的なメモリー消費量が増えている場合では swap 容量を増やす対処も考えられます。

そこで今回は、**Amazon Linux 2 環境で swap 領域を拡張する方法** を紹介します。

**本作業で OS の再起動は必要ありません。**

swap 容量を増やすということは、そのぶんディスク容量を使用します。

ディスク容量の拡張も必要な場合は、事前に以下記事を参考にして拡張ください。

[Amazon Linux 2 のディスク容量を拡張する方法 | MSeeeeN](https://mseeeen.msen.jp/how-to-expand-the-disk-space-of-amazon-linux-2/)

## 想定環境

- OS: Amazon Linux 2
- swap 容量
    - 拡張前: 1GB
    - 拡張後: 2GB
- swap 領域はファイルで作成されている

※ `/swap` を拡張する手順です。  
その他の領域を拡張する場合は適宜読み替えてください。

## 拡張手順

以下の手順で拡張します。

1. swap 領域の無効化
2. swap ファイルの削除
3. swap ファイルの再作成（容量拡張したもの）
4. swap 領域として設定
5. 必要に応じて `/etc/fstab` の修正

### 準備

まずは作業前に拡張対象のボリュームのスナップショットを作成してきます。  
※作業が完了し、動作に問題ないことを確認できたら削除しておいてください。

以下の手順を参考にしてください。

[スナップショットの作成 - Amazon Linux 2 のディスク容量を拡張する方法 | MSeeeeN](https://mseeeen.msen.jp/how-to-expand-the-disk-space-of-amazon-linux-2/#%E6%BA%96%E5%82%99)

また、**本作業時には一時的に swap 領域が使用できなくなります。**

重要なプロセスを動かすタイミングを避けて作業ください。

### swap 領域の無効化

`swapon --show` コマンドで拡張前の状態を確認します。

```bash
[ec2-user@hiratatsu04 ~]$ sudo swapon --show
NAME  TYPE  SIZE USED PRIO
/swap file 1024M   0B   -2　　👈 swap は 1GB のみ（初期状態）
```

まずは `swapoff -a` コマンドで swap 領域を無効化します。

```bash
[ec2-user@hiratatsu04 ~]$ sudo swapoff -a
```

無効化されているか確認します。

`swapon --show` コマンドを実行し、何も表示されなければ無効化されています。

```bash
[ec2-user@hiratatsu04 ~]$ sudo swapon -show
[ec2-user@hiratatsu04 ~]$ 
```

ファイルを削除します。

```bash
[ec2-user@hiratatsu04 ~]$ ls /
bin   dev  home  lib64  media  opt   root  sbin  swap      sys  usr
boot  etc  lib   local  mnt    proc  run   srv   tmp  var
[ec2-user@hiratatsu04 ~]$ sudo rm /swap
```

### 新規 swap 領域の作成

以下の例では 2GB の swap 領域を作成しています。

まずは `dd` コマンドで指定サイズの空のファイルを作成します。

2GB 以外の容量にする時は `count=2048` を任意の数値に変更ください。

また、swap のファイル名や場所を変更する場合は、`of=/swap` を任意の場所に変更ください。

```bash
[ec2-user@hiratatsu04 ~]$ sudo dd if=/dev/zero of=/swap bs=1M count=2048
2048+0 records in
2048+0 records out
2147483648 bytes (2.1 GB) copied, 14.2129 s, 151 MB/s
```

`mkswap` コマンドで、作成したファイルをスワップ領域として使用できるようにします。

```bash
[ec2-user@hiratatsu04 ~]$ sudo mkswap /swap
mkswap: /swap: insecure permissions 0644, 0600 suggested.
Setting up swapspace version 1, size = 2 GiB (2147479552 bytes)
no label, UUID=f78c7bdc-5a58-47b8-8792-665dc21ec129
```

`swapon` コマンドでスワップ領域を有効にします。

```bash
[ec2-user@hiratatsu04 ~]$ sudo swapon /swap
swapon: /swap: insecure permissions 0644, 0600 suggested.
```

上記で提案されている通りにパーミッションを変更します。

```bash
[ec2-user@hiratatsu04 ~]$ sudo chmod 600 /swap
```

正常に作られているか確認します。

**swap 容量が、設定した容量になっていれば問題ありません。**

```bash
[ec2-user@hiratatsu04 ~]$ free -h
              total        used        free      shared  buff/cache   available
Mem:           957M        260M         81M        712K        614M        555M
Swap:          2.0G          0B        2.0G
[ec2-user@hiratatsu04 ~]$ sudo swapon --show
NAME  TYPE SIZE USED PRIO
/swap file   2G   0B   -2　　👈 swap が 2GB になっている
```

### `/etc/fstab` 修正

swap ファイルの名前や場所を変更した場合は fstab の内容を修正ください。  
変更していない場合は修正不要です。

```bash
[ec2-user@hiratatsu04 ~]$ cat /etc/fstab
#
/swap swap swap defaults 0 0　👈 ここの `/swap` 部分です
```

以上で swap 領域の拡張は完了です。

動作に問題がなければ作業前に作成したスナップショットを削除しておきましょう。

## 最後に

今回は Amazon Linux 2 環境で swap 領域を拡張する方法を紹介しました。

ご参考になれば幸いです。

## 参考
- [Linux | SWAP領域の確認と作成 - わくわくBank](https://www.wakuwakubank.com/posts/685-linux-swap/#index_id4)
- [EC2のEphemeral DiskにSwap領域を作成or拡張する - 本日も乙](https://blog.jicoman.info/2015/05/ec2_add_swap_to_ephemeral_disk/)
- [swapon - システム管理コマンドの説明 - Linux コマンド集 一覧表](https://kazmax.zpp.jp/cmd/s/swapon.8.html)
