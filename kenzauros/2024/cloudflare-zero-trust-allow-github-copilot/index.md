---
title: "[Cloudflare Zero Trust] GitHub Copilot を使えるようにファイアウォールポリシーを設定する"
date: 2024-07-22
author: kenzauros
tags: [Cloudflare Zero Trust, GitHub Copilot, Visual Studio Code]
description: "Cloudflare Zero Trust が導入された環境で、Visual Studio Code (VS Code) と GitHub Copilot を使っている場合に証明書エラーを回避するための設定方法を紹介します。基本的には Cloudflare Zero Trust の HTTP ファイアウォールポリシーで GitHub Copilot が利用するドメイン名を検査しないように設定するだけです。"
---

こんにちは、 kenzauros です。

Cloudflare Zero Trust が導入された環境で、 Visual Studio Code (VS Code) と [GitHub Copilot](https://copilot.github.com/) を使っている場合に証明書エラーを回避するための設定方法を紹介します。

## エラー

VS Code で GitHub Copilot を使おうとすると、 Copilot のアイコンに停止マークがつき、 OUTPUT（出力）ペインに以下のようなエラーが表示されることがあります。

エラー例 1:
```
2024-07-01 14:22:28.608 [error] [ghostText] Error on ghost text request: FetchError: The pending stream has been canceled (caused by: unable to get local issuer certificate)
    at fetch (c:\Users\USER\.vscode\extensions\github.copilot-1.208.0\node_modules\@adobe\helix-fetch\src\fetch\index.js:99:11)
    ～省略～
    at Q.provideInlineCompletions (c:\Users\USER\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\workbench\api\node\extensionHostProcess.js:153:118317) {
  type: 'system',
  _name: 'FetchError',
  code: 'ERR_HTTP2_STREAM_CANCEL',
  errno: undefined,
  erroredSysCall: undefined
}
```

エラー例 2:
```
2024-07-01 14:22:43.658 [error] [default] Error sending telemetry FetchError: The pending stream has been canceled (caused by: unable to get local issuer certificate)
    at fetch (c:\Users\USER\.vscode\extensions\github.copilot-1.208.0\node_modules\@adobe\helix-fetch\src\fetch\index.js:99:11)
    ～省略～
    at xq.fetch (c:\Users\USER\.vscode\extensions\github.copilot-1.208.0\lib\src\network\helix.ts:88:22) {
  type: 'system',
  _name: 'FetchError',
  code: 'ERR_HTTP2_STREAM_CANCEL',
  errno: undefined,
  erroredSysCall: undefined
}
```

いずれも原因は **`unable to get local issuer certificate`** となっており、 SSL/TLS 証明書の検査が行われたことで、証明書エラーが発生したことを示しています。


## 解決策

この問題は Cloudflare に限らず、 zScaler や他のプロキシ環境でも発生するため、 GitHub でも議論されています。

- [error: "unable to get local issuer certificate" behind zScaler proxy · community · Discussion #8866](https://github.com/orgs/community/discussions/8866)

VS Code に限れば、 [win-ca](https://marketplace.visualstudio.com/items?itemName=ukoloff.win-ca) 拡張機能を使って、 Windows の証明書ストアにある証明書を使うようにすることで回避できるようですが、これだとユーザーごとにインストールが必要です。

運用ポリシー的に「GitHub に関する証明書をいちいち検査しなくて OK」とできるのであれば、ポリシー設定で除外してしまったほうがシンプルでしょう。

ということで、今回は解決策として **Cloudflare Zero Trust の HTTP ファイアウォールポリシーで GitHub Copilot が利用するドメイン名を検査しないように設定**します。

Cloudflare の公式ドキュメントにも以下のように一部のアプリケーションでは *Do Not Inspect （検査しない）* ポリシーを追加する必要があるとされています。

> Some applications require the use of a publicly trusted certificate — they do not trust the system certificate, nor do they have a configurable private store. For these applications to function, you must add a Do Not Inspect policy for the domains or IPs that the application relies on.
> 
> アプリケーションによっては、一般に信頼されている証明書を使用する必要があります。これらのアプリケーションは、システム証明書を信頼しませんし、設定可能なプライベートストアも持っていません。このようなアプリケーションを機能させるには、アプリケーションが依存するドメインまたはIPに対してDo Not Inspectポリシーを追加する必要があります。
> 
> <cite>[​Add the certificate to applications​ - Install certificate manually · Cloudflare Zero Trust docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/user-side-certificates/install-cloudflare-cert/#add-the-certificate-to-applications)</cite>

なお、 GitHub Copilot の公式ドキュメントにも証明書関連のトラブルシューティング方法がいくつか掲載されています。

- [GitHub Copilot のネットワーク エラーのトラブルシューティング - GitHub ドキュメント](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-network-errors-for-github-copilot)

この中でユーザー・管理者ともに簡便な方法はやはりプロキシのポリシーで対象のドメイン名を検査しないように設定することでしょう。


## 設定方法

前述のとおり **Cloudflare Zero Trust の HTTP ファイアウォールポリシーで GitHub Copilot が利用するドメイン名を検査しないように設定**します。対象のドメイン名については以下のドキュメントにある URL を参考に正規表現で指定することにします。

- [Troubleshooting firewall settings for GitHub Copilot - GitHub Docs](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot)

| 対象ドメイン                     | 正規表現                      |
| -------------------------------- | ----------------------------- |
| `github.com`<br>`api.github.com` | `^(api\.)?github\.com$`       |
| `*.githubusercontent.com`        | `.*\.githubusercontent\.com$` |
| `*.githubcopilot.com`            | `.*\.githubcopilot\.com$`     |

まず **[Zero Trust] → [Gateway] → [Firewall Policies] → [HTTP]** から **[Add a policy]** をクリックします。

![](images/firewall_policies_http.png "ファイアウォールポリシー (HTTP) の追加")

各項目を以下のように設定します。対象のドメインは Traffic の項目で、正規表現を使って指定します。

- STEP 1: Name your policy
    - Policy name: `Allow GitHub Copilot` など（任意）
    - Description: 任意
- STEP 2: Build an expression
    - Traffic: *※ 条件を `Or` で結合するのを忘れずに*
        - Selector: Domain<br>Operator: Matches<br>Value: `^(api\.)?github\.com$`
        - *Or*
        - Selector: Domain<br>Operator: Matches<br>Value: `.*\.githubusercontent\.com$`
        - *Or*
        - Selector: Domain<br>Operator: Matches<br>Value: `.*\.githubcopilot\.com$`
    - Identity: 必要に応じて設定
    - Device Posture: 必要に応じて設定
- STEP 3: Select an action
    - Action: **`Do Not Inspect`**

![](images/firewall_policies_http_new.png "ファイアウォールポリシー (HTTP) の設定内容")

ポリシーを設定後しばらくすると各端末に反映され、証明書エラーが発生しなくなるはずです。

## まとめ

Cloudflare Zero Trust のファイアウォールポリシーで GitHub Copilot が利用するドメイン名を検査しないように設定することで、証明書エラーを回避できるようになります。

どなたかのお役に立てれば幸いです。
