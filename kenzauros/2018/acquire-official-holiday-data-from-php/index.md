---
title: "[PHP] 内閣府から提供されている祝祭日CSVデータを読み込んで休日を判断する"
date: 2018-07-05
author: kenzauros
tags: [PHP, Web]
---

最近、少し WordPress 関連の開発をやっているのですが、 **PHP で営業日を判断**する必要がでてきました。

当たり前ですが、営業日を判断するということは、非営業日、つまり「**休日**」を判断することが必要です。

「カレンダーどおりだよ」なんて簡単に言いますが、自動的に判断できる土日と違って、祝祭日というのは毎年決まった年ではない上、法改正によって変わるので、なかなか厄介です。

ということで、どこか「たしからしい情報源」から「祝祭日データ」を読み込んでくるのが一番確実です。

前置きが長くなりましたが、今回は**内閣府が提供している「国民の休日 CSV」から祝祭日を取得**してみたいと思います。

## 前提条件

今回想定する要件は次の通り。

1. 日本の祝祭日が判断できれば OK
2. 未来の祝祭日が判断できれば OK

過去の祝祭日を判断しようと思うと当然ながら過去の祝祭日データが必要なので、ここでは現在から未来のことのみを想定します。

## 内閣府が提供する祝祭日データ

**内閣府**が下記のホームページで**国民の休日データ（≒ 祝祭日データ）**を提供してくれています。

> [国民の祝日について - 内閣府](http://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html)

この CSV については公開当初は物議をかもしましたが(笑)、まぁ今はとりあえず使える感じのファイルが提供されています。

> [【悲報】内閣府の「国民の祝日」CSVがひどいと話題に【更新】 | ソフトアンテナブログ](https://www.softantenna.com/wp/webservice/naikakufu-shukujitsu-csv-format/)

実際のCSVのデータ URL はこちら。 (2018/6/30 現在)

- [http://www8.cao.go.jp/chosei/shukujitsu/syukujitsu_kyujitsu.csv](http://www8.cao.go.jp/chosei/shukujitsu/syukujitsu_kyujitsu.csv)

ちなみにこちらは**「振替休日」を含んだバージョン**です。含まないバージョンも提供されていますが、普通は含んだバージョンを利用することが多いでしょう。

ちなみに**ファイルサイズは 1.1KB ぐらいで、 3 年間分**が含まれています。フォーマットは下記のような感じです。

```
国民の祝日・休日月日,国民の祝日・休日名称
2017-01-01,元日
2017-01-02,休日
2017-01-09,成人の日
2017-02-11,建国記念の日
```

DB 形式の日付と名称の2項目がひたすら定義されています。シンプルで理想的な形ですね。いわゆる振替休日は「休日」と示されています。

## PHP でダウンロードして読み込む

### HTTP GET メソッドの定義

まず、 PHP 標準ではイケてる感じの HTTP メソッドがないので、 curl 系関数をつかったラッパーを定義します。

他のライブラリ等でいい感じに HTTP GET できる場合は、ここは飛ばしていただいて結構です。

```php
/**
 * HTTP でデータを取得します。
 */
function httpGet($url)
{
    $option = [
        CURLOPT_RETURNTRANSFER => true, // 文字列として返す
        CURLOPT_TIMEOUT => 10, // タイムアウト時間 (秒)
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, $option);

    $data = curl_exec($ch);
    $info = curl_getinfo($ch);
    $errorNo = curl_errno($ch);

    // OK 以外はエラーなので空白配列を返す
    if ($errorNo !== CURLE_OK) {
        // CURLE_OPERATION_TIMEDOUT: タイムアウト
        return [];
    }

    if ($info['http_code'] !== 200) {
        return false;
    }

    return $data;
}
```

### ダウンロードしてデータ取り出し

ダウンロードしたあとは何も難しいことはないのですが、**文字コードが Shift-JIS** のため、内部処理の文字コードに合わせて変換が必要です。

```php
/**
 * 祝祭日データを配列で取得します。
 */
function loadHolidays() {
  // 祝祭日データ URL
  $url = 'http://www8.cao.go.jp/chosei/shukujitsu/syukujitsu_kyujitsu.csv';
  // HTTP GET で取得
  $data = httpGet($url);
  if (!$data) {
      throw new Exception("祝日データ取得に失敗しました。");
  }
  // CSV が SJIS なので文字コードを変換しておく
  $data = mb_convert_encoding($data, 'UTF-8', 'SJIS');
  // 行ごとに分割
  $lines = explode("\n", $data);
  $holidays = [];
  foreach ($lines as $line) {
      // カンマで分割
      $cols = explode(",", $line);
      $holidays[] = [ trim($cols[0]), trim($cols[1]) ];
  }
  return $holidays;
}
```

祝日名が必要なければ、 `$cols[1]` は捨ててもいいでしょう。

### 年末年始などを追加

祝祭日ならこれだけでもいいのですが、実際は年末年始のように「祝祭日ではない休日」もあるので、これらも一緒に「休日データ」として保持しておきましょう。

```php
// 現在から3年間分の年末年始を追加
$currentYear = intval(date('Y'));
for ($i = 0; $i < 3; $i++) { // 3年間
    $y = $currentYear + $i;
    $date = strtotime("$y-12-29"); // 12月29日から
    for ($j = 0; $j < 6; $j++) { // 1月3日まで6日間
        $dateStr = date('Y-m-d', $date);
        $holidays[] = [ $dateStr, '年末年始' ];
        $date = strtotime("+1 day", $date);
    }
}
```

この処理を追加したのが下記のバージョンです。

```php
/**
 * 祝祭日データを配列で取得します。
 */
function loadHolidays() {
  // 祝祭日データ URL
  $url = 'http://www8.cao.go.jp/chosei/shukujitsu/syukujitsu_kyujitsu.csv';
  // HTTP GET で取得
  $data = httpGet($url);
  if (!$data) {
      throw new Exception("祝日データ取得に失敗しました。");
  }
  // CSV が SJIS なので文字コードを変換しておく
  $data = mb_convert_encoding($data, 'UTF-8', 'SJIS');
  // 行ごとに分割
  $lines = explode("\n", $data);
  $holidays = [];
  foreach ($lines as $line) {
      // カンマで分割
      $cols = explode(",", $line);
      $holidays[] = [ trim($cols[0]), trim($cols[1]) ];
  }
  // 現在から3年間分の年末年始を追加
  $currentYear = intval(date('Y'));
  for ($i = 0; $i < 3; $i++) { // 3年間
      $y = $currentYear + $i;
      $date = strtotime("$y-12-29"); // 12月29日から
      for ($j = 0; $j < 6; $j++) { // 1月3日まで6日間
          $dateStr = date('Y-m-d', $date);
          $holidays[] = [ $dateStr, '年末年始' ];
          $date = strtotime("+1 day", $date);
      }
  }
  return $holidays;
}
```

### おまけ：日付形式のチェックを行う関数

[Carbon](https://carbon.nesbot.com/) などのライブラリが使えればいいのですが、ない場合は自前で判別関数を用意しましょう。

```php
/**
 * 日付が YYYY-MM-DD 形式の文字列かつ正しいグレゴリオ暦の日付の場合 true を返します。
 */
function isValidDate($date)
{
    return is_string($date)
        && preg_match('/^(?P<year>[0-9]{4})-(?P<month>[0-9]{2})-(?P<day>[0-9]{2})$/', $date, $m) === 1
        && checkdate($m['month'], $m['day'], $m['year'];
}
```

### おまけ：土日を判断する関数

土日も休日として扱うので、判断したいときは下記のような関数を用意します。単純ですが、結構忘れるのでメモ代わりに。

```php
/**
  * 指定した日付が土曜日もしくは日曜日なら true を返します。
  */
function isSundayOrSaturday($date)
{
    $w = intval(date('w', $date));
    return $w === 0 || $w === 6;
}
```

