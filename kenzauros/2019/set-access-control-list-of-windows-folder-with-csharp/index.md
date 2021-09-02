---
title: "[C#.NET] フォルダーの権限 (ACL) を設定する"
date: 2019-03-06
author: kenzauros
tags: [C#, .NET]
---

**.NET** アプリから **Windows のフォルダーにアクセス権を設定**する方法を紹介します。

## ACL の管理

フォルダーのアクセス権管理は Windows でも **ACL (Access Control List, アクセス制御リスト)** を利用します。

手法自体は従来からある方式なので、特筆すべき点はありませんが、 `System.IO` 名前空間と `System.Security.AccessControl` 名前空間を使用します。

機能 | メソッド
--- | ---
アクセス制御の取得 | [Directory.GetAccessControl](https://docs.microsoft.com/ja-jp/dotnet/api/system.io.directory.getaccesscontrol)
アクセス制御の設定 | [Directory.SetAccessControl](https://docs.microsoft.com/ja-jp/dotnet/api/system.io.directory.setaccesscontrol)

### アクセス制御の取得

```cs
var sec = Directory.GetAccessControl(path);
```

`path` はフォルダーのパス、戻り値は **`DirectorySecurity`** 型になります。

ちなみにパスは `\\hogehoge\shared` のように**ネットワークパスを指定すれば共有フォルダー内のフォルダーの権限設定も可能**です。 (接続しているユーザーに管理権限がある場合のみ)

### アクセス制御の追加

**`GetAccessControl`** で取得した `DirectorySecurity` に新しい **`FileSystemAccessRule`** のインスタンスを追加して、 **`SetAccessControl`** に渡してやります。

下記のコードで **`MSEN\yamada` ユーザーに対して「変更」権限** を与えることができます。

```cs
sec.AddAccessRule(new FileSystemAccessRule(
    "MSEN\yamada",
    FileSystemRights.Modify,
    InheritanceFlags.ContainerInherit | InheritanceFlags.ObjectInherit,
    PropagationFlags.None,
    AccessControlType.Allow));
Directory.SetAccessControl(path, sec);
```

`account` はアクセス権を与えるユーザー名です。手元の環境では認識できるドメインであれば、ドメインユーザーなら `"MSEN\yamada"` のような文字列、ローカルユーザーなら単に `"yamada"` のような文字列を渡せば、変換してくれるようです。

**`FileSystemRights.Modify` は「変更」権限**を表します。他にも引数に設定する列挙体がありますが、このへんは各列挙体のヘルプを参照してください。

>[FileSystemRights Enum (System.Security.AccessControl) | Microsoft Docs](https://docs.microsoft.com/ja-jp/dotnet/api/system.security.accesscontrol.filesystemrights)
>[InheritanceFlags Enum (System.Security.AccessControl) | Microsoft Docs](https://docs.microsoft.com/ja-jp/dotnet/api/system.security.accesscontrol.inheritanceflags)
>[PropagationFlags Enum (System.Security.AccessControl) | Microsoft Docs](https://docs.microsoft.com/ja-jp/dotnet/api/system.security.accesscontrol.propagationflags)
>[AccessControlType Enum (System.Security.AccessControl) | Microsoft Docs](https://docs.microsoft.com/ja-jp/dotnet/api/system.security.accesscontrol.accesscontroltype)

## 設定用ユーティリティメソッド

簡単な内容ではありますが、引数が意外と多いので、メソッドにまとめてしまうと見やすくなります。

```cs
/// <summary>
/// 指定したディレクトリの ACL に新規ルールを追加します。
/// </summary>
/// <param name="path">ディレクトリパス</param>
/// <param name="account">ユーザーアカウント名</param>
/// <param name="rights">アクセス権</param>
/// <param name="controlType">許可または拒否</param>
public static void AddAccessRule(string path, string account, FileSystemRights rights, AccessControlType controlType)
{
    var sec = Directory.GetAccessControl(path);
    sec.AddAccessRule(new FileSystemAccessRule(
        account,
        rights,
        InheritanceFlags.ContainerInherit | InheritanceFlags.ObjectInherit,
        PropagationFlags.None,
        AccessControlType.Allow));
    Directory.SetAccessControl(path, sec);
}
```

これで下記のように設定できるようになります。

```cs
AddAccessRule(path, "MSEN\yamada", FileSystemRights.Modify, AccessControlType.Allow);
```

めでたしめでたし