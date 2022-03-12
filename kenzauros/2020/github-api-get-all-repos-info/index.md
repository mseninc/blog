---
title: GitHub API で特定の user/organization のすべてのリポジトリ情報を取得する
date: 2020-01-27
author: kenzauros
tags: [Node.js, GitHub, Web]
---

標題のとおり、 **GitHub API で特定の user/organization のすべてのリポジトリ情報**を取得します。

環境は Node.js 12 を利用します。

## 前提条件

- Node.js v12.13.0
- GitHub の [Personal Access Token](https://github.com/settings/tokens) を取得済み (public リポジトリの情報のみを取得する場合は不要)

## GitHub API について

現在 **GitHub API は v3** になっています。リファレンスは下記のとおりです。

- [GitHub API v3 | GitHub Developer Guide](https://developer.github.com/v3/)

リポジトリ情報を取得するには Repositories ページを参照します。

- [ユーザーのリポジトリ一覧](https://developer.github.com/v3/repos/#list-user-repositories)
- [組織のリポジトリ一覧](https://developer.github.com/v3/repos/#list-organization-repositories)

ユーザーと組織のリポジトリ一覧は下記のような URL で取得できることがわかります。

- `https://api.github.com/users/<ユーザー名>/repos`
- `https://api.github.com/orgs/<組織名>/repos`

上記のようにユーザーと組織は若干 URL が異なるのみです。

## API を試す

試しにユーザーと組織について API をブラウザーで開いて結果を取得してみます。

- [https://api.github.com/users/kenzauros/repos](https://api.github.com/users/kenzauros/repos)
- [https://api.github.com/orgs/vuejs/repos](https://api.github.com/orgs/vuejs/repos)

いずれも下記のような JSON が得られます。

```js
[
  {
    "id": 11730342,
    "node_id": "MDEwOlJlcG9zaXRvcnkxMTczMDM0Mg==",
    "name": "vue",
    "full_name": "vuejs/vue",
    "private": false,
    "owner": { ... },
    "html_url": "https://github.com/vuejs/vue",
    "description": "🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
    "fork": false,
    "url": "https://api.github.com/repos/vuejs/vue",
    ...
    "created_at": "2013-07-29T03:24:51Z",
    "updated_at": "2020-01-18T03:16:27Z",
    "pushed_at": "2020-01-18T03:01:08Z",
    "git_url": "git://github.com/vuejs/vue.git",
    "ssh_url": "git@github.com:vuejs/vue.git",
    "clone_url": "https://github.com/vuejs/vue.git",
    "svn_url": "https://github.com/vuejs/vue",
    "homepage": "http://vuejs.org",
    "size": 28015,
    "stargazers_count": 155803,
    "watchers_count": 155803,
    "language": "JavaScript",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 23435,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 428,
    "license": { ... },
    "forks": 23435,
    "open_issues": 428,
    "watchers": 155803,
    "default_branch": "dev",
    "permissions": {
      "admin": false,
      "push": false,
      "pull": true
    }
  },
  ...
]
```

一部省略していますが、**レスポンスは配列になっており、それぞれの要素が各リポジトリ**に対応します。

また、**リポジトリが1回のリクエストに収まらない場合は、 HTTP のレスポンスヘッダーに次のような `Link` ヘッダーが含まれます**。

```
Link: <https://api.github.com/organizations/6128107/repos?page=2>; rel="next", <https://api.github.com/organizations/6128107/repos?page=4>; rel="last"
```

1回のリクエストで取得できる数を指定できないため、基本的にはこの **`Link` ヘッダーにある `rel="next"` の URL を順次取得して、すべての情報を取得していく**必要があります。

この next の URL は最初にリクエストした API の URL とは異なるので注意が必要です。

## Node.js サンプルスクリプト

Node.js で [axios](https://github.com/axios/axios) パッケージを使って、 REST API からのデータを取得します。

- [GitHub API で特定の user/organization のすべてのリポジトリ情報を取得する - gist](https://gist.github.com/kenzauros/89ef31ad231e7efb62e4dcc6ce3bf695)

```js
const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = '<GitHub API Token>';

// Prepare axios for GitHub API
const axiosBase = require('axios');
const github = axiosBase.create({
  baseURL: GITHUB_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `token ${GITHUB_TOKEN}`,
  },
  responseType: 'json',
});

/**
 * Gets a list of repos in GitHub.
 * @param {String} ownerType Resource type of owner (orgs|users)
 * @param {String} owner Owner name
 */
async function getGithubRepos(ownerType, owner) {
  let url = `${ownerType}/${owner}/repos?sort=full_name`;
  const array = [];
  while (url) {
    const { next, data } = await getGithubReposPage(url);
    if (data) array.push(data);
    url = next;
  }
  return array.flat();
}

async function getGithubReposPage(url) {
  const result = await github.get(url);
  let next = null;
  if (result.headers && result.headers.link) {
    // extract next url from "link" header
    const matches = /\<([^<>]+)\>; rel\="next"/.exec(result.headers.link);
    if (matches) {
      next = matches[1];
    }
  }
  const data = result.data || null;
  return {
    next,
    data,
  };
}

// demo
(async () => {
  const kenzaurosRepos = await getGithubRepos('users', 'kenzauros');
  console.log(kenzaurosRepos);
  const vuejsRepos = await getGithubRepos('orgs', 'vuejs');
  console.log(vuejsRepos);
})();
```

※認証トークンを使わない場合は `GITHUB_TOKEN` の宣言 (2行目) と `Authorization` ヘッダー (10行目) を削除してください。

最後のほうに書いたように **`await getGithubRepos('users', 'kenzauros')`** のように書くことで、「ユーザー kenzauros のリポジトリ一覧」を取得できます。

`getGithubRepos` でやっていることは単純で **`rel="next"` を含む `Link` ヘッダーがなくなるまで、繰り返し問い合わせ**していくだけです。

どなたかの助けになれば幸いです。
