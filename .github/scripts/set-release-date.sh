#!/bin/bash

if [ ! -d $1 ]; then
  echo "Directory not found" 1>&2
  exit 1
fi

DATE_STR=$(TZ=UTC-9 date '+%Y-%m-%d')
echo "Setting date to $DATE_STR..."

MD_LIST=($(grep -Erl --include='*.md' '^date: *$' $1))

for MD in "${MD_LIST[@]}"
do
  sed -i -E "s/^date: *$/date: $DATE_STR/" $MD
  echo -n "$MD > "
  grep -E '^date:' $MD
done
