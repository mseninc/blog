---
title: "[C#.NET] GroupPrincipal で別ドメインの端末からユーザーをグループに追加できない"
date: 2019-02-21
author: kenzauros
tags: [ActiveDirectory, C#, .NET]
---

こんにちは、kenzauros です。

**.NET** アプリで **Active Directory** を管理する際、 .NET 3.5 以降であれば **`System.DirectoryServices.AccountManagement` 名前空間の `PrincipalContext` や `GroupPrincipal` 、 `UserPrincipal` を使うのが、安心・安全**だと思いますが、ラッピングされている分、なかなか融通が利かないこともあります。

今回は Active Directory で**ユーザーをセキュリティグループに参加させる**ときにつまづいたので、原因と解決法を紹介します。

## 前提条件

- ドメイン名: `ad.msen.jp` (ドメインコントローラーも同名)
- ユーザー: `Users/ほげほげ`
- グループ: `Users/グループA`, `Temp/グループB`

※すべて架空の情報です。

## UserPrincipal と GroupPrincipal を使ったグループへの参加

ユーザーとグループが同じコンテナであれば、同じコンテキストでいけるので `Users/グループA` には下記のコードで参加させることができます。

```cs
using (var context = new PrincipalContext(
    ContextType.Domain,
    "ad.msen.jp",
    "CN=Users,DC=ad,DC=msen,DC=jp"))
using (var user = UserPrincipal.FindByIdentity(context, "ほげほげ"))
using (var group = GroupPrincipal.FindByIdentity(context, "グループA"))
{
    if (!group.Members.Contains(user)) {
        group.Members.Add(user);
    }
}
```

※説明を簡単にするため、エラー処理等は省いて `Dispose` は `using` に任せています。

実にシンプルですね。

OU が異なる場合 (`Temp/グループB`) でもグループ用に別のコンテキストを開くことで実現できます。

```cs
using (var context = new PrincipalContext(
    ContextType.Domain,
    "ad.msen.jp",
    "CN=Users,DC=ad,DC=msen,DC=jp"))
using (var groupContext = new PrincipalContext(
    ContextType.Domain,
    "ad.msen.jp",
    "OU=Temp,DC=ad,DC=msen,DC=jp"))
using (var user = UserPrincipal.FindByIdentity(context, "ほげほげ"))
using (var group = GroupPrincipal.FindByIdentity(groupContext, "グループB"))
{
    if (!group.Members.Contains(user)) {
        group.Members.Add(user);
    }
}
```

こちらもわかりやすいですね。

## ドメイン外の端末から実行できない

が、しかし、上記のプログラムは**ドメイン外の端末から実行できません**でした。

`group.Members.Contains(user);` の部分で下記の例外 **`PrincipalOperationException` 「ドメインについての情報を取得できませんでした (1355)」** が発生します。

```
System.DirectoryServices.AccountManagement.PrincipalOperationException
  HResult=0x80131501
  Message=ドメインについての情報を取得できませんでした (1355)。
  Source=System.DirectoryServices.AccountManagement
  スタック トレース:
   場所 System.DirectoryServices.AccountManagement.Utils.GetDcName(String computerName, String domainName, String siteName, Int32 flags)
   場所 System.DirectoryServices.AccountManagement.ADStoreCtx.LoadDomainInfo()
   場所 System.DirectoryServices.AccountManagement.ADStoreCtx.get_UserSuppliedServerName()
   場所 System.DirectoryServices.AccountManagement.ADStoreCtx.IsMemberOfInStore(GroupPrincipal g, Principal p)
   場所 System.DirectoryServices.AccountManagement.PrincipalCollection.ContainsNativeTest(Principal principal)
   場所 System.DirectoryServices.AccountManagement.PrincipalCollection.Contains(Principal principal)
   場所 System.DirectoryServices.AccountManagement.PrincipalCollection.Add(Principal principal)
   場所 System.DirectoryServices.AccountManagement.PrincipalCollection.Add(UserPrincipal user)
   場所 HOGEHOGE.DomainUtilTest.test() (C:\HOGEHOGE\ActiveDirectory\DomainUtilTest.cs):行 362
```

スタックトレースの一番最後を見てみると `System.DirectoryServices.AccountManagement.Utils.GetDcName` となっているのでソースを見てみました。

> [System.DirectoryServices.AccountManagement.Utils.GetDcName - GitHub dotnet/corefx](https://github.com/dotnet/corefx/blob/332d12c0a401927c84d8a2c2ea113427481689ab/src/System.DirectoryServices.AccountManagement/src/System/DirectoryServices/AccountManagement/Utils.cs#L584)

590 行目を見てみると `UnsafeNativeMethods.DsGetDcName` が呼ばれて、結果がエラーなら `PrincipalOperationException` がスローされることがわかります。

**`DsGetDcName` は Windows API の一つで「最も早く応答を返したドメインコントローラーの情報を取得する」** ものです。

> [DsGetDcNameA function | Microsoft Docs](https://docs.microsoft.com/ja-jp/windows/desktop/api/dsgetdc/nf-dsgetdc-dsgetdcnamea)

ということで `PrincipalContext` ですでに DC のコンテキストにいるのにもかかわらず、**メンバーがいるかどうかの確認の際に再度 DC の情報を取りに行く** (同ファイル 540 行目) という謎仕様です。

`DsGetDcName` の仕様によれば、 DNS サーバーに DC の SRV レコードと A レコードが必要なようですが、ドメイン外の端末だと利用している DNS サーバーに DC の情報が完全に登録されているわけではありませんので、情報が取得できないようです。

で、結果、例外が発生する、と。

おそらく内部的にはいろいろ都合があって、こうなっているのだと思いますが、なんのためにコンテキストを開いているのかわかりません(T_T)

## 回避策 (DirectoryEntry を使う)

さて、いろいろ試行錯誤はしましたが、どうも `GroupPrincipal.Members` を使う限り解決できそうにないので、少々泥臭い方法に切り替えて、**別ドメインのマシンからもグループ参加に成功**しました。

```cs
using (var context = new PrincipalContext(
    ContextType.Domain,
    "ad.msen.jp",
    "CN=Users,DC=ad,DC=msen,DC=jp"))
using (var groupContext = new PrincipalContext(
    ContextType.Domain,
    "ad.msen.jp",
    "OU=Temp,DC=ad,DC=msen,DC=jp"))
using (var user = UserPrincipal.FindByIdentity(context, "ほげほげ"))
using (var group = GroupPrincipal.FindByIdentity(groupContext, "グループB"))
{
    var entry = group.GetUnderlyingObject() as System.DirectoryServices.DirectoryEntry;
    if (entry.Properties["member"].IndexOf(user.DistinguishedName) < 0)
    {
        entry.Properties["member"].Add(user.DistinguishedName);
        entry.CommitChanges();
    }
}
```

見たままですが、 `GroupPrincipal` でやるのはあきらめて、 **`DirectoryEntry`** を使っています。 `GroupPrincipal` や `UserPrincipal` は旧来の API である `DirectoryEntry` を内部的に使っているラッパークラスなので、 **`GetUnderlyingObject()` を呼ぶことで、内部の `DirectoryEntry` を取得**できます。

「凝ったことは `DirectoryEntry` でやってください&#9825;」という MS 開発サイドの愛情 (?) が窺えます。

`DirectoryEntry.Properties["member"]` でメンバー管理ができますが、こちらは DN (Distinguished Name, `CN=ほげほげ,DC=ad,DC=msen,DC=jp` のような完全名) で指定する必要がありますが、 `UserPrincipal.DistinguishedName` で取得できるのでそのまま渡せます。

どなたかのお役に立てれば幸いです。

## 参考

- [How Domain Controllers Are Located in Windows](https://support.microsoft.com/ja-jp/help/247811/how-domain-controllers-are-located-in-windows)
- [Windowsにおいてドメインコントローラーが検出される方法 | MacRuby](https://macruby.info/domain-controller/how-domain-controllers-are-located-in-windows.html#more-1240)
- [\[ADSI じゃないけど AD 系\] DsGetDcName() – DC 様の 1 ゲトーレースの行方とは！？ – 管理者は見た！～AD と ILM 一家の秘密～](https://blogs.technet.microsoft.com/jpilmblg/2009/03/05/adsi-ad-dsgetdcname-dc-1-6528/)
- [corefx/Utils.cs at master · dotnet/corefx](https://github.com/dotnet/corefx/blob/master/src/System.DirectoryServices.AccountManagement/src/System/DirectoryServices/AccountManagement/Utils.cs#L584)
- [ドメイン コント ローラーの SRV DNS レコードが作成されていることを確認する方法](https://support.microsoft.com/ja-jp/help/816587/how-to-verify-that-srv-dns-records-have-been-created-for-a-domain-cont)
