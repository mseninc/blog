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
<a href="images/register-multiple-start-pages-for-ie11-by-windows-registry-1.png"><img src="images/register-multiple-start-pages-for-ie11-by-windows-registry-1.png" alt="" width="414" height="246" class="aligncenter size-full wp-image-4904" /></a>

<a href="images/register-multiple-start-pages-for-ie11-by-windows-registry-2.png"><img src="images/register-multiple-start-pages-for-ie11-by-windows-registry-2.png" alt="" width="634" height="141" class="aligncenter size-full wp-image-4905" /></a>

文字列を編集します。ここではGoogleを指定しました。これが1つ目のタブになります。
<a href="images/register-multiple-start-pages-for-ie11-by-windows-registry-3.png"><img src="images/register-multiple-start-pages-for-ie11-by-windows-registry-3.png" alt="" width="404" height="199" class="aligncenter size-full wp-image-4906" /></a>

Googleが表示されました。
<a href="images/register-multiple-start-pages-for-ie11-by-windows-registry-4.png"><img src="images/register-multiple-start-pages-for-ie11-by-windows-registry-4.png" alt="" width="1146" height="722" class="aligncenter size-full wp-image-4907" /></a>

## 応用で複数タブを設定

1. 応用で2つ、3つと同時に多分を設定してみます。
同じキー位置に、新規で**複数行文字列値**を**Secondary Start Pages**という名前で作成します。
<a href="images/register-multiple-start-pages-for-ie11-by-windows-registry-5.png"><img src="images/register-multiple-start-pages-for-ie11-by-windows-registry-5.png" alt="" width="607" height="74" class="aligncenter size-full wp-image-4908" /></a>

1. 文字列を編集し、2つめのタブにYahoo、3つめのタブにMSNを指定します。
タブごとに改行で追記します。2つ目のあとに改行をいれておきます。
<a href="images/register-multiple-start-pages-for-ie11-by-windows-registry-6.png"><img src="images/register-multiple-start-pages-for-ie11-by-windows-registry-6.png" alt="" width="372" height="387" class="aligncenter size-full wp-image-4909" /></a>
入れないとエラーになります。
<a href="images/register-multiple-start-pages-for-ie11-by-windows-registry-7.png"><img src="images/register-multiple-start-pages-for-ie11-by-windows-registry-7.png" alt="" width="385" height="134" class="aligncenter size-full wp-image-4910" /></a>
エラーになるのですが、OKを押せば正しい状態に補正されるのでエラーは特に気にする必要はありません。
1. IEを新規で開くと、正しく3つ表示されました。
<a href="images/register-multiple-start-pages-for-ie11-by-windows-registry-8.png"><img src="images/register-multiple-start-pages-for-ie11-by-windows-registry-8.png" alt="" width="1146" height="829" class="aligncenter size-full wp-image-4911" /></a>

## あとがき

スタートページ1つにする場合は、**Secondary Start Pages**を空欄にすればOKです。
<a href="images/register-multiple-start-pages-for-ie11-by-windows-registry-9.png"><img src="images/register-multiple-start-pages-for-ie11-by-windows-registry-9.png" alt="" width="372" height="387" class="aligncenter size-full wp-image-4916" /></a>

この方法はプロファイルに依存せず、環境を整えたい場合などに使えると思います。

これらの方法は、ドメイン環境であればグループポリシーを利用して実施することがよいと思いますがいろいろなケースで複合したいケースが実際にはでてくるので1つの選択肢として覚えておくといいかもしれません。

実際に私の関わるネットブート環境でもこの方法が利用されています。

それでは、次回の記事であいましょう。