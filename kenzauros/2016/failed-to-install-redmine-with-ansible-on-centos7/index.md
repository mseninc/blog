---
title: redmine-centos-ansible で Redmine 3.2 のインストールが失敗する (CentOS 7.1)
date: 2016-06-06
author: kenzauros
tags: [Redmine, CentOS, Vagrant, Ansible, Web]
---

最近 **Redmine** をちょくちょくいろんなサーバーにインストールしています。そんなとき便利なのが [RedmineをCentOSに自動インストールためのAnsibleプレイブック](https://github.com/farend/redmine-centos-ansible) です。

本来 [こちらの手順](http://blog.redmine.jp/articles/3_2/install/centos/) にしたがって、割と長い工程でインストールしないといけないのですが、上記の Ansible Playbook ならわずか 5 コマンドでインストールが完了します。

超ベンリなんですが、最近なぜかインストールできなくなっていました。原因は簡単だったんですが、しばらくハマりましたので、解決法をご紹介しておきます。

## 環境

* Hyper-V 上の VM もしくは Windows 上の Vagrant(VirtualBox)
* CentOS 7.1 (x64)
* Redmine 3.2

## 現象

[RedmineをCentOSに自動インストールためのAnsibleプレイブック](https://github.com/farend/redmine-centos-ansible) の手順でコマンドを叩いていくと、最後の `ansible-playbook -i hosts site.yml` でエラーが発生します。

```bash
# yum install -y epel-release
# yum install -y ansible git
# git clone https://github.com/farend/redmine-centos-ansible.git
# cd redmine-centos-ansible
# ansible-playbook -i hosts site.yml
```

エラー内容はこんな感じ。

```bash
# ansible-playbook -i hosts site.yml
[DEPRECATION WARNING]: Instead of sudo/sudo_user, use become/become_user and make sure become_method is 'sudo'

(default).
This feature will be removed in a future release. Deprecation warnings can be disabled by setting
deprecation_warnings=False in ansible.cfg.

PLAY [redmine-servers] *********************************************************

TASK [setup] *******************************************************************
ok: [localhost]

TASK [system : SELinuxの状態確認] ***************************************************
fatal: [localhost]: FAILED! => {"failed": true, "msg": "The conditional check 'result.rc not in [0' failed. The error was: template error while templating string: unexpected '}', expected ']'. String: {% if result.rc not in [0 %} True {% else %} False {% endif %}"}

NO MORE HOSTS LEFT *************************************************************
        to retry, use: --limit @site.retry

PLAY RECAP *********************************************************************
localhost                  : ok=1    changed=0    unreachable=0    failed=1
```

"SELinuxの状態確認" でエラー (fatal) になってるなー、と思って、 `/etc/sysconfig/selinux` で `SELINUX=disalbed` にして再起動しても効果なく、 `getenforce` すれば SELinux はちゃんと無効になっているし、 Ansible のタスクを一部除外してみたりなんかしてもことごとくエラーでした。

## 原因と解決法

結論から言うと **Ansible のバージョンが 2.0 系だったのが原因**でした。

細かいところまで調べ切れていませんが、おそらくこのプレイブックが 1.9 以下の環境で作成されていて、 2.0 系で変更になった機能でひっかかっているのだと思います。後方互換がないのはイケてないですね...。

そういえば最初にこの Ansible Playbook 使った時はまだ 1.9 系だった気が...。調べてみるとインストールされていたバージョンは 2.0.2.0-1.el7 でした。

ということで一旦 **Ansible をアンインストールして、 1.9 系を再インストール**します。

```bash
# yum -y remove ansible
# yum -y install ansible1.9.noarch
```

これで再度 ```ansible-playbook -i hosts site.yml``` を行ったところ、無事インストールが完了しました。めでたしめでたし。

なお、環境によって 1.9 系のリポジトリ名が違うかもしれません。再インストール前に `yum search ansible` などで検索してください。

## おまけ

参考までに Vagrant ファイルとプロヴィジョニング用スクリプトを掲載しておきます。

### Vagrantfile

```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "bento/centos-7.1"
  config.vm.network "forwarded_port", guest: 80, host: 80
  config.vm.network "private_network", ip: "192.168.33.121"
  config.vm.provision "shell", path: "provision.sh"
end
```

### provision.sh （プロビジョニング用シェルスクリプト）

```bash
#!/bin/sh
set -e
set -x

yum install -y epel-release
yum install -y ansible1.9.noarch git
git clone https://github.com/farend/redmine-centos-ansible.git
cd redmine-centos-ansible
ansible-playbook -i hosts site.yml
```

## 参考

* [farend/redmine-centos-ansible: RedmineをCentOSに自動インストールためのAnsibleプレイブック](https://github.com/farend/redmine-centos-ansible)
* [Redmine 3.2をCentOS 7.1にインストールする手順 | Redmine.JP Blog](http://blog.redmine.jp/articles/3_2/install/centos/)