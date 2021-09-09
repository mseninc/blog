---
title: Laravel、汎用的なデータ操作を共通化する
date: 2021-06-09
author: hiroki-Fukumoto
tags: [その他]
---

こんにちは。ふっくんです。

今回は、Laravelで汎用的なデータ操作の処理を何度も書くのが面倒だったため共通化してみました。

前回の続きで、リポジトリパターンでの実装に組み込むこととします。

[laravelでリポジトリパターンを実装する](/laravelでリポジトリパターンを実装する/)

まず、Trait層に `BaseCrud` というクラスを作成します。
ここで汎用的なデータ操作の処理を実装します。

BaseCrud.php

```php
<?php

namespace App\Traits;

trait BaseCrud
{
    /**
     * 全件取得
     */
    public function fetchIndexData()
    {
        return $this->get();
    }

    /**
     * 1件取得
     *
     * @param int $id
     */
    public function fetchShowData($id)
    {
        return $this->findOrFail($id);
    }

    /**
     * 新規登録
     *
     * @param Request $request
     */
    public function createData($request)
    {
        $record = new $this;
        $record->fill($request->all())->save();
        return $record;
    }

    /**
     * 更新処理
     *
     * @param Request $request
     * @param int $id
     * @return object
     */
    public function updateData($id, $request)
    {
        $record = $this->findOrFail($id);
        $record->fill($request->all())->save();
        return $record;
    }

    /**
     * 削除
     *
     * @param int $id
     */
    public function deleteData($id)
    {
        $record = $this->findOrFail($id);
        $record->delete();
        return null;
    }
}
```

次に、Model層に `BaseModel` というクラスを作りましょう。

BaseModel.php

```php
<?php

namespace App\Models;

use App\Traits\BaseCrud;
use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    use BaseCrud;
}
```

最後に各モデルクラスではこのBaseModelを継承するようにしましょう。

Shop.php
```php
<?php

namespace App\Models;

class Shop extends BaseModel
{
    protected $fillable = [
        'name',
        'code',
        'address',
        'tel',
    ];
}
```

あとはRepositoryで以下のように呼び出すだけです。

```php
public function fetchIndexShop()
{
    return $this->shopModel->fetchIndexData();
}

public function fetchShowShop($id)
{
    return $this->shopModel->fetchShowData($id);
}

public function createShop($request)
{
    return $this->shopModel->createData($request);
}

public function updateShop($id, $request)
{
    return $this->shopModel->updateData($id, $request);
}

public function deleteShop($id)
{
    return $this->shopModel->deleteData($id);
}
```

BaseCrudに定義するメソッド名はなんでも構わないのですが、私の場合は `動詞 + Data` とすることで、
メソッド名に `Data` がついていれば、汎用的なデータ操作のメソッドだなと判断しています。

また、普段はページネーションの取得処理や、任意のカラムのみのリストを取得する（並び順を保ったリスト）処理なども汎用的なメソッドとして定義しています。
`fetchIndexData()` に、引数としてカラムの一覧を渡すようにしてもいいかもしれませんね。