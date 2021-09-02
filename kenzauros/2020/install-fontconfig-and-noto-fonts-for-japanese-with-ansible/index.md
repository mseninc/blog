---
title: CentOS で fontconfig を Ansible で設定して日本語フォントを Noto Fonts にする
date: 2020-02-07
author: kenzauros
tags: [CentOS, Ansible, Linux]
---

Node.js から phantomjs を使って PDF を出力することになり、サーバー側に **fontconfig の設定と Noto fonts のインストール**が必要になったので、 **Ansible** を作成しました。


## 前提条件

- サーバー: CentOS 7
- Ansible: 2.8.5
- フォントは Noto Fonts を利用 ([Noto CJK – Google Noto Fonts](https://www.google.com/get/noto/help/cjk/))

## やること

当たり前ですが、まともな日本語の PDF を生成するには、 HTML/CSS で指定したフォントがまともな日本語フォントで描画される必要があります。

日本語 GUI の入っていない状態では、正しく設定しておかないとデフォルトの [DejaVu フォント](https://ja.wikipedia.org/wiki/DejaVu%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88) しか入っていないので日本語は豆腐状態になってしまいます。

CSS でのフォント指定は環境によってフォント名の差がでやすく、マッチしないとよくわからないフォントが使われてしまう可能性があるため、今回は **`serif` や `sans-serif` など汎用的なフォント指定**にします。

今回の事例では日本語の文書を吐き出すため、書体はセリフ体 (明朝体) を用います。このため CSS の指定は下記のようにします。

```css
font-family: serif;
```

よって上記のように **`serif` と指定されたときに `Noto Serif JP` が使用されればよい**ということになります。

node の PDF 変換用パッケージは **[phantom-html-to-pdf](https://www.npmjs.com/package/phantom-html-to-pdf)** を利用しています。今回は PDF 変換については触れません。

## 設定の概要

おおまかな設定内容は下記のとおりです。

- `fontconfig-devel`, `unzip` パッケージを yum で追加
- `/usr/share/fonts/noto/` に `NotoSansJP-<weight>.otf`, `NotoSerifJP-<weight>.otf` を配置
- デフォルトの `serif`, `sans-serif` フォントをそれぞれ `Noto Serif JP`, `Noto Sans JP` に設定
    - 設定は `/etc/fonts/local.conf` に記載します。

このほか、フォントファイルが zip で圧縮されているため、 Ansible の `unarchive` module で直接展開できるよう yum で `unzip` コマンドもインストールします。

## ソースコード

### ファイル構成

下記の構成とします。今回の fontconfig インストール用のロール名は **`fontconfig-noto`** としました。

```
/
  inventory.yml # インベントリー
  site.yml
  roles/
    fontconfig-noto/ # ロール
      defaults/ # デフォルトの変数
        main.yml
      files/ # 設定ファイルコピー元
        local.conf
      tasks/ # タスク定義
        main.yml
```

### タスクファイル

まず一番肝となるロールのタスク定義ファイル **`roles/fontconfig-noto/tasks/main.yml`** の内容です。

```yml
- name: fontconfig インストール
  yum:
    name:
      - fontconfig-devel
      - unzip
    state: present

- name: フォント確認
  shell: "fc-match {{ item.pattern }}"
  register: check_font
  changed_when: check_font.stdout.find(item.expected) == -1
  with_items:
    - "{{ font_check_matches }}"

- name: フォントディレクトリ作成
  file:
    path: "{{ font_dir }}"
    state: directory
    owner: root
    group: root
    mode: 0644
  register: create_font_directory
  when: check_font.changed

- name: フォントファイル展開
  unarchive:
    remote_src: true
    src: "{{ item.url }}"
    dest: "{{ font_dir }}"
  with_items:
    - "{{ font_files }}"
  when: check_font.changed

- name: フォント設定ファイル展開
  copy:
    src: "{{ item.src }}"
    dest: "{{ item.dest }}"
    force: false
  with_items:
    - "{{ font_conf_files }}"
  when: check_font.changed

- name: フォントキャッシュ更新
  shell: fc-cache -vf
  changed_when: false

- name: フォント確認
  shell: "fc-match {{ item.pattern }}"
  changed_when: false
  failed_when: check_font.stdout.find(item.expected) == -1
  with_items:
    - "{{ font_check_matches }}"
```

タスクで使われる変数は **`roles/fontconfig-noto/defaults/main.yml`** で定義します。

```yml
---
font_dir: /usr/share/fonts/noto
font_files:
  - filename: NotoSerifJP.zip
    url: https://noto-website-2.storage.googleapis.com/pkgs/NotoSerifJP.zip
  - filename: NotoSansJP.zip
    url: https://noto-website-2.storage.googleapis.com/pkgs/NotoSansJP.zip
font_conf_files:
  - src: ./files/local.conf
    dest: /etc/fonts/local.conf
font_check_matches:
  - pattern: serif
    expected: Noto Serif JP
  - pattern: sans-serif
    expected: Noto Sans JP
```

### 設定ファイル

**`roles/fontconfig-noto/files/local.conf`** の中身です。

**サーバーの `/etc/fonts/local.conf` にこのような XML 設定ファイルを配置することで、優先して使われるフォントを指定することができます。**

```xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
    <alias>
        <family>serif</family>
        <prefer>
            <family>Noto Serif JP</family>
        </prefer>
    </alias>
    <alias>
        <family>sans-serif</family>
        <prefer>
            <family>Noto Sans JP</family>
        </prefer>
    </alias>
</fontconfig>
```

### インベントリー

インベントリーは簡単にホストを設定しているだけです。環境に応じて作成ください。

```yml
---
all:
  hosts:
    my_server:
      ansible_host: 192.168.10.111
```

### site.yml

こちらも `all` グループのロールとして今回作成した `fontconfig-noto` ロールを設定しているだけですので、環境に応じて作成ください。

```yml
- hosts: all
  become: yes
  roles:
    - fontconfig-noto
```

## 解説

ロールのタスク定義が肝ですので、主にこの一部を説明します。

### インストール済みかのチェック

まず、フォントはインストールされていれば何度もインストールする必要はないので、 **`fc-match <ファミリー名>` で希望のフォントが表示されるようなら、以後の設定をしないように**します。

たとえば `serif` に対するフォントを確認するときは **`shell` module で `fc-match serif` を実行し、その結果に `Noto Serif JP` が含まれていなければ、このチェックタスクを `changed`** にします。

`serif`, `Noto Serif JP` といったところは配列変数の `font_check_matches` で指定します。

### フォントファイル展開

フォントは **Google のダウンロードサイトから直接 zip をダウンロードしてきて展開**します。

URL は [Noto CJK – Google Noto Fonts](https://www.google.com/get/noto/help/cjk/) に載っているもので、これを配列変数 `font_files` の `url` に指定します。

**`unarchive` モジュールは `remote_src` を `true`(`yes`) にして `src` に絶対パスを指定することで、 HTTP(S) サイトからダウンロードしたファイルを直接展開できます。**

展開先は `/usr/share/fonts/noto` です。

`/usr/share/fonts/` 以下であれば `fc-cache -fv` で自動的にフォントが読み込まれますが、ややこしくならないよう `noto` ディレクトリ下に展開しています。

### フォントインストール

あとは前述のフォント設定ファイルを配置し、 `fc-cache -fv` を実行すれば完了です。

最初に行ったインストール済みかのチェックと同様の手法で **`fc-match <ファミリー名>` の結果が Noto フォントになっているかを確認して、なっていない場合のみ `failed`** となるようにしています。

## あとがき

Ansible で fontconfig を設定する方法を紹介しました。

お役に立てれば幸いです。