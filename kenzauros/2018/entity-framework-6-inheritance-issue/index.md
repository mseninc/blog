---
title: Entity Framework 6 Code First でエンティティクラスを継承するときの注意
date: 2018-11-01
author: kenzauros
tags: [C#, Entity Framework 6, .NET]
---

**Entity Framework 6 Code First** (以下 EF) で似たようなテーブルを扱う際、クラスのプロパティを何度も書きたくはないので、できれば継承して済ましたい場合があります。

ただ EF は内部で POCO (Plain Old CLR object) クラスとデータベースのリレーションとの間で様々な判断の上でクエリーを生成しているので、下手に C# 上だけで満足するクラス構成にすると、とんでもない SQL が生成されて驚くことになります。

今回はエンティティクラスを継承したときにハマったので注意点をメモしておきます。

詳細は後述しますが、全体的に重要なことは **基底クラスを抽象クラスにする** ということです。

## 前提

下記のようなエンティティクラスとデータベースコンテキストがあるとします。

```cs
public class Row
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class ExtendedRow : Row
{
    public int Weight { get; set; }
}

public partial class MyDbContext : DbContext
{
    public virtual DbSet<Row> Rows { get; set; }
    public virtual DbSet<Row> ExtendedRows { get; set; }
}
```

※実例は [参考サイト](https://stackoverflow.com/questions/38036376/entity-framework-tpc-inheritance-issue)  の例を使わせていただいています。

## 問題

### 問題1: 継承した側のエンティティを SELECT すると基底エンティティが INNER JOIN される

たとえば 

```cs
dbContext.ExtendedRows.ToList();
```

などとすると

```sql
SELECT
[Extent1].[Id] AS [Id],
[Extent1].[Weight] AS [Weight],
[Extent2].[Name] AS [Name],
'0X0X' AS [C1]
FROM [ExtendedRows] AS [Extent1]
INNER JOIN [Rows] AS [Extent2] ON [Extent1].[Id] = [Extent2].[Id]
```

のように、**継承側のテーブルに基底側のテーブルが INNER JOIN されて SELECT** されたりします。

※無駄についてくる `'0X0X'` や `'0X0X0X'` は意味不明ですが、あまり気にしないことにしました。

キーが適切に設定されていれば、レコードは一致するはずなので大きな問題ではないのですが、それでも無駄な JOIN が入るのは歓迎できません。

これを防ぐにはコンテキストの **`OnModelCreating` で継承側エンティティに継承したプロパティのマッピングを引き継ぐ**ように指定する必要があります。

`DbModelBuilder` の `Map` メソッド内で [`MapInheritedProperties` メソッド](https://msdn.microsoft.com/ja-jp/library/gg679174(v=vs.113).aspx) を呼び出します。

```cs
protected override void OnModelCreating(DbModelBuilder modelBuilder)
{
    modelBuilder.Entity<ExtendedRow>()
        .Map(m =>
        {
            m.MapInheritedProperties();
        });
}
```

これによって `Row` から継承したプロパティの列も `ExtendedRows` の列のように扱われ、結果として SELECT 時の余分な `INNER JOIN` がなくなります。

```sql
SELECT
[Extent1].[Id] AS [Id],
[Extent1].[Weight] AS [Weight],
[Extent1].[Name] AS [Name]
FROM [ExtendedRows] AS [Extent1]
```

たぶん上記のような SQL が得られるはずです。

### 問題2: 基底エンティティを SELECT すると継承エンティティが UNION ALL される

正直これはなぜこんな仕様なのか全く意味不明です。

具体的には

```cs
dbContext.Rows.ToList();
```

のように基底エンティティのクエリーを実行すると下記のような **UNION ALL を含んだ SQL** が生成されます。

```sql
SELECT 
    [Extent1].[Id] AS [Id], 
    [Extent1].[Name] AS [Name]
    なんかもろもろ
    FROM [dbo].[Row] AS [Extent1]
UNION ALL
SELECT 
    [Extent2].[Id] AS [Id], 
    [Extent2].[Name] AS [Name]
    なんかもろもろ
    FROM [dbo].[ExtendedRow] AS [Extent2]
```

実際はもうちょっといろいろついてきますが、理解できません。

理由を考えるのも面倒なので、結論からいうと解決策は **基底クラスを抽象クラスにする** です。

ここでは `RowBase` という基底クラスを作って、元々の基底クラス `Row` のプロパティはすべてそちらに移動させます。

その上で、 `Row` も `ExtendedRow` もこの `RowBase` を継承させるようにします。

```cs
public abstract class RowBase
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Row : RowBase
{
}

public class ExtendedRow : RowBase
{
    public int Weight { get; set; }
}
```

これにより無駄な UNION ALL が生成されなくなります。

また、抽象クラス化により前節の `MapInheritedProperties` も不要になります。

おそらくこれ以外にもハマることが多いと思うのですが、なるべく無駄なコードを書かずにデータベース操作をしていきたいですね。

### 補足: さらに継承したエンティティクラスを使いたいときは

今回の `ExtendedRow` をさらに継承したようなエンティティを定義したいときは、 `ExtendedRow` を再度抽象クラス化します。具体的には下記のようになります。 (`RowBase`, `Row` は省略)

```cs
// さらに抽象クラスをつくる
public abstract class ExtendedRowBase : RowBase
{
    public int Weight { get; set; }
}

// ExtendedRow は抽象クラスをそのまま継承
public class ExtendedRow : ExtendedRowBase
{
}

// さらに継承されたエンティティ
public class ExtendedExtendedRow : ExtendedRowBase
{
    public int Height { get; set; }
}
```

参考になれば幸いです。

## 参考サイト

- [sql - Entity Framework TPC inheritance issue - Stack Overflow](https://stackoverflow.com/questions/38036376/entity-framework-tpc-inheritance-issue)
- [TPC | Entity Framework Tutorial | EF6 Documentation](https://entityframework.net/tpc)
- [Table Per Concrete Type Inheritance in Entity Framework | Gil Fink's Blog](http://blogs.microsoft.co.il/gilf/2010/01/25/table-per-concrete-type-inheritance-in-entity-framework/)