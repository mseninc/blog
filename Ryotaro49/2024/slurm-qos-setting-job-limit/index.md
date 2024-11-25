---
title: "[Slurm] QOSを設定してジョブの同時実行数を制限する"
date: 2024-11-25
author: Ryotaro49
tags: [Slurm]
description: "QOSを使用して、ジョブの同時実行数を制限することで、リソースの公平な利用や管理する方法を解説します。"
---

リソースの割り当てを効率的に行い、ユーザーごとの負荷を制限するために、Slurm では **QOS（Quality of Service）** という機能が利用できます。

今回は、QOS を使ってジョブの同時実行数を制限し、効率的なリソース管理をする方法を解説します。

本記事では下記の環境で動作確認を行っています。

- Ubuntu Server 22.04.3 LTS
- Slurm v22.05.2

## QOS（Quality of Service）とは？

QOS は、Slurm でユーザーやジョブの実行に対する制限や優先度を設定するための機能です。

この機能を活用することで、ジョブの同時実行数や消費するリソースの最大量などを柔軟にコントロールできます。

たとえば、ジョブの同時実行数を制限することで、サーバーの過負荷を防ぎ、他のユーザーもリソースを利用できるよう調整できます。

## QOS設定手順

### 1. slurm.conf の設定変更

QOS の制限を適用するためには、Slurm の設定ファイル `slurm.conf` を編集し、`AccountingStorageEnforce` の項目に `qos` を追加する必要があります。

1. `/etc/slurm/slurm.conf` を開き、以下のように設定します。

```bash:title=qosを追加
AccountingStorageEnforce=limits,qos
```

この設定により、ジョブの同時実行数制限やリソース制限など、QOS で設定した制限が有効になります。

2. 設定ファイルを保存し、Slurm デーモンを再起動します。

```bash:title=Slurmデーモンの再起動
$ sudo systemctl restart slurmctld
```

これで、QOS の制限が有効化されました。

### 2. QOS の作成と設定

`sacctmgr` コマンドを使って、新しい QOS を作成します。

ここでは、`sample_qos` という名前の QOS を作成し、ジョブの同時実行数を「4」に制限します。

```bash:title=QOSを作成し同時実行数を設定
$ sudo sacctmgr add qos sample_qos MaxJobs=4
```

上記のコマンドで、`sample_qos` という QOS が作成され、同時に実行できるジョブ数が最大で4件に制限されました。

### 3. QOS の設定確認

作成した QOS の設定内容を確認するために、以下のコマンドを実行します。

```bash:title=QOS設定を表示
$ sacctmgr show qos
```

実行結果として、QOS のリストとその詳細が表示されます。

ここで、`sample_qos` が作成され、`MaxJobs=4` の設定が適用されていることを確認してください。

### 4. アカウントへのQOS適用

作成した QOS をアカウントに適用します。ここでは、`user` アカウントに対して QOS を追加し、`sample_qos` を利用できるように設定します。

```bash:title=アカウントにQOSを適用
$ sudo sacctmgr modify account where name=user set qos+=sample_qos
```

このコマンドにより、`user` アカウントの全ユーザーが `sample_qos` の QOS を使用できるようになります。

## ジョブへのQOS適用

QOS を指定してジョブを送信するには、`sbatch` コマンドに `--qos` オプションを追加します。

```bash:title=ジョブにQOSを適用
$ sbatch --qos=sample_qos script.sh
```

これにより、`script.sh` で実行されるジョブに`sample_qos` の QOS が適用され、QOS 設定に基づいてリソースが制限されます。

## まとめ

QOS を利用することで、Slurm のリソース管理がより細やかに行えるようになります。

特に、多くのユーザーが利用する環境では、QOS を活用することで公平なリソース配分が可能となり、システムの安定性が向上します。

また、QOS の設定には今回設定したジョブの同時実行数以外にも CPU 制限やメモリー制限、ジョブの優先度設定など、さまざまなリソース制限が使用できます。

QOS を活用して、より効率的なリソース管理を目指しましょう！

それではまた！

## 参考
- [Slurm 公式ドキュメント](https://slurm.schedmd.com/)
- [Slurm Installその後3.リソース制限 QoS](https://taqqu.hatenablog.com/entry/2022/09/18/133449#Slurm%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8BQoS)