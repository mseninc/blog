---
title: C# WPF で複数のタグを選択できるコンボボックスを作る
date: 2018-08-10
author: kenzauros
tags: [WPF, C#, .NET]
---

**タグを複数個選択して、文字列として設定できるようなタグ入力用のコントロール** を WPF で作ってみます。イメージは図のような感じです。

> 注意：この記事は過去のブログから移行した記事のため、一部が古い言語仕様になっているほか、バインディングに対応していないというなかなかに役立たずな面があります。ただ、基本的なアイディアとして悪くはないと思うので、紹介しますので、コントロール作成のヒントになれば幸いです。

## 基本設計

### デザイン

- `Popup` 部分が必要なので、ベースのコントロールには `ComboBox` を使用
- タグの一覧は `WrapPanel` を利用して、コンパクトに表示
- 個々のタグは `CheckBox` を利用  
（チェックボックス部分は不要なので、テンプレートをカスタムして、テキストのみにする）
- テキストボックス部分にはカンマ区切りで選択されたタグを表示

### XAML の階層構造

```
ComboBox
  (ComboBox.ItemsPanel)
  WrapPanel
    (ComboBox.ItemContainerStyle)
      Content Presenter
        (ComboBox.ItemTemplate)
        CheckBox
          (CheckBox.Template)
          Border
          TextBlock
```

### タグ管理用のクラス

個々のタグとタグをまとめて管理するコレクションはそれぞれ専用のクラスを作成します。

- 個々のタグ： **`MultiTagBoxItem`**  
`INotifyPropertyChanged` インターフェースを実装し、プロパティの変更が画面に反映されるようにする
- タグのコレクション： **`MultiTagBoxItemCollection`**  
`ObservableCollection<T>` を継承し、要素の変更が画面に反映されるようにする

## つかいかた

### コントロールの作成

1. `MultiTagBoxItem`, `MultiTagBoxItemCollection` というファイル名のクラスファイルを作り、ソースコードをコピペします。
1. 新しい `UserControl` を `MultiTagBox` という名前で作成し、XAML と C# のコードをコピペします。

### 実際に使う

まず、 `MultiTagBox` を使う `Window` の XAML で、作成した `UserControl` の名前空間を定義します。下の例では名前空間が `msen.Controls`、接頭辞が `msen` です。

```xml
<Window x:Class="～～～"
        ～中略～
        xmlns:msen="clr-namespace:msen.Controls"
        >
```

次に実際にコントロールを使うところに `MultiTagBox` を記述します。

```xml
<msen:MultiTagBox x:Name="tagBox" Height="24" Width="280"
                  HorizontalAlignment="Left" VerticalAlignment="Center"
                  DefaultText="タグを選択してください..."
                  />
```

最後に `Window` の C# コードビハインド側でタグリストを設定します。
ここでは、データベースから読み込んだタグの一覧が `tags` に、初期状態で選択しておくタグの一覧が `selectedTag` に格納されていることとします。（いずれも型は `string[]` 型）

```cs
tagBox.ItemsSource = new MultiTagBoxItemCollection(tags);
tagBox.SelectedTags = selectedTags;
```

## ソースコード

各クラスのソースを下記に示す。なお、`MultiTagBox` コントロール（XAML）の1行目のクラス名（`x:Class="msen.Controls.MultiTagBox"`）にある名前空間は適宜変更すること。

### MultiTagBoxItem クラス

```cs
/// <summary>
/// MultiTagBox のタグリストに表示されるタグ項目です。
/// </summary>
public class MultiTagBoxItem : INotifyPropertyChanged
{
  /// <summary>
  /// タグ名を指定して、MultiTagBoxItem のインスタンスを初期化します。
  /// </summary>
  /// <param name="t"></param>
  public MultiTagBoxItem(string t) { Title = t; }

  /// <summary>
  /// タグの文字列
  /// </summary>
  public string Title { get; set; }

  private bool _IsSelected = false;
  /// <summary>
  /// タグが選択されているかどうかを設定または取得します。
  /// </summary>
  public bool IsSelected { get { return _IsSelected; } set { _IsSelected = value; OnPropertyChanged("IsSelected"); } }

  /// <summary>
  /// タグ文字列を返します。
  /// </summary>
  /// <returns></returns>
  public override string ToString()
  {
    return Title;
  }

  #region INotifyPropertyChanged

  public event PropertyChangedEventHandler PropertyChanged;

  protected void OnPropertyChanged(string name)
  {
    if (PropertyChanged != null)
    {
      PropertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(name));
    }
  }

  #endregion
}
```

### MultiTagBoxItemCollection クラス

```cs
/// <summary>
/// MultiTagBox の項目を格納するコレクションです。
/// </summary>
public class MultiTagBoxItemCollection : ObservableCollection<MultiTagBoxItem>
{
  /// <summary>
  /// タグ文字列のリストを指定して、コレクションを初期化します。
  /// </summary>
  /// <param name="nodes"></param>
  public MultiTagBoxItemCollection(IEnumerable<string> nodes)
    : this(nodes.Select(t => new MultiTagBoxItem(t)))
  {
  }

  /// <summary>
  /// MultiTagBoxItem のリストを指定して、コレクションを初期化します。
  /// </summary>
  /// <param name="nodes"></param>
  public MultiTagBoxItemCollection(IEnumerable<MultiTagBoxItem> nodes)
    : base(nodes)
  {
  }

  /// <summary>
  /// 選択されているタグをカンマ区切りで返します。
  /// </summary>
  /// <returns></returns>
  public override string ToString()
  {
    return ToString(", ");
  }

  /// <summary>
  /// 選択されているタグを、指定した区切り文字列で結合して返します。
  /// </summary>
  /// <param name="separater"></param>
  /// <returns></returns>
  public string ToString(string separater)
  {
    var selectedItems = this.Items.Where(t => t.IsSelected).Select(t2 => t2.Title);
    return string.Join(separater, selectedItems);
  }

  /// <summary>
  /// 選択されているタグを、指定した先頭文字列と末尾文字列を付加し、結合して返します。
  /// </summary>
  /// <param name="head"></param>
  /// <param name="tail"></param>
  /// <returns></returns>
  public string ToString(string head, string tail)
  {
    return head + ToString(tail + head) + tail;
  }

  /// <summary>
  /// カンマ区切りのタグ文字列から、リストのタグを選択状態にします。
  /// </summary>
  /// <param name="str"></param>
  public void Restore(string str)
  {
    if (string.IsNullOrEmpty(str))
    {
      var tags = str.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
      tags = Array.ConvertAll(tags, (t) => t.Trim());
      foreach (var item in this)
      {
        item.IsSelected = tags.Contains(item.Title);
      }
    }
  }
}
```

### MultiTagBox コントロール（XAML）

```xml
<UserControl x:Class="msen.Controls.MultiTagBox"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             x:Name="UserControl" mc:Ignorable="d"
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
             Height="22" Width="120">
    <ComboBox
        x:Name="baseComboBox"
        IsReadOnly="True"
        IsEditable="True"
        SnapsToDevicePixels="True"
        Text="{Binding ElementName=UserControl, Path=Text, Mode=TwoWay}"
        ItemsSource="{Binding ElementName=UserControl, Path=ItemsSource}"
        DataContext="{Binding ElementName=UserControl, Path=DataContext}"
        DropDownClosed="baseComboBox_DropDownClosed"
        >
        <!-- ItemsPanel -->
        <ComboBox.ItemsPanel>
            <ItemsPanelTemplate>
                <WrapPanel Width="{Binding ElementName=UserControl, Path=Width}" />
            </ItemsPanelTemplate>
        </ComboBox.ItemsPanel>
        <!-- ItemContainerStyle -->
        <ComboBox.ItemContainerStyle>
            <Style TargetType="ComboBoxItem">
                <Setter Property="Background" Value="Transparent"/>
                <Setter Property="Template">
                    <Setter.Value>
                        <ControlTemplate TargetType="ListBoxItem">
                            <ContentPresenter/>
                        </ControlTemplate>
                    </Setter.Value>
                </Setter>
            </Style>
        </ComboBox.ItemContainerStyle>
        <!-- ItemTemplate -->
        <ComboBox.ItemTemplate>
            <HierarchicalDataTemplate>
                <CheckBox Content="{Binding Title}"
                          IsChecked="{Binding Path=IsSelected, Mode=TwoWay}"
                          Tag="{RelativeSource FindAncestor, AncestorType={x:Type ComboBox} }"
                          Click="CheckBox_Click"
                          Margin="0"
                          Padding="0"
                          Background="Transparent"
                          >
                    <CheckBox.Template>
                        <ControlTemplate>
                            <Border x:Name="Border" Margin="1" Background="{TemplateBinding Background}" Padding="2,0">
                                <TextBlock
                                    x:Name="Presenter"
                                    IsHitTestVisible="False"
                                    VerticalAlignment="Center"
                                    HorizontalAlignment="Left"
                                    Text="{Binding Title}"
                                    Foreground="{x:Static SystemColors.WindowTextBrush}"
                                    TextDecorations="None"
                                    />
                            </Border>
                            <ControlTemplate.Triggers>
                                <Trigger Property="CheckBox.IsChecked" Value="true">
                                    <Setter TargetName="Border" Property="Background" Value="SkyBlue"/>
                                    <Setter TargetName="Presenter" Property="TextDecorations" Value="None"/>
                                </Trigger>
                                <Trigger Property="IsMouseOver" Value="true">
                                    <Setter TargetName="Presenter" Property="TextDecorations" Value="Underline"/>
                                </Trigger>
                            </ControlTemplate.Triggers>
                        </ControlTemplate>
                    </CheckBox.Template>
                </CheckBox>
            </HierarchicalDataTemplate>
        </ComboBox.ItemTemplate>
    </ComboBox>
</UserControl>
```

### MultiTagBox コントロール（C#）

```cs
/// <summary>
/// MultiTagBox.xaml の相互作用ロジック
/// </summary>
public partial class MultiTagBox : UserControl
{
  public MultiTagBox()
  {
    InitializeComponent();
  }

  #region 依存関係プロパティ

  /// <summary>
  /// 選択候補のタグ一覧のコレクションを設定または取得します。
  /// </summary>
  public IEnumerable ItemsSource
  {
    get { return (IEnumerable)GetValue(ItemsSourceProperty); }
    set
    {
      SetValue(ItemsSourceProperty, value);
      Items.ToList().ForEach(t => { t.PropertyChanged += new System.ComponentModel.PropertyChangedEventHandler(tagBoxItem_PropertyChanged); });
      SetText();
    }
  }

  public static readonly DependencyProperty ItemsSourceProperty =
      DependencyProperty.Register("ItemsSource", typeof(IEnumerable), typeof(MultiTagBox), new UIPropertyMetadata(null));

  /// <summary>
  /// 表示されている文字列
  /// </summary>
  public string Text
  {
    get { return (string)GetValue(TextProperty); }
    private set { SetValue(TextProperty, value); }
  }

  public static readonly DependencyProperty TextProperty =
      DependencyProperty.Register("Text", typeof(string), typeof(MultiTagBox), new UIPropertyMetadata(string.Empty));


  /// <summary>
  /// デフォルトの文字列
  /// </summary>
  public string DefaultText
  {
    get { return (string)GetValue(DefaultTextProperty); }
    set { SetValue(DefaultTextProperty, value); }
  }

  public static readonly DependencyProperty DefaultTextProperty =
        DependencyProperty.Register("DefaultText", typeof(string), typeof(MultiTagBox), new UIPropertyMetadata(string.Empty));

  #endregion

  #region タグ操作

  /// <summary>
  /// ItemsSource を MultiTagBoxItemCollection として取得します。
  /// </summary>
  public MultiTagBoxItemCollection Items
  {
    get
    {
      if (this.ItemsSource == null) // なければ作る
      {
        this.ItemsSource = new MultiTagBoxItemCollection(new string[] { });
      }
      return (this.ItemsSource as MultiTagBoxItemCollection);
    }
  }

  /// <summary>
  /// 指定した文字列をタグ一覧に加えます。
  /// </summary>
  /// <param name="tag"></param>
  /// <param name="isSelected"></param>
  public void AddItem(string tag, bool isSelected = true)
  {
    var item = new MultiTagBoxItem(tag) { IsSelected = isSelected };
    item.PropertyChanged += new System.ComponentModel.PropertyChangedEventHandler(tagBoxItem_PropertyChanged);
    Items.Add(item);
    SetText();
  }

  /// <summary>
  /// 選択されているタグの一覧を設定または取得します。
  /// </summary>
  public IEnumerable<string> SelectedTags
  {
    get { return Items.Where(t => t.IsSelected).Select(t2 => t2.Title).ToList(); }
    set
    {
      Items.ToList().ForEach((t) =>
      {
        if (value.Any((t2) => t2.Equals(t.Title)))
        {
          t.IsSelected = true;
        }
      });
      SetText();
    }
  }

  #endregion

  #region タグ選択変更時の動作

  /// <summary>
  /// タグの選択内容をテキストボックスに反映します。
  /// </summary>
  private void SetText()
  {
    this.Text = (this.ItemsSource != null) ? this.ItemsSource.ToString() : this.DefaultText;

    if (string.IsNullOrEmpty(this.Text))
    {
      this.Text = this.DefaultText;
    }
  }

  private void CheckBox_Click(object sender, RoutedEventArgs e)
  {
    SetText();
  }

  private void baseComboBox_DropDownClosed(object sender, EventArgs e)
  {
    SetText();
  }

  private void tagBoxItem_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
  {
    SetText();
  }

  #endregion
}
```
