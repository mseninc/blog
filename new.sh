#!/bin/bash

BOUNDARY=$(printf "=%0.s" {0..79})
SLUG=$1

if [ $# -ne 1 ]; then
  echo "記事のスラグを入力してください"
  echo "  スラグにはアルファベット・数字・ハイフンのみ使用できます (0-9, a-z, -)"
  echo "  例: my-first-post"
  read -e -p "> " SLUG
fi

if [ -z $SLUG ]; then
  echo "ERROR: 記事のスラグを指定してください" 1>&2
  exit 1
fi

SLUG="${SLUG,,}" # make slug lower-case

if [ "`echo $SLUG | grep '[^0-9a-zA-Z-]'`" ]; then
  echo "ERROR: スラグにはアルファベット・数字・ハイフンのみ使用できます (0-9, a-z, -)" 1>&2
  exit 1
fi

# check if slug is already used
FIND_RESULT=$(find ./ -maxdepth 3 -mindepth 3 -type d -name $SLUG)

if [[ -n $FIND_RESULT ]]; then
  echo "ERROR: スラグがすでに存在します" 1>&2
  echo $FIND_RESULT 1>&2
  exit 1
fi

# select author
authors=($(awk -F': ' '/github:/ {github=$2} /active: true/ {print github}' author.yaml))

echo $BOUNDARY
echo "著者番号を指定してください"
PS3="> "
select AUTHOR in ${authors[@]}
do
  if [ -z "$AUTHOR" ]; then
    echo 'CANCELED'
    exit 0
  else
    break
  fi
done

YEAR=`date '+%Y'`
DIR="${AUTHOR}/${YEAR}/${SLUG}"
IMAGES="${DIR}/images"
MD="${DIR}/index.md"
BRANCH_NAME="post/${SLUG}"

# confirmation
echo $BOUNDARY
echo スラグ: \"${SLUG}\"
echo ブランチ: \"${BRANCH_NAME}\"
echo 著者: \"${AUTHOR}\"
echo 作成されるファイル:
echo "  \"${IMAGES}\" (ディレクトリ)"
echo "  \"${MD}\""
echo -n "よろしいですか? [y/N] > "
read CONFIRM

case $CONFIRM in
  [Yy]* )
    echo $BOUNDARY
    ;;
  * )
    echo 'キャンセルされました'
    exit 0
    ;;
esac

# fecth git commits from origin
echo "フェッチしています..."

git fetch origin

if [ $? -gt 0 ]; then
  echo "ERROR: フェッチできませんでした" 1>&2
  exit 1
fi

# checkout release branch
echo $BOUNDARY
echo "release ブランチをチェックアウトしています..."

git checkout origin/release

if [ $? -gt 0 ]; then
  echo "ERROR: release ブランチをチェックアウトできませんでした" 1>&2
  exit 1
fi

## create branch
echo "新しいブランチを作成しています..."
git switch -c ${BRANCH_NAME}

if [ $? -gt 0 ]; then
  echo "ERROR: ブランチの作成に失敗しました" 1>&2
  exit 1
fi

# create images directory
echo "images ディレクトリを作成しています..."
mkdir -p ${IMAGES}

# create md file with initial content
echo "index.md を作成しています..."
cat <<EOF > "${MD}"
---
title: ""
date: 
author: ${AUTHOR}
tags: []
description: ""
---

EOF

echo -n "VS code で md ファイルを開きますか? [y/N] > "
read EDITOR

case $EDITOR in
  [Yy]* )
    code ${MD}
    ;;
esac

echo $BOUNDARY
echo "さぁ、執筆をはじめましょう！"
echo
echo "ヒント"
echo "  文章校正 (textlint) と構文チェック : F5 キー (2回目からは Ctrl+Shift+F5 キー) ※VS Code のみ"
echo "  md ファイルを開く : code ${MD}"
echo "  タグ一覧を見る : make taglist"
echo "  アイキャッチ画像 : images/HERO.png または images/HERO.jpg に配置"
