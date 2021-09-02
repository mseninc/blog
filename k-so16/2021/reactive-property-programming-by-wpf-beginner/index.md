---
title: WPF 初心者が ReactiveProperty を使ってみた
date: 2021-05-04
author: k-so16
tags: [WPF, C#, ReactiveProperty, .NET, .NET Framework]
---

こんにちは。最近、 27 歳の誕生日を迎えた k-so16 です。 27 という数字は 3<sup>3</sup> と、底と指数ともに 3 で共通していて特別な数字だなと感じています(笑)

WPF を利用して Windows のプログラムの作成に取り組んでいるのですが、 UI コンポーネントとデータを **MVVM** のように制御したいと思い、 **[Reactive Property](https://github.com/runceel/ReactiveProperty)** を利用してみることにしました。

私自身、 WPF での開発経験がなく ReactiveProperty も初めて触ったので、 WPF の UI コンポーネントとデータをバインドするための基本的な書き方を把握するのも苦労しました。

本記事では、 WPF で ReactiveProperty を利用する基礎的な方法を紹介します。

本記事の想定する読者層は以下の通りです。

- C# の基礎的な知識を有している
- MVVM に関する基礎知識を有している
- WPF での開発経験がほとんどない

## 開発環境

本記事で想定する開発環境は以下の通りです。

- Visual Studio 2019
- .NET 5.0
- ReactiveProperty 7.8.3

## ReactiveProperty とは

ReactiveProperty は WPF において **MVVM** を実現するためのサードパーティ製のライブラリです。画面での変更をモデルに反映したり、逆にモデルの変更を検知して画面に反映するといった処理を簡単に記述できます。

MVVM のアーキテクチャを採用している有名なフレームワークに **[Vue.js](https://vuejs.org/)** があります。 Vue.js に馴染みのある方なら、 ReactiveProperty の便利さが容易に想像できることと思います。

## WPF プロジェクトの作成

Visual Studio から WPF のプロジェクトを作成する方法を説明します。

まず Visual Studio を開き、 **新しいプロジェクトの作成** を選択し、プロジェクトのテンプレート一覧から **WPF アプリケーション** を選択ます。

[caption id="attachment_16227" align="aligncenter" width="800"]<a href="images/reactive-property-programming-by-wpf-beginner-1.png"><img src="images/reactive-property-programming-by-wpf-beginner-1.png" alt="" width="800" height="531" class="size-full wp-image-16227" /></a> Visual Studio の起動画面[/caption]

[caption id="attachment_16228" align="aligncenter" width="800"]<a href="images/reactive-property-programming-by-wpf-beginner-2.png"><img src="images/reactive-property-programming-by-wpf-beginner-2.png" alt="" width="800" height="531" class="size-full wp-image-16228" /></a> テンプレートの選択画面[/caption]

プロジェクト名やプロジェクトの保存先の設定画面に遷移したら、それぞれの項目について設定を行います。ソリューション名はプロジェクト名を入力すると自動的に入力されます。

[caption id="attachment_16229" align="aligncenter" width="800"]<a href="images/reactive-property-programming-by-wpf-beginner-3.png"><img src="images/reactive-property-programming-by-wpf-beginner-3.png" alt="" width="800" height="531" class="size-full wp-image-16229" /></a> プロジェクト名の入力画面[/caption]

追加情報は特に変更する必要はないので、 **作成** ボタンを押します。これで WPF プロジェクトの作成が完了します。

[caption id="attachment_16230" align="aligncenter" width="800"]<a href="images/reactive-property-programming-by-wpf-beginner-4.png"><img src="images/reactive-property-programming-by-wpf-beginner-4.png" alt="" width="800" height="531" class="size-full wp-image-16230" /></a> 追加情報の設定画面[/caption]

## ReactiveProperty のインストール

ソリューションエクスプローラーから、 **依存関係** を右クリックし、 **NuGet パッケージの管理** を選択します。

[caption id="attachment_16231" align="aligncenter" width="351"]<a href="images/reactive-property-programming-by-wpf-beginner-5.png"><img src="images/reactive-property-programming-by-wpf-beginner-5.png" alt="" width="351" height="259" class="size-full wp-image-16231" /></a> 依存関係のコンテキストメニューから NuGet パッケージの管理を選択[/caption]

**参照** タブを選択し、 **ReactiveProperty** と検索してください。検索結果の一番上に **ReactiveProperty** と表示されるはずなので、それを選択してインストールします。特に事情がなければ最新版をインストールしましょう。

[caption id="attachment_16232" align="aligncenter" width="800"]<a href="images/reactive-property-programming-by-wpf-beginner-6.png"><img src="images/reactive-property-programming-by-wpf-beginner-6.png" alt="" width="800" height="384" class="size-full wp-image-16232" /></a> ReactiveProperty を検索[/caption]

[caption id="attachment_16233" align="aligncenter" width="523"]<a href="images/reactive-property-programming-by-wpf-beginner-7.png"><img src="images/reactive-property-programming-by-wpf-beginner-7.png" alt="" width="523" height="607" class="size-full wp-image-16233" /></a> ReactiveProperty のインストール設定画面[/caption]

## View の編集

画面の UI の配置は **`MainWindow.xaml`** を編集します。 Visual Studio で `MainWindow.xaml` を開くと、上半分に画面のプレビューが、下半分に **XAML** と呼ばれる、ビューの UI の配置などを定義するための XML 形式の Markup が表示されます。

[caption id="attachment_16266" align="aligncenter" width="800"]<a href="images/reactive-property-programming-by-wpf-beginner-8.png"><img src="images/reactive-property-programming-by-wpf-beginner-8.png" alt="" width="800" height="475" class="size-full wp-image-16266" /></a> XAML の編集画面[/caption]

入力用の `TextBox` と出力用の `Label` をビューに配置してみましょう。 `MainWindow.xaml` の `Grid` の中を以下のように編集します。

```xml
<Grid>
  <Grid.RowDefinitions>
    <RowDefinition Height="*"/>
    <RowDefinition Height="*"/>
  </Grid.RowDefinitions>
  <TextBox Text="これは入力用の TextBox です。" Width="400" Height="40" Grid.Row="0"/>
  <Label Content="これは出力用の Label です。" Height="40" Width="400" Grid.Row="1"/>
</Grid>
```

画面のプレビューが以下の画像のように表示されるはずです。

[caption id="attachment_16235" align="aligncenter" width="800"]<a href="images/reactive-property-programming-by-wpf-beginner-9.png"><img src="images/reactive-property-programming-by-wpf-beginner-9.png" alt="" width="800" height="475" class="size-full wp-image-16235" /></a> コード例を実装したときのプレビュー画面[/caption]

デバッグ実行すると、実際に動作する際の画面が確認できます。

[caption id="attachment_16234" align="aligncenter" width="800"]<a href="images/reactive-property-programming-by-wpf-beginner-10.png"><img src="images/reactive-property-programming-by-wpf-beginner-10.png" alt="" width="800" height="450" class="size-full wp-image-16234" /></a> デバッグの実行画面[/caption]

## ViewModel の作成

ビューとデータをバインドするための `ViewModel` クラスを作成します。本記事では `ViewModels` フォルダーを作成し、その中に `ViewModel` クラスを作成することとします。

作成手順は次の通りです。

1. **プロジェクトを右クリック** して「**追加**」を選択し「**新しいフォルダー**」を選択
    - フォルダー名を `ViewModels` として作成

    [caption id="attachment_16239" align="aligncenter" width="645"]<a href="images/reactive-property-programming-by-wpf-beginner-11.png"><img src="images/reactive-property-programming-by-wpf-beginner-11.png" alt="" width="645" height="631" class="size-full wp-image-16239" /></a> フォルダーの作成[/caption]

1. **`ViewModels` フォルダーを右クリック** して「**追加**」を選択し「**クラス**」を選択

    [caption id="attachment_16240" align="aligncenter" width="637"]<a href="images/reactive-property-programming-by-wpf-beginner-12.png"><img src="images/reactive-property-programming-by-wpf-beginner-12.png" alt="" width="637" height="326" class="size-full wp-image-16240" /></a> クラスの新規作成[/caption]

1. `ViewModel.cs` という名前で C# クラスファイルを作成

    [caption id="attachment_16241" align="aligncenter" width="800"]<a href="images/reactive-property-programming-by-wpf-beginner-13.png"><img src="images/reactive-property-programming-by-wpf-beginner-13.png" alt="" width="800" height="555" class="size-full wp-image-16241" /></a> 新規作成のメニュー画面[/caption]

`ViewModel` クラスのファイルを作成したら、クラスファイルを選択して編集画面を開きます。 `ViewModel` クラスの作成の流れは次の通りです。

1. `ReactiveProperty<T>` のプロパティを作成
1. コンストラクタで `ReactiveProperty<T>` のインスタンスを設定
    - View や Model からデータを変更されるものは `ReactiveProperty<T>` のインスタンスを作成
    - あるデータの変更にあわせて値を再計算する場合は `ToReactiveProperty<T>()` メソッドを利用

実際にコード例を見てみましょう。以下のコードは入力フォームのデータを監視するための `InputValue` と、出力用のデータを監視するための `OutputValue` を設定した例です。

```cs
using Reactive.Bindings;

namespace MyFirstWpfApp.ViewModels
{
    class ViewModel
    {
        public ReactiveProperty<string> InputValue { get; }
        public ReactiveProperty<string> OutputValue { get; }

        public ViewModel()
        {
            InputValue = new ReactiveProperty<string>();
            OutputValue = InputValue.ToReactiveProperty();
        }
    }
}
```

`InputValue`, `OutputValue` ともに監視するデータ型は `string` なので、 `ReactiveProperty<string>` 型のプロパティとして宣言しています。

`InputValue` は **フォームの値が変更されたことを監視する** ために `ReactiveProperty<string>` のインスタンスをコンストラクタから生成しています。一方で、 `OutputValue` は `InputValue` のデータに依存して値を求めるので、 `InputValue` のインスタンスが持つ `ToReactiveProperty()` メソッドを利用しています。

上記の例では、 `OutputValue` のデータは `InputValue` のデータの値がそのまま反映されますが、なんらかの変換処理をはさみたい場合は、 `Select()` メソッドを利用します。 LINQ の `Select()` と同様に、引数にラムダ式を指定することで、任意の変換処理を実行した結果を求めることもできます。

```cs
OutputValue = InputValue.Select(x => x.ToUpper()).ToReactiveProperty();
```

## バインディングの設定

`ViewModel` クラスを作成したら、データとビューの **バインディング** を設定します。バインディングするためには、 `ViewModel` のインスタンスをビューのプロパティに設定し、ビューのプロパティに `ViewModel` クラスで定義した `ReactiveProperty` のプロパティをバインドします。

まず `ViewModel` のインスタンスをビューにバインドするために `MainWindow` クラスのコンストラクタで `DataContext` プロパティに `ViewModel` のインスタンスを設定します。 `MainWindow.xaml.cs` を以下にように編集します。

```cs
using MyFirstWpfApp.ViewModels;
using System.Windows;

namespace MyFirstWpfApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new ViewModel();
        }
    }
}
```

次に、ビューの各コンポーネントにそれぞれデータバインディングを設定します。 `ReactiveProperty` のプロパティをビューにバインドする際には、 `ReactiveProperty` のプロパティそのものではなく、 `Value` プロパティをビューに対してバインドします。

今回は `TextBox` と `Label` に対してそれぞれ `InputValue` と `OutputValue` をバインドします。先ほど `MainWindow.xaml` に追加した `TextBox` と `Label` を以下のように編集してください。

```xml
<TextBox Text="{Binding InputValue.Value, UpdateSourceTrigger=PropertyChanged}" Width="400" Height="40" Grid.Row="0"/>
<Label Content="{Binding OutputValue.Value}" Height="40" Width="400" Grid.Row="1"/>
```

`TextBox` の `Binding` の後ろに記述されている `UpdateSourceTrigger=PropertyChanged` は、フォームの値が変更されたら即時に変更内容を反映します。

実際に実行すると、 `TextBox` に入力された内容が `Label` に自動的に反映されることを確認できるはずです。

[caption id="attachment_16263" align="aligncenter" width="800"]<a href="images/reactive-property-programming-by-wpf-beginner-14.gif"><img src="images/reactive-property-programming-by-wpf-beginner-14.gif" alt="" width="800" height="450" class="size-full wp-image-16263" /></a> 実際の動作の確認[/caption]

ReactiveProperty を利用することで、手軽に簡単に MVVM のように UI コンポーネントとデータを制御できました。複雑な WPF アプリケーションを開発するには、 ReactiveProperty は不可欠といっても過言ではないですね(笑)

## まとめ

本記事のまとめは以下の通りです。

- ReactiveProperty についての概要の紹介
- 簡単な例を用いた ReactiveProperty の基本的な使い方の説明

以上、 k-so16 でした。 ReactiveProperty が使いこなせるようになれば、より WPF の開発をスムーズに行えそうですね (笑)