---
title: "[Laravel] 外部キーで紐付いているレコードを含めて削除したい"
date: 2019-09-18
author: k-so16
tags: [Laravel, Eloquent, Web]
---

こんにちは。最近、焼きマシュマロの美味しさに驚いた k-so16 です。マシュマロと焼きマシュマロは別の食べ物といっても過言ではないと感じました（笑）

関係データベースシステム (以下 RDBS と表記) において、レコードを削除する際に、他のテーブルのレコードが紐づいていると、 **外部キー制約によって削除できない** ことがあります。先に紐づいているレコードを削除してから対象のレコードを削除すれば良いのですが、リレーションが深くなると、紐づいているレコードの数が多くなり、対象とするレコードを削除する処理の記述量も多くなります。

本記事では、対象のレコードを削除することで、リレーションで紐づいているレコードもまとめて削除する方法を紹介します。前提として、 Laravel のマイグレーションや Eloquent を利用することとします。動作を確認した Laravel のバージョンは 5.8 系です。

想定読者は以下の通りです。

- RDBS におけるリレーションに関する基礎的な知識を有している
- Laravel のマイグレーションや Eloquent について知っている

## 外部キー制約を変更する方法
外部キー制約に `CASCADE` を割り当てれば、紐づいている先のレコードが削除された際に一緒に削除されます。 Laravel では、 `onDelete()` メソッドの引数に `'cascade'` を追加することで、外部キー制約を `CASCADE` に変更できます。

```php:title=テーブルを新規追加する際に&nbsp;cascade&nbsp;制約を追加する方法
Schema::table('books', function (Blueprint $table) {
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
});
```

既にテーブルを作成している場合、 **一度外部キーを削除してから** 外部キー制約を設定し直します。 Laravel では、 `dropForeign()` メソッドで外部キー制約を削除出来ます。引数には、 `リレーション元のテーブル名_外部キーのカラム名_foreign` という規則から成り立つ文字列を指定します。自動生成ルールに基づいて外部キー制約を作成していれば、 `dropForeign()` の引数はカラム名の文字列を持つ配列を指定することも出来ます。

```php:title=外部キー制約を削除したあとで&nbsp;cascade&nbsp;制約を追加する方法
Schema::table('books', function (Blueprint $table) {
    $table->dropForeign(['user_id']);
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
});
```

## Eloquent のイベント監視を利用する方法
Laravel の Eloquent では、データベースに保存、更新、削除が実行される直前または直後にイベントが発火します。例えば、データベースに新たにデータが作成される際に、作成の直前で `creating` イベントが、作成直後に `created` イベントが発火します。

モデルの削除前に発火する `deleting` イベントが発火する際に、外部キーで紐付いているレコードを削除することで、親テーブルのレコードを削除する前に、子テーブルのレコードを削除できます。

Eloquent のイベントを監視する方法はいくつかありますが、本記事では、 **Observer** を利用した方法を紹介します。 Observer を利用するメリットとして、 Eloquent モデルのイベント発火時の処理をモデルの定義と分離し、 Observer に集約出来ることが挙げられます。

Observer は、 `artisan` の `make:observer` コマンドで生成出来ます。例えば、 User モデルの Observer である UserObserver の生成コマンドは以下の通りです。

```bash:title=Observer&nbsp;の作成
php artisan make:observer UserObserver --model=User
```

削除直前のイベント `deleting` を監視するためには、監視対象のモデルのインスタンスを引数に持つ `deleting` メソッドを実装します。リレーションで紐付いているレコードを削除する処理を `deleting` メソッドに記述することで、親テーブルのレコードが削除される直前でその処理が実行されます。

紐づいているレコード群をまとめて消す場合、リレーション元のモデルでは `deleting` イベントが発火しないので、 **さらにリレーションが紐づいている場合** はエラーになります。エラーを回避するためには、 `each()` メソッドを用いて、モデルを 1 つずつ削除するように記述する必要があります。

```php:title=Observer::deleting()&nbsp;でモデルを&nbsp;1&nbsp;つずつ削除する
class UserObserver
{
    public function deleting(User $user)
    {
        $user->books()->each(function ($book) {
            $book->delete();
        });
    }
}
```

紐付いているレコードをまとめて削除した際に `deleting` イベントが発火しない理由として、 Model クラスのように `fireModelEvent()` メソッドが実行されていないことが原因と考えられます。 

Eloquent モデルの基底クラスである Model の `delete()` メソッドでは、レコードの削除前に `$this->fireModelEvent('deleting')` を実行し、 `deleting` イベントが発火します。 HasMany クラスが Model クラスのインスタンスがレコードの削除直前に `fireModelEvent('delete')` を実行せず、イベントが発火していないのではないかと思います。 (HasMany クラスの `delete()` メソッドを実装しているコードを見つけられなかったので、確認は出来ていません...)

## 総括
本記事のまとめは以下の通りです。

- 外部キー制約を `CASCADE` に設定することで、紐づいているレコードも含め一括で削除可能
- Observer で `deleting` イベント発火時にリレーションで紐づくレコードを削除することで一括削除を実現可能

以上、 k-so16 でした。外部キー制約の扱いって、難しいですね。