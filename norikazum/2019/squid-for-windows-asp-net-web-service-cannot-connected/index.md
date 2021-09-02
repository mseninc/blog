---
title: "[Squid for Windows] 解決！プロキシ経由でASP.NETのWebサービスにつながらない"
date: 2019-02-04
author: norikazum
tags: [Linux, Windows Server, Windows]
---

こんにちは。

**ASP.NETで構築したWebサービス** にCentOSに構築したSquid経由でうまく接続できない現象が発生し、 **Windows Server 2016** に **Squid for Windows** を構築して接続したら解決した、というお話です。

**Squid** といえば **Webプロキシ** として有名で主にCentOSなどのLinuxOSに構築されるケースがほとんどだと思います。

[Squid (ソフトウェア) - Wikipedia](https://ja.wikipedia.org/wiki/Squid_(%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2))

今回、他社様が **ASP.NETで構築したWebサービス** で、あるリンクをクリックすると別ウィンドウで情報が表示されるページに、CentOSで構築したSquid経由の場合、クリック後2，3分応答なしになり最終的に **(104) Connection reset by peer** というSquidのエラーが発生し接続できない状態に陥りました。

<img src="images/squid-for-windows-asp-net-web-service-cannot-connected-1.png" alt="" width="627" height="270" class="alignnone size-full wp-image-8677" />

プロキシサーバーを経由しない状態では問題なく接続できたため **プロキシサーバーが問題** であることは明らかな状態でした。

<img src="images/squid-for-windows-asp-net-web-service-cannot-connected-2.png" alt="" width="1173" height="776" class="alignnone size-full wp-image-8693" />

Squidの設定を変えたり、キャッシュをクリアしたり、Squidをソースからコンパイルしたり、色々行うも解消せず・・・

最後の切り分けとして、Squid for Windows　を稼働させ実施したところ無事接続できた、という結果になりました。

<img src="images/squid-for-windows-asp-net-web-service-cannot-connected-3.png" alt="" width="1173" height="266" class="alignnone size-full wp-image-8694" />

しかし、現時点で **原因は不明** で、記事としては少し不完全な状態で申し訳ございません。
今後判明すれば追記したいと思います。

同じような悩みの方がこの切り分けで解決すれば嬉しいです。

続いて、Squid for Windowsの構築手順を記載します。

## 構築手順

環境は、**Windows Server 2016** 上に、Squid for Windows を構築します。

1. Squid for Windowsのダウンロード
以下よりダウンロードします。
[Squid for Windows](http://squid.diladele.com/)
※クリックするとすぐに **squid.msi** がダウンロードされます。
<img src="images/squid-for-windows-asp-net-web-service-cannot-connected-4.png" alt="" width="1493" height="1090" class="alignnone size-full wp-image-8682" />

1. ダウンロードされたインストーラーをダブルクリックし、以下の流れでインストールします。
    <img src="images/squid-for-windows-asp-net-web-service-cannot-connected-5.png" alt="" width="613" height="488" class="alignnone size-full wp-image-8683" />

    <img src="images/squid-for-windows-asp-net-web-service-cannot-connected-6.png" alt="" width="619" height="496" class="alignnone size-full wp-image-8684" />

    <img src="images/squid-for-windows-asp-net-web-service-cannot-connected-7.png" alt="" width="618" height="485" class="alignnone size-full wp-image-8686" />

    <img src="images/squid-for-windows-asp-net-web-service-cannot-connected-8.png" alt="" width="626" height="489" class="alignnone size-full wp-image-8687" />

    <img src="images/squid-for-windows-asp-net-web-service-cannot-connected-9.png" alt="" width="615" height="479" class="alignnone size-full wp-image-8688" />

    <img src="images/squid-for-windows-asp-net-web-service-cannot-connected-10.png" alt="" width="621" height="476" class="alignnone size-full wp-image-8689" />

以上でインストールは完了です。

## 設定関連

設定ファイルは `C:\Squid\etc\squid\squid.conf` にあり、記載方法はLinux版と同じです。

インストール完了後に **サービス登録** や **ファイアウォール登録** は自動で実施されます。
再起動しても自動で起動してきます。

<img src="images/squid-for-windows-asp-net-web-service-cannot-connected-11.png" alt="" width="1174" height="751" class="alignnone size-full wp-image-8697" />

<img src="images/squid-for-windows-asp-net-web-service-cannot-connected-12.png" alt="" width="1307" height="856" class="alignnone size-full wp-image-8698" />

ファイアウォールで2点注意があります。

1点目は、デフォルトの **3128ポート** はインストール直後から許可されていますが、異なるポートに変更した場合はファイアウォールの設定も変更する必要があります。
<img src="images/squid-for-windows-asp-net-web-service-cannot-connected-13.png" alt="" width="533" height="695" class="alignnone size-full wp-image-8700" />

2点目は、デフォルトの状態だと 接続できるネットワークが **ローカルサブネット** になっています。
これでは、サーバーがもつ同じネットワーク帯からしか利用することが出来ないため、 **設定を削除** し、 **任意のアドレス** に変更します。
<img src="images/squid-for-windows-asp-net-web-service-cannot-connected-14.png" alt="" width="543" height="695" class="alignnone size-full wp-image-8701" />

<img src="images/squid-for-windows-asp-net-web-service-cannot-connected-15.png" alt="" width="540" height="688" class="alignnone size-full wp-image-8702" />

## あとがき

プロキシサーバーを構築した弊社と、Webサービスを構築した会社様が異なったためなかなか切り分けが進まず接続が成功するまで半年以上要しました。

粘り強く対応できたことで、再構築の発注もいただけた、という結末でした。

それでは次回の記事でお会いしましょう。