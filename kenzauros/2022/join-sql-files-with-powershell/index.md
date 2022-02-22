---
title: PowerShell でフォルダ内の SQL ファイルを結合した SQL ファイルを生成する
date: 2022-02-22
author: kenzauros
tags: [PowerShell, SQL, SQL Server]
description: 複数の SQL ファイルを結合した SQL ファイルを出力する PowerShell のスクリプトを作りましたので紹介します。
---

弊社ではデータベースのマイグレーション用に SQL ファイルを保存していることがあります。

複数の SQL ファイルを実行する必要があるとき、いちいちファイルを開いて実行、というのも面倒です。
そこで **SQL ファイルを結合した SQL ファイルを作成する PowerShell のスクリプト** を作りました。

DBMS 依存の部分も多いですが、何かのお役に立てれば幸いです。

## 前提

- **PowerShell 5.1**
- Windows 10
- SQL Server

用途の都合上 SQL Server を前提としています。

Shell Script でもよかったのですが、動作環境が Windows 前提のため PowerShell にしました。

※ちなみに PowerShell 6 からはクロスプラットフォーム対応です。

## スニペット

結論のコードスニペットから。このコードを適当なファイル名 (`join-sql.ps1` など) で SQL ファイルのあるフォルダに保存するだけです。

```ps{numberLines:1}:title=join-sql.ps1
Param(
  [parameter(mandatory)][String]$outputFile
)
$divider="-- $("=" * 100)"
$files = Get-ChildItem .\*.* -Include *.sql -Exclude $outputFile
if (Test-Path $outputFile) { Clear-Content $outputFile }

function output {
  process {
    Out-File -Encoding UTF8 -FilePath $outputFile -Append -InputObject $PSItem
  }
}
foreach ($file in $files) {
  Write-Output $divider | output
  Write-Output "-- $($file.Name)" | output
  Write-Output $divider | output
  Get-Content $file.FullName -Encoding UTF8 `
    | Select-String -Pattern "^(BEGIN TRAN|ROLLBACK)" -NotMatch `
    | Select-Object -ExpandProperty line | output
  Write-Output "GO`r`n" | output
}
```

gist にも置いてあります。

- [ディレクトリ内の SQL ファイルを結合する PowerShell スクリプト (SQL Server 用) - gist](https://gist.github.com/kenzauros/6c6aad4ad938ece7deefabc0e6d6585a)

あとは PowerShell から `.\join-sql.ps1 <出力ファイル名>` とするだけです。

ちなみに Windows のデフォルト状態ではスクリプトが実行できません。権限周りで怒られた場合は、 PowerShell を管理者権限で起動し、 `Set-ExecutionPolicy RemoteSigned` を実行しましょう。

## 実行例

たとえば下記のように SQL ファイルが複数格納された `sql_files` フォルダを想定します。ここに `join-sql.ps1` を配置します。

```:title=C:\path\to\sql_files
sql_files
├── a.sql
├── b.sql
├── c.sql
└── join-sql.ps1 👈 スクリプトを配置
```

この `join-sql.ps1` を実行します。 `result.sql` は結合した結果ファイルの名前を指定します。

```ps:title=実行例
PS C:\path\to\sql_files> .\join-sql.ps1 result.sql
```

実行後に出力される `result.sql` は下記のようになります。 (`a.sql` 等の中身は適当です)

```sql
-- ====================================================================================================
-- a.sql
-- ====================================================================================================

SELECT * FROM A;

GO

-- ====================================================================================================
-- b.sql
-- ====================================================================================================

SELECT * FROM B;

GO

-- ====================================================================================================
-- c.sql
-- ====================================================================================================

SELECT * FROM C;

GO
```

うん、見やすさは及第点ですね👌

## 詳解

### スクリプトの仕様

今回のスクリプトでは、ただファイルを結合するだけでなく下記の処理を行っています。

- 各ファイルの内容の先頭にファイル名と区切り文字を付加する
- 各ファイルの `BEGIN TRAN` もしくは `ROLLBACK` から始まる行を削除 (出力しない)
- 各ファイルの内容の後に `GO` を付加する

`BEGIN TRAN` もしくは `ROLLBACK` から始まる行を削除しているのは、今回対象とした SQL には安全対策としてそれぞれ `BEGIN TRAN` `ROLLBACK` で囲まれているからです。内部で意味のあるトランザクションをかけている場合、消してしまっては一大事ですので、この部分は変更してください。

また SQL Server の場合、各ファイルで同じ名前の変数を使っている場合、重複定義のエラーが起こります。
これを回避するため、間に `GO` を挟み、それぞれの SQL を別個に実行しています。

これらの処理は用途に応じてカスタマイズしてください。

### PowerShell メモ

よくやる処理で忘れがちなものをメモしておきます。

#### 必須引数

コマンドラインからスクリプトを呼び出すときに引数を必須にするときは下記のようにします。 *`mandatory`* がミソです。

```ps
Param(
  [parameter(mandatory)][String]$p1,
  [parameter(mandatory)][String]$p2
)
```

#### 同じ文字の繰り返しで線を表現

テキストで見た目を区切りたい場合、あまりよくないとわかっていても下記のような線を引きたくなるのが人の性です。

```
====================================================================================================
```

こんなとき PowerShell では **`"=" * 100` のように乗算記号で文字が繰り返せる** のでわかりやすいです。今回はそれをさらに SQL コメントの後に展開して変数に格納しました。

```ps
$divider="-- $("=" * 100)"
```

#### 特定の拡張子のファイルのみ列挙

特定の拡張子のファイルのみ列挙するには **`Get-ChildItem` を `-Include` オプションとともに** 使います。

ただし、パス指定で `.\*.*` のようにファイルレベルで指定しておかないと下記の `-Include` 指定は効きません。最初 `.\` と指定していて少しハマりました。

```ps
$files = Get-ChildItem .\*.* -Include *.sql -Exclude $outputFile
```

また、今回は出力したファイル自身を含まないように *`-Exclude` オプションで出力ファイルを除外* しています。

#### ファイルのクリア

ファイルを削除するのではなく、中身だけを空にしたい場合は `Clear-Content` が使えます。（知りませんでした）

```ps
Clear-Content $outputFile
```

#### パイプラインにつなげて使える関数

今回は同じファイルに繰り返し出力 (`Out-File`) するので、その部分だけ関数にしました。

```
function output {
  process {
    Out-File -Encoding UTF8 -FilePath $outputFile -Append -InputObject $PSItem
  }
}
```

`Write-Output $divider | output` のようにパイプライン (`|`) でつなげて出力したいので、 **`process` と `$PSItem` でパイプライン対応にしました。**

パイプラインで渡ってきたオブジェクト `$PSItem` をそのまま `Out-File` の `-InputObject` に渡しています。

さらに詳しいことは先達の記事をご参照ください。

- [PowerShellのファンクションで引数やパイプラインから値を受け取る](https://zenn.dev/kumarstack55/articles/2021-01-24-powershell-functions)
- [PowerShellでのOut-Fileコマンドの使い方｜各オプションもご紹介 | テックマガジン from FEnetインフラ](https://www.fenet.jp/infla/column/engineer/powershell%E3%81%A7%E3%81%AEout-file%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9%EF%BD%9C%E5%90%84%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%82%E3%81%94%E7%B4%B9/)

#### ファイルの各行をフィルタリングしながら出力

簡単なようで意外と面倒なのがこの「**ファイルの各行をフィルタリングしながら出力**」する処理です。

`Select-String` した結果をそのまま書き出すと、画面バッファーの幅で改行されてしまい、意図した結果になりません。

これは *`Select-String` が `MatchInfo` クラスのオブジェクトを返す* ことが原因ですので、少し工夫する必要があります。

- [MatchInfo Class (Microsoft.PowerShell.Commands) | Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/api/microsoft.powershell.commands.matchinfo?view=powershellsdk-7.0.0)

今回の例では `Select-String` で得られた **`MathcInfo` から `Select-Object` で `Line` プロパティーを取り出しています。**

```ps
Get-Content $file.FullName -Encoding UTF8 `
  | Select-String -Pattern "^(BEGIN TRAN|ROLLBACK)" -NotMatch `
  | Select-Object -ExpandProperty Line | output
```

`MatchInfo.Line` プロパティーは検索にマッチした行をすべて含んでいるため、これを取り出すことで元の文字列が得られます。

※ 今回は `Select-String` で `-NotMatch` を指定しているので「マッチしない」行が抽出されます。また SQL ファイルの文字コードは UTF-8 を想定しているため `-Encoding UTF8` としています。

#### 改行コードなどのエスケープ

PowerShell での *特殊文字のエスケープはバッククォート (`` ` ``)* です。

CRLF (C でいう `\r\n`) は ``"`r`n"`` になります。うん、わかりにくく、打ちにくい上に Markdown との相性は最悪です(笑)。

## まとめ

Shell script で cat するだけでも十分な場合もあると思うのですが、今回は間に `GO` を挟みたかったので、スクリプトにしました。

たまに PowerShell も触らないと忘れてしまいますね。いい頭の体操になりました。

もっと簡単に C# でスクリプトが書けたらいいのになぁ...。
