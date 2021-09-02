---
title: Laravel でタブ区切り CSV からデータベースシーディングを行う基底クラスを作る
date: 2019-11-11
author: kenzauros
tags: [PHP, Laravel, Web]
---

マスターデータやテスト用データを用意するとき、**データベースシーディング**は非常に便利です。

**Laravel では組み込みの DatabaseSeeder があり、 `Seeder` クラスを継承すれば `php artisan db:seed` コマンドでシーディングを行うことができます。**

ただ、大量のデータを PHP ファイルに記述するのは可読性に乏しいですし、保守性もよくありません。そんなときに役に立つ CSV ファイルから簡単にシーディングできる方法をご紹介します。

## 前提条件

本記事は下記の条件を想定します。

- Laravel 5～6
- データソース: タブ区切りの CSV ファイル (TSV)
- 文字コード: UTF-8

この記事では便宜上**タブ区切りの CSV (Character-Separated Values) ファイルを TSV (Tab-Separated Values)** と呼ぶことにし、カンマ区切りの場合は明示的に区別することにします。

### なぜタブ区切りの CSV (TSV) か

データファイルの形式としては JSON や yaml もありますが、**「一覧性」という点ではやはり表形式に軍配があがります**。

このため、シーディングデータの多くは Excel のような表形式のエディターで作成されることと思います。 RDB の「テーブル」が表のような概念に近いため、人間にはわかりやすいということもあります。

Excel か Google Spreadsheet で定義したシーディングデータをそのまま取り込めるのが理想ですが、 Excel ファイルを扱うといろいろ別のジレンマがありますし、 Google Spreadsheet は基本的にオンラインでなければアクセスできません。

と考えると **Excel のような元データから、いかにスムースにシーディングデータに変換するか**というのが肝になります。またシーディングデータは開発中は変わっていくものですから、更新が容易にできることも求められます。

Excel を元データと考えると、方法としては下記のようなものが考えられます。

方法 | 作成 | 更新 | 可読性
--- | :---: | :---: | :---:
1. Excel からコピペして<br>正規表現等で PHP の配列定義に変換する | 面倒 | 面倒 | 悪い
2. Excel の CONCAT 関数などで<br>PHP の配列定義に変換する | 面倒 | 自動 | 悪い
3. Excel から CSV ファイルを保存する | 簡単 | 簡単 | そこそこ
4. Excel からコピペで TSV ファイルに保存する | 簡単 | 簡単 | そこそこ

一長一短はありますが、私が便利だと思っているものは 4 です。理由は下記のとおりです。

- Excel → テキストエディターのコピペでは**自動的にタブ区切り**になる
- **括り文字 (`"` など) やエスケープ文字を考える必要がない** (セル内改行を除く)
- Laravel を触っている＝開発環境が開いているのでテキストファイルを更新する手間は少なくて済む

というわけで、この記事ではこれを前提に説明します。

### ファイル構成

下記のようなファイル構成を仮定します。

```
<Laravel Project>
└ database/
　├ factories/
　├ migrations/
　└ seeds/
　　├ CsvDataSeeders/
　　│　├ data/
　　│　│　└ Hogehoge.tsv
　　│　├ CsvDataSeederBase.php
　　│　└ HogehogeDataSeeder.php
　　└ DatabaseSeeder.php
```

`CsvDataSeederBase.php` が CSV シーディング機能を実装した基底クラス、 `HogehogeDataSeeder.php` が 実際に `Hogehoge.tsv` を読み込んで `Hogehoge` テーブルにシーディングする子クラスです。

## 実装

### 基底クラス

いきなり肝の**基底クラス (`CsvDataSeederBase`)** です。説明はのちほど。

```php
use Illuminate\Database\Seeder;

class CsvDataSeederBase extends Seeder
{
    /**
     * File name to import
     */
    public $filename;
    /**
     * Full class name of model to seed
     */
    public $modelName;
    /**
     * Delimiter to split a line
     */
    public $delimiter = "\t";
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (empty($this->filename)) throw new Exception('$filename not specified.');
        if (empty($this->modelName)) throw new Exception('$modelName not specified.');
        if (empty($this->delimiter)) throw new Exception('$delimiter not specified.');
        $file = new SplFileObject(__DIR__.'/data/'.$this->filename);
        $file->setFlags(
            SplFileObject::READ_AHEAD |
            SplFileObject::SKIP_EMPTY |
            SplFileObject::DROP_NEW_LINE
        );
        $columns = [];
        foreach ($file as $lineNumber => $line) {
            $row = explode($this->delimiter, $line);
            if ($lineNumber === 0) {
                $columns = $row;
            } else {
                $values = [];
                foreach ($columns as $colIndex => $colName) {
                    $values[$colName] = ($colIndex < count($row) && mb_strlen($row[$colIndex]) > 0)
                        ? $row[$colIndex]
                        : null;
                }
                $obj = new $this->modelName($values);
                $obj->save();
            }
        }
    }
}
```

### シーディングクラス

基底クラスを実装した `HogehogeDataSeeder` クラスです。基底クラス側で処理をしているので `$filename` と `$modelName` をオーバーライドするだけです。

```php
use Illuminate\Database\Seeder;

class HogehogeDataSeeder extends CsvDataSeederBase
{
    public $filename = 'hogehoge.tsv';
    public $modelName = App\Hogehoge::class;
}
```

### データファイル

データファイル (`hogehoge.tsv`) の中身はヘッダー (1行目) がテーブルのカラム名、 2行目以降をデータにします。

```
id	name	age
1	山田 太郎	24
2	田中 花子	32
```

### DatabaseSeeder

`php artisan db:seed` で呼び出されるのが `DatabaseSeeder` ですので、ここに先ほどのシーダー呼び出しを追加します。

```php
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(HogehogeDataSeeder::class);
    }
}
```

## 実装解説

解説すべきは基底クラス (`CsvDataSeederBase`) だけだと思いますので、他のクラスは割愛します。

### `SplFileObject` では行単位で読み込む

まずこの CSV シーディング基底クラスの肝は「**`SplFileObject` で CSV 読み込みしない**」というところです。矛盾に聞こえますが、これには理由があります。

`SplFileObject` でよくある TSV 読み込みのスニペットは下記のようなものです。

```php
$file = new SplFileObject('ファイルパス', 'r');

$file->setFlags(SplFileObject::READ_CSV);
$file->setCsvControl("\t");

foreach ($file as $line) {
    var_dump($line);
}
```

`SplFileObject` に `READ_CSV` フラグを指定して CSV 読み込みモードにし、`setCsvControl` で区切り文字 (デリミタ) をタブ文字にするというものです。 ( `setCsvControl` しなければカンマ区切りの CSV 読み込みになります。)

しかし、この実装ではうまくいく場合もあればうまくいかない場合もあるのです。 **`SplFileObject` の `READ_CSV` モードではセルにある種の文字列を含んでいると区切り文字が認識されず複数列が1つの値になってしまうことがある**のです。

たとえば

```
id	last_name	first_name	age
1	山田	太郎	24
2	田中	花子	32
```

このような TSV ファイルを読み込むと下記のようになることがあります。

```php
[
    [ "1", "山田", "太郎", "24" ],
    [ "2", "田中\t花子"	"32" ],
]
```

1行目は想定通りタブ文字で区切られ、4要素になっていますが、**2行目はなぜか2つめのタブが区切りとして認識されず、3要素になっています**。これは意図した結果ではないので、当然データとして使えません。

おそらく文字コードの問題かと思いますが、 `setlocale(LC_ALL, 'ja_JP.UTF-8');` とやってみても変化はありませんでした。また分割される前の問題なので、 `mb_convert_encoding` で文字コードを変換してみることもできません。

実はこのことは弊社も過去に経験していて、なぜか SJIS のファイルを SJIS のまま開くと直るということもありました。 (参照: [LaravelでSplFileObjectを使ってCSVファイルの値を取得する](https://mseeeen.msen.jp/laravel-import-csv-file-content-with-spl-file-object/#SplFileObject_CSV))

しかし当然 UTF-8 のファイルはそのまま開きたいので、今回は「**`SplFileObject` から行単位で読み込んで `explode` でセルの値に分解する**」という手法にしました。

`SplFileObject` から行単位で読み込むには `READ_CSV` オプションを外すだけですので、とても簡単です。また `file_get_contents` のようにファイル全体をメモリにロードする必要もないので、メモリ消費、実効速度としても許容範囲でしょう。

### カラム名をシーディングデータ側にもたせる

今回の実装では**カラム名をシーディングデータ (TSV) の1行目 (ヘッダー) にもたせる**想定にしています。これにより**シーディングクラス側ではカラム名とその順番を意識する必要がなくなり、 PHP 側でカラム名を記述する必要がありません**。

どうせシーディングデータの元データ作成のときはヘッダーがないとわかりづらいので、必ずヘッダーが存在するはずです。

この実装にしておけば、たとえば

```
id	name	age
1	山田 太郎	24
2	田中 花子	32
```

と

```
age	name	id
24	山田 太郎	1
32	田中 花子	2
```

のように列が入れ替わっていても問題なくシーディングすることができます。

実装としては **1行目 (`$lineNumber` が `0`) ならカラム名一覧として格納しておき、 2行目以降はそのカラム名でモデルの同名プロパティに値を設定する**ようなイメージです。

要するにシーディングデータ側のヘッダーに記述するのは「モデルのプロパティ名」なのでカラム名とプロパティ名が異なる場合は、後者でデータ定義すれば OK でしょう。

### シーディングにモデルを利用する

今回は**シーディング時のデータ保存に `$modelName` で指定するモデルクラスを使用**しています。

通常、 Laravel のシーディングでは下記のようなコードが紹介されています。

```php
DB::table('users')->insert([
    'name' => Str::random(10),
    'email' => Str::random(10).'@gmail.com',
    'password' => bcrypt('secret'),
]);
```

`DB` クラスはデータベースを直接操作できるのでおそらく実行速度としては一番早いはずですが、**`created_at` などの Timestamp 処理やモデルで定義した処理などは通らないため、シーディングデータを適切に整備しておく必要**があります。

シーディングデータ側でアプリの内部処理を考慮したデータを定義するのも少し違うような気もします。

ということで**実行速度では劣るかもしれませんが、シーディングでもモデルを介すようにし、通常のアプリ側からの保存処理と同じロジックが処理される**ようにしています。

## まとめ

アプリや開発方針によって必要なシーディングデータはいろいろ異なると思いますが、今回の実装には

- カンマ区切りのジレンマがない (括り文字、エスケープ)
- 元データ (Excel) の作成者が開発者でなくてもよい
- シーディングデータ (TSV) が PHP ソースから独立する
- シーディングデータ (TSV) の更新が容易
- PHP の実装がシンプル

のような特長があり、なかなかスマートな案ではないかと思っています。

改良案等ありましたら、ご意見いただければ幸いです。