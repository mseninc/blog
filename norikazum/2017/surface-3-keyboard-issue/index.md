---
title: Surface 3 からリモートデスクトップで接続すると英字キーボードになる
date: 2017-03-28
author: norikazum
tags: [リモートデスクトップ, Surface]
---

タブレット用途などで Microsoft の Surface 3 を使っているのですが、つい先日、 Surface からリモートデスクトップ (RDP) すると、半角を押しても `｀` が出たりなどキーボードが英字キーボード (101) になりまともに操作できない事態に見舞われました。

色々と調べていると、 Surface 側でレジストリの設定変更をすれば解消しました。

レジストリキーの場所は、
```
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\i8042prt\Parameters
```
で、値を以下のデータのように変更すれば解消しました。

|名前|種類|データ|
|:--:|:--:|:--:|
|LayerDriver JPN|REG_SZ|kbd106.dll|
|OverrideKeyboardIdentifier|REG_SZ|PCAT_106KEY|
|OverrideKeyboardSubtype|DWORD|2|
|OverrideKeyboardType|DWORD|7|
 
リモート先も一度、ログオフ→ログインする必要があります。
 
設定される場合にはレジストリの変更のため誤りがあると動作に影響を及ぼす可能性があります。
自己責任で実施していただくようお願いします。
