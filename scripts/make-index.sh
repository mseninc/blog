#! /bin/bash
for file in `\find . -name '*.md'`; do
  idfile="${file%/*}/.id"
  if [ ! -f $idfile ]; then
    sha1sum $file | awk '{ print $1 }' > $idfile
  fi
done
