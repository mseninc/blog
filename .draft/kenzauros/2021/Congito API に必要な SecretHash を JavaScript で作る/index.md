---
title: Congito API に必要な SecretHash を JavaScript で作る
date: 2021-05-31
author: kenzauros
tags: [その他, ライフハック]
---

```js
function computeSecretHash(username, clientId, secretKey) {
  const crypto = require('crypto')
  const hmac = crypto .createHmac('sha256', secretKey)
  const payload = `${username}${clientId}`
  return hmac.update(payload).digest('base64')
}
```

```js
const computeSecretHash = (username, clientId, secretKey)
  => require('crypto').createHmac('sha256', secretKey)
    .update(`${username}${clientId}`)
    .digest('base64')
```