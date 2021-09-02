---
title: VMware ESXi のカスタムインストールディスクの作成方法
date: 2016-06-30
author: norikazum
tags: [仮想化技術]
---

現在、社内インフラを強化中で、久しぶりにESXiのカスタムディスクを作成したので記事にしたいと思います。

>VMware ESXiとはVMware社による、コンピュータを仮想化するためのハイパーバイザー・ソフトウェア。VMware ESXは仮想化ソフトウェア製品パッケージ「VMware vSphere」の一部として有償で販売されており、サービスコンソールなどの機能を制限したVMware ESXiは無償で入手して利用することができる。仮想化の機能自体は両者で違いはない。
VMware ESXはハードウェア上で直接動作し、仮想的に構築されたコンピュータ上で様々な種類のOS（ゲストOS）を動作させることができる。ゲストOSに仮想化のための修正を必要としない「完全仮想化」型のハイパーバイザーで、通常のOS製品を仮想マシンにそのままインストールして利用することができる。
**e-Words参照**


## 概要
VMware ESXiをインストールしようとすると、ネットワークドライバがなくインストールが途中で止まることがあります。

VMware社より公開されているインストールISOの中にネットワークドライバが含まれていないことが多いのですが、そのような場合には手動でドライバを入手しカスタムインストールディスクを作成する必要があります。

事前準備として、**ESXiのインストールISOを準備します。**
今回の例では、ESXi 5.5 U2 なので、**VMware-ESXi-5.5U2-RollupISO2.iso**というISOファイル名です。

## ドライバの特定
まずはそのドライバが何かを特定する必要があります。

今回、マザーボードに使用したのは、**ASRock H97M Pro** なので[公式ホームページの仕様](http://www.asrock.com/mb/Intel/H97M%20Pro4/index.jp.asp?cat=Specifications)から調査しました。

ふむふむ、なるほど**Intel社のI218V**やな、ということが分かりました。

<img src="images/how-to-make-vmware-esxi-install-disc-1.png" alt="2016-06-21_23h41_20" width="796" height="159" class="alignnone size-full wp-image-1082" />

## ドライバの入手
次に、ESXiに組み込むためのドライバを検索します。

[v-front.de](https://vibsdepot.v-front.de/wiki/index.php/List_of_currently_available_ESXi_packages)に行きます。

上部に、I218がありました。
リンクをクリックし、進みます。

<img src="images/how-to-make-vmware-esxi-install-disc-2.png" alt="2016-06-21_23h43_22" width="1170" height="455" class="alignnone size-full wp-image-1083" />

ダウンロードリンクをクリックし、任意の場所にダウンロードします。

<img src="images/how-to-make-vmware-esxi-install-disc-3.png" alt="2016-06-21_23h45_54" width="313" height="112" class="alignnone size-full wp-image-1084" />

## カスタムディスク作成ツール
カスタムインストールディスクを作成するためのツールを入手します。

[ここ](http://www.v-front.de/p/esxi-customizer.html)から入手します。

<img src="images/how-to-make-vmware-esxi-install-disc-4.png" alt="2016-06-21_23h50_25" width="563" height="335" class="alignnone size-full wp-image-1088" />

↓

<img src="images/how-to-make-vmware-esxi-install-disc-5.png" alt="2016-06-21_23h50_54" width="547" height="160" class="alignnone size-full wp-image-1089" />

## カスタムディスクの作成
ダウンロードしたツールを解凍し、解凍して出来たフォルダの中の**ESXi-Customizer.cmd**を実行します。

って、ん？えーーー！？
**Windows 10では動かんのかい！**

<img src="images/how-to-make-vmware-esxi-install-disc-6.png" alt="2016-06-21_23h53_03" width="478" height="160" class="alignnone size-full wp-image-1090" />

記事書きながらやってたので。。

仕方がないので、Windows7に諸々ファイルをコピーして気を取り直して進めます。

起動直後はこんな画面になります。

<img src="images/how-to-make-vmware-esxi-install-disc-7.png" alt="2016-06-21_23h56_56" width="515" height="301" class="alignnone size-full wp-image-1092" />

続けて、ISOとドライバを指定して**Run**をクリックします。

<img src="images/how-to-make-vmware-esxi-install-disc-8.png" alt="2016-06-21_23h58_58" width="512" height="300" class="alignnone size-full wp-image-1095" />

このメッセージは**いいえ**で進めます。

<img src="images/how-to-make-vmware-esxi-install-disc-9.png" alt="2016-06-22_00h00_45" width="477" height="293" class="alignnone size-full wp-image-1097" />

このメッセージは**はい**で進めます。

<img src="images/how-to-make-vmware-esxi-install-disc-10.png" alt="2016-06-22_00h08_31" width="418" height="235" class="alignnone size-full wp-image-1103" />

完了しました。

<img src="images/how-to-make-vmware-esxi-install-disc-11.png" alt="2016-06-22_00h09_15" width="419" height="187" class="alignnone size-full wp-image-1104" />

出来たISOはライティングソフト書き込みを行います。
**340MBだったので、十分CD-Rで足りますね！**

この手順で作成したカスタムインストールディスクで無事インストールが完了しました！