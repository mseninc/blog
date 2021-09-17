#!/bin/bash

if [ $# = 1 ]; then
  dt=$1
else
  dt=`TZ=JST-9 date '+%Y-%m-%d'`
fi

dt=`date --date "-1 day ${dt}" '+%Y-%m-%d'`
year=`date --date "1 month ${dt}" '+%Y'`

# 12～5 → 1 6～11 → 7
month=$(((`date --date "${dt}" '+%-m'`/6*6+1)%12))

first_day=`date --date "-1 month ${year}-${month}-02" '+%Y-%m-%d'`
last_day=`date --date "5 month ${year}-${month}-01" '+%Y-%m-%d'`

echo ${first_day} '~' ${last_day}

find . -name '*.md' -type f -not -path './.draft/*' |\
  xargs grep -E '^date: ?[0-9\-]+$' | \
  sed -r 's/\W*\/([^\/]+).+(20[0-9]{2}-[0-9]{2}-[0-9]{2})$/\2 \1/' | \
  awk -v first="${first_day}" -v last="${last_day}" '$1 >= first && $1 <= last' | \
  awk '{print $2}' | sort | uniq -c | sort | awk '{print $2" "$1}'
