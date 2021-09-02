---
title: 手動でKernelをアップデートすると競合エラーではまる
date: 2017-04-11
author: norikazum
tags: [CentOS, Linux]
---

こんにちは。

今回の記事は、kernel をRPMコマンドを使って手動でアップデートする流れを紹介します。

今更記事にするほどのことでは・・・と思ったのですが、昨今は yum コマンドを使ってアップデートすることが主流となり手動でアップデートを実施する機会が減っていることもあり、いざやってみるとできなかったので復習も兼ねた記事になっています。

今回は **CentOS 6** の **kernel-2.6.32-504** から **kernel-2.6.32-642.11.1** にアップデートします。


## 単純にはアップデートできなかった

rpm コマンドも久しぶりでしたが、アップデート前にインストールされているkernel を確認すると、以下のとおりでした。
```
kernel-2.6.32-504.el6.x86_64
kernel-devel-2.6.32-504.el6.x86_64
kernel-firmware-2.6.32-504.el6.noarch
kernel-headers-2.6.32-504.el6.x86_64
```

この4種を準備しました。
[ここ](http://archive.kernel.org/centos-vault/6.8/updates/x86_64/Packages/)から探しました。

```
kernel-2.6.32-642.11.1.el6.x86_64.rpm
kernel-devel-2.6.32-642.11.1.el6.x86_64.rpm
kernel-firmware-2.6.32-642.11.1.el6.noarch.rpm
kernel-headers-2.6.32-642.11.1.el6.x86_64.rpm
```

ここで、単純に上記全てのパッケージを指定し新規インストールを実行すると大量の競合エラーが・・・。
```
# rpm -ivh *.rpm
警告: webmin-1.550-1.noarch.rpm: ヘッダ V3 DSA/SHA1 Signature, key ID 11f63c51: NOKEY
準備中...                ########################################### [100%]
        パッケージ webmin-1.550-1.noarch は既にインストールされています。
        ファイル /usr/include/asm-generic/mman-common.h (パッケージ kernel-headers-2.6.32-642.11.1.el6.x86_64 から) は、パッケージ kernel-headers-2.6.32-504.el6.x86_64 からのファイル と競合しています。
        ファイル /usr/include/linux/sockios.h (パッケージ kernel-headers-2.6.32-642.11.1.el6.x86_64 から) は、パッケージ kernel-headers-2.6.32-504.el6.x86_64 からのファイルと競合して います。
        ファイル /usr/include/asm/hyperv.h (パッケージ kernel-headers-2.6.32-642.11.1.el6.x86_64 か

中略

        ファイル /usr/include/sound/asound.h (パッケージ kernel-headers-2.6.32-642.11.1.el6.x86_64 から) は、パッケージ kernel-headers-2.6.32-504.el6.x86_64 からのファイルと競合しています。
        ファイル /lib/firmware/rtl_nic/rtl8168g-1.fw (パッケージ kernel-firmware-2.6.32-642.11.1.el6.noarch から) は、パッケージ kernel-firmware-2.6.32-504.el6.noarch からのファイルと競合しています。
        ファイル /usr/share/doc/kernel-firmware-2.6.32/WHENCE (パッケージ kernel-firmware-2.6.32-642.11.1.el6.noarch から) は、パッケージ kernel-firmware-2.6.32-504.el6.noarch からの ファイルと競合しています。
```

## 手順を整理

過去のメモや作業履歴を確認して、手順を整理しました。

以下については、`# rpm -Fvh <パッケージファイル名>` でアップデートします。
```
kernel-abi-whitelists
kernel-debug
kernel-debug-debuginfo
kernel-debug-devel
kernel-debuginfo
kernel-debuginfo-common-x86_64
kernel-doc
kernel-firmware
kernel-headers
kernel-source
```
適用するパッケージより新しいバージョンのパッケージがインストールされている場合は、以下のコマンドを実行し適用します。
```
# rpm -Uvh --oldpackage <パッケージファイル名>
```

以下のパッケージについては、`# rpm -ivh <パッケージファイル名>` でアップデートします。
```
kernel-devel
kernel
```

上記のパッケージについては、**-Fvh** または **-Uvh** オプションで適用するとインストールするカーネル以外のカーネル(以前のバージョン)がすべて削除されるため、使用しないように注意が必要です。
適用するパッケージより新しいバージョンのパッケージがインストールされている場合は、以下のコマンドを実行し適用します。
```
# rpm -ivh --oldpackage <パッケージファイル名>
```
## 実践

前項にて整理した手順を元に実践してみます。
まずは、firemware と headers をアップデートします。
```
# rpm -Fvh kernel-firmware-2.6.32-642.11.1.el6.noarch.rpm kernel-headers-2.6.32-642.11.1.el6.x86_64.rpm
準備中...                ########################################### [100%]
   1:kernel-headers         ########################################### [ 50%]
   2:kernel-firmware        ########################################### [100%]
```
その後、devel と kernel 本体をアップデートします。

```
# rpm -ivh kernel-devel-2.6.32-642.11.1.el6.x86_64.rpm kernel-2.6.32-642.11.1.el6.x86_64.rpm
準備中...                ########################################### [100%]
   1:kernel                 ########################################### [ 50%]
   2:kernel-devel           ########################################### [100%]
```

少し時間完了までにがかかりますが待機してください。
無事に成功しました。


## 確認

実践後に確認すると、`rpm -qa | grep kernel` コマンドで確認すると、以下のようにkernel と kernel-devel については新旧の両方が残っていることが確認できます。

```
kernel-2.6.32-504.el6.x86_64
kernel-2.6.32-642.11.1.el6.x86_64
kernel-devel-2.6.32-504.el6.x86_64
kernel-devel-2.6.32-642.11.1.el6.x86_64
kernel-firmware-2.6.32-642.11.1.el6.noarch
kernel-headers-2.6.32-642.11.1.el6.x86_64
```

再起動後に新しいカーネルで動作します。あとがき今回、kernel-2.6.32-504 からのアップデートを実施し、上記の流れで実施できることを確認しました。もう少し古い別環境で kernel-2.6.32-279 からアップデートを実施してみたところ、
```
エラー: 依存性の欠如:
        bfa-firmware < 3.2.21.1-2 は kernel-2.6.32-642.11.1.el6.x86_64 と競合し ます。
```
というエラーが出ました。

このエラーが出た場合は、 `# yum -y update bfa-firmware` を実行して bfa-firmware をアップデートしてから `rpm -ivh` を実行してください。

記事の執筆時に実施した作業ではこの流れで成功しました。

Kernel のアップデートはOS以外のシステムに影響が及ぶことがありますので、実施者の責任のもと判断いただけますようお願いします。

それでは次回の記事でお会いしましょう。
