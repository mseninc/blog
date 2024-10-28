---
title: "[Slurm] UnkillableStepTimeout を設定することでノードが意図せず DRAIN 状態になるのを防ぐ"
date: 
author: Ryotaro49
tags: [Slurm, Ubuntu Server 22.04, Ubuntu]
description: ""
---

Slurm でジョブを実行していると、またまた PD 状態のまま実行されない問題に遭遇しました。

ノードの状態が DRAIN になっていたので、[[Slurm] ジョブが PD 状態のまま実行されない場合の解決方法](https://mseeeen.msen.jp/slurm-job-stuck-pd-state-solution/) で紹介した方法で IDLE に戻して対処しました。

しかし、これでは根本的な解決になっていません。

そこで今回は `UnkillableStepTimeout` という設定を変更し、ノードが意図せず DRAIN 状態になるのを防ぐ方法を紹介します。

本記事では下記の環境で動作確認を行っています。

- Ubuntu Server 22.04.3 LTS
- Slurm v22.05.2

## `UnkillableStepTimeout` とは

Slurm Workload Manager - slurm.conf の日本語訳を読むと以下のように書かれています。

> UnkillableStepTimeout
>
>Slurmがジョブステップ内のプロセスが強制終了できないと判断する前に（SIGKILLで通知された後）待機し、上記のようにUnkillableStepProgramを実行する時間の長さ（秒単位）。
>
>デフォルトのタイムアウト値は60秒です。
>
>超過すると、計算ノードはドレインされ、ノードで将来のジョブがスケジュールされないようにします。
>
><cite>[Slurm Workload Manager - slurm.conf](http://www.dna-ltd.co.jp/slurm_doc/20.02.04/slurm.conf.html)</cite>

Slurm がジョブの終了を命令しても、プロセスがなかなか終わらないときに「待つ秒数」です。

プロセスの終了にかかる時間がこの設定値を越えてしまうと、 Slurm ジョブ上では「終了できない」と判断されて `Kill task failed` という理由でノードが DRAIN 状態になります。

デフォルトのタイムアウト値では短い場合があるため、引き延ばします。

## 設定方法

### 1. `slurm.conf` ファイルを開く

```bash:title=slurm.confファイルを開くコマンド
$ sudo vi /etc/slurm/slurm.conf
```

### 2. `UnkillableStepTimeout` を設定

UnkillableStepTimeout を適切な値に書き換えます。

```conf:title=UnkillableStepTimeoutを設定
UnkillableStepTimeout=180
```

以下の issue のように 180秒を設定しているケースが多かったので、とりあえず180秒を設定しています。

> Since setting UnkillableStepTimeout to 180 this has been happening far less frequently
>
><cite>[Slurm nodes that go into drain 'DUE TO JOB NOT ENDING WITH SIGNALS' #1849](https://github.com/usegalaxy-au/infrastructure/issues/1849#issuecomment-2132585238)</cite>

### 3. Slurm を再起動

設定ファイルを保存したら、Slurm デーモンを再起動して設定を反映させます。

```bash:title=再起動
$ sudo systemctl restart slurmctld
$ sudo systemctl restart slurmd
```
### 4. 確認

コマンドで設定が反映されているか確認できます。

```bash:title=反映されているか確認
$ scontrol show config | grep UnkillableStepTimeout
```

このコマンドで、`UnkillableStepTimeout=180 sec` のような出力が表示されれば、設定が正しく反映されています。

## まとめ

`slurm.conf` の `UnkillableStepTimeout` を `180` に設定し、ノードが意図せず DRAIN 状態になるのを防ぐ方法を紹介しました。

この記事が、同じ問題に直面した方々の役に立てば幸いです。

それではまた！

## 参考文献
- [Server drains after kill task failed - JOB NOT ENDING WITH SIGNALS](https://support.schedmd.com/show_bug.cgi?id=5262)