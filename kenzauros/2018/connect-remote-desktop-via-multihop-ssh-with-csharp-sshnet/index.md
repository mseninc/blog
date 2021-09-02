---
title: SSH.NET を使って C# で多段 SSH 経由のリモートデスクトップ接続を可能にする
date: 2018-09-15
author: kenzauros
tags: [C#, .NET Framework, SSH, .NET]
---

多段 SSH 経由のリモートデスクトップを簡略化したくて、最近、[自前のソフト](https://kenzauros.github.io/rharbor/index.ja.html) を作っていたのですが、内部的に SSH 接続の確立に役立ってくれたのが、 **[SSH.NET](https://github.com/sshnet/SSH.NET)** です。

> [sshnet/SSH.NET: SSH.NET is a Secure Shell (SSH) library for .NET, optimized for parallelism.](https://github.com/sshnet/SSH.NET)

非常に便利なライブラリですが、意外と使用例が少なく、試行錯誤しながら使うことになったので、同じような方のために簡単な使い方をメモしておきます。

ちなみにここで書いたことは作ってみたアプリでできますので、よければお試しください。

> [RHarbor - Remote Desktop via SSH Servers | rharbor](https://kenzauros.github.io/rharbor/index.ja.html)

## 前提条件

今回は bastion1, bastion2 の**二つの SSH ホストを経由**して、 bastion2 と同じネットワークにある Windows 機 remote1 の**リモートデスクトップ (3389) へ接続**できる環境を構築します。

今回はサンプルなので、各ホストの IP アドレスとポートは下記のように定数で定義したものとします。

```cs
const string LOCAL_HOST = "127.0.0.1";
const string FIRST_HOP_HOST = "192.168.10.112"; // bastion1
const int FIRST_HOP_PORT = 22;
const string SECOND_HOP_HOST = "192.168.11.114"; // bastion2
const int SECOND_HOP_PORT = 22;
const string REMOTE_IP = "192.168.11.10"; // remote1
const int REMOTE_PORT = 3389; // RDP
const string SSH_USERNAME1 = "hogehoge";
const string SSH_PASSWORD1 = "hogehoge";
```

bastion1, bastion2 はそれぞれパスワード認証です。

## 一段目の SSH 認証

認証は多要素認証にも対応していて、パスワードの他、鍵認証やそれらを組み合わせた認証もできます。

とりあえずパスワード認証の場合は `PasswordConnectionInfo` を使って接続情報 (`ConnectionInfo`) を作成します。

```cs
var connectionInfo = new PasswordConnectionInfo(FIRST_HOP_HOST, FIRST_HOP_PORT, SSH_USERNAME1, SSH_PASSWORD1);
```

こんな感じです。わかりやすいですね。

## 一段目の SSH 接続

これは極めて簡単で、 **`SShClient` クラスに認証情報を渡してインスタンス化し、 `Connect` メソッドを呼ぶだけ**です。

```cs
var client = new SshClient(connectionInfo);
client.Connect();
```

ちなみに**認証に失敗した場合は `SshAuthenticationException` が発生**するので、この例外をキャッチして、再認証（パスワード入力など）を走らせるとよいでしょう。

(失敗理由は英語ですが `Message` プロパティに含まれています)

## 二段目の SSH 接続用のポートフォワード

次に二段目の SSH に接続するため、 bastion2 に対するポートフォワードを設定します。

この場合のポートフォワードは "Local" と呼ばれるタイプのものなので、 **`ForwardedPortLocal` クラス**を用います。

```cs
var forward = new ForwardedPortLocal(LOCAL_HOST, SECOND_HOP_HOST, SECOND_HOP_PORT);
client.AddForwardedPort(forward);
forward.Start();
```

`client.AddForwardedPort` で一段目の SSH にポートフォワードを追加したあと、 `forward.Start()` で開始します。

当たり前ですが、この順番が逆だと例外が発生します。別メソッドでやっていると逆になってしまったりするので注意しましょう。

## 二段目の SSH 接続

二段目の認証情報を作成します。この場合の接続先は今作成したポートフォワードのローカルポートなので、 `forward.BoundHost` と `forward.BoundPort` になります。

```cs
var connectionInfo2 = new PasswordConnectionInfo(forward.BoundHost, (int)forward.BoundPort, SSH_USERNAME1, SSH_PASSWORD1);
var client2 = new SshClient(connectionInfo2);
client2.Connect();
```

なぜか `ForwardedPort` のほうのポートは `uint` で `ConnectionInfo` のほうのポートは `int` なのでキャストしています。

## 最後のポートフォワード

最後にリモートデスクトップ先である remote1 に対してポートフォワードを設定します。

先のポートフォワードとほぼ同じなので難しいところはありません。

```cs
var forward2 = new ForwardedPortLocal(LOCAL_HOST, REMOTE_IP, REMOTE_PORT);
client2.AddForwardedPort(forward2);
forward2.Start();
Console.WriteLine(forward2.BoundPort);
```

ここまで実行できた後 `forward2.BoundHost` が 50000 だとすると、リモートデスクトップを開き `localhost:50000` で接続できるはずです。

## おまけ : 鍵認証

**鍵認証の場合は `PrivateKeyFile` と `PrivateKeyAuthenticationMethod`** を使います。
（いくつかやり方はありますが、この方法が汎用的だと思います。）

```cs
var pkeyfile = new PrivateKeyFile(鍵ファイルのパス, PASSPHRASE);
var auth = new PrivateKeyAuthenticationMethod(USERNAME, pkeyfile);
var connectionInfo = new ConnectionInfo(host, port, USERNAME, auth);
var client = new SshClient(connectionInfo);
client.Connect();
```

ちなみに**鍵ファイルは OpenSSH 形式に対応していますので、 PuTTy 形式 (拡張子 .ppk) だと "Invalid key file" と怒られます**。

PuTTy 形式の鍵しかない場合は puttygen.exe などを利用して ppk から OpenSSH 形式に変換してください。

>[PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
>下のほうの "Alternative binary files" に puttygen.exe のダウンロードリンクがある