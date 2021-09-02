---
title: Laravel 5.3 Eloquent ORM 入門 2 (マイグレーション)
date: 2016-12-02
author: kenzauros
tags: [PHP, Laravel, Eloquent, Web]
---

Laravel Eloquent の 2 回目です。

[前回](https://mseeeen.msen.jp/laravel-53-eloquent-orm-1/)はモデル作成までしか書けなかったので、今回はマイグレーションについて紹介します。

## マイグレーションファイル

### ファイル名

マイグレーションファイルは `database/migrations` フォルダに配置します。

ファイル名の規則は `yyyy_mm_dd_hhmmss_ほげほげ.php` です。ほげほげの部分は実行する内容を表す文字列にします。

たとえば users テーブルを作るファイルであれば、 `2014_10_12_000000_create_users_table.php` のような感じです。このように時刻部分は 000000 でもかまいませんが、ファイル名の昇順でマイグレーションが実行されますので、フォルダ内での並びには注意してください。

下記のようにモデルを作るときに `-m` オプションを指定して一緒に作るか、 `php artisan make:migration` で作るのが簡単ですが、手動で作成しても構いません。

```
# モデルと一緒に作成
php artisan make:model User -m
# マイグレーションファイルだけ作成
php artisan make:migration create_users_table
```

### マイグレーションファイルの基本構造

マイグレーションファイルの内容は下記の形式です。

```php
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    public function up()
    {
    }

    public function down()
    {
    }
}
```

**up でマイグレート、 down でロールバック**できるように書いていきます。クラス名は他のファイルにあるクラス名と被らないように、ファイル名と同じものをアッパーキャメルケースでつければよいでしょう。

## 例1. テーブルを作成するマイグレーションファイル

もっともよく使うのがこのタイプでしょう。 up で指定した名前のテーブルを作り、列を生成します。 down でテーブルを DROP します。

### up

テーブルを生成するには `Schema::create` メソッドを使用します。第 1 引数にはテーブル名を指定します。原則的には**モデル名をスネークケース (小文字にしてアンダーバーでつないだもの) に変えたものをテーブル名として使用**します。

```php
Schema::create('users', function (Blueprint $table) {
    $table->engine = 'InnoDB';
    $table->integer('id')->unsigned()->unique();
    $table->primary('id');
    $table->string('name');
    $table->boolean('is_female');
    $table->double('weight');
    $table->integer('department_id')->unsigned()->nullable();
    $table->timestamps();
});
```

#### データベースエンジンの指定

MySQL でデータベースエンジンを指定する場合は `$table->engine = 'InnoDB';` のような形で指定します。

#### 主キー制約の指定

主キーとなる列は符号なし整数かつ unique にしておけばいいので `$table->integer('id')->unsigned()->unique()` のように列を定義したあとで、 `$table->primary('id')` で主キーに設定します。

ちなみに符号なし整数にしておかないとマイグレーション時にエラーで怒られます。

自動インクリメント列である `$table->increments('id');` で定義するほうが簡単ですが、この場合シーダーで id を指定してデータを挿入できないので、特にマスターデータを格納するテーブルに関しては、前述のような定義を使うようにしています。

#### 列の型指定

integer 以外の型も string, boolean, double などわかりやすい名称で定義することができます。データベースごとの varchar や smallint などを考慮する必要がありません。

対応するデータベース型については下記のページなどを参照してください。

* [Columns - Eloquent Laravel 5.3](https://laravel.com/docs/5.3/migrations#columns)

#### タイムスタンプ列

`$table->timestamps()` を指定するとテーブルに `created_at` と `updated_at` 列が生成され、**モデルからデータを作成・更新した際に自動的にタイムスタンプが記録**されます。

※**シーダーからデータを生成する場合は自動ではタイムスタンプが設定されない**ため、手動で created_at などに値を設定する必要があります。

#### 外部キー列

別のテーブルと外部キーで接続するリレーションシップを作成する場合は `$table->integer('department_id')->unsigned()`  のような形で外部キー列を定義します。

参照先のデータが必須でない場合はさらに `nullable()` を付加しておきます。

外部キー制約自体は `Schema::create` メソッドの後に下記のような感じで `Schema::table` (名前が少々ややこしい) メソッドを追加して定義します。

```php
Schema::table('users', function ($table) {
    $table->foreign('department_id') // このテーブルの外部キー列
        ->references('id') // 参照先テーブルの ID 列
        ->on('departments') // 参照先テーブル
        ->onDelete('set null');
});
```

onDelete は参照先のデータが削除されたときにこのテーブルの行をどのように扱うかを指定します。

* `set null`: NULL に設定 (ID を NULL に変更します)
* `no action`: なにもしない (存在しない ID が残ります)
* `cascade`: 一緒に消す (このテーブルのデータも一緒に消えます)
* `restrict`: 禁止する (参照先のデータが消せなくなります)

設定するときは迷うのですが、概ね下記のような指針でよいと思います。

* 参照先のデータがなくてもこのテーブルのデータが存在すべき場合は `set null`
* 参照先のデータがなければこのテーブルのデータが意味をなさない場合は `cascade`
* このテーブルのデータが存在する限り、参照先のデータも削除されるべきでない場合は `restrict`
* 考えるのがめんどくさい場合は `no action`

### down

これは SQL 文を書くのとほぼ同じですが、 down 内で `Schema::dropIfExists` メソッドを呼び出します。

```php
Schema::dropIfExists('users');
```

## 例2. 外部キー制約を追加するマイグレーションファイル

さきほどと同様に、既存のテーブルに列を追加したり、外部キーを追加したりする場合は `Schema::table`メソッドを利用します。

up で既にある列に外部キー制約を追加する場合は、 down では外部キー制約だけを DROP すればよいので `dropForeign` メソッドを使います。

```
public function up()
{
    Schema::table('users', function ($table) {
        $table->foreign('department_id')
            ->references('id')
            ->on('departments')
            ->onDelete('set null');
    });
}
public function down()
{
    Schema::table('users', function ($table) {
        $table->dropForeign(['department_id']);
    });
}
```

## マイグレーション関連のコマンド

### マイグレーションの実行

```
php artisan migrate
```

強制的に実行するには `--force` を付加します。

### ロールバック

最後に実行したマイグレーションをロールバックするには `migrate:rollback` を利用します。

```
php artisan migrate:rollback
```

考えるのがめんどくさくて、すべてロールバックしたいときには `migrate:reset` を実行します。

```
php artisan migrate:reset
```

### リフレッシュ (ロールバック + マイグレート)

`reset` → `migrate` を同時に行える便利コマンドです。開発中はよくお世話になります。

```
php artisan migrate:refresh
```

シーディングも同時に行う場合は `--seed` をつけて種付けします。

```
php artisan migrate:refresh --seed
```

## あとがき

今回はマイグレーションの基本を紹介しました。

次回はシーダーを見ていきます。