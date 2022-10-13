---
title: AWS CLI で全リージョンの Lambda 関数を一覧表示する
date: 2022-08-19
author: kenzauros
tags: [AWS, Node.js, Lambda, bash]
description: 
---

こんにちは、kenzauros です。

AWS から Node.js 12 終了のお知らせが届いたので、**すべてのリージョンにある Node.js 12 の Lambda 関数**を列挙してみました。

## 前提

- Ubuntu 20.04 on WSL (Windows 11 Pro)
- aws-cli 2.2.22
- Python 3.8.8
- jq 1.6

jq が入っていない場合は apt などでインストールしておきます。

## 概要

2022年8月17日、 AWS から下記のようなメールが届きました。

> お客様の AWS アカウントに現在 Node.js 12 ランタイムを使用した Lambda 関数が 1 つ以上あることが確認されましたので、ご連絡させて頂いています。
> 
> AWS Lambda での Node.js 12 のサポートを終了する予定です。これは、2022 年 4 月 30 日に迎えた Node.js 12 のサポート終了 (EOL) に伴うものです [1]。
> 
> Lambda ランタイムサポートポリシー [2] に記載されているように、Lambda での言語ランタイムのサポートの終了は 2 段階で行われます。2022 年 11 月 14 日以降、Lambda は Lambda 関数で使用される Node.> js 12 ランタイムにセキュリティパッチやその他アップデートを適用しなくなり、Node.js 12 を使用する関数は、テクニカルサポートの対象外となります。さらに、Node.js 12 ランタイムを使用する新しい > Lambda 関数を作成できなくなります。2022 年 12 月 14 日以降、Node.js 12 ランタイムを使用している既存の関数のアップデートはできなくなります。
> 
> 2022 年 11 月 14 日より前に、既存の Node.js 12 を使用する関数を Node.js 16 にアップグレードすることをお勧めします。
> 
> サポートの終了は、関数の実行には影響しません。関数は引き続き実行されます。しかしながら、AWS Lambda チームによる保守やパッチ適用がされない、サポートされていないランタイムで実行されることとなり> ます。
> 
> 次のコマンドは、AWS CLI [3] を使用して、特定のリージョン内の Node.js 12 を使用しているすべての関数を一覧表示する方法を示しています。お客様のアカウント内のこのような関数をすべて確認するには、> リージョンごとに次のコマンドを繰り返してください。
> 
> aws lambda list-functions --function-version ALL --region us-east-1 --output text --query "Functions[?Runtime=='nodejs12.x'].FunctionArn"

要するに **「2022年11月14日以降は、新規作成も更新もできなくなって、サポートの対象外になるから知らんよ」**、ということです。

ご丁寧に CLI を使った確認方法まで記載してくれています。ただ、複数のリージョンを使っている場合は、このコマンドをリージョンごとに実行する必要があるので、面倒です。

ということで Shell Script を使って、全リージョンの Node.js 12 の Lambda 関数を確認してみました。

## Shell Script

AWS CLI の **`aws ec2 describe-regions`** でリージョン情報が取得できるので、そこから jq でリージョン名のみを取り出し、ループで回しているだけです。

ちゃんと改行して書くと下記のような感じです。

```bash:title=bash
for region in $(aws ec2 describe-regions --profile <プロファイル名> | jq -r '.Regions[].RegionName'); do
    echo $region;
    aws lambda list-functions --function-version ALL --region $region --query "Functions[?Runtime=='nodejs12.x'].FunctionArn" --profile <プロファイル名>;
done
```

ループの中身はほぼ Amazon からのメールにあるコマンド `aws lambda list-functions` です。クエリー `--query "Functions[?Runtime=='nodejs12.x'].FunctionArn"` によって、ランタイムで絞り、 ARN だけを表示させているのがミソですね。

配列で表示されたほうが見やすいので、 `--output text` は省略しています。プロファイル名指定 (`--profile <プロファイル名>`) は不要なら削除してください。

ワンライナーの場合は改行を取り除くだけです。

```bash:title=bashワンライナー
for region in $(aws ec2 describe-regions --profile <プロファイル名> | jq -r '.Regions[].RegionName'); do echo $region; aws lambda list-functions --function-version ALL --region $region --query "Functions[?Runtime=='nodejs12.x'].FunctionArn" --profile <プロファイル名>; done
```

## 実行結果

下記のような感じで Node.js 12 をランタイムとして使っていた Lambda 関数が順に表示されます。

```bash:title=bash
$ for region in $(aws ec2 describe-regions --profile <プロファイル名> | jq -r '.Regions[].RegionName'); do echo $region; aws lambda list-functions --function-version ALL --region $region --query "Functions[?Runtime=='nodejs12.x'].FunctionArn" --profile <プロファイル名>; done
eu-north-1
[]
ap-south-1
[]
eu-west-3
[]
eu-west-2
[]
eu-west-1
[]
ap-northeast-3
[]
ap-northeast-2
[]
ap-northeast-1
[
    "arn:aws:lambda:ap-northeast-1:000000000000:function:HogeHogeFunc1:$LATEST",
    "arn:aws:lambda:ap-northeast-1:000000000000:function:HogeHogeFunc2:$LATEST",
    "arn:aws:lambda:ap-northeast-1:000000000000:function:HogeHogeFunc3:$LATEST"
]
sa-east-1
[]
ca-central-1
[]
ap-southeast-1
[]
ap-southeast-2
[]
eu-central-1
[]
us-east-1
[]
us-east-2
[]
us-west-1
[]
us-west-2
[]
```

私の場合、幸い東京リージョンにしか Node.js 12 の Lambda 関数は存在しませんでした。

## まとめ

今回は AWS 全リージョンのラムダ関数を一覧にしてみましたが、応用すれば全リージョンのいろいろなリソースを列挙できます。

どなたかのお役に立てれば幸いです。
