---
title: "Actix Web + sqlx で REST API を作成する第一歩"
date: 
author: linkohta
tags: [Actix Web, Rust, Web]
description: "Actix Web で REST API を作成する手順について解説します。"
---

link です。

最近、 Rust の勉強している関係で Rust 製の各種フレームワークにも手を出しています。

今回はその 1 つ、 **Actix Web** という Web フレームワークと **sqlx** を使って簡単な REST API を実装してみたいと思います。

## 想定環境

- Windows 11
- Rust 1.59 以降
- Actix Web 4
- sqlx 0.7.2

## Actix Web について

Actix Web は Rust 製の Web フレームワークです。

単体で HTTP サーバーとして機能し、静的ファイルのやりとりや Web API を実装できます。

また、動作が非常に軽量であることを特徴にしています。

## sqlx について

sqlx は Rust の O/R マッパー ではない普通のデータベース接続ライブラリーで、直接書いたクエリーを実行することを特徴としています。

PostgreSQL 、 MySQL 、 SQLite をサポートしており、データベースに依存しない設計になっています。

## REST API を実装してみる

さっそく、 REST API を実装してみます。

まず、プロジェクトの準備をします。

`Cargo.toml` を作成して、中身を以下のようにします。

```:title=Cargo.toml
[package]
name = "practice-actix"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4"
sqlx = { version = "0.7.2", features = ["sqlite", "runtime-tokio-rustls", "migrate"] }
serde = "1"
tokio = { version = "1.33.0", features = ["full"] }
env_logger = "0.10.0"
```

### データベースの準備

続いて、 sqlx を使えるようにします。今回は SQLite を使えるようにしています。

```bash:title=sqlxインストール
$ cargo install sqlx-cli --no-default-features --features sqlite
```

マイグレーションファイルを作成します。

```bash:title=マイグレーションファイル作成
$ sqlx migrate add -r create_users_table
```

`migration/作成日時_create_users_table.up.sql` と `migration/作成日時_create_users_table.down.sql` が作成されます。
この 2 つのファイルはそれぞれ、 `sqlx migrate run` と `sqlx migrate revert` で実行される SQL です。

データベースを作成します。

```bash:title=データベース作成
$ sqlx database create --database-url "sqlite:./database.db"
```

作成したマイグレーションファイルの中身を以下のように書き換えます。

```sql:title=migration/create_users_table.up.sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users
VALUES (1, "test", DATETIME())
;
```

```sql:title=migration/create_users_table.down.sql
DROP TABLE users;
```

以下のコマンドを実行して、データベースの準備は完了です。

```bash:title=マイグレーション実行
$ sqlx migrate run --database-url sqlite:./database.db
```

### API の実装

次に `src/main.rs` を作成して、中身を以下のようにします。

```rust:title=src/main.rs
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use std::collections::HashMap;

#[derive(sqlx::FromRow, Serialize, Deserialize)]
struct User {
    id: i32,
    name: String,
}

async fn get_db_pool() -> web::Data<SqlitePool> {
    let database_url = "sqlite:./database.db";

    web::Data::new(SqlitePool::connect(&database_url)
        .await
        .expect("Failed to create DB pool"))
}

async fn get_users() -> impl Responder {
    let db_pool = get_db_pool().await;
    let result = sqlx::query_as::<_, User>(
        r#"
        SELECT id, name
        FROM users
        "#,
    )
    .fetch_all(db_pool.get_ref())
    .await;

    match result {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(error) => HttpResponse::BadRequest().body(error.to_string()),
    }
}

async fn create_user(
    path: web::Path<String>,
    form: web::Form<HashMap<String, String>>,
) -> impl Responder {
    let db_pool = get_db_pool().await;
    let id = path.into_inner();
    let name = body.0.get("name").expect("not exists name");
    let result = sqlx::query(
        r#"
        INSERT INTO users (id, name)
        VALUES (?, ?)
        "#,
    )
    .bind(id)
    .bind(name)
    .execute(db_pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().body("User created"),
        _ => HttpResponse::BadRequest().body("Error trying to create new user"),
    }
}

async fn update_user(
  path: web::Path<String>,
  form: web::Form<HashMap<String, String>>,
) -> impl Responder {
    let db_pool = get_db_pool().await;
    let id = path.into_inner();
    let name = body.0.get("name").expect("not exists name");
    let result = sqlx::query(
        r#"
        UPDATE users
        SET name = ?
        WHERE id = ?
        "#,
    )
    .bind(name)
    .bind(id)
    .execute(db_pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().body("User updated"),
        _ => HttpResponse::BadRequest().body("Error trying to update user"),
    }
}

async fn delete_user(
    path: web::Path<String>,
) -> impl Responder {
    let db_pool = get_db_pool().await;
    let id = path.into_inner();
    let result = sqlx::query(
        r#"
        DELETE FROM users
        WHERE id = ?
        "#,
    )
    .bind(id)
    .execute(db_pool.get_ref())
    .await;

    match result {
        Ok(_) => HttpResponse::Ok().body("User deleted"),
        _ => HttpResponse::BadRequest().body("Error trying to delete user"),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    HttpServer::new(move || {
        App::new()
            .route("/users", web::get().to(get_users))
            .route("/users/{id}", web::post().to(create_user))
            .route("/users/{id}", web::put().to(update_user))
            .route("/users/{id}", web::delete().to(delete_user))
    })
    .bind("127.0.0.1:1080")?
    .run()
    .await
}
```

それぞれの関数について説明していきます。

#### `get_db_pool()`

sqlx を使ってデータベースに接続する処理です。

この関数の戻り値を使ってデータベースに SQL を実行させます。

#### `get_users()`

取得した `User` 一式を JSON 形式で返しています。

#### `create_user()`

パスで指定した `id` とフォームで指定した `name` でデータを登録します。

パスは `path: web::Path<String>`、フォームは `form: web::Form<HashMap<String, String>>` で取得できます。

#### `update_user()`

パスで指定した `id` のデータをフォームで指定した `name` で更新します。

#### `delete_user()`

パスで指定した `id` のデータを削除します。

#### `main()`

Web アプリを起動し、ルーティングを設定しています。

ルーティングは `.route("パス", web::HTTPメソッド().to(関数))` を `App::new()` の後ろに追加して設定します。

## 参考サイト

- [Actix Web](https://actix.rs/)
- [launchbadge/sqlx: 🧰 The Rust SQL Toolkit. An async, pure Rust SQL crate featuring compile-time checked queries without a DSL. Supports PostgreSQL, MySQL, SQLite, and MSSQL.](https://github.com/launchbadge/sqlx)

## まとめ

今回は Actix Web で REST API を作成する手順について解説しました。

バックエンドを軽量な Rust で実装できるのは、重いめの API を実装する時に大きな強みとなると思いますので、利用してみてください。

それではまた、別の記事でお会いしましょう。