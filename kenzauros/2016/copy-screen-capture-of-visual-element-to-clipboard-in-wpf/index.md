---
title: WPF で 画面要素のスクリーンキャプチャをクリップボードにコピーする
date: 2016-08-04
author: kenzauros
tags: [WPF, XAML, C#, .NET]
---

WPF で画面に表示されている要素をそのままキャプチャーしたい場合ってありますよね。

しかも、「キャプチャーした画像を Ctrl + C でできるようにして！」とか。わがままだなぁ。

というわけで、そんなときに役立つスニペットを紹介します。

## 要素の内容をキャプチャーしてクリップボードにコピー

### ソースコード

とにもかくにも全体像から。今回は MainWindow のコードビハインドの中に書いています。

ちなみにここでは実行用　コマンドに [ReactiveProperty](https://github.com/runceel/ReactiveProperty) の ReactiveCommand を使っていますが、 ICommand を継承したクラスであればなんでもかまいません。

```csharp
public partial class MainWindow : Window
{
	// 描画されている画像コンテナの内容をキャプチャーしてクリップボードにコピーするコマンド
	public ReactiveCommand CaptureRenderedImageCommand { get; } = new ReactiveCommand();

	public MainWindow()
	{
		InitializeComponent();

		// 描画されている画像コンテナの内容をキャプチャーしてクリップボードにコピー
		CaptureRenderedImageCommand
			.Subscribe(_ =>
			{
				var visual = imageContainer;
				var bounds = VisualTreeHelper.GetDescendantBounds(visual);
				var bitmap = new RenderTargetBitmap(
					(int)bounds.Width,
					(int)bounds.Height,
					96.0,
					96.0,
					PixelFormats.Pbgra32);
				var dv = new DrawingVisual();
				using (var dc = dv.RenderOpen())
				{
					var vb = new VisualBrush(visual);
					dc.DrawRectangle(vb, null, bounds);
				}
				bitmap.Render(dv);
				bitmap.Freeze();
				Clipboard.SetImage(bitmap);
			});
		// Ctrl + C キーバインドの追加
		var keyBinding = new KeyBinding(CaptureRenderedImageCommand,
			new KeyGesture(Key.C, ModifierKeys.Control));
		InputBindings.Add(keyBinding);
	}
}
```

ここで imageContainer は WPF の画面に表示されるヴィジュアル要素 (Visual クラスを継承した要素) ならなんでもいいので、たとえば下記のように XAML の Name 属性で指定した名前を使います。

```xaml
<Grid Name="imageContainer">
```

### ビットマップに Visual を描画する RenderTargetBitmap

肝は [RenderTargetBitmap](https://msdn.microsoft.com/ja-jp/library/system.windows.media.imaging.rendertargetbitmap%28v=vs.110%29.aspx?f=255&MSPPError=-2147217396) クラスです。「描画の対象となるビットマップ」。BitmapSource クラスの派生ですので、 WPF で扱いやすいですね。

RenderTargetBitmap の Render に要素を渡すだけでもキャプチャーできることもあるんですが、要素が拡大縮小されていたり、 LayoutTransform が設定されていたりなんかすると、**描画したときにサイズが違ったり、位置がずれたり、ということが起こります。**

ということで下記の記事で紹介されている DrawingVisual を使う手法を採用します。

[card url="https://blogs.msdn.microsoft.com/jaimer/2009/07/03/rendertargetbitmap-tips/"]

まず、VisualTreeHelper.GetDescendantBounds で描画されている箱の位置・サイズを取得し、
```csharp
var bounds = VisualTreeHelper.GetDescendantBounds(visual);
```
RenderTargetBitmap をそのサイズで初期化します。
```csharp
var bitmap = new RenderTargetBitmap(
	(int)bounds.Width,
	(int)bounds.Height,
	96.0,
	96.0,
	PixelFormats.Pbgra32);
```
DrawingVisual をインスタンス化して RenderOpen で DrawingContext (dc) を開き、要素の VisualBrush を作ったあと dc に bounds を指定して、描画します。
```
var dv = new DrawingVisual();
using (var dc = dv.RenderOpen())
{
	var vb = new VisualBrush(visual);
	dc.DrawRectangle(vb, null, bounds);
}
```
得られた DrawingVisual を Render メソッドに渡せばビットマップに描画されます。
```csharp
bitmap.Render(dv);
```
Freeze で変更を不可能に設定して終了です。
```csharp
bitmap.Freeze();
```

### 画像をクリップボードに設定する Clipboard.SetImage

作成した RenderTargetBitmap のインスタンスをクリップボードにコピーします。

Clipboard.SetImage に作成したインスタンス (BitmapSource を継承していれば何でもいい) を渡せば OK です。
```csharp
Clipboard.SetImage(bitmap);
```
悩むところもありません。

### Ctrl + C で実行できるようにする

実行したいコマンドを指定して KeyBinding クラスのインスタンスを作成し、

```csharp
var keyBinding = new KeyBinding(CaptureRenderedImageCommand,
		new KeyGesture(Key.C, ModifierKeys.Control));
```

InputBindings に追加しましょう。

```csharp
InputBindings.Add(keyBinding);
```

## LayoutTransform を適用している場合

すでに述べたように LayoutTransform などで要素の見た目を拡大縮小したり変形させたりしている場合は注意が必要です。

これまでの方法でうまくいかない場合、必要であれば下記のように LayoutTransform を一時的に無効にしてみましょう。

```csharp
// LayoutTransform を一時的に無効にする
var transform = visual.LayoutTransform;
visual.LayoutTransform = null;
visual.UpdateLayout();
// ここで Render 処理
// LayoutTransform を戻す
visual.LayoutTransform = transform;
visual.UpdateLayout();
```

## コードビハインドの憂鬱

コマンドをコードビハインドに書いているあたり、 ViewModel にまとめたいなーと思ったりなんかするわけですが、今回の処理は完全にビュー側だけで完結しているので、まぁいいんじゃないかなと思っています。

ただ、キャプチャーした画像を ViewModel 側で使いたい場合や保存先を指定してファイルに書き出す場合などは微妙になってくるので、ViewModel にどうやって渡すのかを考える必要があるのかもしれません。

MVVM の憂鬱ですね(笑)