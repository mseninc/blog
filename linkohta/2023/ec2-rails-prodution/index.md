---
title: "AWS に Rails のアプリをデプロイする方法 ～本番環境を構築する～"
date: 
author: linkohta
tags: [EC2, Ruby on Rails, Web]
description: "実際に外部公開する Rails アプリの本番環境を EC2 インスタンス上で構築する手順を紹介します。"
---

link です。

この記事は前回 [AWS に Rails のアプリをデプロイする方法 ～ Rails アプリを起動するまで](linkohta/ec2-setup-rails) の続きになります。

前回は Rails アプリを起動してアクセスするまでをやりました。

今回は実際に外部公開する Rails アプリの本番環境を EC2 インスタンス上で構築する手順を紹介します。

## 想定環境

- Windows 11
- Amazon Linux 2023
- Ruby 3.2
- Ruby on Rails 7

## 本番環境構築について

今回、本番環境を構築するにあたって **Unicorn+nginx** で Rails アプリを立ち上げます。

Rails アプリの起動は `rails s` で行えます。

しかし `rails s` で立ち上がる Rack アプリサーバーは負荷を分散させるための機能がありません。

そのため、実運用していく上で、大勢の人がサイトを見たときなどにとても重くなってしまいます。

そこで Unicorn+nginx を使ってアクセス時の負荷を分散できるようにします。

## Unicorn のインストールと設定

ローカルの Rails のプロジェクトフォルダ内の `Gemfile` に Unicorn を追加します。

```rb:title=Gemfile
group :production do
  gem 'unicorn'
end
```

`config/unicorn.rb` を作成して以下のように内容を書き換えます。

```rb:title=config/unicorn.rb
app_path = File.expand_path('../../', __FILE__)

worker_processes 1

working_directory app_path

pid "#{app_path}/tmp/pids/unicorn.pid"

listen "#{app_path}/tmp/sockets/unicorn.sock"

stderr_path "#{app_path}/log/unicorn.stderr.log"

stdout_path "#{app_path}/log/unicorn.stdout.log"

timeout 60

preload_app true
GC.respond_to?(:copy_on_write_friendly=) && GC.copy_on_write_friendly = true

check_client_connection false

run_once = true

before_fork do |server, worker|
  defined?(ActiveRecord::Base) &&
    ActiveRecord::Base.connection.disconnect!

  if run_once
    run_once = false
  end

  old_pid = "#{server.config[:pid]}.oldbin"
  if File.exist?(old_pid) && server.pid != old_pid
    begin
      sig = (worker.nr + 1) >= server.worker_processes ? :QUIT : :TTOU
      Process.kill(sig, File.read(old_pid).to_i)
    rescue Errno::ENOENT, Errno::ESRCH => e
      logger.error e
    end
  end
end

after_fork do |_server, _worker|
  defined?(ActiveRecord::Base) && ActiveRecord::Base.establish_connection
end
```

続いて、 Unicorn の起動・停止スクリプトを作成します。

```bash:title=スクリプト生成
$ rails g task unicorn
```

これで `lib/tasks/unicorn.rake` が生成されるので中身を以下のように書き換えます。

```rb:title=lib/tasks/unicorn.rake
namespace :unicorn do

  # Tasks
  desc "Start unicorn"
  task(:start) {
    config = Rails.root.join('config', 'unicorn.rb')
    sh "unicorn -c #{config} -E production -D"
  }

  desc "Stop unicorn"
  task(:stop) {
    unicorn_signal :QUIT
  }

  desc "Restart unicorn with USR2"
  task(:restart) {
    unicorn_signal :USR2
  }

  desc "Increment number of worker processes"
  task(:increment) {
    unicorn_signal :TTIN
  }

  desc "Decrement number of worker processes"
  task(:decrement) {
    unicorn_signal :TTOU
  }

  desc "Unicorn pstree (depends on pstree command)"
  task(:pstree) do
    sh "pstree '#{unicorn_pid}'"
  end

  # Helpers
  def unicorn_signal signal
    Process.kill signal, unicorn_pid
  end

  def unicorn_pid
    begin
      File.read("/home/vagrant/myapp/tmp/unicorn.pid").to_i
    rescue Errno::ENOENT
      raise "Unicorn does not seem to be running"
    end
  end

end
```

ここまではローカルでの作業です。

EC2 インスタンスにログインして環境変数 `SECRET_KEY_BASE` を設定します。

```bash:title=secret_key_base生成
$ export SECRET_KEY_BASE=`bundle exec rake secret`
```

これで Unicorn を使う準備は完了です。

最後にEC2 インスタンス内のプロジェクトフォルダで `git pull` して変更を反映します。

## nginx のインストールと設定

EC2 インスタンスに nginx をインストールします。

```bash:title=nginxインストール
$ sudo yum -y install nginx
```

```conf:title=/etc/nginx/conf.d/rails.conf
upstream app_server {
  server unix:/var/www/AwsRails/tmp/sockets/unicorn.sock;
}

server {
  listen 80;
  server_name EC2 インスタンスの IP アドレス;

  client_max_body_size 2g;

  root /var/www/AwsRails/public;

  location ^~ /assets/ {
    gzip_static on;
    expires max;
    add_header Cache-Control public;
  }

  try_files $uri/index.html $uri @unicorn;

  location @unicorn {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_redirect off;
    proxy_pass http://app_server;
  }

  error_page 500 502 503 504 /500.html;
}
```

nginx の権限を変更して POST メソッドを実行できるようにします。

```bash:title=権限変更
$ cd /var/lib
$ sudo chmod -R 775 nginx
```

nginx のインストールと設定はこれで完了です。

## 本番環境でのアプリ起動

Rails アプリを起動させます。

Unicorn インストール時に作成したスクリプトで Unicorn を使って Rails アプリを起動します。

```bash:title=アプリ起動
$ rake unicorn:start
```

`unicorn -c /home/{ユーザ名}/AwsRails/config/unicorn.rb -E production -D` の 1 行だけ表示されれば起動成功です。

アプリを停止させるときは `rake unicorn:stop` を実行します。

`http://EC2 インスタンスの IP アドレス` にアクセスして、 Web アプリが利用できることを確認しましょう。

## 参考サイト

- [【CentOS 7】nginx + Unicorn で Rails アプリケーションを本番環境で立ち上げる方法](https://zenn.dev/noraworld/articles/deploy-rails-application-with-nginx-and-unicorn)
- [独学向けRailsアプリをAWSにデプロイする方法まとめ【入門】 - Qiita](https://qiita.com/gyu_outputs/items/b123ef229842d857ff39)
- [なぜrailsの本番環境ではUnicorn,nginxを使うのか? 　~ Rack,Unicorn,nginxの連携について ~【Ruby On Railsでwebサービス運営】 - Qiita](https://qiita.com/fritz22/items/fcb81753eaf381b4b33c)

## まとめ

今回は実際に外部公開する Rails アプリの本番環境を EC2 インスタンス上で構築する手順を紹介しました。

AWS に Rails のアプリをデプロイする方法の紹介は以上になります。

それではまた、別の記事でお会いしましょう。