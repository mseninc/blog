---
title: Entity Framework 6 Code First で IQueryable の型キャストを伴う検索クエリーを実行するには
date: 2018-11-05
author: kenzauros
tags: [C#, LINQ, Entity Framework 6, .NET]
---

こんにちは、kenzauros です。

**.NET** で **Entity Framework 6 Code First** を使っていると共通的なインターフェースをもつエンティティに同じような処理を適用したいことがあります。

そんなときはインターフェースを定義して、エンティティクラスにそのインターフェースを実装し、拡張メソッドで共通機能を実装するのがスマートかと思います。
しかし、そこで **LINQ to Entities のクエリーを作成 (IQueryable を操作)** しようとすると問題が起こります。

今回はそれを回避して、インターフェースの拡張メソッドでクエリーを作成できるようにする方法を紹介します。


## LINQ to Entities の制限

エンティティクラスとインターフェースはそれぞれ下記のようになっているとします。

```cs
public interface I_WORKER
{
	Name { get; set; }
}

public class D_BLUE_COLLAR : I_WORKER
{
	public Name { get; set; }
	public Factory { get; set; }
}

public class D_WHITE_COLLAR : I_WORKER
{
	public Name { get; set; }
	public Office { get; set; }
}
```

この `I_WORKER` インターフェースに対し、下記のような拡張メソッドを定義しているとします。

```cs
internal static class I_WORKER_Extensions
{
    public static void ClearWorkerProperties(this I_WORKER entity)
    {
        entity.Name = null;
    }

    public static IQueryable<TEntity> AppendWorkerConditions<T>(this IQueryable<TEntity> query, string text)
        where TEntity : class, I_WORKER
    {
        if (!string.IsNullOrEmpty(text))
        {
            query = query.Where(x => x.Name.Contains(text.Value));
        }
        return query;
    }
}
```

`ClearWorkerProperties` のような単純に値を設定するだけのメソッドの場合、なんの問題ありません。

しかし `AppendWorkerConditions` のように `I_WORKER` を実装したクラスのクエリーを扱う場合に問題が生じます。

実際にこのメソッドを `dbContext.D_WHITE_COLLAR.AppendWorkerConditions("一郎");` のように呼び出すと

> Unable to cast the type 'D_WHITE_COLLAR' to type 'I_WORKER'. LINQ to Entities only supports casting EDM primitive or enumeration types.
> 型 'D_WHITE_COLLAR' を 型 'I_WORKER' にキャストできません。 LINQ to Entities では EDM プリミティブ型または列挙型のキャストのみがサポートされます。

と怒られるでしょう。

この根本的な原因は `AppendWorkerConditions`　メソッドの `query.Where(x => x.Name.Contains(text.Value))` が実行される時点で、この**ラムダ式の `x` という変数式に対し、キャスト操作が挿入されてしまう**からです。

データベースに対するクエリーを生成する際に、 **DB 側では D_WHITE_COLLAR や I_WORKER といったオブジェクト間のキャストはできないのでエラー**になる、ということです。

キャスト操作なんて入れていただかなくてもいいのですが、勝手に入ってしまう仕様なのだから致し方ありません。

そもそもこの原因に行き着くまでかなり時間を要し、その後も `Cast` メソッドを使って `I_WORKER` に変換して `D_WHITE_COLLAR` に戻して～なんてして試行錯誤しましたが、やはりだめでした。

## ExpressionVisitor でキャストを取り除く

ということで、この解決策を提案してくださっているのが下記の質問のベストアンサーです。

> Cast a IQueryable type to interface in Linq to Entities
> [https://stackoverflow.com/questions/34647190/cast-a-iqueryable-type-to-interface-in-linq-to-entities](https://stackoverflow.com/questions/34647190/cast-a-iqueryable-type-to-interface-in-linq-to-entities)

自動で挿入されるものは仕方ないと割り切って、**式木中の挿入されたキャスト式を削除**してやろうというのです。

少々トリッキーというか泥臭い印象もありますが、拡張メソッドで覆い隠してしまうので、実現できればなんでもかまいません。

実際に式木を操作するために `ExpressionVisitor` を拡張した下記のようなクラスを作成します。

```cs
internal class RemoveCastsVisitor : ExpressionVisitor
{
    private static readonly ExpressionVisitor Default = new RemoveCastsVisitor();

    private RemoveCastsVisitor()
    {
    }

    public new static Expression Visit(Expression node)
    {
        return Default.Visit(node);
    }

    protected override Expression VisitUnary(UnaryExpression node)
    {
        if (node.NodeType == ExpressionType.Convert && node.Type.IsAssignableFrom(node.Operand.Type))
        {
            return base.Visit(node.Operand);
        }
        return base.VisitUnary(node);
    }
}
```

肝の部分は単項演算子を処理する **`VisitUnary` メソッド**部分だけです。

**ノードの `NodeType` がキャスト (`ExpressionType.Convert`)** かつ **オペランドの型 (`Operand.Type`) が目的の型にキャスト可能** なら、**オペランドだけにする ＝ キャスト元をそのまま返す** というものです。

これにより **キャスト式がスキップされ、キャスト式のオペランド (＝つまりキャストが挿入される前の本来の式) が残る**、ということですね。とてもクレバー。

というわけでこの `RemoveCastsVisitor` を先程の拡張メソッドに適用すると下記のようになります。

```cs
internal static class I_WORKER_Extensions
{
    public static void ClearWorkerProperties(this I_WORKER entity)
    {
        entity.Name = null;
    }

    public static IQueryable<TEntity> AppendWorkerConditions<T>(this IQueryable<TEntity> query, string text)
        where TEntity : class, I_WORKER
    {
        Expression<Func<T, bool>> removeCasts(Expression<Func<T, bool>> condition)
            => (Expression<Func<T, bool>>)RemoveCastsVisitor.Visit(condition);
        if (!string.IsNullOrEmpty(text))
        {
            query = query.Where(removeCasts(x => x.Name.Contains(text.Value)));
        }
        return query;
    }
}
```

基本的には `RemoveCastsVisitor.Visit` メソッドにラムダ式を渡せばよいのですが、戻り値を `Expression` から `Expression<Func<T, bool>>` にキャストする必要があるため、 `Where` が増えると煩雑になるため、一旦ローカルメソッド (`removeCasts`) にしています。

これで `removeCasts` を通してやればキャストが除去されるので、 `I_WORKER` としてでなく、元の型のまま条件クエリーが追加されるはずです。

めでたしめでたし。
