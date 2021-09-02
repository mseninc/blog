---
title: "[PowerShell] コマンドレットのエイリアスを調べてみた。"
date: 2018-11-08
author: kiyoshin
tags: [PowerShell, Windows]
---

## エイリアスとは

**PowerShell** のコマンドレットには、 **エイリアス** と呼ばれるコマンドレットの名前を別名で定義する機能が実装されています。 この機能の目的は大きく分けて下記の2種類に分かれています。

* 構文を短縮して記述できるようにする
    * 繰り返し処理をするためのコマンドレット **ForEach-Object** には **%** というエイリアスが設定されており、 `% { 繰り返し処理 }` と記述することができます。
* **cmd** や **bash** などに存在するコマンドと似た振る舞いをするコマンドレットに対して各環境のコマンド名で使用できるようにする
    * 例えば、フォルダ内の一覧を取得する場合、通常は **Get-ChildItem** を使用しますが、 **Get-ChildItem** には、エイリアスとして、 **dir** や **ls** が設定されているため、 **PowerShell** 上で **dir** と実行することで同じ結果を得ることが可能です。

デフォルトで設定されているエイリアスを以下の表にまとめてみました。

## エイリアス一覧

コマンド名 | エイリアス名※複数存在する場合はカンマ区切り
-- | --
Add-Content | ac
Add-PSSnapIn | asnp
Clear-Content | clc
Clear-History | clhy
Clear-Host | clear, cls
Clear-Item | cli
Clear-ItemProperty | clp
Clear-Variable | clv
Compare-Object | compare, diff
Connect-PSSession | cnsn
ConvertFrom-String | CFS
Convert-Path | cvpa
Copy-Item | copy, cp, cpi
Copy-ItemProperty | cpp
Disable-PSBreakpoint | dbp
Disconnect-PSSession | dnsn
Enable-PSBreakpoint | ebp
Enter-PSSession | etsn
Exit-PSSession | exsn
Export-Alias | epal
Export-Csv | epcsv
Export-PSSession | epsn
ForEach-Object | %, foreach
Format-Custom | fc
Format-Hex | fhx
Format-List | fl
Format-Table | ft
Format-Wide | fw
Get-Alias | gal
Get-ChildItem | dir, gci, ls
Get-Clipboard | gcb
Get-Command | gcm
Get-ComputerInfo | gin
Get-Content | cat, gc, type
Get-History | ghy, h, history
Get-Item | gi
Get-ItemProperty | gp
Get-ItemPropertyValue | gpv
Get-Job | gjb
Get-Location | gl, pwd
Get-Member | gm
Get-Module | gmo
Get-Process | gps, ps
Get-PSBreakpoint | gbp
Get-PSCallStack | gcs
Get-PSDrive | gdr
Get-PSSession | gsn
Get-PSSnapIn | gsnp
Get-Service | gsv
Get-TimeZone | gtz
Get-Unique | gu
Get-Variable | gv
Get-WmiObject | gwmi
Group-Object | group
help | man
Import-Alias | ipal
Import-Csv | ipcsv
Import-Module | ipmo
Import-PSSession | ipsn
Invoke-Command | icm
Invoke-Expression | iex
Invoke-History | ihy, r
Invoke-Item | ii
Invoke-RestMethod | irm
Invoke-WebRequest | curl, iwr, wget
Invoke-WMIMethod | iwmi
Measure-Object | measure
mkdir | md
Move-Item | mi, move, mv
Move-ItemProperty | mp
New-Alias | nal
New-Item | ni
New-Module | nmo
New-PSDrive | mount, ndr
New-PSSession | nsn
New-PSSessionConfigura... | npssc
New-Variable | nv
Out-GridView | ogv
Out-Host | oh
Out-Printer | lp
Pop-Location | popd
powershell_ise.exe | ise
Push-Location | pushd
Receive-Job | rcjb
Receive-PSSession | rcsn
Remove-Item | del, erase, rd, ri, rm, rmdir
Remove-ItemProperty | rp
Remove-Job | rjb
Remove-Module | rmo
Remove-PSBreakpoint | rbp
Remove-PSDrive | rdr
Remove-PSSession | rsn
Remove-PSSnapin | rsnp
Remove-Variable | rv
Remove-WMIObject | rwmi
Rename-Item | ren, rni
Rename-ItemProperty | rnp
Resolve-Path | rvpa
Resume-Job | rujb
Select-Object | select
Select-String | sls
Set-Alias | sal
Set-Clipboard | scb
Set-Content | sc
Set-Item | si
Set-ItemProperty | sp
Set-Location | cd, chdir, sl
Set-PSBreakpoint | sbp
Set-TimeZone | stz
Set-Variable | set, sv
Set-WMIInstance | swmi
Show-Command | shcm
Sort-Object | sort
Start-Job | sajb
Start-Process | saps, start
Start-Service | sasv
Start-Sleep | sleep
Stop-Job | spjb
Stop-Process | kill, spps
Stop-Service | spsv
Suspend-Job | sujb
Tee-Object | tee
Trace-Command | trcm
Wait-Job | wjb
Where-Object | ?, where
Write-Output | echo, write

上記の一覧の内容を参考に、フォルダ内（サブフォルダを含む）のcsvファイルを1つにまとめる場合は、以下のようなコマンドになります。
```sh
# エイリアスを使用しない場合
> Get-ChildItem -Recurse *.csv | Get-Content | Set-Content merge.csv

# エイリアスを使用した場合
> ls -R *.csv | cat | sc merge.csv
```

コマンド自体が短くなってすっきりし、なんとなく **bash** ぽくなりましたね。

それではまた。

## 関連記事

- [Windows PowerShell: 短縮構文 | Microsoft Docs](https://docs.microsoft.com/ja-jp/previous-versions/technet-magazine/hh922886(v=msdn.10))
- [付録 1 - 互換性のあるエイリアス | Microsoft Docs](https://docs.microsoft.com/ja-jp/powershell/scripting/getting-started/cookbooks/appendix-1---compatibility-aliases?view=powershell-5.1)