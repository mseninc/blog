---
title: "[VMware ESXi] TeraStation 5410DN で作成した共有領域を NFS でデータストアとしてマウントできない"
date: 2019-10-21
author: jinna-i
tags: [VMware, ESXi, TeraStation, 仮想化技術]
---

こんにちは、じんないです。

[TeraStation TS5410DN](https://www.buffalo.jp/product/detail/ts5410dn1204.html) で共有フォルダを作成し、NFS で新規データストアとしてマウントしようとすると、下記のエラーでマウントできませんでした。

<a href="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-1.png"><img src="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-1.png" alt="" width="1604" height="50" class="alignnone size-full wp-image-10939" /></a>

> NFS データストア vmstr01 のマウントに失敗しました: NFS マウント 192.168.10.40: /​m​n​t​/​a​r​r​a​y​1​/​e​x​p​o​r​t エラー: マウント要求が NFS サーバによって拒否されました。エクスポートが存在すること、クライアントがマウントを許可されていることを確認してください。

ESXi 単体の Host Client からやっても、vCenter Server の vSphere Client からやっても状況は変わません。NFS の設定を確認しても特に変なところもありませんでした。

なかなかハマってしまったのでメモとして残しておきます。
※ NFS の設定は割愛します。

## 想定環境
- ストレージ: [TS5410DN1204 : 法人向けNAS : TeraStation | バッファロー](https://www.buffalo.jp/product/detail/ts5410dn1204.html)
- 仮想化基盤: VMware vSphere 6.5

## モデルケース
- マウント方式: NFS
- ストレージ IP アドレス: 192.168.10.40
- NFS パス: /mnt/array1/export
- データストア名: vmstr01


## NFS のパスはコピペ禁止!!

**結論から先に書きます**。

TeraStation の共有フォルダ設定で NFS のチェックを入れると、**NFS パス** が表示されます。今回の例では `/mnt/array1/export` です。
このパスを使って ESXi からマウントするのですが、**絶対にコピペしてはいけません**。

<a href="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-2.png"><img src="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-2.png" alt="" width="598" height="600" class="alignnone size-full wp-image-10944" /></a>

階層が深くなると長ったらしくなり、間違えたら嫌なのでコピペする人がほとんどだと思いますが、**TeraStation の設定画面からコピーはせず、手打ちするようにしてください**。

<a href="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-3.png"><img src="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-3.png" alt="" width="940" height="597" class="alignnone size-full wp-image-11019" /></a>

TeraStation の NFS で引っかかっている人はこれで解消するはずです。

## なぜコピペだとダメなのか

エラーを見ているとアクセス権限がなかったり、NFS の設定が間違っているんじゃないかと思わされます。私も現にそう思い何度も何度も設定を見直しました。
が、いくら設定を見直してもおかしそうなところはありませんでした。

以降、調査した記録になりますので、興味のある方は読んでみてください。

左が TeraStation の共有フォルダ設定から NFS パスをコピペしたもの。右がメモ帳に手打ちしたものです。
一見、両者は同じ文字列に見えますよね。

<a href="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-4.png"><img src="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-4.png" alt="" width="631" height="179" class="alignnone size-full wp-image-10950" /></a>

次は、これらのファイルをテキストに保存し、Git Bash から `cat` してみます。
上が TeraStation の共有フォルダ設定からコピペしたもの。下がメモ帳に手打ちしたものです。
**コピペしたものには、何やら変な制御文字が含まれていることが分かります**。

<a href="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-5.png"><img src="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-5.png" alt="" width="777" height="496" class="alignnone size-full wp-image-10969" /></a>

`od -c` コマンドで何が含まれているのか見てみます。

<a href="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-6.png"><img src="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-6.png" alt="" width="535" height="123" class="alignnone size-full wp-image-10974" /></a>

少しわかりにくいですが、各文字の間に `\0 \v <スペース>` が含まれていることがわかります。
さらに `x` オプションを追加して16進数でダンプしてみます。

<a href="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-7.png"><img src="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-7.png" alt="" width="543" height="239" class="alignnone size-full wp-image-10977" /></a>


16進数だと `\0 → 00`, `\v → 0b`, `<スペース> → 20` です。
わかりにくいので `/mnt` の部分だけ表にしてみました。

<a href="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-8.png"><img src="images/cannot-mount-a-shared-folder-created-with-terastation-5410dn-as-a-datastore-with-nfs-8.png" alt="" width="693" height="165" class="alignnone size-full wp-image-10975" /></a>

余計わかりにくいですが、文字列と16進数の対応です。この対応が4バイトずつクロスになっており、このデータの並びをリトルエンディアンと呼ぶそうです。
※マルチバイト構成の文字列において、下位バイトから上位バイトに向かってデータを伝送・記録する方式。その逆をビッグエンディアンと呼ぶ。

これで余分な制御文字が、`00`, `0b`, `20` であることがわかりました。
これらの制御文字が何を意味するのかは下記の表のとおりです。

コード | 値 | 説明
-- | -- | --
00 | NUL | NULL(ヌル・ナル)
0b | VT | Vertical Tabulation（垂直タブ）
20 | SPC | スペース (空白)

`/mnt/array1/export` の各文字の間に **NULL、垂直タブ、空白文字が含まれていることがわかりました**。
なぜこのような文字列が含まれているのはわかりませんが、コピペするとこれらの制御文字も一緒に入力されてしまうわけですね。
私の場合は直接コピペではなく、**一度メモ帳に貼り付けてそれをコピーしていたので大丈夫だと思ってましたが思わぬ落とし穴がある**ようです。
パスは間違えたくないって気持ちがありますが、コピペがいかに怖いか思い知らされますね・・・。いい勉強になりました。

ではまた。

## 参考

[Adding a TeraStation NFS Share to ESXi 6.5](https://www.buffalotech.com/knowledge-base/adding-a-terastation-nfs-share-to-esxi-6.5)
