---
title: "Gin を使って RESTful API を構築する第一歩"
date:
author: linkohta
tags: [Gin, Go, Web]
description: "Go 言語のフレームワークである Gin を使って RESTful API を構築してみます。"
---

link です。

今回は Go 言語のフレームワークである **Gin** を使って RESTful API を構築してみます。

## 想定環境

- Windows 11
- Go Programming Language 1.20

## Gin とは

> Gin は、Golang で書かれた Web フレームワークです。
>
> martini に似た API を持ちながら、非常に優れたパフォーマンスを発揮し、最大で 40 倍高速であることが特徴です。
>
> 性能と優れた生産性が必要なら、きっと Gin が好きになれるでしょう。
>
> 出典 : [Gin Web Framework](https://gin-gonic.com/ja/#td-block-1)

Gin とは Go 言語の Web アプリケーションフレームワークです。

同じ Go 言語の martini フレームワークと似た API でありながら、最大で 40 倍パフォーマンスが良いことを特徴としています。

## プロジェクト作成

Go 言語のプロジェクトを作成します。

```:title=プロジェクト作成
$ mkdir ginrest
$ cd ginrest
$ go mod init
```

Gin をダウンロードし、 Gin プロジェクト開始用のテンプレートをダウンロードします。

```
$ go get -u github.com/gin-gonic/gin
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

テンプレートのダウンロードが完了すれば、プロジェクトの作成は完了です。

## API 作成

ダウンロードしたテンプレート `main.go` は以下のようになっています。

```go:title=main.go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

var db = make(map[string]string)

func setupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	r := gin.Default()

	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	// Get user value
	r.GET("/user/:name", func(c *gin.Context) {
		user := c.Params.ByName("name")
		value, ok := db[user]
		if ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "value": value})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "status": "no value"})
		}
	})

	// Authorized group (uses gin.BasicAuth() middleware)
	// Same than:
	// authorized := r.Group("/")
	// authorized.Use(gin.BasicAuth(gin.Credentials{
	//	  "foo":  "bar",
	//	  "manu": "123",
	//}))
	authorized := r.Group("/", gin.BasicAuth(gin.Accounts{
		"foo":  "bar", // user:foo password:bar
		"manu": "123", // user:manu password:123
	}))

	/* example curl for /admin with basicauth header
	   Zm9vOmJhcg== is base64("foo:bar")

		curl -X POST \
	  	http://localhost:8080/admin \
	  	-H 'authorization: Basic Zm9vOmJhcg==' \
	  	-H 'content-type: application/json' \
	  	-d '{"value":"bar"}'
	*/
	authorized.POST("admin", func(c *gin.Context) {
		user := c.MustGet(gin.AuthUserKey).(string)

		// Parse JSON
		var json struct {
			Value string `json:"value" binding:"required"`
		}

		if c.Bind(&json) == nil {
			db[user] = json.Value
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		}
	})

	return r
}

func main() {
	r := setupRouter()
	// Listen and Server in 0.0.0.0:8080
	r.Run(":8080")
}
```

`main.go` を以下のように書き換えます。

```go:title=main.go
package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

var db = make(map[string]string)

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("/users", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"users": db})
	})

	r.GET("/user/:name", func(c *gin.Context) {
		user := c.Params.ByName("name")
		value, ok := db[user]
		if ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "value": value})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "status": "no value"})
		}
	})

	r.POST("/user", func(c *gin.Context) {
		user := c.PostForm("name")
		value := c.PostForm("value")
		db[user] = value
		c.JSON(http.StatusOK, gin.H{"user": user, "value": db[user]})
	})

	r.PUT("/user/:name", func(c *gin.Context) {
		user := c.Params.ByName("name")
		db[user] = c.Query("value")
		c.JSON(http.StatusOK, gin.H{"user": user, "value": c.Query("value")})
	})

	r.DELETE("/user/:name", func(c *gin.Context) {
		user := c.Params.ByName("name")
		delete(db, user)
		c.JSON(http.StatusOK, gin.H{"user": user, "status": "deleted"})
	})

	return r
}

func main() {
	r := setupRouter()
	r.Run(":8080")
}
```

`setupRouter()` では各ルーティングに対して実行する関数を実装しています。

書き換え後の `main.go` の `setupRouter()` で使っている関数について解説します。

- `gin.Default()` : Web サーバーを生成
- `Params.ByName()` : パスパラメーターを取得
- `Query()` : クエリーパラメーターを取得
- `PostForm()` : フォームパラメーターを取得
- `JSON()` : 返す JSON を生成

## Web アプリケーション

`go run main.go` コマンドを実行して Web アプリケーションを起動します。

起動後、以下のように表示されます。

```
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:   export GIN_MODE=release
 - using code:  gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /users                    --> main.setupRouter.func1 (3 handlers)
[GIN-debug] GET    /user/:name               --> main.setupRouter.func2 (3 handlers)
[GIN-debug] POST   /user                     --> main.setupRouter.func3 (3 handlers)
[GIN-debug] PUT    /user/:name               --> main.setupRouter.func4 (3 handlers)
[GIN-debug] DELETE /user/:name               --> main.setupRouter.func5 (3 handlers)
[GIN-debug] [WARNING] You trusted all proxies, this is NOT safe. We recommend you to set a value.
Please check https://pkg.go.dev/github.com/gin-gonic/gin#readme-don-t-trust-all-proxies for details.
[GIN-debug] Listening and serving HTTP on :8080
```

Postman などで `localhost:8080` の各ルーティングにリクエストを送信して以下のような動作になっていることを確認しましょう。

### GET /users

`user` の配列が返ってくる。

### GET /user/:name

`:name` で指定した `user` が返ってくる。

### POST /user

フォームパラメーターの `name` と `value` で指定した値の `user` が保存される。

### PUT /user/:name

`:name` で指定した `user` の `value` をクエリーパラメーターの `value` に更新する。

### DELETE /user/:name

`:name` で指定した `user` を削除する。

## 参考サイト

- [クイックスタート | Gin Web Framework](https://gin-gonic.com/ja/docs/quickstart/)

## まとめ

今回は Go 言語のフレームワークである **Gin** を使って RESTful API を構築してみました。

それではまた、別の記事でお会いしましょう。
