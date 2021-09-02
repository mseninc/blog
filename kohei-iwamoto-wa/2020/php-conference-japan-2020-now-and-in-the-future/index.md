---
title: PHP Conference Japan 2020 (PHPの今とこれから2020)
date: 2020-12-22
author: kohei-iwamoto-wa
tags: [PHP, その他, 〇〇奮闘記]
---

こんにちは、こうへいです。最近寒くなってきて、布団から抜け出せなくなってきました。先日、*PHP Conference Japan* にはじめて参加してきました。

昨年まで、日本で行われるPHP Conference は東京の蒲田で行われていたそうですが、今年は、新型コロナウイルスの影響もありオンラインで開催されました。新型コロナウイルスの流行は、残念なことですが、オンライン上で PHP Conference が開催されることにより地方在住の方も参加しやすくなりその点は、よかったと感じています。

また、他にもよかった点は、YouTube でライブ配信していたのとDiscord で他の参加者の反応を見ることができて参加者が聴講して何を感じたのか可視化されていたのが個人的には良かった点です。

今年のPHP Conference は、2020 年 11 月 26 日に PHP8.0 がリリースされたこともあり、 PHP7 から PHP8 への変更点について、いくつも見られたのが印象的でした。

また、セキュリティや設計についてのお話もあり興味深いお話が多くありました。昨今のPHP事情に関するお話を聞くことができて有意義な時間を過ごすことができました。今回は、PHP Conference の中でも *PHP の今とこれから*について書いていきたいと思います。

## PHP の今とこれから 2020

今年の PHP Conference は、日本 PHP ユーザー会の*廣川 類*さんによる*PHP の今とこれから2020*から始まりました。この講演では、PHP のサーバーサイド言語におけるシェアから始まりPHP の開発体制、PHP の歩み、 PHP8.0 での新機能や改善点の話について話した後、PHPの将来について話されていました。

最近、PHP8 がリリースされたこともあり PHP8.0 の話が講演の主な内容でした。以下のような変更点改善点がいくつか取り上げられていました。いくつか紹介していきたいと思います。

### JIT コンパイラ(Just In Time)

PHP8 から PHP のコンパイルの方法に JIT を選択することができるようになりました。JIT コンパイラを導入することで、リクエストがおくられてくるとソースコードがネイティブコードにコンパイルされます。同じリクエストが再び送られてくると前回コンパイルされたネイティブコードが実行されるため、パフォーマンスが向上します。

JITを使用することによって PHP スクリプトのパフォーマンスが向上しますが、JIT を使用することで、必ずしもパフォーマンスが向上するわけではありません。パフォーマンスの比較に関しては次のリンクから参照ください。[PHP8 Released!](https://www.php.net/releases/8.0/en.php)


### Union

**Union** とは、引数と戻り値の方の候補に複数指定できる機能です。
```PHP
class Test {
    public int|float $x;
    public function getVal() : int|float {
        return $this->x;
    }
}
```

### 変数クラス構文

オブジェクト変数に対して、クラス名を取得する方法は、従来は `get_class()` しなければいけなかったが、 `::class` 構文をオブジェクト変数にも使用可能になりました。
```PHP
class A {}
$a = new A;
echo A::class; //PHP8.0以前から使用可能
echo get_class($a); //変数の場合（PHP8.0以前)
echo $a::class; //PHP8.0以降
```

### 文字列部分一致確認用関数

以下の関数は文字列中に指定した文字列が存在するか検査する関数です。

```PHP
$s = '東京特許許可局局長';
var_dump(str_contains($s, "特許")); //bool(true)
var_dump(str_starts_with($s,"東京")); //bool(true)
var_dump(str_ends_with($s,"特許局")); //bool(true)
```

### Nullセーフ演算子

Nullセーフ演算子は、null チェックをシンプルに記述することができます。
```PHP
class moo { public $d = 123; }
class foo {
  public function get() {
    return new moo();
  }
}

if ($b !== null) {
  $a=b->get();
  if($a !== null){
    $b = $a->d;
  }
}
echo $d;
```

PHP では、従来上記のように `NULL` のチェックを行っていました。決して難しい処理ではないと思いますが、上記のように記述すると煩雑に見えてしまいます。そこで、*ヌルセーフ演算子*を使用すると以下のように書き換えることが可能です。

```PHP
echo $b?->get()?->d;
```

このようにヌルチェックが一行で行うことができるため非常に便利です。

### match式

従来の PHP で提供されている switch 文よりもシンプルに記述できます。また、公式ドキュメントを読んでみると、`switch 文` は緩やかな比較であるのに対し、`match 文`は厳密な一致であるため`match文`を使うほうが、意図せぬ挙動を防ぐことができそうです。

```PHP
switch($id){
  case 0:
    $name = 'Taro'; break;
  case 1:
    $name = 'Jiro'; break;
  case 2:
  case 3:
    $name = 'Hanako'; break;
　default:
    $name = 'Anonymous'; break;
}
```
```PHP
echo match($id) { 0 => 'Taro', 1 => 'Jiro', 2, 3 => 'Hanako', default => 'Anonymous' };
```

### mixed

あらゆる型を汎用的に表す型名です。タイプヒンティングで型チェックする場合、mixed を使用しすぎると型チェックをする意味が薄れるため、 mixed を使用する箇所は限定的にすべきだと感じました。

```PHP
class A {
  public mixed $bar;
  public function foo(int $value): mixed {}
}

class B extends A {
  public mixed $bar;
  public function foo($mixed $value): int {}
}
```

### 名前付き引数

PHP8 から名前付き引数が使用できるようになりました。 `array_fill` のような関数に引数を設定する場合、従来であれば、左から順番に引数を設定しなければなりません。引数を入れる順番を間違えてしまうとバグにつながってしますことがあります。名前付き引数を使うと、引数の順番間違いでのミスを減らすことが可能です。


```PHP
// 第1引数 返される配列の最初のインデックス
// 第2引数 挿入する要素数
// 要素に使用する値

array_fill(0, 100, 50);
//名前付き引数を使用すると引数の順番は問われません。
array_fill(value: 50,num:100, start_index: 0);
```

また、名前付き引数を使うことのもう一つのメリットとして `htmlspecialchars` を使って例をあげると第４引数だけパラメーターの指定をしたい場合、 PHP8 以前では、第1引数から第4引数まですべて指定しなければなりませんでしたが、名前付き引数を使用すると、*デフォルト値*をスキップでき完結に記述することができます。

```PHP
//PHP8以前
htmlspecialchars($s, ENT_COMPAT | ENT_HTML401, 'UTF-8', false);
//PHP8
htmlspecialchars($s, double_encode: false);
```

## PHPの将来

PHPの将来については大きく２つのことについて語られていました。

* PHPエクステンション: C言語による記述からPHPによる記述へ( FFI )
* 計算負荷が高いアルゴリズムの PHP による実装： 機械学習、AI 等(PHP-ML、PHP-MLX)

PHP8 で JIT が導入されパフォーマンスが向上した影響により、PHPの拡張モジュールは、従来C言語で記述されるケースが多かったが、これからは PHP スクリプトで記述されることが多くなると予測されていました。

次に JIT が導入されたことの影響により従来の PHP では難しい処理である機械学習やAI等の開発が行われていくと予想されていました。これらの予測から PHP8 での JIT の導入で、 PHP でできる処理の幅が広がっていくのではないかと思われます。

## おわりに

PHP の今とこれから 2020 を受講した感想は、 JIT(Just In Time) のコンパイルに関する話が出てきたり私自身勉強不足で、理解できないことが多くありました。また、 PHP8.0 のようなタイムリーな話を聞くことができ新しい情報を収集することができました。

これからも勉強会に参加することで、知識を更新していければなと考えています。また、PHP Conference に参加して、他にも興味深いお話を聞くことができたので、そちらに関しても書いていきたいと思います。今日はここで失礼します。

## 参考ページ

- [YouTube PHPのいまとこれから2020 / 廣川類](https://www.youtube.com/watch?v=Of_UDFoZNrA)
- [PHP8 Released!](https://www.php.net/releases/8.0/en.php)
- [「PHP 8」が正式リリース ～JITの導入により、処理速度が大きく向上](https://forest.watch.impress.co.jp/docs/news/1291600.html)