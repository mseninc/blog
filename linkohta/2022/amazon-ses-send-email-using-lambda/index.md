---
title: Amazon SES と Lambda を組み合わせて E メールを送る方法
date: 2022-09-05
author: linkohta
tags: [Amazon SES, Lambda, AWS]
description: Amazon SES と Lambda を組み合わせて E メールを送る方法を紹介します。
---

link です。

別の記事で Amazon SES の `Identity` を作成して、テストメールを送信しましたが、今回は Lambda からテストメールを送信する手順を紹介します。

この記事は[Amazon SES で E メールを自動送信する第一歩](https://mseeeen.msen.jp/amazon-ses/)の続きです。

## Lambda から SES にメールを送らせる手順

Lambda から SES にメールを送らせるには以下の手順を踏む必要があります。

1. IAM ロールと IAM ポリシーを作成
2. Amazon SES の `Identity` を作成
3. E メールを送信するための Lambda 関数を作成
4. テストの E メールを送信

これらを紹介していきます。

### IAM ロールと IAM ポリシーを作成

まず、 IAM ロールと IAM ポリシーを作成します。

IAM のポリシー画面に移動して**ポリシーの作成**をクリックします。

![IAM のポリシー画面](images/2022-05-29_16h06_03.png)

JSON を選択して、以下の内容に書き換えたうえで次のステップをクリックします。

```js:title=ポリシーJSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
```

![ポリシーの作成画面](images/2022-05-29_16h12_20.png)

タグ画面は何も設定する必要はありませんので、ポリシーの確認画面まで進めます。

ポリシーの確認画面で適当な名前を設定したらポリシーの作成をクリックします。

![ポリシーの確認画面](images/2022-05-29_16h13_23.png)

次は、 IAM ロールを作成します。

![IAM ロール画面](images/2022-05-29_17h41_48.png)

Lambda を選択して次へをクリックします。

![エンティティを選択画面](images/2022-05-29_17h42_07.png)

先ほど作成した IAM ポリシーにチェックを入れて次へをクリックします。

![許可を追加画面](images/2022-05-29_17h42_22.png)

適当なロール名を入力して、ロール作成を完了させます。

![名前、確認、および作成画面](images/2022-05-29_17h43_04.png)

### Amazon SES の Identity を作成

Amazon SES の `Identity` の作成は[前回の記事](../amazon-ses/)で紹介しましたので、省略させていただきます。前回登録したメールアドレスとは別のメールアドレスにメールを送信させたい場合は前回の記事を参考に新しく登録してください。

### E メールを送信するための Lambda 関数を作成

E メールを送信するための Lambda 関数を作成します。

![Lambda 関数画面](images/2022-05-29_20h24_20.png)

まず、適当な関数名を設定します。

![関数の作成画面](images/2022-05-29_20h25_32.png)

関数を作成後、コードソースの `index.js` を以下のコードに書き換えます。

```js:title=メール送信関数
const aws = require("aws-sdk");
const ses = new aws.SES({ region: "us-east-1" });

exports.handler = function (event) {
    const params = {
        Destination: {
            ToAddresses: ["Address", ...],
        },
        Message: {
            Body: {
                Text: { Data: "Test" },
            },
            Subject: { Data: "Test Email" },
        },
        Source: "SourceAddress",
    };

    return ses.sendEmail(params).promise();
};
```

`region: "us-east-1"` となっている箇所は利用しているリージョンを指定しましょう。

`ToAddresses` には送信先のメールアドレスを、 `SourceAddress` には送信元のメールアドレスを指定します。

いずれも、 SES に登録済みである必要があります。

![コードソース画面](images/2022-05-29_20h27_23.png)

基本設定を編集する画面で既存のロールを作成したロールに変更します。

![基本設定編集画面](images/2022-05-29_20h28_08.png)

これで準備は完了です。

### テストの E メールを送信

コードソース画面の Test ボタンをクリックすることでテストメールを送信できると思います。

クリック後に送信先の E メールを確認して、以下の画像のようなメールが届いているかを確認しましょう。

![送信された E メール](images/2022-05-29_20h51_09.png)

## まとめ

今回は Lambda 関数を使って Amazon SES から E メールを送信してみました。

これでお知らせメールの一斉送信も簡単に構築できると思うので、ぜひ参考にしてみてください。

それではまた、別の記事でお会いしましょう。

## 参考サイト

- [Lambda と Amazon SES を使用して E メールを送信する](https://aws.amazon.com/jp/premiumsupport/knowledge-center/lambda-send-email-ses/)
- [Creating IAM policies (console) - AWS Identity and Access Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html#access_policies_create-start)