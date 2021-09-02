---
title: "[ASP.NET Core] データ保護キーを Azure Blob ストレージに永続化して Azure Key Vault で暗号化する (概要編)"
date: 2020-01-16
author: kenzauros
tags: [Microsoft Azure, ASP.NET Core, .NET]
---

## はじめに

本記事は連載です。後続の記事については下記を参照ください。

- [概要編](https://mseeeen.msen.jp/persist-keys-with-to-azure-blob-storage-and-protect-with-key-vault-in-aspnet-core-1) ← いまここ
- [Azure Blob ストレージ設定編](https://mseeeen.msen.jp/persist-keys-with-to-azure-blob-storage-and-protect-with-key-vault-in-aspnet-core-2)
- [Azure Key Vault 設定編](https://mseeeen.msen.jp/persist-keys-with-to-azure-blob-storage-and-protect-with-key-vault-in-aspnet-core-3)

## 背景

**ASP.NET Core** を使ったアプリでは、 **CSRF トークンの生成などに用いられるデータ保護キーを永続化**しておく必要があります。デフォルトではメモリ上のみで管理されています。

データ保護キーを永続化していない場合、下記のような影響が考えられます。

- アプリケーションを再起動したときにリセットされてしまうため、再起動の前後で使っていたユーザーに不具合が生じる
- ロードバランスされている環境では、ホストごとのキーが異なり、正常に処理できない

今回デプロイしようとしたアプリでは**ロードバランサーが2台のホストをバランスしているため、永続化が必要**となりました。

また「永続化する場所を変更するとデフォルトの暗号化が無効になるため、運用環境では暗号化の仕組みも一緒に指定することをオススメします」とありますので、同時に暗号化方法も考える必要があります。

> If you specify an explicit key persistence location, the data protection system deregisters the default key encryption at rest mechanism. Consequently, keys are no longer encrypted at rest. We recommend that **you specify an explicit key encryption mechanism for production deployments**.
> --- [ASP.NET Core での保存時のキーの暗号化 | Microsoft Docs](https://docs.microsoft.com/ja-jp/aspnet/core/security/data-protection/implementation/key-encryption-at-rest?view=aspnetcore-3.1)

## 前提条件

- 設定時期: 2020年1月
- ASP.NET Core 3.1
- Azure Virtual Machines 上でアプリの動作する VM (Windows Server) が 2 台動作しており、ロードバランスされている
- リソースグループは VM が含まれる既存のものを利用
- 設定には Azure Portal を利用

## リファレンスについて

ASP.NET Core のデータ保護に関しては MS Docs を含め、情報が少なく、非常に断片的なものが多いので、正確な手法を知るのが困難です。今回は「実際に試行錯誤して実現した」方法ですが、最適解かどうかは不明です。有識者の方がいらっしゃいましたら、ご指摘いただけると助かります。

基本的には MS Docs の不親切なドキュメントを頼りにするしかありません。特に機械翻訳の日本語翻訳が致命的にわかりづらいので、英語で読んだほうがわかりやすいときがあります。主な関連ドキュメントは下記の通りです。

- [ASP.NET Core でのキー記憶域プロバイダー | Microsoft Docs](https://docs.microsoft.com/ja-jp/aspnet/core/security/data-protection/implementation/key-storage-providers?view=aspnetcore-3.1)
- [ASP.NET Core データ保護の構成 | Microsoft Docs](https://docs.microsoft.com/ja-jp/aspnet/core/security/data-protection/configuration/overview?view=aspnetcore-3.1)
- [ASP.NET Core での保存時のキーの暗号化 | Microsoft Docs](https://docs.microsoft.com/ja-jp/aspnet/core/security/data-protection/implementation/key-encryption-at-rest?view=aspnetcore-3.1)

## 実装方法の選択

さて、背景でも述べたように今回はキーの永続化と暗号化が必要です。上記のドキュメントでも混じって登場するので非常にわかりにくいのですが、 **キーの永続化 (Persist)** と **キーの暗号化・保護 (Protect)** は別に考える必要があります。

それぞれいくつかの方法が選択できます。

- キーの永続化 (`PersistKeys~` というメソッドを利用)
    - ファイル システム
    - Azure Blob ストレージ
    - Redis
    - レジストリ (Windows のみ)
    - Entity Framework Core (リレーショナル・データベース)
- キーの暗号化・保護 (`ProtectKeys~` というメソッドを利用)
    - Azure Key Vault
    - X509Certificate2 証明書
    - Windows DPAPI
    - Windows DPAPI NG

今回は**永続化**に **Azure Blob ストレージ** を、**暗号化**に **Azure Key Vault** を使用します。

RDB を使ったアプリであれば永続化は Entity Framework Core のほうが簡単かもしれません。今回は諸事情により RDB を利用できないため、 Blob ストレージを選択しました。

## プログラム側で必要な情報

まずプログラム側で必要となる実装から見ていきます。詳細は下記のドキュメント (再掲) を参照してください。

- [ASP.NET Core データ保護の構成 | Microsoft Docs](https://docs.microsoft.com/ja-jp/aspnet/core/security/data-protection/configuration/overview?view=aspnetcore-3.1)

"ProtectKeysWithAzureKeyVault" の項にあるように **`Startup.ConfigureServices` で `AddDataProtection` を呼び出し、 `PersistKeysToAzureBlobStorage` と `ProtectKeysWithAzureKeyVault` を設定していく**ことになります。

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddDataProtection()
        .PersistKeysToAzureBlobStorage(new Uri("<blobUriWithSasToken>"))
        .ProtectKeysWithAzureKeyVault("<keyIdentifier>", "<clientId>", "<clientSecret>");
}
```

(通常、この設定は本番環境でのみ行うと思いますので、 [前記事](https://mseeeen.msen.jp/configure-environmental-services-in-asp-net-core/) を参考にして Production のときのみ設定されるようにしてください)

ここで問題となるのが、それぞれのメソッドの引数に何を指定すればよいのかということです。「分かっている人は分かっている」んだと思いますが、これについて説明してくれている情報がほぼ皆無です。具体的には下記のような値が必要です。

- `PersistKeysToAzureBlobStorage`
    - **`blobUriWithSasToken`: Azure Blob ストレージの URL に SAS トークン**を付加したもの
- `ProtectKeysWithAzureKeyVault`
    - **`keyIdentifier`: Azure Key Vault の識別子** (`https://<キーコンテナー名>.vault.azure.net` からはじまる URL)
    - **`clientId`: Azure AD に登録されたアプリのクライアント ID** (GUID)
    - **`clientSecret`: Azure AD に登録されたアプリで発行したクライアントシークレット** (パスワードのようなもの, ランダム文字列)

というわけでこれらの値を実際にあてはめると今回の例では下記のようになります。

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddDataProtection()
        .PersistKeysToAzureBlobStorage(new Uri("https://hogehogeapp.blob.core.windows.net/key-container/keys.xml?sv=2019-02-02&ss=bfqt&srt=sco&sp=rwdlacup&se=2030-01-10T10:12:42Z&st=2020-01-10T02:12:42Z&spr=https&sig=OyUtkYrDtPiowU%2FSAbbDaU%2FEG7%2FoRaAqSpot1CMhIG4%3D"))
        .ProtectKeysWithAzureKeyVault(
            "https://hogehoge-app.vault.azure.net/keys/data-protection-key/3071deaab75a4fb09da56f33d6c8dee9",
            "8e55c3c9-3e90-45de-11c9-bb455a04ee19",
            ".7Q:_jBKq3STi:eDkucN7U(sg5U:xg98");
}
```

(本来は当然 Configuration から読み込むほうがいいですが、それぞれの値がイメージしやすくなるように直接記述しています。)

なお、これらの拡張メソッドを利用するためには下記の2つの拡張機能が必要ですので、 NuGet から ASP.NET Core のプロジェクトにインストールしてください。

- Microsoft.AspNetCore.DataProtection.**AzureStorage**
- Microsoft.AspNetCore.DataProtection.**AzureKeyVault**

### 次回

概要だけで長くなったので、今回はここまでにします。次回は、それぞれの値を取得するために Azure ポータルからサービスを設定していきます。

- [\[ASP.NET Core\] データ保護キーを Azure Blob ストレージに永続化して Azure Key Vault で暗号化する (Azure Blob ストレージ設定編)](https://mseeeen.msen.jp/persist-keys-with-to-azure-blob-storage-and-protect-with-key-vault-in-aspnet-core-2)
