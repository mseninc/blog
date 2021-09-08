---
title: MFA 認証を有効化した IAM アカウントで AWS CLI コマンドを利用するには
date: 2021-08-19
author: kenzauros
tags: [その他]
---




https://console.aws.amazon.com/iam/home#/security_credentials

arn:aws:iam::560000000000:mfa/yamada

eval `aws sts get-session-token --serial-number <シリアルナンバー> --token-code 123123 | awk ' $1 == "\"AccessKeyId\":" { gsub(/\"/,""); gsub(/,/,""); print "export AWS_ACCESS_KEY_ID="$2 } $1 == "\"SecretAccessKey\":" { gsub(/\"/,""); gsub(/,/,""); print "export AWS_SECRET_ACCESS_KEY="$2} $1 == "\"SessionToken\":" { gsub(/\"/,""); gsub(/,/,""); print "export AWS_SESSION_TOKEN="$2 } '`


[MFA使用時のaws cli 認証方法について | Oji-Cloud](https://oji-cloud.net/2020/03/19/post-4581/)