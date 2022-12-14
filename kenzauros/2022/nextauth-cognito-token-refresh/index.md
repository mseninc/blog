---
title: NextAuth.js + Cognito で Refresh Token を使ってアクセストークンを更新する
date: 
author: kenzauros
tags: [NextAuth.js, Next.js, Cognito, TypeScript, OpenID Connect, OAuth, Node.js]
description: 今回は NextAuth.js + Cognito という環境で更新トークンを使ったアクセストークンのローテーションを実装します。
---

こんにちは、 kenzauros です。

[NextAuth.js](https://next-auth.js.org/) は標準でさまざまな OAuth プロバイダーに対応していますが、なぜかアクセストークンの更新に対応していません。

今回は **NextAuth.js + Cognito という環境で更新トークンを使ったアクセストークンのローテーション**を実装します。

## 概要

OAuth2 でアクセストークンを使って認証する場合、アクセストークンの有効期限は短いため、ローテーションする必要があります。

このときに使われるのが **Refresh Token （更新トークン）** です。この更新トークンの有効期限内であれば、認証情報を再び入力することなく、新しいアクセストークンを取得できます。

公式の情報にもあるとおり、 **NextAuth.js は今のところアクセストークンのローテーションを自動で行ってくれません**。これは Cognito に限らず、どのプロバイダーでも同様です。

> While NextAuth.js doesn't automatically handle access token rotation for OAuth providers yet, this functionality can be implemented using callbacks.
> 
> <cite>[Refresh Token Rotation | NextAuth.js](https://next-auth.js.org/tutorials/refresh-token-rotation)</cite>

コールバックで実装可能なので勝手にしてね👌という感じです。

なんでやねん😂という感じもしますが、しかたないので、この情報を参考にして実装します。


## 環境

この記事は下記の環境を前提とします。

- Node.js 18.12.1
- React.js 18.2.0
- Next.js 12.3.1
- NextAuth.js 4.16.4

また、 Cognito 側で**クライアントシークレットを有効にしたアプリクライアント**を事前に作成してあるものとします。

## Cognito プロバイダーのセットアップ

まず、公式手順に従い、 Amazon Cognito 用のプロバイダーを設定します。

- [Amazon Cognito | NextAuth.js](https://next-auth.js.org/providers/cognito)

### `[...nextauth].ts` の初期設定

```ts{numberLines:1}:title=pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CognitoProvider from "next-auth/providers/cognito";
import { Issuer } from "openid-client";

if (!process.env.COGNITO_CLIENT_ID || !process.env.COGNITO_CLIENT_SECRET) {
  throw new Error("Parameters for Cognito not set properly");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
};

export default NextAuth(authOptions);
```

この時点でまだ不要な import がいくつかありますが、この後使用しますので、あまり気にしないでください。

### 環境変数の設定

環境変数を設定します。ローカル環境では `.env.local` に記述すればいいでしょう。

```:title=.env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dxasidDaixe8qy4i05yeyuDSm54xau9h

COGNITO_CLIENT_ID=th1s1smycl1ent
COGNITO_CLIENT_SECRET=th1s1smycl1entsecret
COGNITO_ISSUER=https://cognito-idp.{region}.amazonaws.com/{PoolId}
```

`NEXTAUTH_SECRET` は NextAuth.js 内で暗号化に用いるシークレットです。指定していない場合は `secret` が使われるようなのでなるべくアプリで設定しておきます。

`COGNITO_CLIENT_ID` と `COGNITO_CLIENT_SECRET` は **Cognito ユーザープールのクライアント ID とシークレット**を設定します。

`COGNITO_ISSUER` には `{region}` と `{PoolId}` の部分に **Cognito ユーザープールのリージョンと ID** をはめた URL を指定します。この URL は `CognitoProvider` 内部で `/.well-known/openid-configuration` から各種エンドポイントの情報を取得するために使用されます。

### `_app.tsx` の設定

こちらは公式の [Getting Started](https://next-auth.js.org/getting-started/example) のままです。

`SessionProvider` で囲えば、その配下で NextAuth.js のセッション情報が使用できます。

```tsx:title=pages/_app.tsx
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

これで Cognito プロバイダーの基本的なセットアップは完了です。


## 更新トークンを使ったローテーションの実装

続いて、今回の本題、更新トークンを使ったアクセストークンのローテーションを実装していきます。

[公式の実装例](https://next-auth.js.org/tutorials/refresh-token-rotation)は JavaScript でしたので TypeScript で書けるようにしています。大まかには下記のような内容を実装します。

1. NextAuth.js の TypeScript 型定義を拡張
1. プロバイダー設定を変数に保持
1. アクセストークンを更新するための function を定義
1. `jwt` コールバックを実装
1. `session` コールバックを実装

なお、型定義以外の変更は `pages/api/auth/[...nextauth].ts` の中で収まります。

### NextAuth.js の TypeScript 型定義を拡張

ではまず NextAuth.js の TypeScript 型定義を拡張します。この後の関数やコールバックで **`Session` インタフェースと `JWT` インタフェース** を使いますので、これらを拡張します。

NextAuth.js で定義されている型を拡張するには型定義ファイルを作ります。今回は `types/next-auth.d.ts` に配置しました。

```ts:title=types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

interface UserWithId extends DefaultSession["user"] {
  id?: string;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: UserWithId;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    user: UserWithId;
    error?: string;
  }
}
```

`Session` の `user` 属性の型は `DefaultSession["user"]` で定義されているのですが、下記のように ID を格納できる属性がないため、 `id` 属性を追加しています。

```ts:title=node_modules/next-auth/core/types.d.ts(抜粋)
export interface DefaultSession {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    expires: ISODateString;
}
```

**`Session`** インタフェースのほうは実際にアプリ上で必要になる情報を格納するために使用します。今回のアプリは `accessToken` が必要になるため、ここで追加しています。 `user` や `error` は任意です。

**`JWT`** インタフェースは NextAuth.js のコールバック内でトークンを管理するのに使われます。ここにアクセストークンや有効期限、リフレッシュトークンなどを格納できるようにします。

### プロバイダー設定を変数に保持

次に NextAuth.js の設定で直接定義している `CognitoProvider` を変数で保持するようにします。

```ts:title=pages/api/auth/[...nextauth].ts
const cognitoProvider = CognitoProvider({
  clientId: process.env.COGNITO_CLIENT_ID,
  clientSecret: process.env.COGNITO_CLIENT_SECRET,
  issuer: process.env.COGNITO_ISSUER,
});

export const authOptions: NextAuthOptions = {
  providers: [cognitoProvider],
  callbacks: {},
};
```

単純に外に出しただけです。これで `cognitoProvider` の持つ情報を流用できます。


### アクセストークンを更新するための function を定義

`cognitoProvider` の下あたりにトークンを更新する関数を定義します。

```ts{numberLines:1}:title=pages/api/auth/[...nextauth].ts(refreshAccessToken&nbsp;関数)
async function refreshAccessToken(token: any): Promise<JWT> {
  try {
    const client_id = cognitoProvider.options?.clientId ?? "";
    const client_secret = cognitoProvider.options?.clientSecret ?? "";
    const issuer = await Issuer.discover(cognitoProvider.wellKnown!);
    const token_endpoint = issuer.metadata.token_endpoint ?? "";
    const basicAuthParams = `${client_id}:${client_secret}`;
    const basicAuth = Buffer.from(basicAuthParams).toString("base64");
    const params = new URLSearchParams({
      client_id,
      client_secret,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    });
    // Refresh token
    const response = await fetch(token_endpoint, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      method: "POST",
      body: params.toString(),
    });
    const newTokens = await response.json();
    if (!response.ok) {
      throw newTokens;
    }
    // Next expiration period
    const accessTokenExpires =
      Math.floor(Date.now() / 1000) + newTokens.expires_in;
    console.debug(`Token refreshed (expired at: ${accessTokenExpires})`);
    // Return new token set
    return {
      ...token,
      error: undefined,
      accessToken: newTokens.access_token,
      accessTokenExpires,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
```

※ `console` は必要に応じて削除してください。

Cognito のトークンエンドポイントに関する説明は公式ページを参照してください。

- [トークンエンドポイント - Amazon Cognito](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/token-endpoint.html)

各処理について簡単に解説します。

- L3-4: クライアント ID とクライアントシークレットは `cognitoProvider` のオプションで指定されたものを流用します。
- L5-6: トークンエンドポイントの URL を取得するため、 Cognito の **`/.well-known/openid-configuration` を取得**し、メタデータから URL を抽出します。取得には `openid-client` モジュールの `Issuer.discover` を利用します。
- L7-8: Cognito で**クライアントシークレットが有効な場合は、 ID とシークレットの対で BASIC 認証する必要があります**。ここで `Authorization` ヘッダーに設定する BASE64 文字列を生成しています。
- L9: リクエスト body を生成するための `URLSearchParams` に必要なパラメーターを設定します。
- L16: トークンエンドポイントに対して新しいトークンの発行をリクエストします。
- L29: 新しいアクセストークンの有効期限を計算します。 Cognito の場合 **`expires_in` に有効期限が秒数で格納されています**ので、これを現在時刻に加算して UNIX 時間で保持します。<br>※ `expires_at` ではないので注意してください。
- L33: 新しいアクセストークンとその有効期限を返します。

### `jwt` コールバックを実装

ほぼ[公式の実装例](https://next-auth.js.org/tutorials/refresh-token-rotation)の通りですが、**アクセストークンの有効期限を UNIX 時間で保持**するようにしているため、期限切れ判定の部分のみ条件が異なります。

```ts{numberLines:1}:title=pages/api/auth/[...nextauth].ts(jwt&nbsp;コールバック)
  callbacks: {
    jwt: async ({ user, token, account }) => {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at,
          refreshToken: account.refresh_token,
          user,
        };
      }
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires ?? 0) * 1000) {
        console.debug(`Token available (expired at: ${token.accessTokenExpires})`);
        return token;
      }
      console.debug(`Token expired at ${token.accessTokenExpires}. Trying to refresh...`);
      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
```

- L4-11: 最初にサインインされたときは `account` からアクセストークンや有効期限を抽出して `user` とともに NextAuth.js 上のトークンとして返します。
- L13-16: サインイン時でなく、アクセストークンの有効期限が切れていなければ、そのままトークンを返します。
- L19: アクセストークンの有効期限が切れていれば更新関数を呼び出して結果を返します。

### `session` コールバックを実装

最後にアプリ側でアクセストークンやユーザー情報を利用するため、セッション情報に必要な属性を設定します。この部分はアプリの仕様に合わせて実装してください。

以下の例は[公式の実装例](https://next-auth.js.org/tutorials/refresh-token-rotation)のままです。

```ts{numberLines:1}:title=pages/api/auth/[...nextauth].ts(session&nbsp;コールバック)
  callbacks: {
    jwt: async ({ user, token, account }) => {
      // jwt callback
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
```

## セッション情報の利用

NextAuth.js に設定した Amazon Cognito で更新トークンを使って、アクセストークンをローテーションできるようになりました🚀

セッションに保存されたアクセストークンは `useSession` フックを利用して `accessToken` 属性から取得できます。

```tsx:title=コンポーネント
import { useSession } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession();

  // console.log('session.accessToken', session.accessToken);

  // ... Component implementation
}
```

クライアントが接続されている状態でアクセストークンの有効期限が切れると、下記のようにトークンが更新されるはずです。

```:title=アクセストークンの更新ログ
Token expired at 1670991520. Trying to refresh... 👈 期限切れ
Token refreshed (expired at: 1671007097) 👈 更新された
Token available (expired at: 1671007097) 👈 有効になった
```

## まとめ

NextAuth.js に設定した Amazon Cognito で更新トークンを使って、アクセストークンをローテーションできるようになりました🚀

これで更新トークンの期限内であれば、ログイン状態を継続して利用できます。

アクセストークンの有効期限は通常短く設定するため、毎回ログインするのは非現実的です。なぜアクセストークンの更新機能が標準でないのか、かなり疑問です😂

どなたかのお役に立てば幸いです。
