---
title: リモートデスクトップで2セッション有効にする方法 - Windows Server 2012 R2
date: 2016-08-15
author: jinna-i
tags: [Windows Server, Windows]
---

はじめましてこんにちは、じんないです。
主にインフラ関係の記事を書いていきます。よろしくお願いいたします。

サーバの構築なんかをしていると、効率よく並行して作業したいってことよくありますよね。
一方でアプリのインストールしながら、もう一方で設定をしたりとか。
そこで今回はWindows Server 2012 R2のリモートデスクトップを2セッション有効にする方法を紹介します。

## グループポリシーの設定
[Windowsキー + R]で「ファイル名を指定して実行」を起動させ、[gpedit.msc]と入力
![j_session_001](images/enable-multiple-session-in-windows-server-2012-r2-1.png)
ローカルグループポリシーエディターが起動します。

[ローカルコンピューターポリシー]-[コンピューターの構成]-[管理用テンプレート]-[Windowsコンポーネント]-[リモートデスクトップサービス]-[リモートデスクトップセッションホスト]-[接続]の順にクリック
![j_session_002](images/enable-multiple-session-in-windows-server-2012-r2-2.png)

下から3つめ、[リモートデスクトップサービスユーザーに対してリモートデスクトップサービスセッションを1つに制限する]をダブルクリック
![j_session_003](images/enable-multiple-session-in-windows-server-2012-r2-3.png)

[未構成]から<span style="color:red;">[無効]</span>に変更
![j_session_004_e](images/enable-multiple-session-in-windows-server-2012-r2-4.png)
[OK]をクリックすれば完了です。再起動の必要はありません。

## 2セッション有効になっていることを確認
対象のサーバにリモートデスクトップ接続をし、2セッションまで入れることを確認します。
![j_session_006_e](images/enable-multiple-session-in-windows-server-2012-r2-5.png)
3セッション目を張ろうとして怒られているの図。

## あとがき
ちょっとした設定でとっても便利になる(しかも無料)ので、試す価値は十分にあると思います。
3セッション以上有効にしたい場合は、別途追加ライセンスを購入する必要があります。

なお、Windows 8やWindows 10などのクライアントOSでは、通常の方法ではマルチセッションにすることはできません。
非サーバーOSで複数接続したい場合は "termsrv.dll" でググると幸せになれるかもしれません。

今後もお役立ち情報を紹介していきます。

ではまた。