---
title: "[bash] シェルの履歴機能を使いこなす"
date: 2019-04-29
author: k-so16
tags: [bash, Linux]
---

こんにちは。最近、Ubuntuで[Shotcut](https://shotcut.org/)を使って動画編集に挑戦している k-so16 です。

シェル[^1]で過去に実行したコマンドを再度実行するとき、読者のみなさんはどのようにコマンドを実行していますか? 目的のコマンドに到達するまで上キーを押してさかのぼって、場合によってはそのコマンドを書き換えて実行していますか? それとも `history` コマンドと `grep` コマンドを駆使して目的のコマンドを探し出して、実行コマンドの全体や一部をコピペしたり、書き換えて実行していますか?

本記事では、シェルの履歴をいい感じに扱える、 [**履歴展開** (history expansion)](http://man7.org/linux/man-pages/man1/bash.1.html) について紹介します。履歴展開を利用すると、 `history` コマンド実行時に表示される番号から再実行するコマンドを指定したり、過去に実行したコマンドの引数を取り出して別のコマンドを実行する際の引数にしたりできます。

本記事で想定する読者は以下の通りです。

- `bash` や `csh` などのUNIXシェルを利用している
- UNIX/Linuxにおける基礎的なコマンドの知識を有している


## 履歴展開の機能
履歴展開には以下の3つの指定子があります。

- Event Designators
- Word Designators
- Modifiers

指定子を接続する場合は、 `:`(コロン) によって接続します。指定方法は、 **Event-Designators**`:`**Word-Designators**`:`**Modifiers**が基本形となります。なお、各指定子を指定する際には、空白文字を開けずにつなげてください。

### `history` コマンド実行時の出力例
本記事では、仮想的な `history` コマンドの出力例を利用して履歴展開の機能を説明します。コマンド履歴の例は以下の通りです。

```:title=コマンド履歴の表示例
28 sed -e 's/hoge/foo/g' hoge.txt
29 echo It is a sunny day today
30 cd Projects/Okonomiyaki/
31 ls -la
32 php artisan make:migration create_plates_table
33 vim databases/migrations/2025_03_25_090030_create_plates_table.php
34 php artisan migrate
35 vim resources/js/components/CookingComponent.vue
36 npm run dev
```

### Event Designators
Event Designatorsによって、履歴中のコマンドを指定できます。Event Designatorsによるコマンドの指定は以下の通りです。

- `!n` : 履歴中の *n* 番目のコマンド
    - 例: `!31` → `ls -la`
- `!-n` : 現在から *n* 個前のコマンド
    - 例:  `!-3` → `php artisan migrate`
- `!!` : 直近のコマンド (!-1と同じ)
    - 例:  `!!` → `npm run dev`
- `!str` : 履歴中のstrから始まるもののうち、直近のコマンド
    - 例: `!ph` → `php artisan migrate`
- `!?str[?]` : 履歴中のstrを含むもののうち、直近のコマンド (strの直後が改行の場合に限り、後ろの?は省略可能)
    - 例: `!?art?` → `php artisan migrate`
- `^str1^str2^` : 直前のコマンド中に出現する先頭のstr1をstr2に置換
    - 例: `^dev^watch^` → `npm run watch`
- `!#` : コマンド全体
    - 例: `echo hoge !#` → `echo hoge echo hoge`

### Word Designators
Word Desgnatorsでは、指定したコマンドに含まれる引数を指定できます。Word Designatorsによるコマンドの指定は以下の通りです。

- `0` : 先頭の単語 (i.e. 実行コマンド)
    - 例: `!35:0` → `vim`
- `n` : コマンドのn番目のコマンド
    - 例: `!34:2` → `migrate`
- `^` : 先頭の引数 (1と同じ)
    - 例: `!34:^` → `artisan`
- `$` : 最後の引数 (引数がない場合は0と同じ)
    - 例: `!32:$` → `make:migration create_plates_table`
- `%` : 直近で ?str? にマッチした単語
    - 例: `!:%` → `artisan` (事前に `!?art?`が実行済みと想定)
- `x-y` : xからyまでの単語列 (-yは0-yと同じ)
    - 例: `!29:3-5` → `a sunny day`
- `*` : 実行コマンドを除く引数すべて (1-$と同じ)
    - 例: `!29:*` → `It is a sunny day today`
- `x*` : `x-$` と同じ
    - 例: `!29:3*` → `a sunny day today`
- `x-` : `x-$` と同じ (ただし、最後の引数は省略される)
    - 例: `!29:3-` → `a sunny day`

### Modifiers
Modifiersでは、履歴展開によって指定したコマンド文字列に対して、操作を加えることができます。Modifiersを複数指定する場合は、指示子を `:` で接続します。Modifiersによる操作は以下の通りです。

- `h` : 引数のファイル名を削除 (ディレクトリ名が残る)
    - 例: `!35:1:h` → `resources/js/components`
- `t` : 引数のファイル名を末尾のもの以外を削除
    - 例: `!35:1:t` → `CookingComponent.vue`
- `r` : 引数のファイル名から拡張子を削除
    - 例: `!35:1:r` → `resources/js/component.CookingComponent`
- `e` : 拡張子以外を削除
    - 例: `!35:1:e` → `.vue`
- `p` : コマンドを実行せずに表示
    - 例: `!!:p` → `npm run dev` (コマンドに表示されるが実行されない)
- `q` : 置換された単語をクウォートで全体を囲み、シングルクオーテーションをエスケープして表示
    - 例: `!28:q` → `'sed -e '\''s/hoge/foo/g'\'' hoge.txt'`
- `x` : 置換された単語をクウォートで単語ごとに囲み、シングルクオーテーションをエスケープして表示 (空白文字や改行が単語の切れ目)
    - 例: `!28:x` → `'sed' '-e' ''\''s/hoge/foo/g'\''' 'hoge.txt'`
- `s/old/new/` : コマンドの文字列中のoldをnewに置き換える
    - 例: `!33:s/at/??/` → `vim d??abases/migrations/2025_03_25_090030_create_plates_table.php`
- `&` : 前の置換を繰り返す
    - 例: `!!:&` → `vim d??abases/migr??ions/2025_03_25_090030_create_plates_table.php` (`!33:s/at/` の実行直後を想定)
- `g` : コマンドの変更を全体に適用
    - 例: `!33:gs/at/??/` → `vim d??abases/migr??ions/2025_03_25_090030_cre??e_pl??es_table.php`
- `G` : modifier s の内容を各引数に一度だけ適用
    - 例: `!29:Gs/a/@/` → `echo It is @ sunny d@y tod@y`

## 利用例
本章では、履歴展開の機能をどのように活用できるかの例を紹介します。

### 指定したコマンド引数の再利用やファイル名の修正
`vim` などのエディターで編集したファイルをコピーしたり、別のディレクトリに移動する際に、エディター起動時の引数のファイル名を履歴展開で再利用できます。また、ディレクトリは変更せず、ファイル名を変更したい場合にも履歴展開が利用できます。この節では、35番目のコマンドの引数 `resources/js/components/CookingComponent.vue` を `resources/js/components/DecoratingComponent.vue` という名前でコピーする例を考えます。履歴展開を用いたコマンドは以下の通りになります。

```bash:title=コマンド引数の再利用するコマンド例
cp !vim:1 !vim:1:h/DecoratingComponent.vue
# cp resources/js/components/CookingComponent.vue resources/js/components/DecoratingComponent.vue と等価
```

第1引数の `!vim:1` では、直近に実行された `vim` コマンドの第1引数を指定しています。すなわち、第1引数には、 `resources/js/components/CookingComponents.vue` が指定されます。

第2引数の `!vim:1:h/DecoratingComponents.vue` では、 `!vim:1` までは第1引数と同様です。その後ろの `:h` では、引数のファイル名の部分を削除します。つまり、 `!vim:1:h` で `resources/js/components` が指定されることになります。最後に、`DecoratingComponents.vue` というファイル名で保存したいので、 `!vim:1:h` の直後に `/DecoratingComponents.vue` を付け加えます。これで第2引数に `resources/js/components/DecoratingComponent.vue` が指定できました。

注意点として、Modifiersの `h` を指定すると、最後のスラッシュは出力されません。Modifiersの `h` を利用して指定したディレクトリの下のファイルを付け加える際には、ファイル名をスラッシュから始めることを忘れないように注意してください。失敗例を示します。上記の第2引数の場合、 `!vim:1:hDecoratingComponent.vue` としてしまうと、 `resources/js/components/DecoratingComponent.vue` となってしまいます。

### コマンド引数に含まれる文字列から繰り返すコマンドを指定
Laravelの `artisan` や、Dockerの `up` や `down` のように、同じコマンドを利用するが、引数が異なる時に、 コマンドの引数から繰り返したいコマンドを実行する方法を紹介します。この節では、`make:migration` を引数に含むコマンド引数を再実行する例を考えます。ついでに、第3引数の `create_plates_table` も `create_chefs_table` に変更してみましょう。履歴展開を用いたコマンドは以下の通りになります。

```bash:title=コマンド引数に含まれる文字列から再度実行するコマンドを指定する例
!?make:migration?:s/plate/chef/
# php artisan make:migration create_chefs_table と等価
```

まず、 `!?make:migration?` によって、32番目の `php artisan make:migration create_plates_table` が指定されます。さらに、 `s/plate/chef/` によって、コマンド中に最初に出現する文字列 `plate` が `chef` に置換されます。


## 総括
本記事のまとめです。

- 履歴展開を用いることで、 `history` の番号や文字列を指定によるコマンドの繰り返しが可能
- Event Designators, Word Designators, Modifiersを組み合わせることで、コマンド引数の再利用や変更が可能

以上、k-so16でした。履歴展開って、すごい!

[^1]: 本記事では `bash` をシェルとして想定するが、 `csh` および `tcsh` でも同様の機能(History substitution)が存在する。