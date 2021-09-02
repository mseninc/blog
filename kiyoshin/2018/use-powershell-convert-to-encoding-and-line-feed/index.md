---
title: PowerShellを使ってファイルの文字コードと改行コードを変換する
date: 2018-09-18
author: kiyoshin
tags: [PowerShell, その他, ライフハック, Windows]
---

**Windows PowerShell** を使ってファイルの文字コードと改行コードを変換する方法について紹介します。

## 使用環境

* Windows 10
* Windows PowerShell 5.1

## 変換方法

下記のコードは文字コードが **SJIS** のファイルを読み込み、改行コードを **LF** に変換し **UTF8** の文字コードのファイルを出力する内容になります。

```
(Get-Content -Path "input.txt" -Encoding Default) -join "`n" `
    | % { [Text.Encoding]::UTF8.GetBytes($_) } `
    | Set-Content -Path "output.txt" -Encoding Byte
```

### 1行目

```
(Get-Content -Path "input.txt" -Encoding Default) -join "`n" `
```

* **Get-Content** で読み込んだファイルを1行ずつ指定の改行コードで連結しているという内容になります。
    * **-Path** の値は読み込み対象のファイルパスを指定します。
    * **-Encoding** の値は読み込み対象のファイルの文字コードを指定します。
        * 指定できる文字コードは下記の通りです。  
`Unknown`, `String`, `Unicode`, `Byte`, `BigEndianUnicode`, `UTF8`, `UTF7`, `UTF32`, `Ascii`, `Default`, `Oem`, `BigEndianUTF32`
    * **-join** の値は変換したい改行コードを指定します。
* 最終行の文末に改行を入れる場合は、全体を()で括り、改行コードを文字列連結してください。
```
((Get-Content -Path "input.txt" -Encoding Default) -join "`n") + "`n" `
```

### 2行目

```
    | % { [Text.Encoding]::UTF8.GetBytes($_) } `
```

* 1行目で出力された文字列を .NETの `Text.Encoding` クラスのGetBytes()を使って 1文字づつバイトシーケンスに変換していきます。
    * ここでバイトシーケンスに変換を行わないと出力後のファイルの最終行の改行コードが **CRLF** で出力されてしまいます。
    * `UTF8` の部分は出力後の文字コードを指定します。
    * 指定できる文字コードは下記の通りです。  
`Unicode`, `BigEndianUnicode`, `UTF8`, `UTF7`, `UTF32`, `ASCII`, `Default`

### 3行目

```
    | Set-Content -Path "output.txt" -Encoding Byte
```

* 2行目でバイトシーケンスに変換したものを指定のファイルに出力するという内容になります。
    * **-Path** の値は出力先のファイルパスを指定します。
    * **-Encoding** の値は バイトシーケンスをそのまま出力するため `Byte` を指定します。

入力/出力ファイルの文字コードおよび改行コードの組み合わせを用途に応じて変更していきましょう。

## 関連記事

- [PowerShellで改行コードを指定してファイル出力するには](http://m0t0k1x2.tumblr.com/post/106510176434/powershell%E3%81%A7%E6%94%B9%E8%A1%8C%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E6%8C%87%E5%AE%9A%E3%81%97%E3%81%A6%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E5%87%BA%E5%8A%9B%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF)
- [PowerShellでBOM無しUTF8を書くサンプル](https://gist.github.com/stknohg/c84b2a8b6aa02b25a327c1420b0a1695)