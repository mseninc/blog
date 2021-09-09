---
title: Nuxt.js で axios についたデフォルトの request headers を削除する
date: 2021-05-31
author: kenzauros
tags: [その他, ライフハック]
---

[Extending axios - Axios Module](https://axios.nuxtjs.org/extend/#new-axios-instance)
```
        const axios = this.$axios.create()
        delete axios.defaults.headers.common // Remove default headers including Authorization
        const { data: blob } = await axios.request({
          url,
          method: 'GET',
          responseType: 'blob',
          cancelToken: cancelTokenSource.token,
        })

```