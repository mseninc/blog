---
title: "[Slurm] ジョブが PD 状態のまま実行されない場合の解決方法"
date: 
author: Ryotaro49
tags: [Slurm, Ubuntu Server 22.04, Ubuntu]
description: "Slurm でジョブが PD 状態のまま実行されない場合の解決方法を紹介します。ノードの状態が IDLE+DRAIN になっているときの対処方法について解説しています。"
---

Slurm でジョブを投入した際、ジョブが PD 状態のまま実行されない問題に遭遇しました。

本記事では下記の環境で動作確認を行っています。

- Ubuntu Server 22.04.3 LTS
- Slurm v22.05.2

## ステータスの確認

ジョブのステータス (`ST`) を確認すると **PD** となっており、理由 (`REASON`) には **Nodes required for job are DOWN, DRAINED or reserved for jobs in higher priority partitions** と表示されていました。

`squeue` の結果を見る限り、他にジョブは登録されていないにもかかわらず、ジョブに必要なノードが割り当てられていないという状態のようでした。

```log:title=squeue&nbsp;の結果
JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)

 2611       all job_name     msen PD       0:00      1 (Nodes required for job are DOWN, DRAINED or reserved for jobs in higher priority partitions)
```

ノードの `State` を確認すると、**IDLE+DRAIN** になっており、`Reason` は **Kill task failed** となっていました。

```log{10,19}:title=localhost&nbsp;のノードの状態を確認
$ scontrol show node localhost
NodeName=localhost Arch=x86_64 CoresPerSocket=32
   CPUAlloc=0 CPUEfctv=128 CPUTot=128 CPULoad=2.33
   AvailableFeatures=(null)
   ActiveFeatures=(null)
   Gres=gpu:nvidiah100pcie:6,mps:nvidiah100pcie:600
   NodeAddr=localhost NodeHostName=localhost Version=22.05.2
   OS=Linux 6.5.0-25-generic #25~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC Tue Feb 20 16:09:15 UTC 2
   RealMemory=2051970 AllocMem=0 FreeMem=88759 Sockets=2 Boards=1
   State=IDLE+DRAIN ThreadsPerCore=2 TmpDisk=0 Weight=1 Owner=N/A MCS_label=N/A
   Partitions=all
   BootTime=2024-08-06T10:30:29 SlurmdStartTime=2024-08-07T10:41:28
   LastBusyTime=2024-08-08T19:13:10
   CfgTRES=cpu=128,mem=2051970M,billing=128
   AllocTRES=
   CapWatts=n/a
   CurrentWatts=0 AveWatts=0
   ExtSensorsJoules=n/s ExtSensorsWatts=0 ExtSensorsTemp=n/s
   Reason=Kill task failed [root@2024-08-08T19:12:57]
```

何らかのプロセスが終了せずに残っていたことが原因で、Slurm のジョブ実行が一時的に停止していたと考えられます。

## 解決方法

以下のコマンドを root ユーザーで実行し、ノードの状態を `IDLE` に変更することで、再びジョブを正常に実行できるようになりました！

```bash:title=ノードの&nbsp;State&nbsp;を変更するコマンド
scontrol update nodename=localhost state=idle
```
 
## あとがき

今回の記事では、Slurm でジョブが PD 状態のまま実行されない問題の解決方法を紹介しました。
ノードの状態を変更することで簡単に解決できました！

この記事が 1 人でも困っている方のお役に立てれば幸いです。

それではまた！

## 参考
- http://www.dna-ltd.co.jp/slurm_doc/20.02.04/sinfo.html