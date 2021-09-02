---
title: LaravelでSplFileObjectを使ってCSVファイルの値を取得する
date: 2018-06-04
author: hiroki-Fukumoto
tags: [PHP, Laravel, もくもく会, Web]
---

こんにちわ！ふっくんです。

LaravelでCSVファイルをインポートして、値を取得する方法です。

例として以下のような値が入ったCSVファイルを使用します。

`test.csv`
|id|name|age|
|:--|--:|:--:|
|1|ユーザー1|22|
|2|ユーザー2|25|
|3|ユーザー3|34|
|4|ユーザー4|29|
|5|ユーザー5|32|

※以下に記載する内容は **Laravel 5.5.3** を前提としております。

## ルートの設定

初めにルートの設定します。

```
Route::post('csv-imports/csv', 'CsvImportController@store');
```

## 画面（CSVファイルをインポートするフォーム）の実装

次に、画面を実装します。

![](images/laravel-import-csv-file-content-with-spl-file-object-1.png)

ソースコードはこのようになります。

```html
<p>CSVファイルを選択してください</p>
<form role="form" method="post" action="csv-imports/csv" enctype="multipart/form-data">
{{ csrf_field() }}
    // name属性を Controller で使用します。
    <input type="file" name="csv_file">
    <div class="form-group">
        // CSSフレームワークに semantic-ui を使用しておりますので、 clss属性はご使用の環境に合わせて変更してください。
        <button type="submit" class="ui blue button">インポート</button>
    </div>
</form>
```

## Controllerの実装

Controllerは以下のようになります。

```php
public function store(Request $request)
{
    // setlocaleを設定
    setlocale(LC_ALL, 'ja_JP.UTF-8');

    // アップロードしたファイルを取得
    // 'csv_file' はCSVファイルインポート画面の inputタグのname属性
    $uploaded_file = $request->file('csv_file');

    // アップロードしたファイルの絶対パスを取得
    $file_path = $request->file('csv_file')->path($uploaded_file);

    $file = new SplFileObject($file_path);
    $file->setFlags(SplFileObject::READ_CSV);

    $row_count = 1;
    foreach ($file as $row)
    {
        // 1行目のヘッダーは取り込まない
        if ($row_count > 1)
        {
            $id = mb_convert_encoding($row[0], 'UTF-8', 'SJIS');
            $name = mb_convert_encoding($row[1], 'UTF-8', 'SJIS');
            $age = mb_convert_encoding($row[2], 'UTF-8', 'SJIS');

            var_dump($id);
            var_dump($name);
            var_dump($age);

            // ここで値をデータベースに保存したりする

        }
        $row_count++;
    }
}
```

### SplFileObject クラスについて

`SplFileObject` クラスはファイルのためのオブジェクト指向のインターフェイスを提供してくれます。
詳しくは以下をご確認ください。

>[PHP: SplFileObject - Manual](http://php.net/manual/ja/class.splfileobject.php)

また、PHPでCSVファイルを読み込む方法はいくつかあるのですが、PHP5.1以上を使用しているのであれば、`SplFileObject::READ_CSV` を使用するのが最も速度が速いとされています。

レスポンスは以下のようになります。

```json
string(1) "1"
string(5) "ユーザー1"
string(2) "22"
string(1) "2"
string(5) "ユーザー2"
string(2) "25"
string(1) "3"
string(5) "ユーザー3"
string(2) "34"
string(1) "4"
string(5) "ユーザー4"
string(2) "29"
string(1) "5"
string(5) "ユーザー5"
string(2) "32"
```

これで無事、CSVファイルの値を取得することができました！

### SplFileObject クラスと CSV の文字コード

今回取り込んだCSVファイルの文字コードは `SJIS` で保存されており、このままだとインポートして値を取得したときに文字化けしてしまいますので、 `mb_convert_encoding` で `UTF-8` に文字コードを変換しています。

`SplFileObject` で開く前に `UTF-8` に変換しておくほうが素直なのですが、この場合、なぜか `SplFileObject` フィールドを取り出すと一部のカンマが無視され、複数フィールドが1つとして認識されて `1,ユーザー1` のようになることがありました。またこれも全行がそうなるわけではなく、挙動が一致しませんでした。

そして（なぜか） `SJIS` のまま `SplFileObject` で開いたほうが、カンマを正常に認識したため、そのまま取り込んだあと、個別のフィールドの文字コードを変換することにしました。


