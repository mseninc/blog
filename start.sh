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

BRANCH_NAME=`git rev-parse --abbrev-ref HEAD`
if [ "`echo $BRANCH_NAME | grep '^post/'`" ]; then
  SLUG_CANDIDATE=`echo $BRANCH_NAME | sed -e 's%^post/%%'`
fi

read -p "slug? [$SLUG_CANDIDATE]> " SLUG

if [ -z "${SLUG}" ]; then
  if [ -n "${SLUG_CANDIDATE}" ]; then
    SLUG=$SLUG_CANDIDATE
  else
    echo 'CANCELED'
    exit 0
  fi
fi

if [ "`echo $SLUG | grep '[^0-9a-zA-Z-]'`" ]; then
  echo "ERROR: slug can contain only alphanumeric characters and hyphen (0-9, a-z, -)" 1>&2
  exit 1
fi

SLUG="${SLUG,,}" # make slug lower-case
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

echo -n "Open with code? [y/N] > "
read EDITOR

case $EDITOR in
  [Yy]* )
    code ${MD}
    ;;
  * )
    exit 0
    ;;
esac
