---
title: Web アプリケーション脆弱性診断ツールOWASP ZAPを使ってみた
date: 2016-09-27
author: norikazum
tags: [セキュリティ, その他の技術]
---

こんにちは。

今回、Web アプリケーション脆弱性診断ツールの **OWASP(Open Web Application Security Project)　ZAP** を使ってみた感触をレポートします。

## インストール
インストール環境は、Windows Server 2012 R2 です。

前提として JRE が必要となりますので、インストールされていない場合は、[ここ](https://java.com/ja/download/)からインストールしてください。

前提を満たした上で、[ここ](https://github.com/zaproxy/zaproxy/wiki/Downloads) から OWASP ZAP をダウンロードします。

<a href="images/owasp-zap-1.png"><img src="images/owasp-zap-1.png" alt="2016-09-17_00h37_30" width="725" height="438" class="alignnone size-full wp-image-2738" /></a>

その後は以下の流れでインストールします。

<a href="images/owasp-zap-2.png"><img src="images/owasp-zap-2.png" alt="2016-09-17_00h36_25" width="509" height="398" class="alignnone size-full wp-image-2739" /></a>

<a href="images/owasp-zap-3.png"><img src="images/owasp-zap-3.png" alt="2016-09-17_00h36_49" width="511" height="395" class="alignnone size-full wp-image-2740" /></a>

<a href="images/owasp-zap-4.png"><img src="images/owasp-zap-4.png" alt="2016-09-17_00h36_56" width="511" height="395" class="alignnone size-full wp-image-2741" /></a>

<a href="images/owasp-zap-5.png"><img src="images/owasp-zap-5.png" alt="2016-09-17_00h37_04" width="512" height="398" class="alignnone size-full wp-image-2742" /></a>

<a href="images/owasp-zap-6.png"><img src="images/owasp-zap-6.png" alt="2016-09-17_00h37_10" width="509" height="395" class="alignnone size-full wp-image-2743" /></a>

<a href="images/owasp-zap-7.png"><img src="images/owasp-zap-7.png" alt="2016-09-17_00h37_17" width="512" height="403" class="alignnone size-full wp-image-2744" /></a>

<a href="images/owasp-zap-8.png"><img src="images/owasp-zap-8.png" alt="2016-09-17_00h37_46" width="509" height="395" class="alignnone size-full wp-image-2745" /></a>

インストールが完了すると、デスクトップ上に以下のアイコンが作成されます。

<a href="images/owasp-zap-9.png"><img src="images/owasp-zap-9.png" alt="2016-09-17_00h37_54" width="87" height="97" class="alignnone size-full wp-image-2746" /></a>

## 使ってみる

デスクトップに作成されたアイコンをダブルクリックします。

<a href="images/owasp-zap-9.png"><img src="images/owasp-zap-9.png" alt="2016-09-17_00h37_54" width="87" height="97" class="alignnone size-full wp-image-2746" /></a>

利用許諾を同意(Accept)します。

<a href="images/owasp-zap-10.png"><img src="images/owasp-zap-10.png" alt="2016-09-17_00h50_20" width="798" height="596" class="alignnone size-full wp-image-2749" /></a>

起動中。

<a href="images/owasp-zap-11.png"><img src="images/owasp-zap-11.png" alt="2016-09-17_00h51_16" width="427" height="457" class="alignnone size-full wp-image-2750" /></a>

初回の問い合わせは以下のように設定してOKをクリックします。

<a href="images/owasp-zap-12.png"><img src="images/owasp-zap-12.png" alt="2016-09-17_00h51_39" width="401" height="231" class="alignnone size-full wp-image-2751" /></a>

弊社Blogに対して、攻撃をしてみます。（みなさんはマネしないでくださいね！）

<a href="images/owasp-zap-13.png"><img src="images/owasp-zap-13.png" alt="2016-09-17_00h53_16" width="1094" height="598" class="alignnone size-full wp-image-2752" /></a>

進行します。（ちょっとどきどき）

<a href="images/owasp-zap-14.png"><img src="images/owasp-zap-14.png" alt="2016-09-17_00h54_41" width="1090" height="276" class="alignnone size-full wp-image-2753" /></a>

完了すると、アラートの部分で確認できます。説明も日本語で非常にわかり易いです。

<a href="images/owasp-zap-15.png"><img src="images/owasp-zap-15.png" alt="2016-09-17_00h59_01" width="902" height="359" class="alignnone size-full wp-image-2755" /></a>

## あとがき

前項のアラート画像は、セキュリティをさらすことになるのでボカシを入れさせていただきました(笑)

大きな脆弱はなく安心でした。

このように手軽に基本的なチェックができるオープンソースがあることは助かりますね。

これらのチェックを実施することで安心はできませんが1つの指標になると思います。

注意点は、これらは攻撃と同じようにチェックするため ZAP を起動してすぐの注意書きにもありますが、チェック対象にするサイトへは必ず同意の上実施してください。

<a href="images/owasp-zap-16.png"><img src="images/owasp-zap-16.png" alt="2016-09-17_01h03_11" width="690" height="53" class="alignnone size-full wp-image-2756" /></a>

それではまた次回お会いしましょう。