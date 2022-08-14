---
title: Vagrant で ansible_local プロビジョナーに Ansible Vault のパスワードを渡す
date: 2017-02-14
author: kenzauros
tags: [仮想化技術]
---

こんにちは、kenzauros です。

Ansible でパスワードの書かれたファイルを直接リポジトリにコミットしたくない場合、 **Ansible Vault** を用いて暗号化します。

この暗号化されたファイルの含まれた Ansible を実行しようと思うと復号化してやらないといけないのですが、 Vagrant のプロビジョナーだとこれがなかなかうまくいかなかったのでハマりました。

## 前提

* Windows 10 Pro
* VirtualBox 5.0.20
* Vagrant 1.9.1
* box: bento/centos-7.2
* リポジトリの /provision ディレクトリ以下に ansible のソースがある
* `/provision/group_vars/web/vault.yml` が vault で暗号化された設定ファイル
* ansible_local プロビジョナー ([Ansible Local Provisioner](https://www.vagrantup.com/docs/provisioning/ansible_local.html)) を使いたい

なぜ ansible_local プロビジョナーかというとホストマシン側になにもインストールする必要がないからです。複数の開発者で進める場合はできるだけインストールするものが少ないほうが望ましいですね。

## パスワードの指定をどうするか

まず下記のように Vagrantfile に書いて `vagrant up --provision` で実行します。

```ruby
config.vm.provision "ansible_local" do |ansible|
  ansible.playbook = "provision/vagrant.yml"
end
```

当然ながら vault.yml が復号化できないので怒られます。

```bash
$ vagrant up --provision
Bringing machine 'default' up with 'virtualbox' provider...
==> default: Running provisioner: ansible_local...
    default: Running ansible-playbook...
ERROR! Decryption failed on /ansible/group_vars/web/vault.yml
Ansible failed to complete successfully. Any error output should be
visible above. Please fix these errors and try again.
```

### ask_vault_pass オプション

公式ページ ([Ansible - Provisioning - Vagrant by HashiCorp](https://www.vagrantup.com/docs/provisioning/ansible.html#ask_vault_pass)) に `ask_vault_pass` オプションが使える、とあるので指定してみます。

```ruby
config.vm.provision "ansible_local" do |ansible|
  ansible.playbook = "provision/vagrant.yml"
  ansible.ask_vault_pass = true
end
```

しかし、下記のように `ask_vault_pass` なんて知らぬ、とエラーがでます。

```bash
$ vagrant up --provision
Bringing machine 'default' up with 'virtualbox' provider...
There are errors in the configuration of this machine. Please fix
the following errors and try again:

ansible local provisioner:
* The following settings shouldn't exist: ask_vault_pass
```

よく見てみるとこの `ask_vault_pass` オプションは Ansible **(Remote)** Provisioner のオプションなので、 **ansible_local プロビジョナーには使えない**のです。

### raw_arguments オプションで vault-password-file を指定する

下記のページによると `raw_arguments` というオプションで Ansible コマンドのオプションが渡せるらしいということがわかったので `ansible.raw_arguments = "--ask-vault-pass"` を指定してみましたが、やはりエラーになりました。

* [Use Ansible vault with Vagrant (Example)](https://coderwall.com/p/cew4vg/use-ansible-vault-with-vagrant)

気を取り直してパスワードファイルを直接指定して読み込ませる `vault-password-file` オプションを `raw_arguments` に指定してみました。

`.vault_password` ファイルには平文でパスワードを書き、 `/vagrant` ディレクトリに配置しました。まぁローカルなら平文パスワードでもいいだろう、という発想です。

```ruby
config.vm.provision "ansible_local" do |ansible|
  ansible.playbook = "provision/vagrant.yml"
  ansible.raw_arguments = "--vault-password-file=.vault_password"
end
```

これを実行するとオプション自体は指定できているようですが、下記のエラーが発生します。

```bash
$ vagrant up --provision
Bringing machine 'default' up with 'virtualbox' provider...
==> default: Running provisioner: ansible_local...
    default: Running ansible-playbook...
ERROR! Problem running vault password script / v a g r a n t / . v a u l t _ p a s s w o r d ([Errno 8] Exec format error). If this is not a script, remove the executable bit from the file.
Ansible failed to complete successfully. Any error output should be
visible above. Please fix these errors and try again.
```

すごいブランクで強調されていますが、要するに **`.vault_password` が実行可能ファイルになっている (パーミッションに x が立っている) のがダメ**らしいです。

実際、 vagrant に ssh でログインして `ll -a /vagrant` を叩いてみればすべてのファイルが `rwxrwxrwx (777)` になっていることがわかります。これは Windows から共有しているフォルダだとパーミッションが設定できないせいです。

ということはファイルのパーミッションを変更してやる必要があるわけですが、当然 `chmod 664 .vault_password` などとしたところでファイルが存在しているのは Windows なのでパーミッションは変わりません。

### プロビジョニング用共有フォルダの追加

**vagrant の共有フォルダにはデフォルトのパーミッションを指定できる `mount_options` オプションがある**ので、これを使ってプロビジョニング用の共有フォルダを新しく下記のように定義しました。

```ruby
config.vm.synced_folder "./provision", "/provision", id: "ansible", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775,fmode=664"]
```

ディレクトリのパーミッション (dmode) は `775`、ファイルのパーミッション (fmode) は `664` としています。また、この共有フォルダでは **`provision` フォルダ以下だけを VM 側の `/provision` にマウント**します。

設定を変更したら `vagrant reload` でロードしなおし、SSH でログインして `/provision` ディレクトリが存在して、ファイルのパーミッションが `664` になっていることを確認しておきます。

新しく共有フォルダを定義したので **ansible_local のパス指定を `/provision` 基準に変更し、`.vault_password` も `provision` に移動**しました。

```bash
config.vm.synced_folder "./provision", "/provision", id: "ansible", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775,fmode=664"]
config.vm.provision "ansible_local" do |ansible|
  ansible.playbook = "/provision/vagrant.yml"
  ansible.raw_arguments = "--vault-password-file=/provision/.vault_password"
end
```

これで `vagrant up --provision` を叩くと...動きました！！

長かった...。

共有フォルダは追加で定義しているのでデフォルトの `/vagrant` には影響がありません。

あ、当たり前ですが、平文パスワードが含まれる `.vault_password` ファイルがリポジトリに上がってしまわないように `.gitignore` に追記しておきましょう。

```
# Vagrant
*.box
.vagrant/
.vault_password
```
