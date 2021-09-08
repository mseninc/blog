---
title: "[TODO] Raspberry Pi 2 の CentOS で node-sqlite3 をインストールするには"
date: 2016-07-23
author: kenzauros
tags: [その他]
---

[card url="https://www.npmjs.com/package/sqlite3"]

```
npm install --build-from-source
```

```
export LDFLAGS="-L/usr/local/lib"
export CPPFLAGS="-I/usr/local/include -I/usr/local/include/sqlcipher"
export CXXFLAGS="$CPPFLAGS"
npm install sqlite3 --build-from-source --sqlite_libname=sqlcipher --sqlite=/usr/local --verbose
```

```
npm i sqlite3 --unsafe-perm
```

```
node -e 'require("sqlite3")'
```