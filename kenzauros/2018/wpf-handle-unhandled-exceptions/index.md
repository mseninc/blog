---
title: WPF アプリケーションの未処理例外をまとめて捕捉するスニペット
date: 2018-02-01
author: kenzauros
tags: [WPF, C#, .NET]
---

WPF や UWP に限った話ではないですが、試作状態からアプリケーションを作っていると例外処理が後回しになりがちです。

アプリ内で完全に処理しきるのが理想ですが、どうしても捕捉できなかった例外も発生しますし、いざというときのために最後のトラップを仕掛けておくのは、デバッグのためにも重要です。

しかし、この**未処理例外の処理**というのも意外と書くのが面倒なので、今回はスニペットにまとめました。

## 未処理例外の処理

WPF における未処理例外の処理方法は @IT の下記の記事が有名です。

- [WPF：例外をまとめてトラップするには？［C#／VB］：.NET TIPS - ＠IT](http://www.atmarkit.co.jp/ait/articles/1512/16/news026.html)

この記事は非常に詳しく説明されていてためになるのですが、さっさと実装したいときには、記事のあちこちからコード片を収集する必要があるので(笑)、けっこう面倒だったりします。

## コードスニペット

というわけで、整理してまとめたものが今回のスニペットです。

下記の 3 つのイベントを処理しています。

- **App.DispatcherUnhandledException** (UI スレッド)
- **TaskScheduler.UnobservedTaskException** (バックグラウンドスレッド)
- **AppDomain.CurrentDomain.UnhandledException** (最後の砦)

**`App.xaml` のコードビハインド `App.xaml.cs` に下記の必要な部分をコピペ**すれば完了です。

ロギングには [log4net](https://logging.apache.org/log4net/) を使っていますが、環境にあったものに変えてください。

```csharp
/// <summary>
/// App.xaml の相互作用ロジック
/// </summary>
public partial class App : Application
{
    // 適当なログ記録オブジェクト
    // public static readonly log4net.ILog Logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

    public App()
    {
        // 未処理例外の処理
        // UI スレッドで実行されているコードで処理されなかったら発生する（.NET 3.0 より）
        DispatcherUnhandledException += App_DispatcherUnhandledException;
        // バックグラウンドタスク内で処理されなかったら発生する（.NET 4.0 より）
        TaskScheduler.UnobservedTaskException += TaskScheduler_UnobservedTaskException;
        // 例外が処理されなかったら発生する（.NET 1.0 より）
        AppDomain.CurrentDomain.UnhandledException  += CurrentDomain_UnhandledException;
    }

    /// <summary>
    /// UI スレッドで発生した未処理例外を処理します。
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void App_DispatcherUnhandledException(object sender, System.Windows.Threading.DispatcherUnhandledExceptionEventArgs e)
    {
        var exception = e.Exception as Exception;
        if (ConfirmUnhandledException(exception, "UI スレッド"))
        {
            e.Handled = true;
        }
        else
        {
            Environment.Exit(1);
        }
    }

    /// <summary>
    /// バックグラウンドタスクで発生した未処理例外を処理します。
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void TaskScheduler_UnobservedTaskException(object sender, UnobservedTaskExceptionEventArgs e)
    {
        var exception = e.Exception.InnerException as Exception;
        if (ConfirmUnhandledException(exception, "バックグラウンドタスク"))
        {
            e.SetObserved();
        }
        else
        {
            Environment.Exit(1);
        }
    }

    /// <summary>
    /// 実行を継続するかどうかを選択できる場合の未処理例外を処理します。
    /// </summary>
    /// <param name="e">例外オブジェクト</param>
    /// <param name="sourceName">発生したスレッドの種別を示す文字列</param>
    /// <returns>継続することが選択された場合は true, それ以外は false</returns>
    bool ConfirmUnhandledException(Exception e, string sourceName)
    {
        var message = $"予期せぬエラーが発生しました。続けて発生する場合は開発者に報告してください。\nプログラムの実行を継続しますか？";
        if (e != null) message += $"\n({e.Message} @ {e.TargetSite.Name})";
        // Logger.Fatal($"未処理例外 ({sourceName})", e); // 適当なログ記録
        var result = MessageBox.Show(message, $"未処理例外 ({sourceName})", MessageBoxButton.YesNo, MessageBoxImage.Warning);
        return result == MessageBoxResult.Yes;
    }

    /// <summary>
    /// 最終的に処理されなかった未処理例外を処理します。
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
    {
        var exception = e.ExceptionObject as Exception;
        var message = $"予期せぬエラーが発生しました。続けて発生する場合は開発者に報告してください。";
        if (exception != null) message += $"\n({exception.Message} @ {exception.TargetSite.Name})";
        // Logger.Fatal("未処理例外", exception); // 適当なログ記録
        MessageBox.Show(message, "未処理例外", MessageBoxButton.OK, MessageBoxImage.Stop);
        Environment.Exit(1);
    }
}
```