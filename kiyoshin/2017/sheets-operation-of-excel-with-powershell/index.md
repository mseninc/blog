---
title: Windows PowerShell を使って Excel を操作する - シート操作編
date: 2017-12-28
author: kiyoshin
tags: [Excel, PowerShell, もくもく会, Windows]
---

windows環境で **Excel** をプログラム言語で操作する方法に **VBA** がよく紹介されてますが、 **Windows PowerShell** でもお手軽に操作することが可能なので、紹介していきたいと思います。

## 使用環境

* Windows 10
* Windows PowerShell 5.1
* Microsoft Excel 2016

## 操作方法

### Excel を起動

まずは、Excelを起動させましょう。

```ps
# Excelのプロセスを起動
$excel = New-Object -ComObject Excel.Application

# 起動したExcelを表示する
$excel.Visible = $true
```

上記のコマンドを順に実行すると以下の状態でExcelが起動します。

### ワークブックを作成

今の状態では、何もないExcelなので、ワークブックを作成しましょう。

```ps
# 新規のワークブックを作成
$book = $excel.Workbooks.Add()
```

上記のコマンドで新規のワークブックが作成されます。

Excelを起動させた直後によく見る状態ですね。

### シートの追加とシート名の変更

シートの追加とシート名の変更をしてみましょう。

```ps
# シートの追加
$book.Worksheets.Add()

# シート名の変更 - シート番号で指定
$book.WorkSheets.item(1).name = "hoge"

# シート名の変更 - シート名で指定
$book.WorkSheets.item("Sheet1").name = "fuga"

# シートをコピー - hogeをコピーしてfugaの前に配置
$book.Worksheets.item("hoge").copy($book.Worksheets.item("fuga"))
```

上記のコマンドを順に実行すると3つのシートが作成された状態になります。

```ps
# シートの追加
$book.Worksheets.Add()
```

Addによるシートの追加を行った場合、一番手前（シートの並びの一番左側）に追加されます。

```ps
# シート名の変更 - シート番号で指定
$book.WorkSheets.item(1).name = "hoge"

# シート名の変更 - シート名で指定
$book.WorkSheets.item("Sheet1").name = "fuga"
```

操作対象のシートの指定は、並び順によるシート番号の指定または、シート名で指定することができます。

### シートの削除

シートを削除してみましょう。

```ps
# シートを削除 - シート番号で指定
$book.WorkSheets.item(3).delete()

# シートを削除 - シート名で指定
$book.WorkSheets.item("hoge (2)").delete()
```

上記のコマンドを順に実行するとシート2つ削除され1つだけシートが残っている状態になります。

### ワークブックの保存

作成したワークブックを保存しましょう。

```ps
# 名前をつけて保存
$book.SaveAs("C:\tmp\exsample.xlsx")
```

`SaveAs()` の引数にファイルパスを設定することで、指定のフォルダ配下に指定したファイル名で保存されます。

### Excel を閉じる

開いている Excel を閉じてみましょう。

```ps
# Excelを閉じる
$excel.Quit()

# プロセスを解放する
$excel = $null
[GC]::Collect()
```

`Quit()` だけでは、開いていたワークブックを閉じるだけなので、プロセスが残ったままなので、併せてプロセスの解放を行ってあげる必要があります。

以上、シートの基本操作でした。次回はセルの操作について紹介したいと思います。