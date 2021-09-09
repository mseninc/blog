---
title: "[TODO] EF6 CodeFirst で更新日時列を追加する"
date: 2016-07-24
author: kenzauros
tags: [その他]
---

/// <summary>
/// ID
/// </summary>
[Key]
public int Id { get; set; }
/// <summary>
/// 更新日時
/// </summary>
[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
public DateTime? DateModified { get; set; }
