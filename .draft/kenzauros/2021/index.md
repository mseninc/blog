---
title: No Title
date: 2021-08-20
author: kenzauros
tags: [その他]
---

`gatsby-node.js`
```
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode })

    const value = slug.match(/([^/]+)\/$/)
      ? `/${RegExp.$1}/`
      : slug;

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
```

```
  if (posts.length > 0) {
    function getDuplicateSlugs(posts) {
      const counts = posts.reduce(
        (p, c) => ({ ...p, [c.fields.slug]: (p[c.fields.slug] || 0) + 1 }), {});
      const duplicates = Object.keys(counts).filter(x => counts[x] > 1);
      return duplicates.length > 0 ? duplicates : null;
    }
    const duplicateSlugs = getDuplicateSlugs(posts);
    if (duplicateSlugs) {
      reporter.panicOnBuild(
        `Duplicate slugs detected`,
        { duplicateSlugs }
      )
    }
```