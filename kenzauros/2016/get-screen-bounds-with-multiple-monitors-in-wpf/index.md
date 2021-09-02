---
title: WPF でマルチモニターの領域サイズやプライマリモニターの解像度を取得する
date: 2016-08-07
author: kenzauros
tags: [WPF, C#, .NET]
---

こんにちは、けんけんです。

WPF でウィンドウを指定位置に表示する際、スクリーン（モニター、ディスプレイ）の幅と高さを取得したいことがあります。

## とにもかくにも SystemParameters

システムの情報を取得するには System.Windows.**SystemParameters** スタティッククラスのプロパティを使います。

### プライマリモニターのサイズを取得する PrimaryScreenWidth/PrimaryScreenHeight

プライマリ（メイン）モニターのサイズ（解像度）を取得するには SystemParameters.**PrimaryScreenWidth** と SystemParameters.**PrimaryScreenHeight** を使います。

```csharp
Console.WriteLine(SystemParameters.PrimaryScreenWidth);
Console.WriteLine(SystemParameters.PrimaryScreenHeight);
```

フル HD のモニターを使用している場合は 1920 と 1080 が得られるはずです。

### プライマリモニターの作業領域を取得する WorkArea.Width/WorkArea.Height

プライマリモニターの作業領域のサイズを取得するには SystemParameters.**WorkArea.Width** と SystemParameters.**WorkArea.Height** を使います。

```csharp
Console.WriteLine(SystemParameters.WorkArea.Width);
Console.WriteLine(SystemParameters.WorkArea.Height);
```

これは Windows のタスクバーなどを差し引いたサイズになるようですので、 1920 と 1040 などが得られると思います。この場合おそらくタスクバーによって縦方向のサイズが実際の解像度よりも低くなっています。

### マルチモニターの全領域のサイズを取得する VirtualScreenWidth/VirtualScreenHeight

PrimaryScreen なんとかと WorkArea はいずれもプライマリモニターの情報しか返さないため、**マルチディスプレイ環境で使っている場合は、全体の領域を取得できません。**

そこですべてのモニターのスクリーン領域を取得するには SystemParameters.**VirtualScreenWidth** と　SystemParameters.**VirtualScreenHeight** を使います。

```csharp
Console.WriteLine(SystemParameters.VirtualScreenWidth);
Console.WriteLine(SystemParameters.VirtualScreenHeight);
```

たとえばフル HD のモニターを横並びで使用している場合は 3840 と 1080 が得られます。

## あとがき：カレントモニターの情報は？

あともう一つ欲しいのは「現在のウィンドウが存在するモニターのサイズと位置」です。残念ながら WPF だけでは無理なようで、 WinForm 時代の System.Windows.Forms.Screen を利用して取得するしかないようです。

残念。。。