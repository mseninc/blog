---
title: "Next.js で Prisma の seed を使うと Cannot use import statement outside a module が出る"
date: 
author: junya-gera
tags: [Next.js, Prisma]
description: "Next.js で Prisma の seed を使うと発生する Cannot use import statement outside a module エラーの原因と解決法を紹介します。"
---

こんにちは、じゅんじゅんです。

Next.js アプリケーションで Prisma の seed スクリプトを実行した際、以下のエラーが発生しました。

```:title=表示されたエラー内容
Environment variables loaded from .env
Running seed command ts-node --transpile-only prisma/seed.ts ...
(node:2774) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
(Use node --trace-warnings ... to show where the warning was created)
/home/hogehoge/prisma/seed.ts:1
import { PrismaClient } from "../prisma/generated/client";
^^^^^^

SyntaxError: Cannot use import statement outside a module
```

このエラーが発生する原因と解決法を紹介します。

## エラーの原因

[Prisma/docs - Seeding](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding) に記載されているとおり、 seed の実行に [ts-node](https://www.npmjs.com/package/ts-node) を使用していました。

```json:title=package.json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
},
```

ts-node は Node.js 上で TypeScript を直接実行できるツールです。

**TypeScript のコードを即座に JavaScript へトランスパイルしたうえで、 Node.js のモジュールシステムに従って実行します。** Node.js はデフォルトで CommonJS を使用します。

一方、 Next.js はデフォルトで ESM 準拠のトランスパイルを行うよう設計されています。これは `tsconfig.json` 内で `module` が `ESNext` に設定されているからです。

**ESM は `import` や `export` をそのまま残して JavaScript へトランスパイルするため、 JavaScript を実行する際に `import` が解釈できず、エラーが発生します。**

## 解決方法

いくつか解決方法がありますが、本記事では以下の 2 つを紹介します。

### 1. モジュールシステムを指定する

エラーを防ぐには **ts-node 実行時にモジュールシステムを明示的に指定する**必要があります。

[Prisma/docs - Seeding](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding) にも記載されているように、 package.json を以下のように修正すれば実行できるようになります。

> プロジェクトによっては、--compiler-options の追加が必要になる場合があります。たとえば、Next.js を使用する場合は、 seed スクリプトを次のように設定します。

```json:title=package.json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
},
```

ts-node を使用して seed スクリプトを実行する際に、`--compiler-options` でモジュールシステムを明示的に指定します。

この設定により、**ts-node は TypeScript をトランスパイルする際に `import` を `require` に変換します。**

### 2. ts-node ではなく tsx を使用する

ts-node ではなく [tsx](https://tsx.is/) を使用することでこのエラーを回避できます。

tsx も ts-node と同じ TypeScript のコードを直接実行するツールで、 TypeScript のファイルをトランスパイルして実行します。

tsx は公式に以下のように記載されているように、**CommonJS ・ ESM どちらにも対応しているため、モジュールシステムを気にする必要がなくなります。**

> No need to wonder whether a package is CommonJS or ESM again. If you've encountered the ERR_REQUIRE_ESM error in Node, you'll never see it again!

まず tsx をプロジェクトにインストールします。

`npm install -D tsx`

package.json は以下のように修正します。

```json:title=package.json
"prisma": {
  "seed": "tsx prisma/seed.ts"
},
```

以上で `Cannot use import statement outside a module` のエラーが出ることなく、 seed スクリプトが実行できます。