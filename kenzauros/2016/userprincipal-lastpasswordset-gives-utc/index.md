---
title: UserPrincipal.LastPasswordSet は UTC (世界協定時) を返す (ActiveDirectory)
date: 2016-08-23
author: kenzauros
tags: [ActiveDirectory, C#, .NET]
---

こんにちは、イギリスに住みたいけんけんです。今回は ActiveDirectory ネタです。

## UserPrincipal と LastPasswordSet

System.DirectoryServices.AccountManagement 名前空間にあるクラス群は .NET からの ActiveDirectory 管理をちょっとだけ楽にしてくれます。

おそらく一番よく使うのは ActiveDirectory のユーザーオブジェクトに相当する [UserPrincipal](https://msdn.microsoft.com/ja-jp/library/system.directoryservices.accountmanagement.userprincipal(v=vs.90).aspx) クラスでしょう。

パスワードの設定も [SetPassword](https://msdn.microsoft.com/ja-jp/library/system.directoryservices.accountmanagement.authenticableprincipal.setpassword(v=vs.90).aspx) メソッドでできて便利です。

あと、パスワードの管理をしていると **最後にパスワードが変更された日時** を参照したいときがあります。たとえば前回の変更から一定期間を過ぎていたらアラートを出す、なんかはよくありそうですね。

そんなときには [UserPrincipal.LastPasswordSet](https://msdn.microsoft.com/ja-jp/library/system.directoryservices.accountmanagement.authenticableprincipal.lastpasswordset(v=vs.90).aspx) を使います。

ユーザーが前回パスワードを変更した日時 (AD の属性でいうと **pwdLastSet 属性**) を **Nullable<DateTime> 型 (DateTime? 型)** で返してくれます。

## Null 許容型とタイムゾーンに注意

そもそも pwdLastSet はパスワードが変更されていないと "未設定" な項目なので、 LastPasswordSet プロパティは Null 許容型の DateTime を返すようになっています。

ということで、使用するときは **HasValue プロパティで値があるかどうかをチェックした上で、 Value プロパティで本来の値を取得**します。

```csharp
if (user.LastPasswordSet.HasValue)
{
    Console.WriteLine(user.LastPasswordSet.Value);
}
```

ただし、 **LastPasswordSet が返す値は常に [UTC (世界協定時)](https://ja.wikipedia.org/wiki/%E5%8D%94%E5%AE%9A%E4%B8%96%E7%95%8C%E6%99%82)** です。

そのため日本の標準時とは必ず 9 時間ずれています (LastPasswordSet が遅れている)。

ということで現地時刻に直して利用しましょう。 ToLocalTime メソッドを使用します。

```csharp
if (user.LastPasswordSet.HasValue)
{
    Console.WriteLine(user.LastPasswordSet.Value.ToLocalTime());
}
```

うん、なんか長いですね。

## あとがき

はー、時差のない国に行きたい。イギリスいきたい。あ、でも今はサマータイムか。

時差とプログラマーは離れられない運命ですね ┐(´ー｀)┌

おつかれさまでした。