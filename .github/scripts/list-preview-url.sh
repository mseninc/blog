#!/bin/bash

if [ $# -ne 2 ]; then
  echo "URL prefix and bransh name must be specified" 1>&2
  exit 1
fi

IFS=$'\n';
for LINE in `git -c core.quotepath=false diff origin/release $2 --name-only | grep -v ^.draft | grep .md$`
do
  DIR=${LINE%/*}
  echo $1${DIR##*/}
done
