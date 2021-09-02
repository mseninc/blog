---
title: 離席時にWindows 10を自動的にロックするダイナミックロック (Dynamic Lock) 機能を使う
date: 2018-01-13
author: norikazum
tags: [Windows 10, その他, ライフハック]
---

こんにちは。

勝手に利用されたりしないためパソコンから離席するときは、画面ロックをされている方も多いと思いますが、誰かに呼ばれたり、他のことを考えてたりなどなど、うっかりロックし忘れてしまうこともあると思います。

そんなうっかり忘れを防ぐために、Windows 10 Creators Updateの新機能で **ダイナミックロック (Dynamic Lock)** があります。

この機能を有効にする流れを紹介します。

## はじめに

**ダイナミックロック** は、ロックしたいパソコンとスマートフォンをBluetoothでペアリングして、スマートフォンとパソコンが一定距離離れたら自動でロックされるという機能です。
記事で利用しているパソコンとスマートフォンのバージョンは以下のとおりです。

- パソコン： Windows 10 Pro バージョン 1709 (Fall Creators Update)
- スマートフォン： Android 6.0.1

## ペアリング

1. **スマートフォン**で、Bluetooth機能をONにします。

1. ロックしたい**パソコン**で、Bluetooth機能をONにします。

1. **スマートフォン**で、設定からBluetoothに進みます。
<a href="images/windows-10-dynamiclock-1.png"><img src="images/windows-10-dynamiclock-1.png" alt="" width="720" height="1280" class="aligncenter size-full wp-image-6396" /></a>

1. **パソコン**で、設定から以下のように操作し、スマートフォンをクリックします。すると確認キーが表示されるので接続をクリックします。
<a href="images/windows-10-dynamiclock-2.png"><img src="images/windows-10-dynamiclock-2.png" alt="" width="1283" height="1000" class="aligncenter size-full wp-image-6377" /></a>
<a href="images/windows-10-dynamiclock-3.png"><img src="images/windows-10-dynamiclock-3.png" alt="" width="1283" height="1000" class="aligncenter size-full wp-image-6378" /></a>
<a href="images/windows-10-dynamiclock-4.png"><img src="images/windows-10-dynamiclock-4.png" alt="" width="687" height="791" class="aligncenter size-full wp-image-6379" /></a>
<a href="images/windows-10-dynamiclock-5.png"><img src="images/windows-10-dynamiclock-5.png" alt="" width="687" height="791" class="aligncenter size-full wp-image-6393" /></a>
<a href="images/windows-10-dynamiclock-6.png"><img src="images/windows-10-dynamiclock-6.png" alt="" width="687" height="791" class="aligncenter size-full wp-image-6397" /></a>

1. **スマートフォン**で、手順3の画面に以下の画面が出るので、手順4で表示されたコードと一致していることを確認し、ペア設定をするをタップします。
<a href="images/windows-10-dynamiclock-7.png"><img src="images/windows-10-dynamiclock-7.png" alt="" width="720" height="1280" class="aligncenter size-full wp-image-6398" /></a>

これでペアリングは完了です。

## ダイナミックロックを有効にする
1. **パソコン**で、設定からアカウントと進み、ダイナミックロックを有効にします。
<a href="images/windows-10-dynamiclock-8.png"><img src="images/windows-10-dynamiclock-8.png" alt="" width="1283" height="1000" class="aligncenter size-full wp-image-6412" /></a>
<a href="images/windows-10-dynamiclock-9.png"><img src="images/windows-10-dynamiclock-9.png" alt="" width="1283" height="1000" class="aligncenter size-full wp-image-6413" /></a>
<a href="images/windows-10-dynamiclock-10.png"><img src="images/windows-10-dynamiclock-10.png" alt="" width="1283" height="1000" class="aligncenter size-full wp-image-6414" /></a>

これで設定は完了です。

## あとがき

スマートフォン側でBluetooth機能をオフにしてみると、ロックされました。

<a href="images/windows-10-dynamiclock-11.jpg"><img src="images/windows-10-dynamiclock-11.jpg" alt="" width="1152" height="648" class="aligncenter size-full wp-image-6417" /></a>

ちなみに Bluetoothの通信可能距離は10m (Class 2) です。

ロック後のログインについては、スマートフォンと接続されているかどうかは無関係です。

マイクロソフトにも紹介されていますので参考にしてください。

- [離席時に Windows 10 PC を自動的にロックする](https://support.microsoft.com/ja-jp/help/4028111/windows-lock-your-windows-10-pc-automatically-when-you-step-away-from)

それでは次回の記事でお会いしましょう。