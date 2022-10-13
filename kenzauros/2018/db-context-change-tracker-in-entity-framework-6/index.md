---
title: C# Entity Framework 6 の DbContext で変更されたレコードと変更前後の値を取得する
date: 2018-06-20
author: kenzauros
tags: [C#, .NET Framework, Entity Framework 6, .NET]
---

こんにちは、kenzauros です。

**Entity Framework 6** (以下、 **EF6**) では**自動で変更を追跡してくれるため、 `SaveChanges()` を呼び出すとなんらかの変更があったレコードだけがデータベース側で変更されます**。

簡単なアプリケーションではすべてフレームワーク任せでもいいのですが、少し実用的なアプリケーションを作ろうとすると、**ユーザーに確認を求めたり、ログを残したりする必要があるので、結局、変更されたレコードを取得したり、変更内容を洗い出す**必要がでてきます。

とはいえ、変更前の値を保持しておいて、変更後の値と地道に比較していくのは、どうも昭和な匂いがします。 EF6 は変更されたものだけを反映する力をもっているわけですから、その情報を取得してやるのがスマートでしょう。

ということで今回は **EF6 で、変更されたレコードと変更前後の値を取得する方法**をご紹介します。

## 前提

話を簡単にするため、下記のようなごく単純なエンティティとコンテキストを想定します。
（本記事において「エンティティ」とは、データベーステーブルのレコードとほぼ同義です。）

エンティティには POCO (plain-old CLR object) のクラス、コンテキストには VS の Entity Data Model ウィザード等で自動生成される DbContext が使えます。

```cs
public class Company
{
    public int Id { set; get; }
    public string Name { set; get; }
}

public class MyDbContext : DbContext
{
    public virtual DbSet<Company> Companies { get; set; }
}
```

このクラスを使って、 `Company` を追加したり更新したりするには下記のようにしますね。
（説明の都合上、エンティティがない場合などの処理は省いています。）

```cs
using (var db = new MyDbContext) {
    // 修正
    var first = db.Companies.First(x => x.Id == 1);
    first.Name = "いちばん";
    // 追加
    var second = new Company { Id = 2, Name = "にばん" };
    db.Companies.Add(second);
    // 削除
    var third = db.Companies.First(x => x.Id == 3);
    db.Companies.Remove(third);
    // 変更を反映
    db.SaveChanges();
}
```

## 変更追跡の情報を取得する ChangeTracker の Entries<T> メソッド

`DbContext` クラスには **`ChangeTracker` プロパティがあり、現在のコンテキストに対する変更を追跡**しています。

**追跡されているエンティティに関する情報を取得するには `Entries<T>` メソッド**を使います。型パラメーター `T` にはエンティティの型、つまりテーブルに対応する型を指定します。今回の場合は `Company` ですね。

```cs
var entries = db.ChangeTracker.Entries<Company>();
```

**`Entries<T>` メソッドが返す各要素は `DbEntityEntry<T>` 型**になっています。 `Entity` と `Entry` で名前がややこしいので区別するようにしましょう。

- **`Entity` (エンティティ)** はデータオブジェクト (＝テーブルのレコード) 自体
- **`Entry` (エントリー)** はエンティティの変更追跡オブジェクト

`DbEntityEntry<T>` で変更内容を知るために使うのは主に下記の 3 プロパティです。

- **`State`** : 変更なし (`Unmodified`) ・追加 (`Added`) ・修正 (`Modified`) ・削除 (`Deleted`) など、どういった変更状態なのかを示す。
- **`OriginalValues`** : 変更**前**の値の集合  
(ただし `State` が `Added` = 追加のときは元の値がないので取得しようとすると例外になる。)
- **`CurrentValues`** : 変更**後** (＝現在) の値の集合

ちなみに**変更されていないエンティティも `State` = `Unmodified` として列挙されます**ので、なんらかの変更が加わったものだけを取り出す場合は、ここからフィルタリングしてやることになります。

## 追加・修正または削除されたエントリーを取得する

では**追加・修正されたエントリー**だけを取得してみます。

```cs
var addedOrModified = db.ChangeTracker.Entries<Company>()
    .Where(x => x.State.HasFlag(EntityState.Added) || x.State.HasFlag(EntityState.Modified))
    .ToList();
```

特に難しいことはありません。
`State` が追加 (`Added`) もしくは修正 (`Modified`) となっているエントリーだけを取り出します。

同様に、**削除されたエントリー**の場合は、下記のような感じで OK です。

```cs
var deleted = db.ChangeTracker.Entries<Company>()
    .Where(x => x.State.HasFlag(EntityState.Deleted))
    .ToList();
```

これらのエントリーから、**変更対象のエンティティを取得するには `Entity` プロパティ**を参照します。

```cs
foreach (var d in deleted) {
    Console.WriteLine(d.Entity.Name); // 削除対象の会社名が表示されるはず
}
```

これで削除された (削除されるはずの) 会社名が表示されるでしょう。

### 変更状態は ToList しておこう

本稿で使用している **`ChangeTracker` は `SaveChanges()` メソッドが呼ばれるとリセットされます**。

```cs
var addedOrModified = db.ChangeTracker.Entries<Company>()
    .Where(x => x.State.HasFlag(EntityState.Added) || x.State.HasFlag(EntityState.Modified));
Console.WriteLine(addedOrModified.Count()) // ← 追加・変更された件数
db.SaveChanges(); // 保存すると
Console.WriteLine(addedOrModified.Count()) // ← 0 になる
```

`SaveChanges()` メソッドを最後に一回しか呼ばないのであれば問題ないのですが、トランザクションで複数の変更を別々に保存しているときなどは、必要なタイミングで「変更内容がとれない！」という残念な自体に見舞われるかもしれません。 (見舞われました)

ということで、**変更状態は `ToList()` メソッドを呼んでリスト化**しておきましょう。これで魚拓みたいにそのときの状態が確定しますので、 `SaveChanges()` 後でも変更記録にアクセスできます。

```cs
var addedOrModified = db.ChangeTracker.Entries<Company>()
    .Where(x => x.State.HasFlag(EntityState.Added) || x.State.HasFlag(EntityState.Modified))
    .ToList(); // ← これ重要
Console.WriteLine(addedOrModified.Count) // ← 追加・変更された件数
db.SaveChanges(); // 保存しても
Console.WriteLine(addedOrModified.Count) // ← 追加・変更された件数が残る
```

### 拡張メソッドでちょっと簡潔に

```cs
public static class DbContextExtensions
{
    /// <summary>
    /// 現在のコンテキストで指定した状態のエンティティに関する変更追跡エントリーを列挙します。
    /// </summary>
    /// <typeparam name="T">エンティティの型</typeparam>
    /// <param name="context">データベースコンテキスト</param>
    /// <param name="state">状態</param>
    /// <returns>エンティティに関する変更追跡エントリーのコレクション</returns>
    public static IEnumerable<DbEntityEntry<T>> GetEntityEntriesByState<T>(this DbContext context, EntityState state) where T : class
        => context.ChangeTracker.Entries<T>().Where(x => (x.State & state) != 0);
}
```

状態を絞ってエントリーを取得するのは毎回書いていると冗長なので上記のような拡張メソッドを定義しておくと、ちょっと簡潔に書けます。

```cs
// before
var addedOrModified = db.ChangeTracker.Entries<Company>()
    .Where(x => x.State.HasFlag(EntityState.Added) || x.State.HasFlag(EntityState.Modified))
    .ToList();
// after
var addedOrModified = db.GetEntityEntriesByState<Company>(EntityState.Added | EntityState.Modified)
    .ToList();
```

いっそ拡張メソッド内で `ToList` してしまってもいいかもしれません。

## 変更前後の値を取得する

変更**前後**の値は **`OriginalValues` と `CurrentValues` にそれぞれキー・バリュー形式で格納**されます。

この**キーは POCO のプロパティ名 (テーブルの列名)** で、**キーの一覧は `PropertyNames` プロパティ**で参照できます。

たとえば `Company` テーブルの `Name` プロパティが "MS Engineering" から "MSEN" に変更されたとすると下記のようになります。

- `entry.OriginalValues["Name"]` → `"MS Engineering"`
- `entry.CurrentValues["Name"]` → `"MSEN"`

`OriginalValues` 等の要素は `object` 型なので、比較するときなどは注意しましょう。

また、 **`State` が `Added` (= 追加) の場合は元の値がないために `OriginalValues` にアクセスしようとすると例外が発生**しますので、先に `State` をチェックしたほうが無難です。

ということで、変更されたプロパティのみを抽出するために下記のように変換してみましょう。

```cs
var diffs = entry.CurrentValues.PropertyNames
    .Where(x => entry.State.HasFlag(EntityState.Added) // 追加された場合
        || entry.OriginalValues[x]?.ToString() != entry.CurrentValues[x]?.ToString()) // もしくは差分があるものだけ
    .ToDictionary( // ディクショナリに変換
        x => x, // キーは列名
        x => (
            original: entry.State.HasFlag(EntityState.Added) ? null : entry.OriginalValues[x]?.ToString(), // 元の値
            current: entry.CurrentValues[x]?.ToString() // 変更後の値
        )
    );
```

※[タプル型](https://docs.microsoft.com/ja-jp/dotnet/csharp/tuples)を使用しているため、 .NET 4.6 以降もしくは [System.ValueTuple](https://www.nuget.org/packages/System.ValueTuple/) パッケージが必要です。

用途によって変わってくるとは思いますが、たとえばこう変換しておくと、変更された属性の判断や値へのアクセスが下記のように簡単になります。

- 属性が変更されたかどうか : `diffs.ContainsKey["Name"]`
- 変更前の値 : `diffs["Name"].original`
- 変更後の値 : `diffs["Name"].current`

```cs
if (diffs.ContainsKey["Name"]) { // Name プロパティが変更されていれば
    var (original, current) = diffs["Name"]; // 変更前後の値を展開して代入
    Console.WriteLine($"変更前の値は {original}, 変更後の値は {current} です。");
}
```

けっこうすっきり書けますね。 `DbEntityEntry<T>` の拡張メソッドにしておいてもいいかもしれません。

