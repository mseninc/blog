---
title: IE11のスタートページに複数のURLをレジストリで設定する方法
date: 2017-08-01
author: norikazum
tags: [Internet Explorer, Windows]
---

こんにちは。

今回は、IE11を新規に開いたとき、指定したURLのタブが3つ表示されるようにインターネットオプションではなくレジストリで登録する方法を紹介します。

レジストリを操作しますので自己責任で注意して操作してください。

## スタートページ設定方法
1. スタートから、`regedit` とタイプしレジストリエディタを開きます。
1. レジストリキー `HKEY_CURRENT_USER\Software\Microsoft\Internet Explorer\Main` を展開します。
1. 新規で**文字列値**を**Start Page**という名前で作成します。
![](images/register-multiple-start-pages-for-ie11-by-windows-registry-1.png)

![](images/register-multiple-start-pages-for-ie11-by-windows-registry-2.png)

文字列を編集します。ここではGoogleを指定しました。これが1つ目のタブになります。
![](images/register-multiple-start-pages-for-ie11-by-windows-registry-3.png)

Googleが表示されました。
![](images/register-multiple-start-pages-for-ie11-by-windows-registry-4.png)

## 応用で複数タブを設定

1. 応用で2つ、3つと同時に多分を設定してみます。
同じキー位置に、新規で**複数行文字列値**を**Secondary Start Pages**という名前で作成します。
![](images/register-multiple-start-pages-for-ie11-by-windows-registry-5.png)

1. 文字列を編集し、2つめのタブにYahoo、3つめのタブにMSNを指定します。
タブごとに改行で追記します。2つ目のあとに改行をいれておきます。
![](images/register-multiple-start-pages-for-ie11-by-windows-registry-6.png)
入れないとエラーになります。
![](images/register-multiple-start-pages-for-ie11-by-windows-registry-7.png)
エラーになるのですが、OKを押せば正しい状態に補正されるのでエラーは特に気にする必要はありません。
1. IEを新規で開くと、正しく3つ表示されました。
![](images/register-multiple-start-pages-for-ie11-by-windows-registry-8.png)

## あとがき

スタートページ1つにする場合は、**Secondary Start Pages**を空欄にすればOKです。
![](images/register-multiple-start-pages-for-ie11-by-windows-registry-9.png)

この方法はプロファイルに依存せず、環境を整えたい場合などに使えると思います。

これらの方法は、ドメイン環境であればグループポリシーを利用して実施することがよいと思いますがいろいろなケースで複合したいケースが実際にはでてくるので1つの選択肢として覚えておくといいかもしれません。

実際に私の関わるネットブート環境でもこの方法が利用されています。

それでは、次回の記事であいましょう。