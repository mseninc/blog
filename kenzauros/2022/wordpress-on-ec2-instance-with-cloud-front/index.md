---
title: "[CloudFormation] EC2 でホストしている WordPress を CloudFront で配信する"
date: 
author: kenzauros
tags: [AWS, EC2, WordPress, CloudFront, CloudFormation, Serverless Framework]
description: 
---

今回は **EC2 でホストしている WordPress を CloudFront で配信するため、 CloudFormation を使って構築**します。


## 前提

ホストする WordPress は下記の記事で構築したものです。

- [EC2 で PHP 8 と nginx の Docker コンテナーを使って WordPress を動かす](https://mseeeen.msen.jp/wordpress-6-with-docker-php-8-on-aws-ec2-instance/)

この記事では下図の青枠で囲った“以外”の部分を扱います。

![アーキテクチャ](images/architecture.png "アーキテクチャ")

デプロイが簡単なのとパラメーターの管理が楽なので **Serverless Framework v3** を使っていますが、実質的にはほとんど CloudFormation だけです。

スタック外で下記の設定が必要です。

- **Route 53** : ドメインを指定済みであること (この記事では `wp.example.com` として進めます)
- **ACM (Certificate Manager)** : `*.wp.example.com` に対する SSL 証明書を発行済みであること


## リポジトリ (GitHub)

デプロイに必要なファイルは下記の GitHub リポジトリに置いてあります。

- [mseninc/wordpress-on-ec2-instance-with-cloud-front - GitHub](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front)

このリポジトリのファイルをベースに、スタック構成を説明していきます。


## スタック構成

今回は下記の **4 つの CloudFormation スタック**に分けてデプロイします。独立していたほうがデプロイや削除が容易なのでこの分け方にしています。

分けなくても問題ありませんが、あまり 1 つのスタックに入れすぎると、更新やロールバックにも時間がかかるため、試行錯誤するときはスタックを分けておくほうがおすすめです。

1. `common` : 共通リソース (VPC, サブネット, EFS, Elastic IP 等)
2. `db` : データベース (RDS インスタンス, DB サブネットグループ)
3. `server` : サーバー (EC2 インスタンス)
4. `cdn` : CloudFront (ログバケット, ポリシー, ディストリビューション)

リポジトリ内のディレクトリ構成は下記の通りです。

- [01_common/](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/tree/main/01_common)
    - [resources.yml](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/blob/main/01_common/resources.yml)
    - [serverless.yml](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/blob/main/01_common/serverless.yml)
- [02_db/](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/tree/main/02_db)
    - [resources.yml](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/blob/main/02_db/resources.yml)
    - [serverless.yml](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/blob/main/02_db/serverless.yml)
- [03_server/](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/tree/main/03_server)
    - [resources.yml](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/blob/main/03_server/resources.yml)
    - [serverless.yml](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/blob/main/03_server/serverless.yml)
- [04_cdn/](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/tree/main/04_cdn)
    - [resources.yml](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/blob/main/04_cdn/resources.yml)
    - [serverless.yml](https://github.com/mseninc/wordpress-on-ec2-instance-with-cloud-front/blob/main/04_cdn/serverless.yml)

それぞれ **`resources.yml` が CloudFormation のスタック**、 **`serverless.yml` が Serverless Framework のコンフィグ**です。

デプロイも上記の順番で行いますが、 3 と 4 は依存していないので入れ替わっても問題ありません (後述)。

1. `common` は 2, 3 に必要なリソースを準備します。このスタックはほとんどデプロイし直す必要がないと思います。

2. `db` は RDS でデータベースを準備します。初期化が必要になった場合のみ再デプロイすればよいでしょう。

3. `server` はいろいろ試行錯誤するためにも簡単にデプロイし直しができるように、 EC2 インスタンスのみのスタックにしています。

4. `cdn` は EC2 インスタンスの WordPress を配信するための CloudFront スタックです。


## スタック詳解


### 共通リソース

#### 含まれるリソース

他のスタックで使用する **VPC などのインフラ周りや、 EC2 インスタンスにマウントする EFS、 Elastic IP** などが含まれます。

- ネットワーク
    - VPC
    - サブネット (パブリックサブネット×2, プライベートサブネット×2)
    - インターネットゲートウェイ
    - ルートテーブル
- ストレージ
    - EFS (ファイルシステム, マウントターゲット)
- セキュリティ
    - セキュリティグループ (EC2 用, EFS 用, RDS 用)
- シークレット
    - EC2 インスタンス用キーペア
    - RDS 認証情報 Secret
- EC2 インスタンス用
    - Elastic IP
    - Route 53 DNS レコード

ネットワークは標準な VPC の構成だと思います。今後の拡張 (サーバーや RDS の冗長化など) を考慮してパブリック、プライベートともに 2 つずつ用意しています。

20 を超えるので少しリソースは多いですが、 1 つ 1 つ見ていけば難しくはないと思います。

特徴的な部分のみ解説します。

#### EC2 キーペア

**EC2 キーペアの秘密鍵は AWS Systems Manager に `/ec2/keypair/key-********` のような名前で格納されます**ので AWS コンソールから確認します。
キーペアの ID は EC2 コンソールの キーペア一覧で確認します。

- [AWS Systems Manager "/ec2/keypair" 一覧 - Parameter Store](https://console.aws.amazon.com/systems-manager/parameters/?tab=Table#list_parameter_filters=Name:Contains:%2Fec2%2Fkeypair)
- [キーペア - EC2 Management Console](https://console.aws.amazon.com/ec2/home#KeyPairs:)

キーペアのパラメーターを開くと下記のように「値」の部分が非表示になっています。

!["EC2 キーペアの SSM パラメーター"](images/ec2-keypair-1.png "EC2 キーペアの SSM パラメーター")

「表示」を押して秘密鍵の内容を表示します。

!["EC2 キーペアの秘密鍵を表示"](images/ec2-keypair-2.png "EC2 キーペアの秘密鍵を表示")

`-----BEGIN RSA PRIVATE KEY-----` から `-----END RSA PRIVATE KEY-----` をファイルに保存すれば秘密鍵として使えます。

#### CloudFront → EC2 のセキュリティグループ

EC2 をオリジンとする CloudFront の構成では、これまで EC2 へのアクセスを CloudFront のみに制限するのが困難でした。しかし、 2022 年から **CloudFront のマネージドプレフィックスリストを使ったアクセス制限** を利用できるようになりました。

- [Amazon CloudFront用のAWS マネージドプレフィックスリストを使用したオリジンへのアクセス制限 | Amazon Web Services ブログ](https://aws.amazon.com/jp/blogs/news/limit-access-to-your-origins-using-the-aws-managed-prefix-list-for-amazon-cloudfront/)

これにより、下記のようにセキュリティグループで設定すれば、オリジン (EC2) へのアクセスを CloudFront からだけに制限できます。

```yml:title=マネージドプレフィックスリストを使用したEC2オリジンへのアクセス制限
# Security Groups for EC2 instance (HTTP)
MySecurityGroupHTTP:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupDescription: Allow HTTP
    VpcId: !Ref MyVPC
    SecurityGroupIngress:
      - IpProtocol: tcp
        FromPort: 80
        ToPort: 80
        SourcePrefixListId: pl-3b927c52 # 👈 us-east-1 の CloudFront の マネージドプレフィックスリスト ID
```

ただ、 CloudFront がグローバルサービスなのにもかかわらず、**マネージドプレフィックスリストの ID は リージョンごとに異なります**。念のために確認しましたが、*どのリージョンも内容は同じ*です。

!["バージニア北部も東京もプレフィックスリストの中身は同じ"](images/cf-prefix-list.png "バージニア北部も東京もプレフィックスリストの中身は同じ")

ということで少し（かなり？）面倒ではありますが、 *VPC のリージョンごとに別の ID を指定*する必要があります。

今回のテンプレートでは冒頭に `Mappings` で リージョンごとのプレフィックスリスト ID を定義しています。これを `!FindInMap ['RegionMap', !Ref 'AWS::Region', 'PrefixListCloudFront']` のようにすることでリージョンに応じたものを指定します。

うん、面倒ですね。後述の AMI ID と同様にパラメータストアで解決できるようにしてほしいところです。

#### Elastic IP と Route 53 DNS レコード

**EC2 インスタンスには Elastic IP を紐付け、その IP アドレスを `server.wp.example.com` というホスト名で Route 53 (DNS) に登録**します。

これで EC2 インスタンスを作成しなおす場合でも Elastic IP のみを付け外しすればよくなります。
また CloudFront からもオリジンのホスト名 `server.wp.example.com` のみを意識すればよくなります。

ただし *Elastic IP は EC2 インスタンスに紐付いていない場合、月額 3.6 USD ほどの料金がかかります*ので注意しましょう。

#### デプロイ

Serveless Framework を使ったデプロイコマンドは下記のようになります。

```bash:title=共通リソースのデプロイ
sls deploy --param="domain=<Route 53 でホストしているドメイン名>" --param="sshAllowedCidr=<SSH 接続を許可する CIDR>"
```

パラメーターを 2 つ指定する必要があります。

1 つは `domain` で、 Route 53 で管理しているドメイン名、ここでは `wp.example.com` です。

もう 1 つは `sshAllowedCidr` で、 EC2 インスタンスへの SSH 接続を許可する IP アドレスの CIDR を指定します。 CIDR は `123.123.123.123/32` のような形式です。


### データベース

データベースには **RDS (MySQL)** を使います。

*MySQL の t3.micro であれば AWS の初期無料枠で利用できる*ので、検証環境で気軽に試せます。初年無料枠の範囲となるように、既定でストレージは 20GB 、インスタンスクラスは t3.micro にしています。

今回は冗長化しないため、使うリソースは `AWS::RDS::DBSubnetGroup` と `AWS::RDS::DBInstance` のみです。


```yml{9}:title=サブネットグループ
  MyDBSubnetGroup:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupName: !Sub '${AWS::StackName}-subnet-group'
      DBSubnetGroupDescription: !Ref "AWS::StackName"
      SubnetIds:
        Fn::Split:
          - ','
          - !ImportValue '${param:commonResourceStackName}:PrivateSubnetIds' # 👈 共通リソースのプライベートサブネット
```

DB サブネットグループには、共通リソースとして作成したプライベートサブネットを割り当てることで、外部からのアクセスができないようにしておきます。

```yml{18-19}:title=DBインスタンス
  MyDBInstance:
    Type: AWS::RDS::DBInstance
    Properties:
      AllocatedStorage: !Ref DBAllocatedStorage
      DBInstanceClass: !Ref DBInstanceClass
      DBInstanceIdentifier: !Sub '${AWS::StackName}-db'
      Engine: mysql
      DBSubnetGroupName: !Ref MyDBSubnetGroup # DB サブネットグループを紐付け
      MasterUsername:
        !Sub
          - '{{resolve:secretsmanager:${DbAdminSecret}::username}}'
          - DbAdminSecret: !ImportValue '${param:commonResourceStackName}:DbAdminSecretId' # SecretsManager の値からユーザー名を割り当て
      MasterUserPassword:
        !Sub
          - '{{resolve:secretsmanager:${DbAdminSecret}::password}}'
          - DbAdminSecret: !ImportValue '${param:commonResourceStackName}:DbAdminSecretId' # 同様にパスワードを割り当て
      BackupRetentionPeriod: 0
      VPCSecurityGroups:
        - !ImportValue '${param:commonResourceStackName}:DbSecurityGroup' # 👈 DB のセキュリティグループを割り当て
```

`VPCSecurityGroups` に `Fn::ImportValue` で共通リソースで作成したセキュリティグループ (3306 ポート) を割り当てます。これにより *EC2 インスタンス (の VPC) ➡ RDS* へのアクセスが可能になります。

#### SecretsManager の値からユーザー名とパスワードを割り当て

**DB の認証情報は、共通リソースで作成した Secrets Manager のシークレット (`AWS::SecretsManager::Secret`) から、それぞれ読み取って設定**します。

少し分かりづらいので詳しく解説します。

```yml:title=ImportValueとSubと動的パラメーターを使ったSecretの参照
!Sub
    - '{{resolve:secretsmanager:${DbAdminSecret}::username}}'
    - DbAdminSecret: !ImportValue '共通リソーススタックで出力した Secret の ID'
```

ここで `Fn::Sub` に 2 つのパラメーターを指定しています。 *`Fn::Sub` は 2 番目のパラメーターに「変数マップ」 (キーと値のリスト) を指定すると、置換文字列の中でそのキーを指定した値で置き換えることができます。* 使いこなすと非常に便利な機能です。

- [Fn::Sub - AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-sub.html)

これを利用して、共通リソースで作成した Secret の ID を `Fn::ImportValue` で読み込み、動的パラメーター (resolve) に与えています。

*CloudFormation の動的パラメーター*は下記のような記述で Secrets Manager の値を取得できます。

- ユーザー名: `{{resolve:secretsmanager:SECRET_ID:username}}`
- パスワード: `{{resolve:secretsmanager:SECRET_ID:password}}`

この `SECRET_ID` を先の方法で置き換えています。CloudFormation の動的パラメーターに関しては公式情報もわかりやすいです。

- [動的な参照を使用してテンプレート値を指定する - AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager)

#### デプロイ

このデプロイは特にパラメーターを必要としませんので、 `sls deploy` だけで OK です。

```bash:title=データベースのデプロイ
sls deploy
```


### EC2 インスタンス (WordPress サーバー)

EC2 もインスタンスは t3.micro で、 OS は Amazon Linux 2 にします。

いくつかキーポイントを説明します。

#### Amazon Linux 2 の AMI ID

EC2 インスタンスを起動するには OS イメージ (AMI) の ID を指定する必要があります。

しかし AMI ID はリージョンごとに異なるため、ベタ書きするとリージョン依存になってしまいます。 `Mappings` でリージョンごとの AMI ID を持つ方法もありますが、これも最新の AMI ID を維持するのは手間です。

そこで **AWS Systems Manager (SSM) のパラメーターストアに登録されている最新の Amazon Linux の AMI ID を使って動的に取得**できるようにします。

!["Systems Manager のパラメータストアに登録された AMI ID"](images/ssm-ami-id-parameter.png "Systems Manager のパラメータストアに登録された AMI ID")

**CloudFormation テンプレート中で参照するには動的参照 (`resolve`) を利用**して下記のように記述します。

- [動的な参照を使用してテンプレート値を指定する - AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-ssm)

```yml{5}:title=resolveによるAMI-IDの動的参照
Resources:
  MyServerInstance1:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: '{{resolve:ssm:/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2}}'
```

ここで `/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2` はパラメータストアの識別子です。下記の一覧から選択できますが、特に理由がなければこのイメージでいいはずです。

- [AWS Systems Manager - Parameter Store](https://console.aws.amazon.com/systems-manager/parameters/?tab=PublicTable#public_parameter_service=ami-amazon-linux-latest)<br>※ AWS コンソールではユーザーパラメーターが 1 つもない状態では一覧が表示できないようです。

また、 `Parameters` を使って下記のように書いても参照できます。この場合は CloudFormation にパラメーターを指定することでイメージを変更できます。

```yml:title=ParametersによるAMI-IDの動的参照
Parameters:
  Ec2ImageId:
    Type: AWS::SSM::Parameter::Value<String>
    Default: /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2

Resources:
  MyServerInstance1:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: !Ref Ec2ImageId # 👈 Amazon Linux 2 の AMI ID
```

- 参考: [CloudFormationで最新のAmazon Linux 2のAMI IDを取得してEC2を構築する | DevelopersIO](https://dev.classmethod.jp/articles/get-the-latest-amazon-linux-2-ami-id-with-cloudformation/)

#### ネットワーク設定

```yml:title=EC2インスタンスのネットワーク設定
NetworkInterfaces:
  - AssociatePublicIpAddress: true
    DeviceIndex: 0
    GroupSet: !Split [ ',', !ImportValue '${param:commonResourceStackName}:InstanceSecurityGroups' ] # 👈 ①
    SubnetId: !Select [0, !Split [",", !ImportValue '${param:commonResourceStackName}:PublicSubnetIds']] # 👈 ②
```

① ネットワークアダプターには共通リソースで定義したセキュリティグループを `GroupSet` で割り当てます。共通リソーススタックの出力でカンマ区切り文字列として書き出した値を、逆にカンマで分割し、リストとして割り当てます。

② パブリックサブネットの ID のうち、 1 つ目の ID を `Fn::Select` で取り出して、割り当てます。

#### 初期化スクリプト

EC2 インスタンス生成時に、必要なツール (Docker, Docker Compose) のインストールと EFS のマウントを行うため、 `UserData` を指定しています。

**`UserData` には BASE64 エンコードしたシェルスクリプト**を指定します。 `root` で実行されるため `sudo` は不要です。

```yml
UserData:
  Fn::Base64:
    Fn::Sub:
    - |
        #!/bin/bash
        set -x
        echo '========== start userdata =========='
        yum update -y
        echo '---------- installing amazon-efs-utils ----------'
        yum install --quiet -y amazon-efs-utils
        echo '---------- mounting efs volume ----------'
        mkdir /mnt/efs
        mount -t efs ${EFSId}:/ /mnt/efs
        chown ec2-user:ec2-user /mnt/efs
        df -h
        ls -l /mnt
        echo '---------- register efs to fstab ----------'
        sh -c "echo '${EFSId}:/ /mnt/efs efs defaults,_netdev 0 0' >> /etc/fstab"
        cat /etc/fstab
        echo '---------- install docker ----------'
        amazon-linux-extras install -y docker
        amazon-linux-extras | grep docker
        systemctl start docker && systemctl status docker
        systemctl enable docker
        systemctl is-enabled docker
        usermod -a -G docker ec2-user
        docker --version
        echo '---------- install docker compose ----------'
        DOCKER_PLUGINS=/usr/local/lib/docker/cli-plugins
        mkdir -p $DOCKER_PLUGINS
        curl -L https://github.com/docker/compose/releases/download/v${DockerComposeVersion}/docker-compose-$(uname -s)-$(uname -m) -o $DOCKER_PLUGINS/docker-compose
        chmod +x $DOCKER_PLUGINS/docker-compose
        ln -s $DOCKER_PLUGINS/docker-compose /usr/bin/docker-compose
        docker-compose --version
        echo '========== end userdata =========='
    - EFSId: !ImportValue '${param:commonResourceStackName}:FileSystemId'
      DockerComposeVersion: '2.4.1'
```

固定的な内容なら問題ないのですが、今回は EFS をマウントするため、 **EFS の ID を動的に設定**する必要があります。このため、データベースのときと同様に `Fn::Sub` の第 2 引数を指定して、 EFS の ID をスクリプト中に展開しています。

なお、この UserData のデバッグは `/var/log/cloud-init-output.log` の実行ログを確認しながら行えます。

```bash:title=UserDataのデバッグログ確認
sudo cat /var/log/cloud-init-output.log
```

#### デプロイ

このデプロイも特にパラメーターを必要としませんので、 `sls deploy` だけで OK です。

```bash:title=EC2インスタンスのデプロイ
sls deploy
```

EC2 インスタンスの中に配置する WordPress 自体のデプロイや PHP、 nginx の設定は下記の記事を参照してください。

- [EC2 で PHP 8 と nginx の Docker コンテナーを使って WordPress を動かす](https://mseeeen.msen.jp/wordpress-6-with-docker-php-8-on-aws-ec2-instance/)

### CDN (CloudFront)

最後に EC2 をオリジンとした CloudFront を CDN として設定します。

ここで使用するリソースは 4 つです。

1. ログ用 S3 バケット
2. オリジンリクエストポリシー
3. ディストリビューション
4. Route 53 DNS レコード

1 と 3 はだいたいセットです。 4 は CloudFront にアクセスするホスト名 (ここでは `wordpress.wp.example.com`) を Route 53 に登録するものです。

今回は WordPress のホストのため、 2 のオリジンリクエストポリシーを追加していますので説明します。

#### オリジンリクエストポリシーで X-CLOUDFRONT-FORWARDED-PROTO ヘッダーを転送する

**オリジンリクエストポリシーとは CloudFront ➡ オリジン (今回は EC2) の通信の際に、ヘッダー・Cookie・クエリー文字列をどのようにオリジンに転送するかを決めるもの**です。

まず先行記事にあるように今回の前提では、*オリジン (EC2) に対して `X-CLOUDFRONT-FORWARDED-PROTO` ヘッダーを送信する必要があります*。
**WordPress で発生する http→https の無限ループを回避するため**です（詳細は[同記事](https://mseeeen.msen.jp/wordpress-6-with-docker-php-8-on-aws-ec2-instance/)参照）。

CloudFront では既定でいくつかのポリシーが用意されており、それをディストリビューションに設定できます。最も緩いものが AllViewer というポリシーです。

!["既定で用意されている AllViewer オリジンリクエストポリシー"](images/cf-origin-request-policy-all-viewer.png "既定で用意されている AllViewer オリジンリクエストポリシー")

このポリシーでは「ヘッダー」のところが「*すべてのビューワーヘッダー*」となっているので、無条件にヘッダーを転送してくれそうですが、実はそうではありません。

実際にカスタムポリシーを作成してみるとわかるのですが、「すべてのビューワーヘッダー」のほかに「**すべてのビューワーヘッダーと次の CloudFront ヘッダー**」という選択肢があります。

!["オリジンリクエストポリシーのヘッダー設定"](images/cf-origin-request-policy-header.png "オリジンリクエストポリシーのヘッダー設定")

`X-CLOUDFRONT-` で始まるヘッダーを転送するには、このオプションを選択したうえで必要なヘッダーを選択しなければなりません。

これを設定したものが、下記のオリジンリクエストポリシーです。

!["X-CLOUDFRONT-FORWARDED-PROTO ヘッダーを転送するオリジンリクエストポリシー"](images/cf-origin-request-policy-custom.png "X-CLOUDFRONT-FORWARDED-PROTO ヘッダーを転送するオリジンリクエストポリシー")

これを CloudFormation で書いたものがスタック中の `MyCloudFrontWordPressOriginRequestPolicy` です。

```yml:title=X-CLOUDFRONT-FORWARDED-PROTOヘッダーを転送するオリジンリクエストポリシー
  # OriginRequestPolicy to forward X-CLOUDFRONT-FORWARDED-PROTO header
  MyCloudFrontWordPressOriginRequestPolicy:
    Type: AWS::CloudFront::OriginRequestPolicy
    Properties:
      OriginRequestPolicyConfig:
        Name: !Sub "${AWS::StackName}-WordPressOriginRequestPolicy"
        CookiesConfig:
          CookieBehavior: all
        HeadersConfig:
          HeaderBehavior: allViewerAndWhitelistCloudFront # 👈
          Headers:
            - CloudFront-Forwarded-Proto # 👈
        QueryStringsConfig:
          QueryStringBehavior: all
```

#### デプロイ

このスタックのデプロイではパラメーターを 2 つ指定します。

```bash:title=CloudFrontのデプロイ
sls deploy --param="domain=wp.example.com" --param="sslCertificateArn=arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/GUID"
```

1 つは `domain` で、Route 53 に DNS レコードを追加するため、ルートドメイン名を指定します。ここでは `wp.example.com` です。 WordPress のドメインは `wordpress.wp.example.com` になります。これを変更したい場合は別途 `wordPressDomainAlias` を指定します。

もう 1 つは `sslCertificateArn` で、 ACM に登録済みの `wordpress.wp.example.com` 用の SSL 証明書の ARN を指定します。

先述の通り、このスタックの特徴として、**リソースとして EC2 インスタンスに依存していません**。この CloudFront スタックを維持したまま EC2 インスタンスを削除したり、再構成したりもできます。
