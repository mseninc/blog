---
title: Slackで簡単にasanaのタスク通知を受け取る連携方法
date: 2016-08-22
author: kiyoshin
tags: [Slack, その他]
---

タスク管理ツールとして優秀なasanaは、グループでのタスク管理ができたり、グループコミュニケーションチャットのSlackなどと連携させることで、Slackに新規のタスクの割り振りや、今日のタスク、終わってないタスクの通知ができる優秀なサービスです。そんな便利なasanaとSlackの連携方法を紹介したいと思います。

## 事前準備
* Asanaの登録
[https://asana.com/](https://asana.com/)

* Slackの登録
[card url="/slack-registration/"]

## 連携方法
SlackとAsanaを連携させるには、SlackのApp Directoryというwebサイトにアクセスして連携させるサービスを検索し、インストールする必要があります。以下のサイトにアクセスして検索フォームで「asana」と入力して検索してください。入力するとフォーム下に赤枠で囲ったasanaの表示がされると思うのでクリックしてください。

[App Directory](https://slack.com/apps)

![2016-08-16_16h57_52](images/slack_asana_link-1.png)

以下の画面が表示されたら、Installをクリックしてください。

![2016-08-16_17h58_52](images/slack_asana_link-2.png)

インストールが完了すると、asanaの通知を投稿するSlackのチャンネルを指定する画面が出てきます。赤枠で囲った部分をクリックしasanaからの通知を受け取りたいチャンネルを指定して指定すると下の緑になるので緑の部分をクリックして下さい。

![2016-08-16_18h08_08](images/slack_asana_link-3.png)

クリックすると、asanaを認証する画面が出てくるので、赤枠で囲った部分をクリックし認証を完了してください。

![2016-08-16_18h13_15](images/slack_asana_link-4.png)

クリックして認証が完了すると、以下の様な設定画面が表示されます。

![2016-08-16_18h19_40](images/slack_asana_link-5.png)

* Workspace and Projects
個人で使用するのかグループで使用するのか選択します。
* Comment Notifications
asanaでのコメントを任意の人にSlackBotで通知する、統合チャンネルに通知するのどちらか一方か両方か両方利用しないかを選べます。
* Post to Channel
どこにチャンネルに通知するかを設定します。(既に先ほど設定しているはずなので、変更する必要はないです。)
* Descriptive Label
どういったものなのかの説明を書きます。
* Customize Name
Slack上で投稿されるBOTの名前を変更できます。
* Customize Icon
スラック上で投稿するBOTのアイコンを変更します。
* Preview Message
Slack上での見え方を表示しています。

設定が終わったら、Asanaに何かタスクを追加してみましょう。




