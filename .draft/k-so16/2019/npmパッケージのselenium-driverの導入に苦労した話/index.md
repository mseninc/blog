---
title: npmパッケージのselenium-driverの導入に苦労した話
date: 2019-04-01
author: k-so16
tags: [その他]
---

こんにちは。k-so16です。

現在、社内のネットワークで利用されているIPアドレスの情報を管理するツールのUIテストの実装に、何を用いるかを検討をしています。UIテストツールを比較するために、[Selenium](https://docs.seleniumhq.org/) というE2Eテストツールを試そうと思い、導入方法をググりながら、Seleniumのnpmパッケージ [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver) を使おうとしましたが、エラーが出力されて動かず、しばらく悩んでいました。

本記事では、私が直面したエラーとその原因、及び解決方法について紹介します。私と同じ原因でNode.jsからSeleniumが動かせない方々の参考になればと思います。

本記事で想定する読者層は以下の通りです。

- Node.jsのモジュールの基礎的なインストール方法とインポート方法について知っている
- npmパッケージ selenium-webdriver 経由でSeleniumを導入している

本記事で紹介する問題発生時での筆者の開発環境は次の通りです。

- OS: Windows 10
- node バージョン: v10.15.3
- npm バージョン: 6.1.0
- selenium-webdriver バージョン: 4.0.0-alpha.1
- chromedriver バージョン: 2.46.0

## 発生した問題
### 概要
今までSeleniumを利用したことがなかったので、"[Node.js で selenium-webdriver と chromedriver を使って Chrome ブラウザを自動操作してみる](http://neos21.hatenablog.com/entry/2019/01/14/080000)" を参考に、まずコマンドを叩いてパッケージをインストールしました。

```bash
$ npm install chromedriver -g
$ npm install selenium-webdriver --save-dev
```

次に、 index.js というファイルを作成し、以下のテストコードを保存しました。

```JavaScript
const { Build } = require('selenium-webdriver');

(async () => {
  let driver;
  try {
    driver = await new Builder().forBrowser('chrome').build();

    await driver.get('http://localhost');
  } catch (err) {
    console.error(err);
  } finally {
    await driver.quit();
  }
})();
```

index.js 実行すると、次のようなエラーが出力されました。

```
$ node index.js
Error: The ChromeDriver could not be found on the current PATH. Please download the latest version of the ChromeDriver from http://chromedriver.storage.googleapis.com/index.html and ensure it can be found on your PATH.
    at new ServiceBuilder (C:\Users\kato-soichiro\Projects\tutorials\selenium\node_modules\selenium-webdriver\chrome.js:232:13)
    at getDefaultService (C:\Users\kato-soichiro\Projects\tutorials\selenium\node_modules\selenium-webdriver\chrome.js:321:22)
    at Function.createSession (C:\Users\kato-soichiro\Projects\tutorials\selenium\node_modules\selenium-webdriver\chrome.js:696:44)
    at createDriver (C:\Users\kato-soichiro\Projects\tutorials\selenium\node_modules\selenium-webdriver\index.js:155:33)
    at Builder.build (C:\Users\kato-soichiro\Projects\tutorials\selenium\node_modules\selenium-webdriver\index.js:647:16)
    at C:\Users\kato-soichiro\Projects\tutorials\selenium\fail.js:7:53
    at Object.<anonymous> (C:\Users\kato-soichiro\Projects\tutorials\selenium\fail.js:15:3)
    at Module._compile (internal/modules/cjs/loader.js:701:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
    at Module.load (internal/modules/cjs/loader.js:600:32)
(node:18656) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'quit' of undefined
    at C:\Users\kato-soichiro\Projects\tutorials\selenium\fail.js:13:16
    at Object.<anonymous> (C:\Users\kato-soichiro\Projects\tutorials\selenium\fail.js:15:3)
    at Module._compile (internal/modules/cjs/loader.js:701:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
    at Module.load (internal/modules/cjs/loader.js:600:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:539:12)
    at Function.Module._load (internal/modules/cjs/loader.js:531:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:754:12)
    at startup (internal/bootstrap/node.js:283:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)
(node:18656) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:18656) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
$
```

chromedriver パッケージを `npm` コマンドでグローバルインストールしたにも関わらず、環境変数 `$PATH` 上に ChromeDriver が見つからないと怒られたので、以下のコマンドを実行して確認してみると、ちゃんとパスが通っていました。

```bash
$ which chromedriver
/c/Program Files (x86)/Nodist/bin/chromedriver
$
```

### 原因

### 解決策


## 異なる開発環境での検証
### Ubuntu

### FreeBSD