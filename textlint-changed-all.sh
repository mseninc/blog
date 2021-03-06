#!/bin/bash

if [ $# -eq 1 ]; then
  BRANCH=$1
else
  BRANCH=`git rev-parse --abbrev-ref HEAD`
fi

if [ -z BRANCH ]; then
  exit 1
fi

IFS=$'\n';
for LINE in `git -c core.quotepath=false diff origin/release ${BRANCH} --name-only | grep -v ^.draft | grep -rEI '\.md$' -`
do
  npx textlint ${LINE}
done
