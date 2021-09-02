---
title: "[Entity Framework Core] EF Core 3.0 で直接 SQL を実行する方法"
date: 2019-11-14
author: k-so16
tags: [C#, Entity Framework Core, .NET]
---

こんにちは。最近、母校の大学祭に足を運んだ k-so16 です。久々に友人達と会い、楽しい時間を過ごしました。

既存システムのデータベースを利用して新たにシステムを開発する場合、テーブル設計の前提が異なるため、無理にフレームワークの機能を用いてデータを取得するより、 **生SQL からエンティティを取得** する方が効率的に開発をすすめられることがあります。

本記事では、 Entity Framework Core 3.0 (以下 EF Core 3.0 と表記) で SQL を直接実行してデータを取得する方法を紹介します。

想定する読者層は以下の通りです。

- O/R マッパーとしての基礎的な操作は知っている
- 基礎的な SQL を理解している
- EF Core 3.0 で SQL を直接実行する方法を知らない

## 想定するテーブルの構造
本記事では、以下に定義する 3 つのテーブルを利用して、特定の学生の講義スケジュールを取得する場合を想定します。

- 講義カレンダーテーブル `lecture_schedule`

    |カラム名|型|説明|
    |---|---|---|
    |`id`|`int`|ID|
    |`lecture_id`|`int`|講義ID|
    |`academic_year`|`int`|開講年度|
    |`date`|`datetime`|開講日|
    |`period`|`int`|開講時限|
    |`student_id`|`int`|学生ID|

- 講義テーブル `lectures`

    |カラム名|型|説明|
    |---|---|---|
    |`id`|`int`|ID|
    |`name`|`nvarchar`|講義名|
    |`academic_year`|`int`|開講年度|

- 学生テーブル `students`

    |カラム名|型|説明|
    |---|---|---|
    |`id`|`int`|ID|
    |`period`|`nvarchar`|氏名|

これらのテーブルから学生の講義スケジュールを取得するために、以下のデータ構造の取得を考えます。

|カラム名|型|説明|
|---|---|---|
|`lecture_id`|`int`|講義ID|
|`lecture_name`|`nvarchar`|講義名|
|`date`|`datetime`|開講日|
|`period`|`int`|開講時限|
|`academic_year`|`int`|開講年度|
|`student_id`|`nvarchar`|学生ID|
|`student_name`|`nvarchar`|氏名|

## モデルの作成
取得するレコードのカラムに基づいてモデルを実装します。プロパティ名は必ずしもテーブルのカラム名と同じである必要はありません。また、複数のテーブルのカラムから 1 つのモデルを定義することも可能です。

```CSharp
/// <summary>
/// 講義スケジュール
/// </summary>
public class LectureSchedule
{
    /// <summary>
    /// 講義ID
    /// </summary>
    /// <value></value>
    public string LectureId { get; set; }
    /// <summary>
    /// 講義名
    /// </summary>
    /// <value></value>
    public string LectureName { get; set; }
    /// <summary>
    /// 開講日
    /// </summary>
    /// <value></value>
    public DateTime Date { get; set; }
    /// <summary>
    /// 開講時限
    /// </summary>
    /// <value></value>
    public int Period { get; set; }
    /// <summary>
    /// 開講年度
    /// </summary>
    /// <value></value>
    public int AcademicYear { get; set; }
    /// <summary>
    /// 学生ID
    /// </summary>
    /// <value></value>
    public string StudentId { get; set; }
    /// <summary>
    /// 氏名
    /// </summary>
    /// <value></value>
    public string StudentName { get; set; }
}
```

## モデルとデータベースの仲介
モデルを定義したら、データベースとモデルを仲介するための `DbContext` クラスを作成します。以下のように `DbContext` クラスを継承した `LectureDbContext` クラスを定義します。

```CSharp
public class LectureDbContext : DbContext
{
    public LectureDbContext(DbContextOptions<LectureDbContext> options)
        : base(options)
    {
    }

    public DbSet<LectureSchedule> LectureSchedule { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<LectureSchedule>()
            .HasKey(x => new { x.LectureId, x.Date, x.Period, x.StudentId });
    }
}
```

`LectureDbContext` クラス内で `DbSet<LectureSchedule>` 型として `LectureDbContext.LectureSchedule` プロパティを定義します。このプロパティを用いてモデルとデータベースを仲介します。

`OnModelCreating()` で `LectureSchedule` クラスをデータベースのエンティティとして設定し、 `HasKey()` でエンティティのキーを設定します。キーがない場合は `HasNoKey()` を利用します。

## 実行する SQL の記述
### データの検索
`FromSqlRaw()` の引数に実行したい SQL の文字列を渡します。プレースホルダを使用する場合、 SQL 内には `{引数の番号}` を記述し、 `FromSqlRaw()` の第 2 引数以降にプレースホルダに格納する変数を指定します。プレースホルダの番号は配列の添え字番号と同じで、 `0` から始まります。

ある年度に特定の学生が受講している講義のスケジュールを取得するプログラムは以下の通りです。

```CSharp
public Task<List<Lecture>> GetLectureScheduleList(string lectureId, string studentId, int year) =>
    _Context.LectureSchedule
        .FromSqlRaw(@"SELECT A.lecture_id AS LectureId, B.name AS LectureName,
                A.date AS Date, A.period AS Period, A.academic_year AS AcademicYear,
                A.student_id AS StudentId, C.name AS StudentName
            FROM lecture_schedule A
            INNER JOIN lectures B
                ON A.lecture_id = B.id
                AND A.academic_year = B.academic_year
            INNER JOIN students C
                ON A.student_id = C.id
            WHERE A.lecture_id = {0}
                AND A.student_id = {1}
                AND A.academic_year = {2}", lectureId, studentId, year)
        .ToListAsync();
```

ソースコード中の `_Context` は `LectureDbContext` のインスタンスです。 `_Context.LectureSchedule` でエンティティ `LectureSchedule` を取得し、 `FromSqlRaw()` で `LectureSchedule` のエンティティに対してSQL のクエリを発行します。発行されたクエリを非同期処理で実行して `List<LectureSchedule>` 型として取得するために、 `ToListAsync()` を実行します。

**実行した SQL の結果から得られるカラム名とモデルクラスのプロパティ名は一致している必要があります。** SQL のカラム名とモデルのプロパティ名が異なる場合、 SQL のカラム名を `AS` 句を用いてモデルのプロパティ名を別名としてつけることで、カラム名とプロパティ名を一致させられます。

### データの更新
データベースに変更を加える場合、 `ExecuteSqlRawAsync()` を利用します。プレースホルダの指定方法は `FromSqlRaw()` と同じです。`ExecuteSqlRawAsync()` は `DatabaseFacade` のメソッドなので、 `_Context.LectureSchedule` ではなく `_Context.Database` で `DatabaseFacade` のインスタンスを取得します。

学生テーブルにデータを追加するプログラムは以下の通りです。

```CSharp
public async Task AddStudent(string id, string name)
{
    await _Context.Database.ExecuteSqlRawAsync(@"INSERT INTO students (id, name)
        VALUES ({0}, {1})", id, name);
}
```

## 総括
本記事のまとめは以下の通りです。

- モデルクラスを定義して `DbContext` に登録
- SQL でデータを検索する場合は `FromSqlRaw()` を実行
- SQL でデータベースに変更を加える場合は `ExecuteSqlRawAsync()` を実行

以上、 k-so16 でした。フレームワークって慣れていないと難しいですね。