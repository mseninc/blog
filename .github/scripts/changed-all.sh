#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Bransh name must be specified" 1>&2
  exit 1
fi

git -c core.quotepath=false diff origin/release origin/$1 --name-only | grep -v ^.draft
