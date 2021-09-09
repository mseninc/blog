---
title: VSCode + Git bash 環境で複数ファイルの改行コードを CRLF から LF に一括で置換する
date: 2019-03-27
author: kenzauros
tags: [その他]
---

find . -name \*.xml -type f -print0 | xargs -0 sed -i 's/\r//g'