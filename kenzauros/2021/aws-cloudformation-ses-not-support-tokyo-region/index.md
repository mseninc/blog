---
title: "AWS CloudFormation で AWS::SES のリソースは東京リージョンで（まだ）使えないという話"
date: 
author: kenzauros
tags: [CloudFormation, AWS, Amazon SES]
---

CloudFormation で **SES (Simple Email Service)** の設定をしたくて、テンプレートを書いたら、下記のようなエラーに見舞われました。

> An error occurred (ValidationError) when calling the CreateStack operation: Template format error: Unrecognized resource types: [AWS::SES::ConfigurationSetEventDestination, AWS::SES::ConfigurationSet]

「*AWS::SES::ConfigurationSet など知らん*」とおっしゃっています。いやいや公式に [ドキュメント](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html) ありますやん。

## リージョン対応できていない

調べてみると東京リージョンだけでなく、世界のいろんなリージョンでまだ使えない模様です。下記の Issue では世界中のみなさまがブーイングしておられますが、最初のほうに中の人からコメントがあります。

> Not a bug, but a lagging deployment. We need to update our coverage to include the recent SES regions. That includes most of the types for the AWS::SES namespace (with the exception of AWS::SES::ConfigurationSet which is using the new Registry + CLI modelling). We are likely to migrate the other types to the new model before extending regional support. So, keep an eye on this repository.  
> <cite>[AWS::SES::Template - AWS::SES regional availability · Issue #326 · aws-cloudformation/cloudformation-coverage-roadmap](https://github.com/aws-cloudformation/cloudformation-coverage-roadmap/issues/326)</cite>

テキトーな意訳です。

> バグじゃなくって遅れてるだけ。最近のリージョン含めるにはカバレッジ更新しなきゃいけないんだけどね。これには AWS::SES 名前空間のほとんどの型が含まれてるよ（～中略～）リージョンのサポートを広げる前に他の型を新しいモデルに移行しなきゃなんないのよ。ま、このリポジトリを見守ってよ。

このコメントが 2020年1月 なのでなんとも呑気な感じです。移行のあたりの詳細は不要ですが、実際、バージニア北部 (us-east-1) リージョンで試すとすんなりといけました。

しかし SES のリージョンが東京ですので、バージニアにデプロイできても、その ConfigurationSet は使えません😭

## まとめ

2021/11/8 現在、東京リージョンでは使えません。テストは終わっていて、リリースがされていない状態のようですので、早く利用可能になることを祈ります。

せめてドキュメントには利用可能リージョンの記載があるといいですね。
