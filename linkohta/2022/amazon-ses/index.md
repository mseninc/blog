---
title: Amazon SES で E メールを自動送信する第一歩
date: 
author: linkohta
tags: [Amazon SES, AWS]
description: Amazon SES で E メールを自動送信する手順を紹介します。
---

link です。

今回は **Amazon SES** を利用して、登録されたメールアドレスに E メールを送信してみます。

## Amazon SES とは

Amazon SES は特価販売などのマーケティング E メールや、注文確認などの取引 E メール、ニュースレターなどの E メールの自動送信を行うシステムを提供するプラットフォームです。

>Amazon SES は、ユーザー自身の E メールアドレスとドメインを使用して E メールを送受信するための、簡単で費用効率の高い方法を提供する E メールプラットフォームです。
>
>例えば、特価販売などのマーケティング E メールや、注文確認などの取引 E メール、ニュースレターなどのその他のタイプの通信文の送信に使用できます。Amazon SES を使用してメールを受信するときは、E メール自動応答システム、E メール登録解除システム、受信 E メールからカスタマーサポートのチケットを生成するアプリケーションなどのソフトウェアソリューションを開発できます。
>
>出典 : [Amazon SESとは？ - Amazon Simple Email Service](https://docs.aws.amazon.com/ja_jp/ses/latest/dg/Welcome.html)

## Amazon SES から E メールを送信してみる

実際に Amazon SES から E メールを送信してみます。

まずは、 Identity 登録を行う必要があります。

### Identity 登録

`Create Identity` をクリックします。

![SES の最初の画面](images/2022-05-18_22h37_10.png)

`Create Identity` 画面で `Identity Type` を `Email address` を選択し、送信先の E メールアドレスを入力します。

入力が完了したら `Create Identity` をクリックします。

![Create Identity 画面](images/2022-05-18_22h38_06.png)

すると、メールアドレスの検証を要求されるため、 AWS から届いた検証用のメールに書かれているリンクをクリックして、検証を完了させます。

![検証メール](images/2022-05-18_22h40_01.png)

検証が完了すると、以下の画面が表示されます。

![検証成功画面](images/2022-05-18_22h40_22.png)

検証完了後に `Verified identities` 画面に行き、登録したメールアドレスのステータスが `Verified` になっていることを確認しましょう。

![登録完了後の Identity](images/2022-05-18_22h41_07.png)

これで、メールアドレスの登録は完了です。

### テストメールを送信

続いて、テストメールを送信してみましょう。

`Verified identities` 画面からテストメールを送信する Identity を選択して、 `Send Test Mail` をクリックします。

![Verified identities 画面](images/2022-05-18_22h42_05.png)

![Send Test Mail 画面](images/2022-05-18_22h42_47.png)

![送信されたテストメール](images/2022-05-18_22h48_40.png)

## まとめ

今回は Amazon SES を利用して、登録されたメールアドレスにメールを送信してみました。

これを利用すれば、様々なメールを一斉送信できるのでぜひ活用していきたいです。

それではまた、別の記事でお会いしましょう。

## 参考サイト

- [Amazon SESとは？ - Amazon Simple Email Service](https://docs.aws.amazon.com/ja_jp/ses/latest/dg/Welcome.html)