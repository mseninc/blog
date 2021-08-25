---
title: SubDirectory
date: "2015-05-01T22:12:03.284Z"
description: "SubDirectory"
tags: ["Node.js", "Gatsby.js"]
author: kenzauros
---

Hogehoge


`const a = b();`

`https://msen.jp`

https://msen.jp

```:title=hogehoge.js
const a = b();
const a = b();
const a = b();
const a = b();
const a = b();
```

```jsx{numberLines:true}
const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
}) => (
  <div>
    <Helmet title={`Tags | ${title}`} />
    <div>
      <h1>Tags</h1>
      <ul>
        {group.map(tag => (
          <li key={tag.fieldValue}>
            <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
              {tag.fieldValue} ({tag.totalCount})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
)
```

```js{numberLines:true}{4,8-9}:title=hogehoge.js
const a = b();
const a = b();
const a = b();
const a = b();
const a = b();
const a = b();
const a = b();
```

```js:title=hogehoge.js
const a = b();
const a = b();
const a = b();
const a = b();
const a = b(); // highlight-line
const a = b();
const a = b();
const a = b();
const a = b();
const a = b();
```
