---
title: "[CentOS 7.4] GNOME環境にログインした時だけ実行されるスタートアップスクリプトを書く"
date: 2018-03-19
author: jinna-i
tags: [CentOS, Linux]
---

こんちには、じんないです。

今回は、CentOS 7でGNOME環境にログインしたときだけ実行されるスタートアップスクリプトを書いてみます。

`/etc/profile`などもログイン時に実行されるためここに書いてもよいのですが、SSHログインしたときも実行されるため適切ではありません。

場合によってはwarningがでることもあります。

## 想定環境

* CentOS 7.4
* GNOMEデスクトップ環境

## キック用の.desktopファイルを作成する

GNOME環境にログインしたら、`/etc/xdg/autostart/`配下の`.desktop`が実行されます。

ユーザーの個別設定では`~/.config/autostart/`配下です。

まずは、この下にスタートアップスクリプトをキックするための`.desktop`ファイルを用意します。

今回は**kick.desktop**にしました。もっといい名前があると思いますがお好みで。

中身はこんな感じです。

``` bash
[Desktop Entry]
Name=Startup Settings
Type=Application
Exec=/usr/libexec/startup.sh
OnlyShowIn=GNOME;
NoDisplay=true
```

`Exec`に実行したいスタートアップスクリプトのパスを書きます。

今回はGNOMEデスクトップを使用しているので、`OnlyShowIn`は`GNOME;`にしておきましょう。

KDEやUnityなどお使いのデスクトップにあわせて変更してください。


## 実行したいスタートアップスクリプトを書く

パスはユーザー権限でアクセスできる場所ならどこでもいいですが、`/usr/libexec/startup.sh`にしました。

今回は例としてデスクトップ上部に日付を表示させてみます。

``` bash
#!/usr/bin/bash

# show date
gsettings set org.gnome.desktop.interface clock-show-date 'true'
```

作成したら、chmodでパーミッションを755とかに変えておきます。

あとはログインしなおすだけです！


clock-show-dateが**false**のとき↓　曜日が表示される
<a href="images/centos74-gnome-startup-script-1.png"><img src="images/centos74-gnome-startup-script-1.png" alt="" width="266" height="27" class="alignnone size-full wp-image-6862" /></a>

clock-show-dateが**true**のとき↓　日付が表示される。
<a href="images/centos74-gnome-startup-script-2.png"><img src="images/centos74-gnome-startup-script-2.png" alt="" width="312" height="28" class="alignnone size-full wp-image-6863" /></a>


SSHでコマンドラインからログインしたときに必要でないスクリプトは、上記の手順で分けて書いておきましょう。

ではまた。