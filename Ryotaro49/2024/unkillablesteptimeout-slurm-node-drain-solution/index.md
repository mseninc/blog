---
title: "[Slurm] UnkillableStepTimeout でノードが意図せず DRAIN 状態になるのを防ぐ"
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

## 設定方法

### 1. `slurm.conf` ファイルを開く

```bash:title=slurm.confファイルを開くコマンド
$ sudo vi /etc/slurm/slurm.conf
```

### 2. `UnkillableStepTimeout` を修正

```
UnkillableStepTimeout=180
```

Slurm を再起動

設定ファイルを保存したら、Slurm デーモンを再起動して設定を反映させます。

bash
Copy code
sudo systemctl restart slurmctld
sudo systemctl restart slurmd

確認

scontrol show config コマンドで設定が反映されているか確認できます。

bash
Copy code
scontrol show config | grep UnkillableStepTimeout
このコマンドで、UnkillableStepTimeout=180 sec のような出力が表示されれば、設定が正しく反映されています。

設定の反映について
slurmctld の再起動が必要です。再起動を忘れると設定が適用されないので注意してください。
値は秒単位で指定します。適切なタイムアウト値はシステムの状態やジョブの性質に依存するため、環境に応じて調整してください。
この手順に従えば、UnkillableStepTimeout が設定され、ジョブが終了しなかった場合のDRAIN状態を防ぐことができるでしょう。

## まとめ