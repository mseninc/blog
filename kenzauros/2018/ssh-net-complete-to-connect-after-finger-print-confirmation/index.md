---
title: SSH.NET で SSH サーバーのフィンガープリントを確認してから接続を完了する
date: 2018-10-01
author: kenzauros
tags: [C#, .NET Framework, SSH, .NET]
---

**SSH サーバー**に接続する際、正しいサーバーか確認するために **「フィンガープリント」（指紋）**を利用します。

フィンガープリントは SSH サーバーからバイト列として返され、人間にはわかりにくいので、よくある SSH クライアントでは `9a:ab:2e:19:e0:4e:68:79:fa:44:b5:4b:63:48:af:1f` のようなカンマ区切りの 16 進文字列か、アスキーアートのようなパターンにして、ユーザーに正当性を確認させています。

**SSH.NET の `SshClient` クラスでサーバーのフィンガープリントを確認するには `HostKeyReceived` イベント**を使います。

SSH.NET の使い方については前記事をご覧ください。

> [SSH.NET を使って C# で多段 SSH 経由のリモートデスクトップ接続を可能にする](/connect-remote-desktop-via-multihop-ssh-with-csharp-sshnet)

## 公式の例

公式サイトでも ["Verify host identify"](https://github.com/sshnet/SSH.NET#verify-host-identify) として、フィンガープリント検証のシンプルな一例が紹介されています。

```cs
byte[] expectedFingerPrint = new byte[] {
                                            0x66, 0x31, 0xaf, 0x00, 0x54, 0xb9, 0x87, 0x31,
                                            0xff, 0x58, 0x1c, 0x31, 0xb1, 0xa2, 0x4c, 0x6b
                                        };

using (var client = new SshClient("sftp.foo.com", "guest", "pwd"))
{
    client.HostKeyReceived += (sender, e) =>
        {
            if (expectedFingerPrint.Length == e.FingerPrint.Length)
            {
                for (var i = 0; i < expectedFingerPrint.Length; i++)
                {
                    if (expectedFingerPrint[i] != e.FingerPrint[i])
                    {
                        e.CanTrust = false;
                        break;
                    }
                }
            }
            else
            {
                e.CanTrust = false;
            }
        };
    client.Connect();
}
```

この例を用いれば、**フィンガープリントが既定のものと一致しない場合は `e.CanTrust` を `false` にして接続を中止**することができます。

しかし、いくつか使いにくい点があります。

まず、**初めて接続する前にサーバーのフィンガープリントを知っていることは稀ですので、ユーザーに正規のフィンガープリントであるかどうか確認させる必要があります**。

TeraTerm や Poderosa, RLogin など一般的な SSH クライアントでは初回接続時にサーバーから取得したフィンガープリントを、正規のものとして登録するかどうかのダイアログが表示されます。

上記の検証ロジックではこの処理に対応できません。

このイベントが非同期で発生しており、 `client.Connect()` した時点で SSH サーバーには接続されて、**フィンガープリントの確認がどうであれ、すでに通信が可能になっている**からです。

ではどうすればいいでしょうか。

## フィンガープリントの確認が終わるまで接続処理をブロックさせる

いくつか方法はあると思いますが、今回自作していたアプリでは**フィンガープリントの確認が終わるまで接続処理をブロック**できたほうがよかったため、下記のように実装しました。

```cs
var ev = new ManualResetEventSlim(false);
// イベントハンドラ用メソッド
void hostKeyEventHandler(object o, HostKeyEventArgs e)
{
    if (e.FingerPrint == null) throw new Exception("Empty finger print received.");
    var fingerprint = e.FingerPrint?.ToFingerPrintString();
    if (ExpectedFingerPrint == fingerprint) // ExpectedFingerPrint は保存してあったフィンガープリントの想定
    {
        // 保存されているフィンガープリントと一致した場合
        e.CanTrust = true;
        ev.Set();
        return;
    }
    // ユーザーにダイアログなどで正当性を確認させる
    e.CanTrust = 確認結果;
    if (e.CanTrust)
    {
        // ユーザーの確認 OK
        // 次回以降用にフィンガープリントをどこかに保存しておく
    }
    ev.Set();
}
// 実際の接続処理
await Task.Run(() =>
{
    client.HostKeyReceived += hostKeyEventHandler; // イベントハンドラを設定
    Console.WriteLine("Connecting...");
    client.Connect();
    ev.Wait(); // フィンガープリントが確認されるまで実行をブロック
    Console.WriteLine("Connected.");
    client.HostKeyReceived -= hostKeyEventHandler; // イベントハンドラを解除
});
```

**`ManualResetEventSlim`** を使ってフィンガープリントが確認されるまで接続処理をブロックしています。

確認結果が格納されて `ev.Set()` でシグナル状態になってはじめて "Connected." が表示されます。

少々泥臭い実装なので、他によい方法があれば教えてください。

## おまけ

ちなみに `HostKeyReceived` イベントで取得できる `FingerPrint` はバイト配列になっていて、画面表示や管理には不便なので、**`ToFingerPrintString` という拡張メソッド**を用意しています。

```cs
internal static class FingerPrintUtil
{
    public static string ToFingerPrintString(this byte[] fingerprint)
    {
        return string.Join(":", fingerprint.Select(x => x.ToString("x2")));
    }
}
```

これで `9a:ab:2e:19:e0:4e:68:79:fa:44:b5:4b:63:48:af:1f` のようなカンマ区切りの 16 進文字列が得られます。

## 関連記事

- [SSH.NET を使って C# で多段 SSH 経由のリモートデスクトップ接続を可能にする](/connect-remote-desktop-via-multihop-ssh-with-csharp-sshnet)
- [sshnet/SSH.NET: SSH.NET is a Secure Shell (SSH) library for .NET, optimized for parallelism.](https://github.com/sshnet/SSH.NET)
