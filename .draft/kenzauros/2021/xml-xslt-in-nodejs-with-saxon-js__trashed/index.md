---
title: Saxon-JS を使って Node.js 上で XML の XSLT 変換を行う
date: 2021-08-13
author: kenzauros
tags: [Web, XML]
---

ほげ
XSLT なにそれ食えるの？という方にはまったく用のない記事でございます。

<h2>前提条件</h2>

<ul>
<li>Node.js >12</li>
<li>XSLT については理解している方</li>
</ul>

<h2>試したパッケージ</h2>

<h3>xslt-processor</h3>

<a href="https://github.com/fiduswriter/xslt-processor">fiduswriter/xslt-processor: A JavaScript XSLT processor without native library dependencies</a>

おそらくこれが一番有名なのか、検索すると上位にでてくるのだが、開発自体は4年前で止まっていて、一部の機能が実装されていない。

変換したい XSL は <code>xsl:number</code> を含んでいたのだが、そこで <code>not implemented: number</code> というエラーが発生した。

<a href="https://github.com/fiduswriter/xslt-processor/blob/master/src/xslt.js#L217-L218">xslt.js#L217-L218</a> あたりを見ると見事に「実装されていない」とある。

<pre><code class="language-js">case 'number':
    throw(`not implemented: ${nodename[1]}`);
</code></pre>

ということで断念

<h3>xslt-ts</h3>

<a href="https://github.com/backslash47/xslt">backslash47/xslt: XSLT 1.0 TypeScript implementation</a>

こちらは TypeScript の実装で、 README に従って <code>npm install xslt-ts xmldom-ts</code> と2パッケージを入れてやれば、動作しますが、 xslt の実装は xslt-processor と共通なのか、 ~~どちらかがパクっているのか~~ やはり <code>xsl:number</code> は実装されていません。

<a href="https://github.com/backslash47/xslt/blob/8f8ddf0282d1db720912a5835687642fd21745ac/src/xslt.ts#L199-L200">xslt.ts#L199-L200</a>

<h2>Saxon-JS</h2>

最終的に行き着いたのが、 <strong><a href="https://www.saxonica.com/saxon-js/index.xml">Saxonica</a> 社の開発している Saxon-JS</strong> でした。

ホームページは XSLT と同じく歴史を感じさせる趣ですが、現在でも継続して開発が続けられているのが素晴らしいですね。

ただし、無償で利用できるものの、ライセンスはオープンソースではありません（ソースコードは公開されているが、知的財産権は同社が保有）。

<blockquote>
  Although the source code of Saxon-JS is made available, the product is not open source. The code is the intellectual property of Saxonica, except for open source components listed below.
  <a href="https://www.saxonica.com/saxon-js/documentation/index.html#!conditions">Saxon-JS Licensing</a>
</blockquote>

<h3>事前準備: テンプレートの変換</h3>

少々不便な点として、 xsl テンプレートを sef.json という JSON 形式に変換しておく必要があります。

これは同社の提供している xslt3 モジュールで変換できます。

<pre><code>$ npm i xslt3
$ node_modules/.bin/xslt3 -xsl:path/to/template.xsl -export:path/to/template.sef.json -t -ns:##html5 -nogo
</code></pre>

<h3> </h3>