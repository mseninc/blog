---
title: IFTTTでOffice365の新着メールをSlackに通知する方法
date: 2016-06-17
author: kiyoshin
tags: [Slack, Office365, IFTTT, その他, ライフハック]
---

## IFTTT（イフト)とは
IFTTT(イフト)とは、「レシピ」と呼ばれるWebサービス同士を連携させて作ったトリガープログラムを簡単に実装できるサービスです。このサービスの特徴である「if this then that」の頭文字ををとってIFTTTです。

例えば

* (if) もし
* (this) Office365 outlookにメールが来た
* (then) 時、場合
* (that）指定したSlackのチャンネルにタイトルと本文を通知する

という事ができます。
## IFTTTのアカウント登録
IFTTT 公式
[https://ifttt.com/](https://ifttt.com/)

公式サイトにアクセスし、下記の画像の赤枠部分(Sign Up)をクリックしてください。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-1.jpg" alt="IFTTTホーム画面" width="1257" height="480" class="aligncenter size-full wp-image-881" />

メールアドレスと、パスワードの登録画面が出てきたら入力し、Create accountをクリックします。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-2.jpg" alt="IFTTTアカウント登録画面" width="898" height="568" class="aligncenter size-full wp-image-882" />

次に、大きい英文字が書かれた画面が出てきたらthisの部分をクリックします。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-3.jpg" alt="LINE_P2016613_132757" width="806" height="343" class="aligncenter size-full wp-image-883" />

そして、赤枠の中にあるthatをクリックします。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-4.jpg" alt="アカウント登録クリック" width="937" height="384" class="aligncenter size-full wp-image-897" />

以下の画面が表示されたらContinueをクリックします。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-5.jpg" alt="アカウント登録 Continue" width="1346" height="571" class="aligncenter size-full wp-image-898" />

Continueを押した後、次のような画面が表示されると思います。この画面では「興味のあるサービス」や「使ってるサービス」を選択して下さい。**3つ以上選ばないと先に進めない仕様**です。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-6.jpg" alt="興味のあるサービスを3つ選択" width="993" height="653" class="aligncenter size-full wp-image-884" />

選択すると、画面が切り替わり、Recipe for you と表示された後、先ほど選択したサービスを元に色々な組み合わせのレシピを自動で作ってくれます。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-7.jpg" alt="サービス組み合わせ一覧" width="1345" height="667" class="aligncenter size-full wp-image-901" />

これで、アカウントの登録は完了しました。  
## IFTTTでサービスを連携させる
オリジナルの連携パターン（recipe：レシピ）を作ります。以下の赤枠で囲まれた位置にあるMy Recipesと書かれた部分をクリックします。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-8.jpg" alt="MyRecipes" width="1171" height="554" class="aligncenter size-full wp-image-907" />

赤枠で囲まれたCreateRecipeをクリックします。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-9.jpg" alt="レシピの作成" width="1116" height="614" class="aligncenter size-full wp-image-886" />

### Recipeのthisの設定
クリックすると、様々なサービスのアイコンが出てきますので、自分が起点とさせたいサービスを選択します。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-10.jpg" alt="トリガー設定" width="1105" height="490" class="aligncenter size-full wp-image-887" />

今回はOutlookメールで行いたいと思います。Outlookの場合は、Office 365 Mailを選択します。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-11.jpg" alt="1465804998297" width="1343" height="663" class="aligncenter size-full wp-image-908" />

Office 365をクリックすると以下の画面が表示されます。そのままConnectをクリックしてください。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-12.jpg" alt="trigger選択" width="1134" height="420" class="aligncenter size-full wp-image-888" />

クリックすると、OutlookのIDとパスワードを求められると思います。入力して完了してください。完了すると下記の画面が表示されるので赤枠部分をクリックしてください。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-13.jpg" alt="triggerの設定" width="1345" height="661" class="aligncenter size-full wp-image-911" />

次にthisの部分を、どの条件にするかを選択します。以下の画像の通り3つのパターンを選択できます。

* 受信ボックスにメールが来た時（画像左）
* 設定した人からメールを受信した時(画像中央）
* 優先度の高いメールを受信した時(画像右）

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-14.jpg" alt="トリガーの選択" width="1124" height="394" class="aligncenter size-full wp-image-889" />

#### Any New Emailを選択した場合
以下の画像の様な画面が表示されます。Create Triggerをクリックしてください。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-15.png" alt="Any new email" width="1089" height="411" class="aligncenter size-full wp-image-937" />

#### New email fromを選択した場合
Sender's addressの部分に、メールが来た時に通知して欲しいメールアドレスを入力します。入力したらCreate Triggerをクリックしてください。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-16.jpg" alt="1465878734090" width="1097" height="424" class="aligncenter size-full wp-image-940" />

#### New high priority emailを選択した場合
以下の画像の様な画面が表示されます。Create Triggerをクリックしてください。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-17.png" alt="New_high_priority_email" width="1094" height="389" class="aligncenter size-full wp-image-938" />


### Recipeのthatの設定
thatは、thisで設定した条件が満たされた時に何をさせるのかを設定します。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-18.jpg" alt="IFTTTのthatの使い方" width="997" height="310" class="aligncenter size-full wp-image-890" />

今回はSlackに通知をさせるので、Slackを選択します。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-19.jpg" alt="thatにSlackを選択" width="1065" height="484" class="aligncenter size-full wp-image-949" />

SlackはPost to channelの選択肢のみですので、Post to channelをクリックしてください。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-20.png" alt="slack post to channel" width="1034" height="435" class="aligncenter size-full wp-image-951" />

以下の画面が表示されたら、設定をしてください。フォームにカーソルを合わせると画像のようにフラスコマークが表示され、クリックすると追加したい要素のタグを追加できます。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-21.png" alt="IFTTT_Slack_config" width="748" height="974" class="aligncenter size-full wp-image-952" />

* Which channel? :通知投稿したい、Slackのchannnelを選択します。
* Messege : Slackの本文に表示したいものを選択します。
* Title : Slackに通知される時のタイトルに何を表記するかを設定します。
* Title URL : タイトルにURLを追加します。
* Thumbnail URL : 追加したURLのサムネイルをスラック上で表示します。

入力出来たら、Create Actionをクリックします。

以下の画面が表示され、間違いがなければ、Create a Recipeをクリックします。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-22.jpg" alt="LINE_P2016613_133725" width="820" height="493" class="aligncenter size-full wp-image-894" />

以下の画面が表示されたら、Recipeの作成は完了です。実際にメールを送信し、Slackに通知されるか確認してみましょう。**IFTTTは15分くらいラグがある時があります**。設定は間違っていないけれど、通知が来ない場合は赤枠部分の更新マークを押してみてください。

<img src="images/new-mail-notification-from-office365-to-slack-with-ifttt-23.jpg" alt="LINE_P2016613_140938" width="854" height="449" class="aligncenter size-full wp-image-896" />

IFTTTは、一つだけの設定だけでなくいくつかを連携させて、使えるので組み合わせ方次第で相当効率化されると思います。