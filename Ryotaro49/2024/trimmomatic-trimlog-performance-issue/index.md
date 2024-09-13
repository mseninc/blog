---
title: "Trimmomatic 処理速度の改善方法"
date: 
author: Ryotaro49
tags: [Ubuntu Server 22.04, Ubuntu, Conda, Java]
description: "
Trimmomatic の処理速度が遅い場合に見直すべきオプションや設定を紹介します。-trimlog や -threads オプションの設定、インストール方法の違い、実行場所についての改善方法を紹介します。"
---

Trimmomatic の処理速度が遅い時にオプション等を見直すことで、処理速度を改善できます。

今回は見直しをすることで効果があった部分を紹介します。

本記事では下記の環境で動作確認を行っています。

- Ubuntu Server 22.04.3 LTS
- Trimmomatic v0.39

## Trimmomatic とは

Trimmomatic についての説明は以下の記事に書かれています。

>Trimmomatic は Java で書かれているアダプタートリミングツールである。Trimmomatic はアダプターの除去のみならず、リードの末端から一定数の塩基をトリムしたりする、簡単なクオリティフィルタリングも行える。シングルエンドリードのみならずペアエンドリードにも対応している。また、gzip （拡張子 .fq.gz など）や bzip2 （拡張子 .fq.bz2 など）で圧縮されている FASTQ ファイルを展開せずに処理することができる。
> <cite>[生命情報科学](https://bi.biopapyrus.jp/rnaseq/qc/trimmomatic.html)</cite>

インストール方法はバイナリーファイルをダウンロードする方法か Conda でインストールする方法があります。

## `-trimlog` オプション

`-trilmlog` オプションをつけることでログを出力できますが、筆者の環境では大幅に実行時間が増加することを確認しています。

必要がなければ外すことで改善できるかもしれません。

## `-threads` オプション

`-threads` オプションでスレッド数を指定できます。

PC のスペックに合わせて最適なスレッド数を指定しましょう。

```bash:title=例:12スレッドを指定
java -jar trimmomatic-0.39.jar PE -threads 12 <input 1> <input 2> <paired output 1> <unpaired output 1> <paired output 2> <unpaired output 2> <step 1> ...
```

## Conda でインストールしている場合は、 バイナリーリリース版に置き換える

Conda で Trimmomatic をインストールしている方は、バイナリーリリース版に置き換えることで改善できるかもしれません。

筆者の環境では以下のような結果を確認しています。

| インストール方法 | 実行時間 1回目 | 実行時間 2回目 |
| -- | -- | -- |
| Conda | 13分59秒 | 12分18秒 |
|バイナリーリリース版 | 10分33秒 | 11分9秒 |

バイナリーリリース版は以下からインストールできます。

- https://github.com/usadellab/Trimmomatic/releases/tag/v0.39

インストール後、解凍するだけで使用できます。

## ネットワーク上のディレクトリに出力している場合は、ローカルに出力する

ネットワーク上のディレクトリを出力先にしている場合は、ローカルを出力先にすることで速度が改善するかもしれません。

I/O の速度がボトルネックになり遅くなっていることがあるためです。

ネットワーク上のディレクトリに出力する必要がない場合は、ローカルに出力することを推奨します。

## まとめ

本記事では以下の改善方法を紹介しました。

- `-trimlog`, `-threads` オプションの見直し
- 使用している Trimmomatic のインストール方法の見直し
- 実行場所の見直し

[fastp](https://github.com/OpenGene/fastp) や [BBDuk](https://www.seqanswers.com/forum/bioinformatics/bioinformatics-aa/37399-introducing-bbduk-adapter-quality-trimming-and-filtering?t=42776) 等の他のツールを使うのも有効な手段かもしれません。

本記事が少しでも改善のお役に立てれば幸いです。

それではまた！

## 参考
- https://github.com/usadellab/Trimmomatic