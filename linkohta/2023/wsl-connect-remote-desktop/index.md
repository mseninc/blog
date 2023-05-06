---
title: "WSL 上の Ubuntu にリモートデスクトップ接続する方法"
date: 
author: linkohta
tags: [WSL, Ubuntu]
description: "WSL 上の Ubuntu にリモートデスクトップ接続して、 GUI アプリケーションを利用する方法を紹介します。"
---

link です。

Windows 上で Linux を利用する時、 WSL か仮想 PC を作成してインストールすることがほとんどだと思います。

WSL だと GUI を伴うアプリケーションが利用できないため、そういうアプリケーションを利用する場合は仮想 PC を作成する必要がありますが、 Windows の領域を圧迫する問題があります。

そこで WSL 上の Ubuntu にリモートデスクトップ接続して、 GUI アプリケーションを利用する方法を紹介します。

## 想定環境

- Windows 11
- WSL2
- Ubuntu 20.04 以降

## Ubuntu 上での準備

Windows 上から Ubuntu へリモートデスクトップ接続するために **xrdp** をインストールします。また、デスクトップ環境として **LXDE** をインストールします。

```:title=インストールコマンド
$ sudo apt install xrdp
$ sudo apt install lxde
```

xrdp インストール中に以下の画面が表示されると思います。

**gdm3** を選択しましょう。

![xrdpインストール](images/2023-05-06_15h24_10.png)

xrdp のデフォルトのポートは 3389 になっているのでこれを 3390 に置き換えます。

```:title=ポート置換
$ sudo sed -i -e 's/^port=3389/port=3390/g' /etc/xrdp/xrdp.ini
```

リモートデスクトップの接続時に LXDE が起動するように、ホームディレクトリに.`xsessionrc` というファイルを作成します。

```:title=xsessionrc作成
$ echo "export LANG=ja_JP.UTF-8" > ~/.xsessionrc
$ echo "startlxde" >> ~/.xsessionrc
```

Windows 11 からフォントを参照できるようにしておきます。

```:title=フォント設定
$ sudo ln -s /mnt/c/Windows/Fonts/ /usr/share/fonts/windows
$ sudo fc-cache -fv
```

最後に xrdp を再起動して Ubuntu 側の作業は完了です。

```:title=xrdp再起動
$ sudo service xrdp restart
```

## Windows からリモートデスクトップ接続

Windows からリモートデスクトップ接続します。

`localhost:3390` を指定して接続しましょう。

![リモートデスクトップ接続](images/2023-05-06_20h58_19.png)

以下の画面が表示されたら接続成功です。

`username` と `password` に WSL2 で起動したときと同じユーザー名とパスワードを入力して「OK」をクリックします。

![ログイン](images/2023-05-06_20h58_27.png)

以下の画像のようなデスクトップが表示されれば成功です。

![デスクトップ](images/2023-05-06_21h10_54.png)

Thunderbird のようなアプリも使えます。

![Thunderbird](images/2023-05-06_21h27_05.png)

## フォントが気になる場合

デフォルトだとフォントが汚い等で変更したいと思うことがあります。

その場合、以下のように「設定」→「ルックアンドフィールを設定します」からデフォルトのフォントを選択して、変更できます。

![ルックアンドフィールを設定します](images/2023-05-06_15h31_21.png)

![設定画面](images/2023-05-06_15h31_31.png)

## 参考サイト

- [WSL2+ubuntu20.04: GUI化して使う方法 - Qiita](https://qiita.com/atomyah/items/887a5185ec9a8206c7c4)

## まとめ

今回は WSL 上の Ubuntu にリモートデスクトップ接続して、 GUI アプリケーションを利用する方法を紹介しました。

それではまた、別の記事でお会いしましょう。