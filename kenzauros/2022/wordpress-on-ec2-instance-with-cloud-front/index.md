---
title: "[CloudFormation] EC2 でホストしている WordPress を CloudFront で配信する"
date: 
author: kenzauros
tags: [AWS, EC2, WordPress, CloudFront, CloudFormation, Serverless Framework]
description: 
---

今回は EC2 でホストしている WordPress を CloudFront で配信するため、 CloudFormation を使って構築できるようにします。


## 前提

ホストする WordPress は下記の記事で構築したものです。

- [EC2 で PHP 8 と nginx の Docker コンテナーを使って WordPress を動かす](https://mseeeen.msen.jp/wordpress-6-with-docker-php-8-on-aws-ec2-instance/)

図の青枠で囲った*以外*の部分を扱います。

デプロイが簡単なのとパラメーターの管理が楽なので **Serverless Framework v3** を使っていますが、実質的にはほとんど CloudFormation だけです。

スタック外で下記の設定が必要です。

- **Route 53** : でドメインを指定済みであること（この記事では `wp.example.com` として進めます）
- **ACM (Certificate Manager)** : `*.wp.example.com` に対する SSL 証明書を発行済みであること

## スタック構成

今回は下記の 4 つの CloudFormation スタックに分けてデプロイします。独立していたほうがデプロイや削除が容易なのでこの分け方にしています。

分けなくても問題ありませんが、あまり一つのスタックに入れすぎると、更新やロールバックにも時間がかかるため、試行錯誤するときはスタックを分けておくほうがおすすめです。

1. `infra` : 共通リソース (シークレット, VPC, サブネット, EFS, EIP 等)
2. `db` : データベース (RDS インスタンス, DB サブネットグループ)
3. `server` : サーバー (EC2 インスタンス)
4. `cdn` : CloudFront (ログバケット, ポリシー, ディストリビューション)

デプロイも上記の順番で行います。

1 は 2, 3 に必要なリソースを準備します。 1 はほとんど作り直す必要がないと思います。

2 は RDS でデータベースを準備します。初期化が必要になった場合のみ作り直せばよいでしょう。

3 はいろいろ試行錯誤するためにも簡単に作り直しができるように、 EC2 インスタンスのみのスタックにしています。

4 は EC2 インスタンスの WordPress を配信するための CloudFront スタックです。

## スタック

### 共通リソースのデプロイ

他のスタックで使用する VPC などのインフラ周りや、 EC2 インスタンスにマウントする EFS、 Elastic IP などが含まれます。

Serveless Framework を使ったデプロイコマンドは下記のような感じです。

```bash:title=共通リソースのデプロイ
sls deploy --param="domain=<Route 53 でホストしているドメイン名>" --param="sshAllowedCidr=<SSH 接続を許可する CIDR>"
```

パラメーターを2つ指定する必要があります。

もっともリソースの多い


### データベース

続いてデータベース周辺です。 RDS (MySQL) を使います。

```bash:title=データベースのデプロイ
sls deploy
```

*MySQL の t3.micro であれば AWS の初期無料枠で利用できる*ので、検証環境で気軽に試せます。

今回はシングル構成のため、使うリソースは `AWS::RDS::DBSubnetGroup` と `AWS::RDS::DBInstance` のみとシンプルです。

初期無料枠の範囲となるように既定でストレージは 20GB 、インスタンスクラスは t3.micro にしています。

```yml:db/resources.yml(抜粋)
  MyDBSubnetGroup:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupName: !Sub '${AWS::StackName}-subnet-group'
      DBSubnetGroupDescription: !Ref "AWS::StackName"
      SubnetIds:
        Fn::Split:
          - ','
          - !ImportValue '${param:commonResourceStackName}:PrivateSubnetIds' # 👈 ① 共通リソースのプライベートサブネット (①)

  MyDBInstance:
    Type: AWS::RDS::DBInstance
    Properties:
      AllocatedStorage: !Ref DBAllocatedStorage
      DBInstanceClass: !Ref DBInstanceClass
      DBInstanceIdentifier: !Sub '${AWS::StackName}-db'
      Engine: mysql
      DBSubnetGroupName: !Ref MyDBSubnetGroup # 👈 DB サブネットグループを紐付け
      MasterUsername:
        !Sub
          - '{{resolve:secretsmanager:${DbAdminSecret}::username}}'
          - DbAdminSecret: !ImportValue '${param:commonResourceStackName}:DbAdminSecretId' # 👈 SecretsManager の値からユーザー名を割り当て
      MasterUserPassword:
        !Sub
          - '{{resolve:secretsmanager:${DbAdminSecret}::password}}'
          - DbAdminSecret: !ImportValue '${param:commonResourceStackName}:DbAdminSecretId' # 👈 同様にパスワードを割り当て
      BackupRetentionPeriod: 0
      VPCSecurityGroups:
        - !ImportValue '${param:commonResourceStackName}:DbSecurityGroup' # 👈 DB のセキュリティグループを割り当て (②)
```

① DB サブネットグループは共通リソースとして作成したプライベートサブネットを割り当てることで、外部からのアクセスができないようにしておきます。

② 共通リソースで作成したセキュリティグループ (3306 ポート) を割り当てます。これにより EC2 インスタンス (の VPC) ➡ RDS へのアクセスが可能になります。

### SecretsManager の値からユーザー名とパスワードを割り当て

DB のユーザー名とパスワードは、共通リソースで作成した Secrets Manager の Secret (`AWS::SecretsManager::Secret`) から、それぞれ読み取って設定します。

```yml:title=ImportValueとSubと動的パラメーターを使ったSecretの参照
!Sub
    - '{{resolve:secretsmanager:${DbAdminSecret}::username}}'
    - DbAdminSecret: !ImportValue '共通リソーススタックで出力した Secret の ID'
```

ここで `Fn::Sub` に 2 つのパラメーターを指定しています。 **`Fn::Sub` は 2 番目のパラメーターに「変数マップ」 (キーと値のリスト) を指定すると、置換文字列の中でそのキーを指定した値で置き換えることができます。**使いこなすと非常に便利な機能です。

- [Fn::Sub - AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-sub.html)

これを利用して、共通リソースで作成した Secret の ID を `Fn::ImportValue` で読み込み、動的パラメーター (resolve) に与えています。

*CloudFormation の動的パラメーター*は下記のような記述で Secrets Manager の値を取得できます。

- ユーザー名: `{{resolve:secretsmanager:SECRET_ID:username}}`
- パスワード: `{{resolve:secretsmanager:SECRET_ID:password}}`

この `SECRET_ID` を先の方法で置き換えています。CloudFormation の動的パラメータに関しては公式情報もわかりやすいです。

- [動的な参照を使用してテンプレート値を指定する - AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager)



### CDN (CloudFront)


```bash
sls deploy --param="domain=wp.example.com" --param="sslCertificateArn=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/GUID"
```


このスタックの特徴として、**リソース的には EC2 インスタンスとは依存関係がない**ことが挙げられます。このため、ドメインと証明書、オリジン (EC2 インスタンス) のドメイン名さえあれば、 EC2 側が準備できなくともデプロイできます。逆にこの CloudFront スタックを維持したまま EC2 インスタンスを削除したり、再構成することもできます。

[index.html を追加してファイル名を含まない URL をリクエストする - Amazon CloudFront](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/example-function-add-index.html)


