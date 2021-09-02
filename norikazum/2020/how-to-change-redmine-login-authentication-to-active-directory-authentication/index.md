---
title: Redmine のログイン認証を ActiveDirectory 認証に変更する方法
date: 2020-11-11
author: norikazum
tags: [Redmine, ActiveDirectory, その他の技術]
---

<span style="color:;">こんにちは。

今回は、**Redmine と ActiveDirectory を連携し、ActiveDirectory のユーザーでログイン & ユーザー自動作成を実現** したいと思います。

## 前提
- ActiveDirectory を運用していること
- Redmine を運用していること

## 環境
- ActiveDirectory
    - Windows Server 2016

- Redmine
    - CentOS 8
    - Redmine 4.1.1.stable

## 手順
1. 管理者でログインし、 **管理 → LDAP認証 → 新しい認証方式** をクリックします
<a href="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-1.png"><img src="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-1.png" alt="" width="1573" height="949" class="alignnone size-full wp-image-14545" /></a>

2. 以下を参考に設定を入力し、保存ボタンをクリックします
<a href="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-2.png"><img src="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-2.png" alt="" width="1573" height="949" class="alignnone size-full wp-image-14549" /></a>
ドメイン名が、`example.com` として記載
  1. 任意名
  2. ActiveDirectoryのIPアドレス or DNS名
  3. LDAP
  4. 389
  5. administrator@example.com
  6. 5 のパスワード
  7. DC=example,DC=com
  8. チェックを入れる (ユーザーが存在しないとき自動作成してくれる)
  9. sAMAccountName
  10. givenName
  11. sn
  12. mail

1. テストボタンをクリックし、接続できることを確認します
<a href="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-3.png"><img src="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-3.png" alt="" width="1573" height="949" class="alignnone size-full wp-image-14554" /></a>

以上で設定完了です。

## テスト

ユーザーは admin のみ存在することを確認します。

<a href="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-4.png"><img src="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-4.png" alt="" width="1570" height="1019" class="alignnone size-full wp-image-14556" /></a>

ログアウトし、ActiveDirectoryに登録されているユーザーでログインします。
<a href="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-5.png"><img src="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-5.png" alt="" width="1570" height="1019" class="alignnone size-full wp-image-14557" /></a>

ログインできました！
<a href="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-6.png"><img src="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-6.png" alt="" width="1570" height="1019" class="alignnone size-full wp-image-14558" /></a>

ユーザーが自動生成され、 名前・メールアドレスもActiveDirectoryで設定している値が自動で設定されています。
<a href="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-7.png"><img src="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-7.png" alt="" width="1570" height="1019" class="alignnone size-full wp-image-14559" /></a>

簡単に ActiveDirectory と連携することができました。

試しに、ActiveDirectory のアカウントを無効にしてみると、
<a href="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-8.png"><img src="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-8.png" alt="" width="257" height="27" class="alignnone size-full wp-image-14590" /></a>

ログイン出来なくなりました。
<a href="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-9.png"><img src="images/how-to-change-redmine-login-authentication-to-active-directory-authentication-9.png" alt="" width="1675" height="954" class="alignnone size-full wp-image-14593" /></a>

ユーザー認証を ActiveDirectory に統合できるのでお勧めです。

それでは次回の記事でお会いしましょう。
