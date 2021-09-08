---
title: "[TODO] WPF の Image でアンチエイリアスのアルゴリズムを変更するには"
date: 2021-05-31
author: kenzauros
tags: [その他, ライフハック]
---

                                <Image Source="{Binding DisplaySourceImage.Value}" Name="sourceImage"
                                       RenderOptions.BitmapScalingMode="NearestNeighbor" Stretch="None"/>
[image - How can I stretch bitmap in WPF without smoothing pixels - Stack Overflow](http://stackoverflow.com/questions/2381012/how-can-i-stretch-bitmap-in-wpf-without-smoothing-pixels)

RenderOptions.SetBitmapScalingMode(imageDisplay, BitmapScalingMode.NearestNeighbor);