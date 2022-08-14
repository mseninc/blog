---
title: Web Speech Synthesis API (音声合成) で利用可能な音声の一覧を手軽に取得する
date: 2019-06-17
author: kenzauros
tags: [HTML5, Web Speech API, Web]
---

こんにちは、kenzauros です。

今作っている Web サービスで **Web Speech Synthesis API** を利用する機会があり、端末ごとに利用できる言語を列挙したくなったため、 CodePen で簡単に作ってみました。

## 音声の列挙

といってもこのページを開いていただくと、下記の CodePen のテキストエリアにすでに音声の一覧が表示されているはずです。

[List Voices with Web Speech Synthesis API (by CodePen)](https://codepen.io/kenzauros/pen/agvEWe)

<p class="codepen" data-height="265" data-theme-id="0" data-default-tab="js,result" data-user="kenzauros" data-slug-hash="agvEWe" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="List Voices with Web Speech Synthesis API">
  <span>See the Pen <a href="https://codepen.io/kenzauros/pen/agvEWe/">
  List Voices with Web Speech Synthesis API</a> by Kenji YAMADA (<a href="https://codepen.io/kenzauros">@kenzauros</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

実際には**言語というよりは発話可能な音声の種類**になっています。

## 取得方法

そのブラウザーで利用できる音声の一覧は JavaScript で **`window.speechSynthesis.getVoices()`** を叩けば配列で取得できます。

各要素は下記のようなオブジェクトになっています。

```js
{
  voiceURI: "Microsoft Haruka Desktop - Japanese",
  name: "Microsoft Haruka Desktop - Japanese",
  lang: "ja-JP",
  localService: true,
  default: true
}
```

iOS はページロード時に即座に取得可能ですが、 **Google Chrome だと `window.speechSynthesis.onvoiceschanged` でイベントの発生を待つ必要があります**。

ということで上記 CodePen では一旦 `loadVoices` という関数にしてロード時に一回呼んでおき、さらに `voiceschanged` イベントでも呼んでいます。

```js
function loadVoices() {
  document.getElementById("list").value = window.speechSynthesis
    .getVoices()
    .map(x => [x.name, x.lang].join("\t"))
    .join("\r\n");
};

loadVoices();

window.speechSynthesis.onvoiceschanged = function(e) { loadVoices(); }
```

これによってテキストエリアに 音声名と言語コードの一覧が表示されるというわけです。


## 音声一覧の例

### Google Chrome (Windows 10) の例

name | lang
-- | --
Deutsch | de-DE
US English | en-US
UK English | en-GB
español | es-ES
español | de
Estados Unidos | es-US
français | fr-FR
हिन्दी | hi-IN
Bahasa Indonesia | id-ID
italiano | it-IT
日本語 | ja-JP
한국의 | ko-KR
Nederlands | nl-NL
polski | pl-PL
português | do
Brasil | pt-BR
русский | ru-RU
普通话（中国大陆） | zh-CN
粤語（香港） | zh-HK
國語（臺灣） | zh-TW

### iOS (iPad) の例

iOS の場合、キャラクター名 (?) なので、言語名がわからないのがちょっと不便ですね。

name | lang
-- | --
Maged | ar-SA
Zuzana | cs-CZ
Sara | da-DK
Anna | de-DE
Helena | de-DE
Martin | de-DE
Melina | el-GR
Catherine | en-AU
Gordon | en-AU
Karen | en-AU
Arthur | en-GB
Daniel | en-GB
Martha | en-GB
Moira | en-IE
Aaron | en-US
Fred | en-US
Nicky | en-US
Samantha | en-US
Tessa | en-ZA
Monica | es-ES
Paulina | es-MX
Satu | fi-FI
Amelie | fr-CA
Daniel | fr-FR
Marie | fr-FR
Thomas | fr-FR
Carmit | he-IL
Lekha | hi-IN
Mariska | hu-HU
Damayanti | id-ID
Alice | it-IT
Hattori | ja-JP
Kyoko | ja-JP
O-ren | ja-JP
Yuna | ko-KR
Ellen | nl-BE
Xander | nl-NL
Nora | no-NO
Zosia | pl-PL
Luciana | pt-BR
Joana | pt-PT
Ioana | ro-RO
Milena | ru-RU
Laura | sk-SK
Alva | sv-SE
Kanya | th-TH
Yelda | tr-TR
Li-mu | zh-CN
Ting-Ting | zh-CN
Yu-shu | zh-CN
Sin-Ji | zh-HK
Mei-Jia | zh-TW

### Chrome (Android) の場合

Android の場合、 lang の言語と地域をつなぐ文字がアンダースコアになっていることと、末尾にさらに修飾子がついている場合があるので注意が必要です。

name | lang
-- | --
ベンガル語 バングラデシュ | bn_BD
ベンガル語 インド | bn_IN
チェコ語 チェコ | cs_CZ
デンマーク語 デンマーク | da_DK
ドイツ語 ドイツ | de_DE
ギリシャ語 ギリシャ | el_GR
英語 オーストラリア | en_AU
英語 イギリス | en_GB
英語 インド | en_IN
英語 アメリカ合衆国 | en_US
スペイン語 スペイン | es_ES
スペイン語 アメリカ合衆国 | es_US
エストニア語 エストニア | et_EE
フィンランド語 フィンランド | fi_FI
フィリピノ語 フィリピン | fil_PH
フランス語 カナダ | fr_CA
フランス語 フランス | fr_FR
ヒンディー語 インド | hi_IN
ハンガリー語 ハンガリー | hu_HU
インドネシア語 インドネシア | in_ID
イタリア語 イタリア | it_IT
日本語 日本 | ja_JP
ジャワ語 インドネシア | jv_ID
ジャワ語 インドネシア | jv_ID_#Latn
クメール語 カンボジア | km_KH
韓国語 韓国 | ko_KR
ノルウェー語(ブークモール) ノルウェー | nb_NO
ネパール語 ネパール | ne_NP
オランダ語 オランダ | nl_NL
ポーランド語 ポーランド | pl_PL
ポルトガル語 ブラジル | pt_BR
ポルトガル語 ポルトガル | pt_PT
ルーマニア語 ルーマニア | ro_RO
ロシア語 ロシア | ru_RU
シンハラ語 スリランカ | si_LK
スロバキア語 スロバキア | sk_SK
スウェーデン語 スウェーデン | sv_SE
タイ語 タイ | th_TH
トルコ語 トルコ | tr_TR
ウクライナ語 ウクライナ | uk_UA
ベトナム語 ベトナム | vi_VN
広東語 中華人民共和国香港特別行政区 | yue_HK_#Hant
中国語 中国 | zh_CN_#Hans
中国語 台湾 | zh_TW_#Hant

