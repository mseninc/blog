---
title: オンプレミス GitLab に GitHub.com のリポジトリをインポートする
date: 2019-07-04
author: kenzauros
tags: [GitLab, GitHub, Web]
---

今回は Docker で立ち上げた社内 **GitLab に GitHub のリポジトリをインポート**する方法を紹介します。かなり簡単です。

## 前提条件

GitLab は立ち上がっている前提とします。

- GitLab バージョン: CE 11.11.3

この記事は 2019年6月 時点の情報を元にしています。

## モチベーション

弊社は **GitHub** をソースコード管理に使っていますが、やはりクラウドサービスであることから、一定のサービス消滅、データ消失の不安はあります。

IT システム開発会社にとってソースコードは命なので、失われてしまっては事業継続がままなりませんが、 **GitHub 上でやりとりされている Issue や Pull request といったある種のログ情報もナレッジベースとして非常に重要な資産**です。

Git の場合、ソースコードは各開発者の手元にある程度のクローンが残りますが、 Issue や PR は通知が Slack に残るぐらいなので、一本の流れとしてやりとりをさかのぼるには無理があります。

今回は GitHub とは物理的に異なる場所に、これらのソースコードと Issue や PR をバックアップできることを目標としています。

## GitHub リポジトリのインポート

### GitHub の Personal Access Token の生成

まずは **GitHub** 側での操作です。

GitHub の **[Personal setting](https://github.com/settings/profile)** ページを開き、 **[developer settings]** をクリックします。

<a href="images/import-github-repositories-to-gitlab-1.png"><img src="images/import-github-repositories-to-gitlab-1.png" alt="Generate Personal Access Token in GitHub for Importing repositories to GitLab" width="1143" height="739" class="aligncenter size-full wp-image-10216" /></a>

左メニューの **[Personal access tokens]** をクリックし、 **[Generate new token]** をクリックします。

<a href="images/import-github-repositories-to-gitlab-2.png"><img src="images/import-github-repositories-to-gitlab-2.png" alt="Generate Personal Access Token in GitHub for Importing repositories to GitLab" width="1143" height="739" class="aligncenter size-full wp-image-10217" /></a>

New personal access token 画面では **[Select scopes] で [repo] スコープ**を選択します。これでこのトークンでリポジトリ操作が可能になります。

[Note] には自分で何のために発行したかわかるように注釈を書いておきましょう。

**[Generate token]** をクリックするとトークンが生成されます。

<a href="images/import-github-repositories-to-gitlab-3.png"><img src="images/import-github-repositories-to-gitlab-3.png" alt="Generate Personal Access Token in GitHub for Importing repositories to GitLab" width="1143" height="640" class="aligncenter size-full wp-image-10218" /></a>

トークン一覧画面でチェックマークのついたものが今生成されたトークンです。**コピーボタンを押してコピー**します。このトークンは二度と表示できませんので、必要な場合はメモっておきます。ただし、忘れた場合は古いものを失効 (Delete) させて再発行すればいいので、あまりどこかに置いておかないほうがいいでしょう。

<a href="images/import-github-repositories-to-gitlab-4.png"><img src="images/import-github-repositories-to-gitlab-4.png" alt="Generate Personal Access Token in GitHub for Importing repositories to GitLab" width="1143" height="739" class="aligncenter size-full wp-image-10226" /></a>


### GitLab に GitHub リポジトリをインポート

ここからは **GitLab** での操作です。

GitLab を開き、メニューバーの + ボタンから **[New project]** を選択します。

<a href="images/import-github-repositories-to-gitlab-5.png"><img src="images/import-github-repositories-to-gitlab-5.png" alt="GitLab New Project" width="1143" height="739" class="aligncenter size-full wp-image-10213" /></a>

**[Import project]** タブから **[GitHub]** を選択します。

<a href="images/import-github-repositories-to-gitlab-6.png"><img src="images/import-github-repositories-to-gitlab-6.png" alt="GitLab Import Project from GitHub" width="1143" height="739" class="aligncenter size-full wp-image-10214" /></a>

**[Personal Access Token]** というテキストボックスに先ほど生成したトークンを貼り付け、 **[List your GitHub repositories]** をクリックします。

<a href="images/import-github-repositories-to-gitlab-7.png"><img src="images/import-github-repositories-to-gitlab-7.png" alt="Set GitHub Personal Access Token To GitLab" width="1143" height="739" class="aligncenter size-full wp-image-10220" /></a>

次の画面で自分が権限を持っている GitHub リポジトリの一覧が表示されます。

**[From GitHub]** 列が GitHub のリポジトリ名、 **[To GitLab]** 列が GitLab にどういう名前でインポートするかの設定です。所有者 (画像では root になっている) とリポジトリ名を設定し、 **[Import]** ボタンをクリックすると、そのリポジトリのインポートが開始されます。

<a href="images/import-github-repositories-to-gitlab-8.png"><img src="images/import-github-repositories-to-gitlab-8.png" alt="Import GitHub repository to Gitlab" width="1143" height="739" class="aligncenter size-full wp-image-10221" /></a>

ちなみに複数リポジトリの [Import] をクリックすると、スケジュールされて順次インポートが実行されます。

### インポート結果

しばらくするとインポートが完了し、リポジトリが表示できます。 Git としてのコミット記録やブランチだけでなく、 **Issue** や **Merge Requests** (GitHub の Pull request) も移行できていることがわかります。

<a href="images/import-github-repositories-to-gitlab-9.png"><img src="images/import-github-repositories-to-gitlab-9.png" alt="Imported GitHub repository to Gitlab" width="1346" height="945" class="aligncenter size-full wp-image-10222" /></a>

Issue やマージリクエストを開いてみると、コメント内にある、**別の Issue や PR へのリンクも機能している**ことがわかります。

<a href="images/import-github-repositories-to-gitlab-10.png"><img src="images/import-github-repositories-to-gitlab-10.png" alt="Imported GitHub repository to Gitlab" width="1346" height="945" class="aligncenter size-full wp-image-10223" /></a>

ただし、Issue やマージリクエスト、コメントの発言者は GitLab のシステム上はすべてインポートしたユーザーになり、 GitHub で投稿したユーザーは `Created by: ユーザー名` という形でコメントの一部として記述されます。

同じユーザーがいないので当たり前といえば当たり前ですが、 GitHub ユーザーにリンクするとかしてこのあたりだけもう少し改善されないかなと思います。

## 課題

### Git LFS

さて、無事取り込めたように思えたリポジトリですが、実は **Git LFS が有効なリポジトリで LFS 管理されているファイルが GitLab 側に存在していません**。このため、それらのファイルを開こうとすると 404 Not Found になってしまいます。

GitLab 側は LFS を有効にしてあるのですが、今のところ解決していません。これが実現できないとバックアップとしては片手落ちな感じです。

### 定期的なバックアップ

インポートはけっこういい感じにできますが、その後の同期をとることができません。

同期しなおすには、一度 GitLab のリポジトリを削除して、再度インポートしなおさなければなりません。

手動でやるのはなかなか面倒な（というか現実的でない）ので、自動化できないか検討中です。