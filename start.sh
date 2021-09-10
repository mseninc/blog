#!/bin/bash

authors=($(cat author.yaml | grep '^- id: ' | sed 's/^- id: //'))

PS3="name? > "
select AUTHOR in ${authors[@]}
do
  if [ -z "$AUTHOR" ]; then
    echo 'CANCELED'
    exit 0
  else
    break
  fi
done

echo -n "slug? > "
read SLUG

if [ -z "${SLUG}" ]; then
  echo 'CANCELED'
  exit 0
fi

YEAR=`date '+%Y'`
DIR="${AUTHOR}/${YEAR}/${SLUG}"
IMAGES="${DIR}/images"
MD="${DIR}/index.md"

echo -----
echo You are \"${AUTHOR}\"
echo Will make
echo "  \"${DIR}\""
echo "  \"${IMAGES}\""
echo "  \"${MD}\""
echo -n "OK? [y/N] > "
read CONFIRM

case $CONFIRM in
  [Yy]* )
    mkdir -p ${IMAGES}
    cat <<EOF > "${MD}"
---
title: 
date: 
author: ${AUTHOR}
tags: []
description: 
---

EOF
    ;;
  * )
    echo 'CANCELED'
    exit 0
    ;;
esac
