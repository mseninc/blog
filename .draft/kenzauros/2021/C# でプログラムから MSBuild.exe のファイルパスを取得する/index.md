---
title: C# でプログラムから MSBuild.exe のファイルパスを取得する
date: 2021-08-05
author: kenzauros
tags: [その他]
---

C# から C# をビルドしたくなった奇特な方向けの記事です。

C#

```cs
public static class MSBuild
{
    public enum FrameworkVersion
    {
        NET2_0 = 2,
        NET3_5 = 3,
        NET4_0 = 4,
    }

    public static string LocateMSBuildExecutable(FrameworkVersion version)
    {
        const string RegistryKeyBase = @"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\MSBuild\ToolsVersions";
        const string MSBuildExeFileName = "MSBuild.exe";
        var ver = version switch
        {
            FrameworkVersion.NET2_0 => "2.0",
            FrameworkVersion.NET3_5 => "3.5",
            FrameworkVersion.NET4_0 => "4.0",
            _ => "4.0"
        };
        var key = $@"{RegistryKeyBase}\{ver}";
        if (Microsoft.Win32.Registry.GetValue(key, "MSBuildToolsPath", null) is string dir)
        {
            return System.IO.Path.Join(dir, MSBuildExeFileName);
        }
        else
        {
            return null;
        }
    }
}
```