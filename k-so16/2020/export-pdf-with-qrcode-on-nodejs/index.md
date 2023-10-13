---
title: "[Node.js] QR コードを PDF に出力する方法"
date: 2020-12-07
author: k-so16
tags: [Node.js, Web]
---

こんにちは。最近、初めてパン作りに挑戦した k-so16 です。思った以上に生地がまとまらず苦戦しましたが、最終的にはそこそこ満足できるものに仕上がりました(笑)

業務で **Node.js を用いて QR コードを PDF に出力したい** といったことがあり、 Node.js で PDF を出力する方法と QR コードを生成する方法について調べてみました。さらに、生成した QR コードを PDF に埋め込む方法についても調べてみました。

本記事では Node.js で PDF に QR コードを出力する方法を紹介します。なお、本記事のコード例は ES6 の構文で記述しています。

本記事で想定する読者層は以下の通りです。

- Node.js の基礎的な知識を有している
- SVG 形式の画像についての基礎的な知識を有している

## pdfmake を利用する方法

Node.js で PDF を生成するパッケージの 1 つに **[pdfmake](http://pdfmake.org/)** があります。 pdfmake を利用することで **QR コードの生成ライブラリを導入することなく** PDF 上に QR コードを簡単に出力できます。

### pdfmake の基本的な使い方

pdfmake の基本的な使い方の流れは以下の通りです。

1. `pdfmake` のインスタンスを生成する
1. `pdfmake` のインスタンスメソッド `createPdfKitDocument()` を実行する
    - 引数に PDF の内容を表すオブジェクトを指定する
1. `pipe()` メソッドと `fs` モジュールを利用してファイルに出力する
1. `end()` メソッドを実行する

PDF の内容は 2. で引数に指定するオブジェクトの **`content`** プロパティに設定します。 `content` プロパティは **文字列またはオブジェクを要素として持つ配列** を受け取るので、見出しと本文のように **複数の内容を指定** することができます。また、 **`styles`** オプションでフォントサイズなどの **スタイルの調整** もできます。スタイルを指定するには、 `content` プロパティ内のオブジェクトの `style` に指定されている値と `styles` のプロパティを合わせます。

以下は PDF の内容を表すオブジェクトの例です。

```js:title=pdfmake&nbsp;で扱うオブジェクトの例
const document = {
  content: [
    {
      text: '大見出し',
      style: 'header',
    },
    '最初の段落です。',
    'この段落は第 2 段落として扱われます。',
    {
      text: '小見出し',
      style: 'subheader',
    },
    'これも段落です。',
  ],
  styles: {
    header: {
      fontSize: 20,
      bold: true,
    },
    subheader: {
      fontSize: 16,
      bold: true,
    },
  },
};
```

この他にも、配列を受け取る **`ul`** や **`ol`** プロパティを持つオブジェクトを指定することで **箇条書き** を表現したり、 **`table`** や **`columns`** プロパティで **行や列の幅を調整** したりできます。詳細は pdfmake の [ドキュメント](https://pdfmake.github.io/docs/0.1/) をご参照ください。 Playground を利用して実際にどのように出力されるかも確認できます。

### pdfmake で QR コードを PDF に出力する方法

pdfmake を使って QR コードを出力するには、 `content` に **`qr` プロパティを持つオブジェクト** を指定します。 QR コードの内容は **`qr` プロパティの値** として指定します。

以下は `Hello, world` というテキストの情報を持つ QR コードを生成して PDF に出力するコード例です。

```js
import fs from 'fs';
import pdfmake from 'pdfmake';

const printer = new pdfmake();
const pdfDoc = printer.createPdfKitDocument({
  content: [
    { qr: 'Hello, world' },
  ],
});
pdfDoc.pipe(fs.createWriteStream('./output.pdf'));
pdfDoc.end();
```

QR コードを出力する際にもプロパティを設定することで細かな設定を追加できます。例えば、 **`eccLevel`** プロパティで **エラー訂正機能のレベル** を指定したり、 **`version`** プロパティで **QR コードのバージョン** を指定できます。他にも **`foreground`** プロパティや **`background`** プロパティで **QR コードの色** や **背景色** のように **見た目を指定** することもできます。

## html-pdf と qrcode を利用する方法

おおよそのレイアウトで良い場合は pdfmake でも十分便利なのですが、 **CSS などでスタイルをより細かく調整したい場合** は、 **[html-pdf](https://www.npmjs.com/package/html-pdf)** を利用する方が便利でしょう。名前の通り、 **HTML から PDF を生成** できます。このパッケージは内部で **[PhantomJS]()** を利用しているので、 html-pdf のオプションの他に、 **PhantomJS のオプションを設定することも可能** です。

### html-pdf の基本的な使い方

html-pdf で PDF を出力する処理の流れは以下の通りです。

1. HTML の文字列をファイルなどから読み込む
1. html-pdf の `create()` メソッドで HTML を PDF に変換する
  - 引数に HTML の文字列を渡す
1. `toFile()` メソッドで PDF をファイルに出力する
  - 第 1 引数に出力先のファイル名を、第 2 引数にコールバック関数を渡す

html-pdf は HTML 文字列を PDF に変換するので、**ブラウザと同じようなスタイルの PDF** を容易に出力することができます。 **CSS も解釈されるので、見た目を CSS で調整することが可能** です。

HTML ファイルから PDF に変換する場合を考えてみましょう。ファイル名 `template.html` の HTML を PDF として出力するコード例は以下の通りです。

```js
import fs from 'fs';
import pdf from 'html-pdf';

const html = fs.readFileSync('./template.html', 'utf8');
pdf.create(html).toFile('./output.pdf', (err, _) => {
  if (err) {
    console.error(err);
  }
});
```

`create()` の第 2 引数にはオプションが指定できます。 **保存先のディレクトリを指定** する **`directory`** プロパティや **用紙サイズを指定** する **`format`** プロパティなどをオプションのオブジェクトに追加できます。さらに内部で PhantomJS が動作していることから、第 2 引数のオプションに **PhantomJS のオプションを指定** することも可能です。

### html-pdf で QR コードを PDF に出力する方法

**html-pdf だけだと QR コードを埋め込むことができない** ので、 **QR コードを生成するライブラリを別に用意** する必要があります。本記事では、 **[qrcode](https://www.npmjs.com/package/qrcode)** という QR コード生成ライブラリを利用して PDF に QR コードを埋め込みます。

qrcode の `toString()` メソッドを利用することで、 **指定した文字列の内容を埋め込んだ QR コード** を生成できます。特にオプションを指定しない場合は、テキスト上で QR コードが描かれます。オプションの `type` プロパティを指定することで、出力形式を変えることも出来ます。例えば、 `'svg'` を指定すると QR コードを描画する SVG タグの文字列が生成されます。

例えば、以下のようなコードを実行すると、 CLI 上に QR コードが印字されます。

```js
import qrcode from 'qrcode';

qrcode.toString('Hello, world').then((qr) => {
  console.log(qr);
}).catch((err) => {
    if (err) {
      console.error(err);
    }
});
```

上記のコードを実行すると、以下のように QR コードが CLI 上に印字されます。

```
    █▀▀▀▀▀█  ▀    █▀▀▀▀▀█    
    █ ███ █ █ █▀▀ █ ███ █    
    █ ▀▀▀ █ █▄ ▀█ █ ▀▀▀ █    
    ▀▀▀▀▀▀▀ █ █▄█ ▀▀▀▀▀▀▀    
    █ ▀▀██▀▄ █▄ █▄▀▀███ ▄    
      ▀▄▄ ▀▀▀█▀▀ █▀▄ ██▀     
     ▀▀  ▀▀ ▄▀█▀▄▄██▄▄  ▀    
    █▀▀▀▀▀█ ▄ ▀ ██▀█ ▄█▀     
    █ ███ █ ██▀▀▀▀▀▄█▄ ▀▀    
    █ ▀▀▀ █ ▀▄▀▀█▄▀▀▄▄█      
    ▀▀▀▀▀▀▀ ▀▀ ▀  ▀ ▀  ▀     
```

今回は html-pdf を利用して QR コードを出力したいので、 **QR コードを Base64 にエンコードして `img` タグの `src` に埋め込む** ことを考えます。 QR コードを Base64 にエンコードするには **`toDataURL()`** メソッドを実行します。

qrcode の少し扱いづらい点として、 `toDataURL()` メソッドが Base64 でエンコードされた文字列ではなく  **`Promise` を返す** ことが挙げられます。QR コードの Base64 エンコードの文字列を `toDataURL()` メソッドから得るには、上記の例のように **`then()` メソッドを経由する** か、 **`await` して返り値を受け取る** 必要があります。

html-pdf と qrcode を使って QR コードを埋め込んだ PDF を出力するコード例は以下の通りです。

```js
import fs from 'fs';
import pdf from 'html-pdf';
import qrcode from 'qrcode';

qrcode.toDataURL('Hello, world').then((url) => {
  const html = `<html><body><img src="${url}"></body></html>`;
  pdf.create(html).toFile('output.pdf', (err, res) => {
    if (err) {
      console.error(err);
    }
  });
}).catch((err) => {
  if (err) {
    console.error(err);
  }
});
```

`Promise` の `then()` メソッドの代わりに async/await を利用する場合は以下のように記述できます。

```js
(async() => {
  const url = await qrcode.toDataURL('Hello, world');
  const html = `<html><body><img src="${url}"></body></html>`;
  pdf.create(html).toFile('output.pdf', (err, res) => {
    if (err) {
      console.error(err);
    }
  });
})();
```

上記のコード例では、 HTML の文字列に生成した QR コードの SVG タグを直接埋め込んでいますが、 **[ejs](https://www.npmjs.com/package/ejs)** などのテンプレートエンジンを使えば、テンプレートファイルに QR コードを動的に埋め込むことも可能です。

## まとめ

本記事のまとめは以下の通りです。

- pdfmake による PDF への QR コードの出力方法を紹介
    - おおよそのレイアウトで PDF を作成する場合に便利
- html-pdf と qrcode を利用した PDF への QR コードの出力方法を紹介
    - CSS で細かなレイアウトを指定したい場合に便利

以上、 k-so16 でした。 Node.js で QR コードつきの PDF を作成したい方々の助けになれば幸いです。