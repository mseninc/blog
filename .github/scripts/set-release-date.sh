#!/bin/bash

if [ ! -d $1 ]; then
  echo "Directory not found" 1>&2
  exit 1
fi

DATE_STR=$(TZ=UTC-9 date '+%Y-%m-%d')
echo "Setting date to $DATE_STR..."

# *.md で値のない date: を含むファイル
MD_LIST=($(grep -Erl --include='*.md' --exclude-dir='node_modules' --exclude='README.md' '^date: *$' $1))

for MD in "${MD_LIST[@]}"
do
  sed -i -E "s/^date: *$/date: $DATE_STR/" $MD
  echo -n "$MD > "
  grep -E '^date:' $MD
done

# *.md で "date:"" 行のないファイル
NO_DATE_MD_LIST=($(grep -ErL --include='*.md' --exclude-dir='node_modules' --exclude='README.md' '^date:' $1))

for MD in "${NO_DATE_MD_LIST[@]}"
do
  # "title:" が含まれているファイルのみ
  if grep -q '^title:' $MD; then
    # "title:" 行の下に追加
    sed -i -e "/^title:/a date: $DATE_STR" $MD
    echo -n "$MD > "
    grep -E '^date:' $MD
  fi
done

