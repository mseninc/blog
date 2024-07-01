---
title: "[Cloudflare Zero Trust] GitHub Copilot を使えるようにする"
date: 
author: kenzauros
tags: [Cloudflare Zero Trust, GitHub Copilot, Visual Studio Code]
description: "Cloudflare Zero Trust が導入された環境で、Visual Studio Code (VS Code) と GitHub Copilot を使っている場合に証明書エラーを回避するための設定方法を紹介します。基本的には Cloudflare Zero Trust の HTTP ファイアウォールポリシーで GitHub Copilot が利用するドメイン名を検査しないように設定するだけです。"
---

こんにちは、 kenzauros です。

Cloudflare Zero Trust が導入された環境で、 Visual Studio Code (VS Code) と [GitHub Copilot](https://copilot.github.com/) を使っている場合に証明書エラーを回避するための設定方法を紹介します。

## はじめに

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

この問題は Cloudflare に限らず、 zScaler や他のプロキシ環境でも発生するため、 GitHub でも議論されています。

- [error: "unable to get local issuer certificate" behind zScaler proxy · community · Discussion #8866](https://github.com/orgs/community/discussions/8866)

VS Code に限れば、 [win-ca](https://marketplace.visualstudio.com/items?itemName=ukoloff.win-ca) 拡張機能を使って、 Windows の証明書ストアにある証明書を使うようにすることで回避できるようですが、これだとユーザーごとにインストールが必要です。

運用ポリシー的に「GitHub に関する証明書をいちいち検査しなくて OK」とできるのであれば、ポリシー設定で除外してしまったほうがシンプルでしょう。


## 設定方法

以下のドキュメントにある URL を参考に、 **Cloudflare Zero Trust のファイアウォールポリシーで GitHub Copilot が利用するドメイン名を検査しないように設定**します。

- [Troubleshooting firewall settings for GitHub Copilot - GitHub Docs](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot)

| ドメイン                         | 正規表現                      |
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
