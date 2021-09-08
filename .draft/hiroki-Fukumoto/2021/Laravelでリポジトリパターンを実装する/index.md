---
title: Laravelでリポジトリパターンを実装する
date: 2021-06-09
author: hiroki-Fukumoto
tags: [PHP, Laravel, その他]
---

こんにちは。ふっくんです。

Laravelでリポジトリパターンを実装してみましたので、ご紹介させていただきます。

まず、リポジトリパターンとは何なのか。
&gt;データの操作に関連するロジックをビジネスロジックから切り離すことで、データ操作を抽象化したレイヤに任せる。これにより保守性や拡張性を高めるパターン。

と、あります。
では、実際にどういうことなのか簡単なサンプルコードを交えながらみていきましょう。

※リポジトリパターンといっても、目的は「データ操作を抽象化したレイヤに任せる」のため、様々な実装方法があります。
インターフェースを実装するパターンや、以下で紹介するService層を実装する方法。Service層は実装しない方法など。
開発規模等により使い分けるといいかなと思います。

本記事では、リポジトリパターンの実装に当たって以下のような各層を用意し、それぞれの役割を明確にしておきます。
※Bladeなどのテンプレートエンジンは使用せず、API開発を行うという前提とします。

```bash
・Controller
クライアントからのリクエストを受け取り、クライアントにレスポンスを返す。
Service層の参照が可能。

・Service
ビジネスロジックを担う。
Repository層の参照が可能。
Service層の参照が可能。

・Repository
データ操作を行う。
Modelの参照が可能。
```

ディレクトリ構造は以下のようにします。

```bash
.
├─ app
│    ├─ HTTP
│    │     └─ Controllers
│    │             ├─ UserController.php
│    │             └─ ShopController.php
│    ├─ Models
│    │     ├─ User.php
│    │     └─ Shop.php
│    ├─ Repositories
│    │        ├─ UserRepository.php
│    │        └─ ShopRepository.php
│    └─ Services
│          ├─ UserService.php
│          └─ ShopService.php

```

ではまずは簡単にIDからユーザー情報を取得するサンプルを見てみましょう。

UserController.php
```php

<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;

    /**
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * @param int $id
     */
    public function fetchUserById(int $id)
    {
        $user = $this->userService->fetchUserById($id);

        return $user;
    }
}
```

UserService.php
```php
<?php

namespace App\Services;
use App\Repositories\UserRepository;

class UserService
{
    protected $userRepository;

    /**
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @param int $id
     */
    public function fetchUserById(int $id)
    {
        $user = $this->userRepository->fetchUserById($id);

        return $user;
    }
}
```

UserRepository.php

```php
<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    protected $userModel;

    /**
     * @param User $userModel
     */
    public function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    /**
     * @param int $id
     */
    public function fetchUserById(int $id)
    {
        $user = $this->userModel->findOrFail($id);

        return $user;
    }
}

```

このようになります。

さて、上記のコードを見て勘のいい方はこう思うことでしょう。
```
めちゃくちゃ冗長的じゃね？？？Controllerで直接データ取ってくりゃいいじゃん。
```
はい。私も最初はそう思いました。

では、リポジトリパターンでの実装は一旦やめて、以下2つのAPIを実装してみます。
・ユーザーIDからユーザー情報を取得するAPI。
・店舗IDから店舗情報を取得し、かつユーザーIDからユーザー情報を取得するAPI。
※エンドポイントのパスに店舗IDとユーザーIDが含まれることとします。
※店舗とユーザーにはリレーション関係等がないものとしてます。

UserController.php
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    protected $userModel;

    /**
     * @param User $userModel
     */
    public function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    /**
     * @param int $id
     */
    public function fetchUserById(int $id)
    {
        $user = $this->userModel->findOrFail($id);

        return $user;
    }
}
```

ShopController.php
```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\User;

class ShopController extends Controller
{
    protected $shopModel;
    protected $userModel;

    /**
     * @param Shop $shopModel
     * @param User $userModel
     */
    public function __construct(Shop $shopModel, User $userModel)
    {
        $this->shopModel = $shopModel;
        $this->userModel = $userModel;
    }

    /**
     * @param int $id
     * @param int $userId
     */
    public function fetchShopByIdAndUserById(int $id, int $userId)
    {
        $shop = $this->shopModel->findOrFail($id);
        $user = $this->userModel->findOrFail($userId);

        return [
            'shop' => $shop,
            'user' => $user,
        ];
    }
}
```

いかがでしょうか？
```php
$user = $this->userModel->findOrFail($id);
```
この部分、同じことを2回実装しています。
つまり、テストする回数（箇所）とバグが発生する可能性が倍になってしまいますね。

では、「IDからユーザー情報を取得するAPI」は前述したリポジトリパターンでの実装に戻すとして、「店舗IDから店舗情報を取得し、かつユーザーIDからユーザー情報を取得するAPI」をリポジトリパターンで書いてみましょう。

ShopController.php
```php

<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ShopService;

class ShopController extends Controller
{
    protected $shopService;

    /**
     * @param ShopService $shopService
     */
    public function __construct(ShopService $shopService)
    {
        $this->shopService = $shopService;
    }

    /**
     * @param int $id
     * @param int $userId
     */
    public function fetchShopByIdAndUserById(int $id, int $userId)
    {
        $response = $this->shopService->fetchShopByIdAndUserById($id, $userId);

        return $response;
    }
}
```

ShopService.php
```php
<?php

namespace App\Services;
use App\Repositories\ShopRepository;
use App\Repositories\UserRepository;

class ShopService
{
    protected $shopRepository;
    protected $userRepository;

    /**
     * @param ShopRepository $shopRepository
     * @param UserRepository $userRepository
     */
    public function __construct(ShopRepository $shopRepository, UserRepository $userRepository)
    {
        $this->shopRepository = $shopRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @param int $id
     * @param int $userId
     */
    public function fetchShopByIdAndUserById(int $id, int $userId)
    {
        $user = $this->userRepository->fetchUserById($userId);
        $shop = $this->shopRepository->fetchShopById($id);

        return ['user' => $user, 'shop' => $shop];
    }
}
```

ShopRepository.php

```php
<?php

namespace App\Repositories;

use App\Models\Shop;

class UserRepository
{
    protected $shopModel;

    /**
     * @param User $shopModel
     */
    public function __construct(Shop $shopModel)
    {
        $this->shopModel = $shopModel;
    }

    /**
     * @param int $id
     */
    public function fetchShopById(int $id)
    {
        $shop = $this->shopModel->findOrFail($id);

        return $shop;
    }
}

```

このように、リポジトリパターンでの実装をやめた時と比べて、データ操作を隔離することで随分と見通しがよくなりました。
また、例えばユーザー取得処理で不具合が発生した場合は userRepositoryの `fetchUserById()` の処理を見直すだけで改善されます。
Unitテストの実施もしやすくなります。

今回は「データ操作の隔離」に注目しましたので、Service層のメリットを記載することができませんでしたが、
例えば他のAPIで「店舗IDから店舗情報を取得 + ユーザーIDからユーザー情報を取得 + α」の処理が必要になった場合には
shopServiceの `fetchShopByIdAndUserById()` を呼び出せば、店舗情報とユーザー情報を取得できるので +α の処理を実装するだけで済みます。

ビジネスロジックが複雑になってきたり、テストパターンが複雑になってきた時にService層の威力を実感できると思います。