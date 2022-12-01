---
title: Apollo Server で GraphQL の Global Object Identification を実装する
date: 
author: k-so16
tags: [Web, GraphQL, Node.js]
description: Apollo Server 上で GraphQL の Global Object Identification を実装する方法を紹介します。
---

こんにちは。最近、久々に [Sonton のピーナッツクリーム](https://www.sonton.co.jp/products/familycup/familycup_peanuts/) を購入した k-so16 です。
意外と近所のスーパーで見かけなかったので、コンビニで見かけたときに、懐かしさのあまり衝動買いをしてしまいました(笑)

現在携わっているプロジェクトで、 **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)** を利用して GraphQL サーバーを実装しています。
GraphQL を初めて触ることもあり、ひたすら調べながら実装を進めています(笑)

特に、 **Global Object Identification** を Apollo Server でどのように実装するのかわからず、かなり苦戦していました。
本記事では、 *Apollo Server 上で GraphQL の Global Object Identification を実装する方法* を紹介します。

本記事で想定する読者層は以下の通りです。

- GraphQL について基礎知識を有している
- Node.js についての基礎知識を有している

なお、本記事では以下の記事の実装例を前提とし、 GraphQL サーバーの実装のコード例は省略します。

> [Apollo ServerとPrismaではじめるGraphQL API開発入門](https://zenn.dev/eringiv3/books/a85174531fd56a)

## Global Object Identification について

実装方法を紹介する前に、 GraphQL の Global Object Identification について簡単に説明します。

GraphQL の Global Object Identification は 以下の 2 つの特徴を持ちます。

- 型によらず **個々のオブジェクトの ID が一意**
- クエリーで ID を指定することで **単一のオブジェクトを取得可能**

GraphQL の仕様では、 `node` というクエリーに ID を渡すことで、 *その ID に適合する単一のオブジェクト* が取得できます。
また、 *`node` クエリーの返却型は `Node`* となっているので、 **取得対象のオブジェクトの型は `Node` の実装型** である必要があります。

`Node` interface はプロパティに `id` しか持ちませんが、 **fragments** を利用することで、指定した型のプロパティも取得できます。

## Global Object Identification の実装の流れ

Global Object Identification の実装の流れは以下の通りです。

1. スキーマに `Node` インタフェースを定義する
1. Query resolver に `node` クエリーの実装を追加する

### スキーマの定義

まず、 GraphQL のスキーマに `Node` インタフェースと、それを実装するオブジェクトを定義します。
インタフェースを定義する際には、 `interface` キーワードを利用します。
インタフェースを実装するオブジェクトには、 `implements` キーワードを利用し、 `Node` を実装します。

クエリーには `node` を定義します。
引数には `ID` を受け取り、 `Node` を返却します。
実際に `node` クエリーが実行される際には、実体のオブジェクトが返却されます。

実際にインタフェースと実装するオブジェクトを定義してみます。
GraphQL のスキーマ定義を以下のように変更します。

```graphql{numberLines:1}:title=schema.graphql
type Query {
  node(nodeId: ID!): Node
}

interface Node {
  id: ID!
}

enum TodoStatus {
  done
  pending
}

type Todo implements Node {
  id: ID!
  createdAt: Date
  updatedAt: Date
  title: String!
  status: TodoStatus!
  description: String
  user: User!
}

type User implements Node {
  id: ID!
  name: String!
  todos: [Todo!]!
}

scalar Date
```

上記の例では、 `Todo` と `User` を `Node` インタフェースを実装するオブジェクトとして定義しています。
`node` クエリーが実行された際に、 `Todo` または `User` が返却されます。

`node` クエリーを実行して `Todo` や `User` を取得するには、以下のように記述します。

- `Todo` を取得する `node` クエリーの例
    ```graphql
    query Node($nodeId: ID!) {
      node(nodeId: $nodeId) {
        id
        ... on Todo {
          title
          status
          description
        }
      }
    }
    ```

- `User` を取得する `node` クエリーの例
    ```graphql
    query Node($nodeId: ID!) {
      node(nodeId: $nodeId) {
        id
        ... on User {
          name
        }
      }
    }
    ```

### Query resolver の実装

スキーマ定義に `node` のインタフェースを実装したので、 query resolver に Apollo Server での動作を定義します。
処理の主な流れは次の通りです。

1. `node` クエリーに渡された ID から型と object ID を取得する
1. object ID に合致するデータを取得する
1. 返却するオブジェクトに `__typename` を追加する

本記事では `node` クエリーに渡される ID の構成は、型名と object ID をコロン (`:`) で結合し、 Base64 でエンコードした値を想定します。
たとえば、 object ID が `1` の `Todo` の場合 `Todo:1` を Base64 でエンコードした `VG9kbzox` が ID として渡されます。

スキーマの定義例の内容を実装する resolver の例を以下に示します。

```ts{numberLines:1}{10,14-16,20,23-25,28}:title=src/resolvers/queries/node.ts 
import { prisma } from "../../lib/prisma";
import { QueryResolvers, Todo, User } from "../../types/generated/graphql";

export const node: QueryResolvers["node"] = async (
  _parent,
  { nodeId },
  _context,
  _info
) => {
  const [typename, id] = Buffer.from(nodeId, "base64").toString().split(":");

  switch (typename) {
    case "Todo":
      const todo = await prisma.todo.findUnique({
        where: { id: Number(id) },
      });
      return {
        ...todo,
        id,
        __typename: 'Todo',
      } as Todo;
    case "User":
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return {
        ...user,
        __typename: 'User',
      } as User;
    default:
      throw new Error(`type ${typename} not implemented.`);
  }
};
```

まず 10 行目で `node` クエリーに渡された `nodeId` を Base64 でデコードし、それをコロンで分割します。
分割した結果は `['Todo', '1']` のように配列の要素として型名と object ID が格納されるので、分割代入を用いてそれぞれ `typename` と `id` に代入します。

次に 14～16 行目および 23～25 行目で `Todo` または `User` のオブジェクトを取得します。
`typename` の値から型を判定し、合致する型のデータについて object ID に合致するオブジェクトを取得します。

最後に GraphQL で定義した node の型にキャストしたオブジェクトを返却する際に、 20 行目および 28 行目のように `__typename` プロパティを追加します。
`__typename` の値は、 `'Todo'` や `'User'` のようにクラス名の文字列を指定します。

## 実装に苦労した点

Object Identification の実装をしている中で、以下のエラーに遭遇しました。

> Abstract type "Node" must resolve to an Object type at runtime for field "Query.node". Either the "Node" type should provide a "resolveType" function or each possible type should provide an "isTypeOf" function.

結論から言うと、 resolver で返却するオブジェクトに `__typename` プロパティが追加されていないことが原因でした。
以下の Stack Overflow の質問の回答のように、オブジェクトに `__typename` プロパティを返すことで解決できました。

> [node.js - How to implement isTypeOf method? - Stack Overflow](https://stackoverflow.com/questions/53078554/how-to-implement-istypeof-method)

本記事を執筆する上で、以下の記事を参考にしました。

> - [Apollo ServerとPrismaではじめるGraphQL API開発入門](https://zenn.dev/eringiv3/books/a85174531fd56a)
> - [The magic of the Node interface - DEV Community 👩‍💻👨‍💻](https://dev.to/zth/the-magic-of-the-node-interface-4le1)
> - [Global Object Identification | GraphQL](https://graphql.org/learn/global-object-identification/)

## まとめ

本記事のまとめは以下の通りです。

- Apollo Server 上で GraphQL の Global Object Identification の実装方法を紹介
    - `Node` インタフェースと `node` クエリーを追加
    - `node` クエリーの resolver の実装方法を紹介

以上、 k-so16 でした。
同じように GraphQL の Global Object Identification の実装で困っている方の助けになれば幸いです。
