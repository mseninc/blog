---
title: "[CentOS7] expect を使って対話式に対応したユーザー作成用のシェルスクリプトを作る"
date: 2018-06-28
author: norikazum
tags: [CentOS, shell script, expect, Linux]
---

こんにちは。

CentOS などの Linux 系 OS で、ユーザーにパスワードを設定するのに `passwd masuda` とすると、

```sh
# passwd masuda
ユーザー masuda のパスワードを変更。
新しいパスワード:
```

というような形で確認が入ります。

ここで実行が中断されるため、例えばシェルスクリプトでパスワードを変更するというのは単純ではありません。

今回は、**`expect`** を使ってこの**対話式コマンド**に対応したシェルスクリプトを作成してみたいと思います。

## expect のインストール

`yum -y install expect`

準備はこれで完了です。

## 実践

それでは実践していきましょう。

全体は、

```sh
expect -c "
この間に処理を書きます。
expect "
```

という感じになります。ダブルクオーテーション内に書く内容は、

1. `spawn hogehoge` で実行したいコマンドを記載(ここではhogehoge)
1. `expect \"password:\"` で、実行したコマンドの後に応答がある内容を記載(ここではpassword:)
1. `send \"test123\n\"` で、応答に対する返答内容を記載(ここではtest123)

という感じになります。

2 の `expect` にある `\` は、ダブルクォーテーションをエスケープしています。
3 の `send` も同じですが、 `\n` は、応答内容を決定するために改行しています。 (Enterを押す動作と同じです)

対話が連続する場合は、 3 のあとに、 2, 3 の内容を繰り返します。

では、 `masuda` ユーザーにパスワードを設定してみましょう。

以下の内容で、 **test.sh** を作成します。

```sh
#!/bin/sh
user=masuda
pw=test123

expect -c "
  spawn passwd ${user}
  expect \"新しいパスワード:\"
  send \"${pw}\n\"
  expect \"再入力してください:\"
  send \"${pw}\n\"
expect "
```

それでは、実行してみましょう。

```sh
# ./test.sh
spawn passwd masuda
ユーザー masuda のパスワードを変更。
新しいパスワード:
よくないパスワード: このパスワードは辞書チェックに失敗しました。 - 単純/系統的すぎます
新しいパスワードを再入力してください:
passwd: すべての認証トークンが正しく更新できました。
```

このような結果になりました。
無事、変更後のパスワードでログインできました。

## ちょっと応用

少し応用して、簡易ユーザー作成のスクリプトを作成してみました。

仕様は、以下のとおりです。

1. ユーザー登録のコマンドは `useradd` とする
1. 登録したいユーザー名を1行ごとに記載したテキストファイルを用意 (`/root/user.txt`)
1. そのユーザーリストに対して12桁の乱数でパスワードを設定して登録
1. パスワードのリストを出力 (`/root/result.txt`)
1. グループ名はユーザー名と同じとする

注意点は以下のとおりです。

1. すでに存在するユーザーに対して実行するとパスワードが更新されます
1. 細かなエラー処理などテストが不十分なので予期せぬエラーがでるかも

スクリプトは以下のとおりです。

```sh
#!/bin/sh

# 登録するユーザーリスト(1ユーザー1行で記載)
user_list="/root/user.txt"

# ログファイル
log=/root/result.txt
rm -rf ${log} # ログ初期化

# パスワード格納ファイル作成
tmp_pw=/tmp/set_pw

# 実行した日時取得
date=`date '+%Y%m%d-%H%M%S'`
echo "-------------------------------" >> ${log}
echo "Execution Time ${date}" >> ${log}
echo "-------------------------------" >> ${log}

# 登録処理
while read line
do
  rm -rf ${tmp_pw}
  set_pw=

  # 12桁のランダムパスワード作成用変数
  create_pw=`cat /dev/urandom | tr -dc "[:alnum:]" | fold -w 12 | head -c 12`

  echo ${create_pw} > ${tmp_pw}
  set_pw=`cat ${tmp_pw}`

  # log 出力(ユーザー名:パスワード の形で出力)
  echo -n ${line} >> ${log}
  echo -n : >> ${log}
  cat ${tmp_pw} >> ${log}

  useradd ${line}

  expect -c "
    spawn passwd ${line}
    expect \"新しいパスワード:\"
    send \"${set_pw}\n\"
    expect \"再入力してください:\"
    send \"${set_pw}\n\"
  expect "
done < ${user_list}

## end ##
```

つづいて `/root/user.txt` を作成します。

```sh
# vi /root/user.txt
masuda1
masuda2
masuda3
```

これで準備は完了、実行してみます。

```sh
# /root/test.sh
spawn passwd masuda1
ユーザー masuda1 のパスワードを変更。
新しいパスワード:
新しいパスワードを再入力してください:
passwd: すべての認証トークンが正しく更新できました。
spawn passwd masuda2
ユーザー masuda2 のパスワードを変更。
新しいパスワード:
新しいパスワードを再入力してください:
passwd: すべての認証トークンが正しく更新できました。
spawn passwd masuda3
ユーザー masuda3 のパスワードを変更。
新しいパスワード:
新しいパスワードを再入力してください:
passwd: すべての認証トークンが正しく更新できました。
```

確認すると、登録できてそうです。

```sh
# cat /etc/passwd | grep masuda
masuda1:x:1001:1001::/home/masuda1:/bin/bash
masuda2:x:1002:1002::/home/masuda2:/bin/bash
masuda3:x:1003:1003::/home/masuda3:/bin/bash
```

作成したユーザーのパスワードを `/root/result.txt` から確認し、ログインを実施してみると無事ログインできました。

```sh
# cat /root/result.txt
-------------------------------
Execution Time 20180624-212402
-------------------------------
masuda1:IE1cwuF6B0vG
masuda2:BuUBZoZVbhZJ
masuda3:0ybmqJOWVfMQ
```

応用次第で色々と利用できると思いますので対話式に困ったら一度お試し下さい。

それでは次回の記事でお会いしましょう。