---
title: CentOS 8 の終了ニュースをみて CentOS Stream インストールレビューしてみた
date: 2021-01-12
author: norikazum
tags: [CentOS, CentOS Stream, Linux]
---

こんにちは。

**2020年12月8日に CentOS Project が Stream 以外の CentOS 8 を 2020 年末に終了 (EoL) するという衝撃のニュース** が出ました。
[CentOS Project shifts focus to CentOS Stream – Blog.CentOS.org](https://blog.centos.org/2020/12/future-is-centos-stream/)

Google 翻訳ですが、記事を読んでみると、

> Red Hat Enterprise Linux（RHEL）の再構築であるCentOS Linuxから、現在のRHELリリースの直前に追跡するCentOSStreamに焦点を移します。CentOS Linux 8は、RHEL 8の再構築として、2021年の終わりに終了します。

続けて、**CentOS 7 は RHEL7 のサイクルとおりに継続する** 、ともありました。

> その間、多くの皆さんがCentOS Linux 7に深く投資していることを理解しており、RHEL7のライフサイクルの残りを通してそのバージョンを作成し続けます。

**RHEL7.7 は 2023 年 8 月 30 日終了予定** となっているので CentOS 7 を利用していればまだ焦ることはありません。
[Red Hat Enterprise Linux のライフサイクル - Red Hat Customer Portal](https://access.redhat.com/ja/support/policy/updates/errata#Life_Cycle_Dates)

まさか  **CentOS 7 を使っていたほうが余命が長くなる** なんて・・・

CentOS 8 を採用しているお客さまも多いことから Stream の移行かもしくはその他か・・・考えていかないといけません、

記事には、**Stream 8 に移行することが最善**、とありました。
> CentOS Linux8からの小さなデルタであるCentOSStream 8に移行するのが最善のオプションであり

と、いうことで (!?) Stream 8 をインストールしてみました。
恥ずかしながら初めてです。

## 環境
- VMware ESXi 6.7
- 仮想マシン (2コア、2GBメモリ)

## インストール
**CentOS-Stream-8-x86_64-20201211-dvd1.iso** を利用しました。
[Index of /centos/8-stream/isos/x86_64](http://mirror.vodien.com/centos/8-stream/isos/x86_64/)

- **ISOからブート** します
<a href="images/trying-centos-stream-instead-of-centos8-1.jpg"><img src="images/trying-centos-stream-instead-of-centos8-1.jpg" alt="" width="870" height="654" class="alignnone size-full wp-image-15302" /></a>
↓
<a href="images/trying-centos-stream-instead-of-centos8-2.jpg"><img src="images/trying-centos-stream-instead-of-centos8-2.jpg" alt="" width="875" height="656" class="alignnone size-full wp-image-15303" /></a>

- **言語を選択** します
<a href="images/trying-centos-stream-instead-of-centos8-3.jpg"><img src="images/trying-centos-stream-instead-of-centos8-3.jpg" alt="" width="873" height="657" class="alignnone size-full wp-image-15304" /></a>

- **インストール概要を決定** します (今回は **全てデフォルト** でインストールしてみます)
<a href="images/trying-centos-stream-instead-of-centos8-4.jpg"><img src="images/trying-centos-stream-instead-of-centos8-4.jpg" alt="" width="873" height="658" class="alignnone size-full wp-image-15305" /></a>
↓
<a href="images/trying-centos-stream-instead-of-centos8-5.jpg"><img src="images/trying-centos-stream-instead-of-centos8-5.jpg" alt="" width="876" height="658" class="alignnone size-full wp-image-15306" /></a>
↓
<a href="images/trying-centos-stream-instead-of-centos8-6.jpg"><img src="images/trying-centos-stream-instead-of-centos8-6.jpg" alt="" width="873" height="648" class="alignnone size-full wp-image-15307" /></a>

- **インストールが進行** し、 **再起動** します
<a href="images/trying-centos-stream-instead-of-centos8-7.jpg"><img src="images/trying-centos-stream-instead-of-centos8-7.jpg" alt="" width="871" height="653" class="alignnone size-full wp-image-15308" /></a>
↓
<a href="images/trying-centos-stream-instead-of-centos8-8.jpg"><img src="images/trying-centos-stream-instead-of-centos8-8.jpg" alt="" width="870" height="655" class="alignnone size-full wp-image-15309" /></a>

- **ライセンスに同意** します
<a href="images/trying-centos-stream-instead-of-centos8-9.jpg"><img src="images/trying-centos-stream-instead-of-centos8-9.jpg" alt="" width="907" height="681" class="alignnone size-full wp-image-15310" /></a>
↓
<a href="images/trying-centos-stream-instead-of-centos8-10.jpg"><img src="images/trying-centos-stream-instead-of-centos8-10.jpg" alt="" width="911" height="677" class="alignnone size-full wp-image-15311" /></a>
↓
<a href="images/trying-centos-stream-instead-of-centos8-11.jpg"><img src="images/trying-centos-stream-instead-of-centos8-11.jpg" alt="" width="911" height="677" class="alignnone size-full wp-image-15312" /></a>
↓
<a href="images/trying-centos-stream-instead-of-centos8-12.jpg"><img src="images/trying-centos-stream-instead-of-centos8-12.jpg" alt="" width="908" height="680" class="alignnone size-full wp-image-15314" /></a>

ここまででインストールは完了です。
**CentOS 8 となんら変わりはなく違和感なし** です。

## 初期セットアップ

- Welcome 画面を **次へ** で進みます
<a href="images/trying-centos-stream-instead-of-centos8-13.jpg"><img src="images/trying-centos-stream-instead-of-centos8-13.jpg" alt="" width="905" height="673" class="alignnone size-full wp-image-15317" /></a>

- プライバシー の確認を **次へ** で進みます
<a href="images/trying-centos-stream-instead-of-centos8-14.jpg"><img src="images/trying-centos-stream-instead-of-centos8-14.jpg" alt="" width="906" height="685" class="alignnone size-full wp-image-15318" /></a>

- **オンラインアカンとへの接続はスキップ** します
<a href="images/trying-centos-stream-instead-of-centos8-15.jpg"><img src="images/trying-centos-stream-instead-of-centos8-15.jpg" alt="" width="909" height="683" class="alignnone size-full wp-image-15319" /></a>

- **ユーザーを作成** します 
<a href="images/trying-centos-stream-instead-of-centos8-16.jpg"><img src="images/trying-centos-stream-instead-of-centos8-16.jpg" alt="" width="909" height="678" class="alignnone size-full wp-image-15320" /></a>
↓
<a href="images/trying-centos-stream-instead-of-centos8-17.jpg"><img src="images/trying-centos-stream-instead-of-centos8-17.jpg" alt="" width="909" height="680" class="alignnone size-full wp-image-15321" /></a>

- これで **初期セットアップが完了** します
<a href="images/trying-centos-stream-instead-of-centos8-18.jpg"><img src="images/trying-centos-stream-instead-of-centos8-18.jpg" alt="" width="901" height="679" class="alignnone size-full wp-image-15322" /></a>
↓
<a href="images/trying-centos-stream-instead-of-centos8-19.jpg"><img src="images/trying-centos-stream-instead-of-centos8-19.jpg" alt="" width="906" height="680" class="alignnone size-full wp-image-15323" /></a>

メニューはこんな感じでした。

<a href="images/trying-centos-stream-instead-of-centos8-20.jpg"><img src="images/trying-centos-stream-instead-of-centos8-20.jpg" alt="" width="906" height="681" class="alignnone size-full wp-image-15324" /></a>

このあと、パッケージのインストールなども試してみましたが特に違和感を感じることはなく、触ってみた限りでは CentOS 8 と同様に使うことが出来な印象でした。

[この記事](https://www.clara.jp/media/?p=6989) でも、
> Fedoraのような、開発要素の高いディストリビューションではなく、引き続きRHELの互換OSという点ではCentOSと変わらず、RHELのメジャーバージョンにも追従するため、大きな変化はありません。

とまとめられていました。

今後の 提案は CentOS 8 から CentOS Stream となりますね。
それでは次回の記事でお会いしましょう。