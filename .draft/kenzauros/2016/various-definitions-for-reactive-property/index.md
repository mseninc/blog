---
title: "[TODO] ReactiveProperty の定義をいろいろまとめてみた"
date: 2016-06-07
author: kenzauros
tags: [WPF, MVVM, ReactiveProperty, その他]
---

## 主なクラス

まずよく使うクラスの一覧です。

### プロパティ (ReactiveProperty)
```
ReactiveProperty<T>
ReadOnlyReactiveProperty<T>
```

### コレクション (ReactiveCollection)
```
ReactiveCollection<T>
ReadOnlyReactiveCollection<T>
```

### コマンド (ReactiveCommand)
```
ReactiveCommand
ReactiveCommand<T>
```

## Model → ViewModel

### ReactiveProperty.FromObject

もっとも単純なのは `ReactiveProperty.FromObject` を使うことです。

```
this.SomeProp = ReactiveProperty.FromObject(model, x => x.SomeProp)
```
これで ViewModel の `this.SomeProp` が `model.SomeProp` にリンクしたような形になり、最初に Model 側の値が ViewModel 側に代入されます。その後、 ViewModel 側の値が更新されると `model.SomeProp` の値が更新されます。

ただし、モデルは変更を通知しないため、__`model.SomeProp` を更新しても ViewModel 側の `this.SomeProp` は変わりません__。


## Tips

### 名前空間の using を忘れずに

```
using System.Linq;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using Reactive.Bindings;
using Reactive.Bindings.Extensions;
```


Records.CollectionChangedAsObservable().Select(x => GetDirtyRecords().Count() > 0).ToReactiveCommand(false);