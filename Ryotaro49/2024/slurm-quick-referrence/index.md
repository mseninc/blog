---
title: "[Slurm] Slurm コマンド集"
date: 
author: Ryotaro49
tags: [Slurm, Ubuntu Server 22.04, Ubuntu]
description: "Slurm を使用してジョブを管理する際に役立つ基本的なコマンドを集めました。"
---

業務で Slurm を使用しており、私が頻繁に使っているコマンドを備忘録がてら紹介します。

本記事では下記の環境で動作確認を行っています。

- Ubuntu Server 22.04.3 LTS
- Slurm v22.05.2


## ジョブ関連のコマンド

### ジョブの送信

ジョブを送信するコマンド。

```bash:title=ジョブを送信
$ sbatch <ジョブ>
```

```bash:title=実行例
$ sbatch myjob.sh
Submitted batch job 12345
```

送信後、ジョブ ID が出力されます。
この ID を使ってジョブの状況を確認できます。

####  Tips

たとえば、シェルスクリプトで以下のようにして変数にジョブ ID を格納します。

```sh:title=実行時に変数にジョブIDを格納
job_id=$(sbatch <ジョブ> | awk '{print $4}')
```

以下のように依存ジョブを設定できます。

```sh:title=依存ジョブとして設定
sbatch <次のジョブ> --dependency=afterok:"$job_id"
```

`--dependency=afterok:<ジョブID>` は、**指定したジョブIDが 正常終了（完了）した後**に、次のジョブを実行するためのオプションです。

### ジョブのステータス確認

現在のキューにあるジョブを確認するコマンド。

```bash:title=現在のキューにあるジョブを確認
$ squeue
```

```bash:title=実行例
$ squeue
JOBID   PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
12345   example       myjob    user  R    00:00:00      1 node-001
```

特定のユーザーのジョブだけを表示するには、-u オプションを使います。

```bash:title=特定のユーザーのジョブだけを表示
$ squeue -u <ユーザー名>
```

## ジョブ履歴の確認

ジョブの履歴を確認するにはあらかじめ**設定が必要**です。

設定方法については以下の記事などが参考になると思います。

- [slurm/accounting](https://web.chaperone.jp/w/index.php?slurm/accounting)

ジョブの履歴を確認するためコマンド。


```bash:title=全てのジョブの履歴を確認
$ sacct
```

```bash:title=実行例
$ sacct
       JobID    State  Elapsed      AllocCPUS
------------ -------- -------- ----------------
12345         COMPLETED   00:02:45             8
12346         FAILED      00:01:10             4

```

### 便利なオプション

`squeue` コマンドと同じように特定のユーザーのジョブの履歴を表示するには、-u オプションを使います。

```bash:title=特定のユーザーのジョブの履歴を表示
$ sacct -u <ユーザー名>
```

ジョブ ID を指定することで、特定のジョブの履歴を確認できます。

```bash:title=ジョブの履歴を確認
$ sacct -j <ジョブID>
```

#### 期間を指定して履歴を表示

```bash:title=期間を指定して履歴を表示
$ sacct -S 2024-11-01 -E 2024-11-20
```

これにより、指定した期間内のジョブ履歴を確認できます。

#### 詳細情報を表示

```bash:title=formatを指定
$ sacct -j <ジョブID> --format=JobID,State,Elapsed
```

```bash:title=実行例
$ sacct -j 12345 --format=JobID,State,Elapsed
       JobID    State  Elapsed
------------ -------- --------
12345         COMPLETED   00:02:45
```

`--format`オプションで表示する情報をカスタマイズできます。

### ジョブのキャンセル

送信済みのジョブをキャンセルするコマンド。

```bash:title=送信済みのジョブをキャンセル
$ scancel <ジョブID>
```

特定のユーザーのすべてのジョブをキャンセルするコマンド。

```bash:title=特定のユーザーのすべてのジョブをキャンセル
$ scancel -u <ユーザー名>
```

## ノード関連のコマンド

### ノードの詳細確認

特定のノードの状態を確認するコマンド。

```bash:title=特定のノードの状態を確認
$ scontrol show node <ノード名>
```

ちなみに、以前このコマンドを使用して問題を対処しました。

そちらも記事にしています。

- [[Slurm] ジョブが PD 状態のまま実行されない場合の解決方法](https://mseeeen.msen.jp/slurm-job-stuck-pd-state-solution/)

## まとめ

Slurm の基本的なコマンドを紹介しました。

この記事が、Slurm を使う皆さんの役に立てれば幸いです。

それではまた！

## 参考

- [Slurm Workload Manager - Man Pages](http://www.dna-ltd.co.jp/slurm_doc/20.02.04/man_index.html)
