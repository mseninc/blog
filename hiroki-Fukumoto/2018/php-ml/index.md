---
title: PHP（PHP-ML）で機械学習
date: 2018-08-27
author: hiroki-Fukumoto
tags: [PHP, Web]
---

こんにちは。ふっくんです。

今回は `PHP` で機械学習を行う方法を紹介します。

※検証環境 macOS 10.12
※エディタ Visual Studio Code
※PHP 7.1.8

## きっかけ

もともと、機械学習やデータサイエンス等の技術に興味があり、 `jupyter notebook(使用言語：python)` や `R` を一通り試したが、これらの案件に携わることがなかったので、業務に繋がる技術力を身につけることができなかった。
それであれば、業務で携わることの多い `PHP` を使用して機械学習をやってみようと思ったのがきっかけ。
要するに、**好きなことして、技術力をつけて、業務に活かしちゃおう！**ってことです。

## PHP-MLのインストール

まず初めに `PHP-ML` をインストールします。
[PHP-ML](https://php-ml.readthedocs.io/en/latest/)とは、PHP用の機械学習のライブラリーです。

インストールはいたって簡単。
`composer require php-ai/php-ml`
たったこれだけです！！
`composer` をインストールしていない場合は、先に `composer` をインストールしておいてください。

※本記事では `composer` のインストール方法は紹介しません。

## k近傍法を試してみる

では、[PHP-ML](https://php-ml.readthedocs.io/en/latest/)にサンプルコードが記載されているので、試してみましょう。
k近傍法については以下をご確認ください。
>[k近傍法](https://ja.wikipedia.org/wiki/K%E8%BF%91%E5%82%8D%E6%B3%95)

```php
<?php
require_once __DIR__ . '/vendor/autoload.php';

use Phpml\Classification\KNearestNeighbors;

$samples = [[1, 3], [1, 4], [2, 4], [3, 1], [4, 1], [4, 2]];
$labels = ['a', 'a', 'a', 'b', 'b', 'b'];

$classifier = new KNearestNeighbors();
$classifier->train($samples, $labels);

echo $classifier->predict([3, 2]);
// return 'b'
```

おおーーー！！
ちなみに、Visual Studio Code でコードを実行するには[code-runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)という拡張機能をインストールし `ctrl + alt + N` で実行できます。

他にもサンプルコードはたくさん載ってあるので、私みたいにPHPの勉強がてら、機械学習をやってみたいという方はぜひ試してみてください。
