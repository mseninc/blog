---
title: OCNからOffice365のメールが届かない
date: 2015-09-14
author: norikazum
tags: [Office365, 移行記事, その他の技術]
---

MSENの桝田です。
 
さて、先日取引先の方から、「突然メールを送ると変なメールが返ってくるようになった」と言われ、状況を確認すると、以下のメールが届いているとのことでした。
 
```
This is the mail system at host mbkd0137.ocn.ad.jp.
このメールと共に返信されているメールは一つ以上の宛先に対
して配信できませんでした。
I’m sorry to have to inform you that the message returned
below could not be delivered to one or more destinations.
エラーメッセージの原因や対処方法については下記のサイトで
ご案内しております。
http://tech.support.ntt.com/ocn/mail/trouble/errormail/index.html
Solutions for the cause of the error message and please check the following sites.
http://tech.support.ntt.com/ocn/mail/trouble/errormail/index.html
ここから下の部分が【エラーメッセージ】です。
The following is the error message.
—————————————————————–
<masuda@msen.jp>: host msen-jp.mail.protection.outlook.com[213.199.154.23]
said: 550 5.7.1 Service unavailable; Client host [153.149.230.38] blocked
using FBLW15; To request removal from this list please forward this message
to delist@messaging.microsoft.com (in reply to RCPT TO command)
Reporting-MTA: dns; mbkd0137.ocn.ad.jp
X-Postfix-Queue-ID: CBF70400C8A
X-Postfix-Sender: rfc822; xxxx@herb.ocn.ne.jp
Arrival-Date: Mon, 7 Sep 2015 22:14:57 +0900 (JST)
Final-Recipient: rfc822; masuda@msen.jp
Original-Recipient: rfc822;masuda@msen.jp
Action: failed
Status: 5.7.1
Remote-MTA: dns; msen-jp.mail.protection.outlook.com
Diagnostic-Code: smtp; 550 5.7.1 Service unavailable; Client host
[153.149.230.38] blocked using FBLW15; To request removal from this list
please forward this message to delist@messaging.microsoft.com
Re: test.eml
Subject:
Re: test
From:
株式会社xx <xxxx@herb.ocn.ne.jp>
Date:
2015/09/07 22:14
To:
|| MSEN / 桝田 典和 || <masuda@msen.jp>
``` 
 
上記のメールを読み解き、Microsoftに対して、解除申請を出してもらうように依頼すると、以下の返信がありました。
 
```
——– Forwarded Message ——–
Subject:        RE: SRX1303529797ID – Urgent: unblock request
Date:   Wed, 9 Sep 2015 19:27:42 +0000
From:   Microsoft Customer Support
<OLSRV.FOPE.WW.00.EN.WIP.BOM.TS.T01.DLS.ST.EM@css.one.microsoft.com>
To:     ?????? <>, xxxxx@xxxx.ocn.ne.jp
 
 
 
Hello,
 
Thank you for contacting Microsoft Online Services Technical Support.
This email is in reference to ticket number [1303529797], which was
opened in regards to your delisting request for 153.149.230.38.
 
The IP address you submitted has been reviewed and removed from our
block lists.  Please note that there may be a 1-2 hour delay before this
change propagates through our entire system.
 
We apologize for any inconvenience this may have caused you.  As long as
our spam filtering systems do not mark a majority of email from the IP
address as spam-like, your messages will be allowed to flow as normal
through our network.  However, should we detect an increase in spam-like
activity, the IP address may be re-added to our block list.
 
Should you have any further questions or concerns, please feel free to
respond to this email.
 
Thank you again for contacting Microsoft Online Services technical
support and giving us the opportunity to serve you.
 
 
————————————————————————
 
 
— Original Message —
*From* : OLSRV.FOPE.WW.00.EN.WIP.BOM.TS.T01.DLS.ST.EM
*Sent* : Monday, September 7, 2015 1:32:24 PM UTC
*To* : “??????”;
*Subject* : RE: SRX1303529797ID – Urgent: unblock request
 
Hello ,
 
Thank you for your delisting request SRX1303529797ID. Your ticket was
received on (Sep 07 2015 01:31 PM UTC) and will be responded to within
24 hours.
 
Our team will investigate the address that you have requested to be
removed from our blocklist. If for any reason we are not able to remove
your address, one of our technical support representatives will respond
to you with additional information.
 
Regards,
Technical Support
```
 
解除したよ、ということでこの転送メールの送信が成功していたようですが、大手OCNをブロックするOffice365(Microsoft)とは一体・・・。
 
続報あればまた掲載します。
 
以上、桝田がお届けしました。

（本記事は過去ブログからの移行記事です。）