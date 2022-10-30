---
title: 【備忘録】C++ でファイル名を取得する方法
date: 
author: linkohta
tags: [C++, Visual Studio]
description: C++ でファイル名を取得する方法を紹介します。
---

link です。

C# ではファイルパスからファイル名を取得する `System.IO.Path.GetFileName` メソッドが存在します。

今回は C++ でも同じようにファイルパスからファイル名を取得する `std::filesystem::path::filename` メソッドを紹介します。

## 環境

- Windows 10 以降
- Visual Studio 2022

## Visual Studio の設定

Visual Studio で作成直後の C++ プロジェクトでは `std::filesystem::path::filename` を include できません。

これは、 Visual Studio の C++ プロジェクトはデフォルトでは **C++14** を利用するようになっているためです。

`std::filesystem::path::filename` は **C++17 以降**でなければ利用できないため、プロジェクトの設定を変更する必要があります。 

まず、プロジェクトのプロパティを開きます。

![プロパティ](images\2022-10-30_15h42_18.png)

「C/C++ → 言語」の「C++ 言語標準」を `ISO C++17 標準` に設定して「OK」ボタンを押して設定は完了です。

![C/C++ 設定](images\2022-10-30_15h45_11.png)

## ファイル名を取得してみる

試しに `C:\\test\\test.txt` というパスから `test.txt` を取得してみます。

```cpp:title=ファイル名取得
std::filesystem::path filepath = "C:\\test\\test.txt";
std::cout << path.filename() << std::endl;
```

これでコンソール上に `test.txt` が表示されると思います。

## 参考サイト

- [path::filename - cpprefjp C++日本語リファレンス](https://cpprefjp.github.io/reference/filesystem/path/filename.html)
- [Visual Studio に C11 および C17 サポートをインストールする | Microsoft Learn](https://learn.microsoft.com/ja-jp/cpp/overview/install-c17-support?view=msvc-170)

## まとめ

今回は C++ でファイルパスからファイル名を取得する `std::filesystem::path::filename` メソッドを紹介しました。

それではまた、別の記事でお会いしましょう。