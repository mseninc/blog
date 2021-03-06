---
title: PHP TechCafe のオンラインイベント (静的解析編) に参加しました
date: 2022-06-23
author: k-so16
tags: [〇〇奮闘記, その他]
description: 5/27 に開催された『PHPerのための「静的解析」を語り合うPHP TechCafe』の参加レポートです。
---

こんにちは。
最近、 [Xiaomi のスマートバンド](https://www.mi.com/jp/product/mi-smart-band-6/) を購入した k-so16 です。
ジョギングする時に 1km ごとのラップタイムが確認できたり、心拍数や消費カロリーなどがわかるのがおもしろいと感じています。

2022/5/27 に開催されたオンラインイベント [PHPerのための「静的解析」を語り合うPHP TechCafe](https://rakus.connpass.com/event/245646/) に参加しました。
本記事ではイベントの概要を紹介します。

## イベントの概要

今回のイベントは次の 3 つのセッションに分かれていました。

- LT セッション
- PHP に関する最新情報の議論
- PHP の静的解析についての議論

### LT セッション

LT のセッションでは、 3 枠の発表がありました。
発表概要は以下の通りです。

- PHPMD を PHPMD 自身で静的解析した話
- OSS contribution のきっかけとしての Pslam のススメ
- PHPStan の解析ルールを作成して contribute した話

本記事では、筆者が特におもしろいと感じた PHPMD の静的解析の発表について紹介します。

**[PHPMD](https://phpmd.org/)** は PHP Mess Detector の略で、 PHP の静的解析ツールの 1 つです。
PHPMD を使うことで、解析対象のコードに潜む **不吉な匂い** を検出できます。

発表者は、興味本位から *PHPMD を使って PHPMD のコードを解析してみた* とのことです。
解析した結果、なんと *35 件の不吉な匂いを検出した* とのことでした。

検出された不吉な匂いのうち、明らかなバグが 1 件あったので、それを修正して Pull Request を送り、無事 merge されたようです。

コードの不吉な匂いを検出するツールに不吉な匂いが存在するという、なんともコントのような話ですが、 PHPMD の開発時に PHPMD で解析すれば不吉な匂いを防げると感じました。
ちなみに、今回のイベントの直前に再度 PHPMD を解析したら、 *不吉な匂いが 37 件と増えていた* とのことです。
今後の PHPMD の開発で、 PHPMD を使って不吉な匂いが解消されることを期待しましょう (笑)

### PHP に関する最新情報の議論

LT の発表の次は、イベント進行役の方々が中心に、 PHP に関する最新のニュースについて語り合うセッションに移りました。
このセッションでは、以下のトピックについて話題に挙げられていました。

- PHP 9 で未定義プロパティーへのアクセス許容されなくなる
- phpass に 悪意のあるコードが含まれていた
    - AWS のキーを侵害される可能性がある
- Readonly Class について
    - PHP 8.2 から導入
    - インスタンスのプロパティーが readonly になる
    - 継承する際は基底クラスと派生クラスの両方が readonly class でないといけない

個人的には、 PHP 9 から未定義プロパティーへのアクセスが許容されなくなるという話題に興味を強くひかれました。
PHP 9 から未定義変数へのアクセスも許容されなくなるらしく、 PHP も段々と厳格な言語になってきているように感じました。

### PHP の静的解析についての議論

最後のセッションでは、今回のタイトルである、 PHP の静的解析について、イベント進行役の方々と有志の方々が語り合うセッションでした。
以下の議題について意見交換や議論が行われました。

- 静的解析はどのように利用されるか
    - IDE
        - 文法の誤りや不適切なコードの指摘をエディター上に表示
        - コード補完
    - CI への組み込み
        - `git push` 時に解析してコーディングルールの違反を検出
- 実行時の型検査についての議論
    - 新規プロジェクトを作成する際には言語仕様の型検査を利用した方が安全
    - 既存のプロジェクトに実行時型検査させると実行時エラーでプログラムが止まってしまわないかが心配
- テストコードも静的解析の対象にするか
    - テストコードを解析する動機があまり分からない
    - 導入コストがほとんどないことを考えるとひとまずテストコードも対象としてもデメリットはない
- 解析ツールについて
    - `php -l` で文法チェックが可能
    - PHPMD
        - バグを生じそうなコードや未使用のパラメーターなどを指摘する解析ツール
        - 解析結果の出力フォーマットを XML や JSON など複数のフォーマットに対応
    - PHPStan
        - 解析の厳密さを指定可能
        - 10 段階のレベルに分けられている
            - レベル 0 が最も緩く レベル 9 が最も厳密
    - Psalm
        - PHPStan 同様に解析の厳密さを段階的に指定可能
            - レベル 1 が最も厳しく レベル 8 が最も緩い
            - 厳しさのレベルの数値は PHPStan と逆
        - どういう理由で不適切と検知されたかの説明が表示される
    - PhpStorm
        - IDE 内に静的解析機能が含まれる
            - コード補完で入力をサジェスト
            - 開かれているファイルの不適切な箇所をハイライティングする
        - 任意の静的解析ツールをインストールして利用することも可能

筆者自身は PHP の静的解析ツールをほとんど使ったことがないので、これを機にいろいろ調べて触ってみたいと思いました。
過去に書いた PHP のプログラムを解析ツールに通してみて、どのような結果が出てくるかを見てみるのもおもしろそうですね。

## 所感

今まで PHP の静的解析ツールに触れる機会がなかったので、どのような解析ツールがあるのか、そしてどのような特徴があるのかを知ることができたのは自分にとって大きな収穫になりました。
また、静的解析にまつわる LT の発表では、 PHPMD を解析する話が非常におもしろく感じました。
他の解析ツールについても、同様のことを試したらどのような結果になるかも気になるところです。

静的解析の話だけでなく、 PHP に関する話題についてもおもしろい話を聞くことができました。
未定義変数や未定義プロパティーへのアクセスの禁止など、 PHP も徐々に厳格さを持つ言語に変わってきているように感じます。
しばらく PHP に触れられていないので、 PHP に追加された新しい機能などもいずれ試してみたいと思います。

以上、 k-so16 でした。
