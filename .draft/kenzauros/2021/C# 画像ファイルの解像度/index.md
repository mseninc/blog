---
title: C# 画像ファイルの解像度
date: 2021-08-17
author: kenzauros
tags: [その他]
---

<!-- wp:paragraph --><br />        public static System.Windows.Size LoadImageResolution(string filePath)<br />        {<br />            using FileStream file = File.OpenRead(filePath);<br />            using var image = System.Drawing.Image.FromStream(file, false, false);<br />            return new System.Windows.Size(image.Width, image.Height);<br />        }<br /><!-- /wp:paragraph -->