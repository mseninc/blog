---
title: Redmine のプラグインで利用できるフックの一覧を確認する (v.3.4.6)
date: 2020-11-13
author: kenzauros
tags: [Redmine, Ruby on Rails, Web]
---

Redmine のプラグイン作成の検討にあたり、**フックの一覧**がほしかったのですが、なかなかピンポイントな情報がなかったので、メモしておきます。

## 前提条件

- Redmine 3.4.6.stable.17477
- Redmine のインストールディレクトリは `/var/lib/redmine` の想定

なお、公式には `redmine:plugins:hook_list` タスクで取得できるとありますが、 **v3.4.6 時点ではこのタスクは存在せず、できません**。

- [利用できるフックの一覧を確認する — Redmine.JP](https://redmine.jp/tech_note/plugins/developer/quickref/hook-list/)

```sh
$ bin/rake redmine:plugins:hook_list
rake aborted!
Don't know how to build task 'redmine:plugins:hook_list' (see --tasks)
Did you mean?  redmine:plugins:test

(See full trace by running task with --trace)
```

## フック一覧の取得

なんのことはないですが、 **grep で call_hook と書かれた箇所を列挙**するだけです。

```
$ cd /var/lib/redmine # インストールディレクトリ
$ grep -r call_hook *
```

以下、 Controller/Model/View に分けて取得した一覧を載せておきます。

### Controller hooks

```
$ grep -r call_hook\(:controller *
```

```
app/controllers/issues_controller.rb:    call_hook(:controller_issues_new_before_save, { :params => params, :issue => @issue })
app/controllers/issues_controller.rb:      call_hook(:controller_issues_new_after_save, { :params => params, :issue => @issue})
app/controllers/issues_controller.rb:      call_hook(:controller_issues_bulk_edit_before_save, { :params => params, :issue => issue })
app/controllers/issues_controller.rb:      call_hook(:controller_issues_edit_before_save, { :params => params, :issue => @issue, :time_entry => time_entry, :journal => @issue.current_journal})
app/controllers/issues_controller.rb:        call_hook(:controller_issues_edit_after_save, { :params => params, :issue => @issue, :time_entry => time_entry, :journal => @issue.current_journal})
app/controllers/journals_controller.rb:    call_hook(:controller_journals_edit_post, { :journal => @journal, :params => params})
app/controllers/timelog_controller.rb:    call_hook(:controller_timelog_edit_before_save, { :params => params, :time_entry => @time_entry })
app/controllers/timelog_controller.rb:    call_hook(:controller_timelog_edit_before_save, { :params => params, :time_entry => @time_entry })
app/controllers/timelog_controller.rb:      call_hook(:controller_time_entries_bulk_edit_before_save, { :params => params, :time_entry => time_entry })
app/controllers/custom_fields_controller.rb:      call_hook(:controller_custom_fields_new_after_save, :params => params, :custom_field => @custom_field)
app/controllers/custom_fields_controller.rb:      call_hook(:controller_custom_fields_edit_after_save, :params => params, :custom_field => @custom_field)
app/controllers/messages_controller.rb:        call_hook(:controller_messages_new_after_save, { :params => params, :message => @message})
app/controllers/messages_controller.rb:      call_hook(:controller_messages_reply_after_save, { :params => params, :message => @reply})
app/controllers/account_controller.rb:    call_hook(:controller_account_success_authentication_after, {:user => user })
app/controllers/wiki_controller.rb:      call_hook(:controller_wiki_edit_after_save, { :params => params, :page => @page})
```

フック名 | ファイル
-- | --
controller_issues_new_before_save | app/controllers/issues_controller.rb
controller_issues_new_after_save | app/controllers/issues_controller.rb
controller_issues_bulk_edit_before_save | app/controllers/issues_controller.rb
controller_issues_edit_before_save | app/controllers/issues_controller.rb
controller_issues_edit_after_save | app/controllers/issues_controller.rb
controller_journals_edit_post | app/controllers/journals_controller.rb
controller_timelog_edit_before_save | app/controllers/timelog_controller.rb
controller_timelog_edit_before_save | app/controllers/timelog_controller.rb
controller_time_entries_bulk_edit_before_save | app/controllers/timelog_controller.rb
controller_custom_fields_new_after_save | app/controllers/custom_fields_controller.rb
controller_custom_fields_edit_after_save | app/controllers/custom_fields_controller.rb
controller_messages_new_after_save | app/controllers/messages_controller.rb
controller_messages_reply_after_save | app/controllers/messages_controller.rb
controller_account_success_authentication_after | app/controllers/account_controller.rb
controller_wiki_edit_after_save | app/controllers/wiki_controller.rb

### Model hooks

```
$ grep -r call_hook\(:model *
```

```
app/models/changeset.rb:    Redmine::Hook.call_hook(:model_changeset_scan_commit_for_issue_ids_pre_issue_update,
app/models/project.rb:        Redmine::Hook.call_hook(:model_project_copy_before_save, :source_project => project, :destination_project => self)
```

フック名 | ファイル
-- | --
model_changeset_scan_commit_for_issue_ids_pre_issue_update | app/models/changeset.rb
model_project_copy_before_save | app/models/project.rb


### View hooks

```
$ grep -r call_hook\(:view *
```

```
app/helpers/application_helper.rb:    @view_layouts_base_sidebar_hook_response ||= call_hook(:view_layouts_base_sidebar)
app/views/my/account.html.erb:<%= call_hook(:view_my_account_contextual, :user => @user)%>
app/views/my/account.html.erb:  <%= call_hook(:view_my_account, :user => @user, :form => f) %>
app/views/my/account.html.erb:  <%= call_hook(:view_my_account_preferences, :user => @user, :form => f) %>
app/views/context_menus/time_entries.html.erb:  <%= call_hook(:view_time_entries_context_menu_start, {:time_entries => @time_entries, :can => @can, :back => @back }) %>
app/views/context_menus/time_entries.html.erb:  <%= call_hook(:view_time_entries_context_menu_end, {:time_entries => @time_entries, :can => @can, :back => @back }) %>
app/views/context_menus/issues.html.erb:  <%= call_hook(:view_issues_context_menu_start, {:issues => @issues, :can => @can, :back => @back }) %>
app/views/context_menus/issues.html.erb:  <%= call_hook(:view_issues_context_menu_end, {:issues => @issues, :can => @can, :back => @back }) %>
app/views/welcome/index.html.erb:  <%= call_hook(:view_welcome_index_left) %>
app/views/welcome/index.html.erb:  <%= call_hook(:view_welcome_index_right) %>
app/views/journals/_notes_form.html.erb:    <%= call_hook(:view_journals_notes_form_after_notes, { :journal => @journal}) %>
app/views/journals/update.js.erb:<%= call_hook(:view_journals_update_js_bottom, { :journal => @journal }) %>
app/views/reports/issue_report.html.erb:<%= call_hook(:view_reports_issue_report_split_content_left, :project => @project) %>
app/views/reports/issue_report.html.erb:<%= call_hook(:view_reports_issue_report_split_content_right, :project => @project) %>
app/views/timelog/_form.html.erb:  <%= call_hook(:view_timelog_edit_form_bottom, { :time_entry => @time_entry, :form => f }) %>
app/views/timelog/bulk_edit.html.erb:    <%= call_hook(:view_time_entries_bulk_edit_details_bottom, { :time_entries => @time_entries }) %>
app/views/custom_fields/_form.html.erb:<%= call_hook(:view_custom_fields_form_upper_box, :custom_field => @custom_field, :form => f) %>
app/views/settings/_general.html.erb:<%= call_hook(:view_settings_general_form) %>
app/views/users/_form.html.erb:  <%= call_hook(:view_users_form, :user => @user, :form => f) %>
app/views/users/_form.html.erb:  <%= call_hook(:view_users_form_preferences, :user => @user, :form => f) %>
app/views/search/index.html.erb:    <%= call_hook(:view_search_index_options_content_bottom) %>
app/views/versions/show.html.erb:<%= call_hook(:view_versions_show_contextual, { :version => @version, :project => @project }) %>
app/views/issue_statuses/_form.html.erb:<%= call_hook(:view_issue_statuses_form, :issue_status => @issue_status) %>
app/views/repositories/changes.html.erb:<%= call_hook(:view_repositories_show_contextual, { :repository => @repository, :project => @project }) %>
app/views/repositories/annotate.html.erb:<%= call_hook(:view_repositories_show_contextual, { :repository => @repository, :project => @project }) %>
app/views/repositories/show.html.erb:<%= call_hook(:view_repositories_show_contextual, { :repository => @repository, :project => @project }) %>
app/views/repositories/entry.html.erb:<%= call_hook(:view_repositories_show_contextual, { :repository => @repository, :project => @project }) %>
app/views/projects/settings/_members.html.erb:      <%= call_hook(:view_projects_settings_members_table_header, :project => @project) %>
app/views/projects/settings/_members.html.erb:  <%= call_hook(:view_projects_settings_members_table_row, { :project => @project, :member => member}) %>
app/views/projects/show.html.erb:  <%= call_hook(:view_projects_show_left, :project => @project) %>
app/views/projects/show.html.erb:  <%= call_hook(:view_projects_show_right, :project => @project) %>
app/views/projects/show.html.erb:  <%= call_hook(:view_projects_show_sidebar_bottom, :project => @project) %>
app/views/projects/_form.html.erb:<%= call_hook(:view_projects_form, :project => @project, :form => f) %>
app/views/calendars/show.html.erb:<%= call_hook(:view_calendars_show_bottom, :year => @year, :month => @month, :project => @project, :query => @query) %>
app/views/issues/index.html.erb:<%= call_hook(:view_issues_index_bottom, { :issues => @issues, :project => @project, :query => @query }) %>
app/views/issues/_sidebar.html.erb:<%= call_hook(:view_issues_sidebar_issues_bottom) %>
app/views/issues/_sidebar.html.erb:<%= call_hook(:view_issues_sidebar_planning_bottom) %>
app/views/issues/_sidebar.html.erb:<%= call_hook(:view_issues_sidebar_queries_bottom) %>
app/views/issues/show.html.erb:<%= call_hook(:view_issues_show_details_bottom, :issue => @issue) %>
app/views/issues/show.html.erb:<%= call_hook(:view_issues_show_description_bottom, :issue => @issue) %>
app/views/issues/_edit.html.erb:      <%= call_hook(:view_issues_edit_notes_bottom, { :issue => @issue, :notes => @notes, :form => f }) %>
app/views/issues/new.html.erb:<%= call_hook(:view_issues_new_top, {:issue => @issue}) %>
app/views/issues/_history.html.erb:  <%= call_hook(:view_issues_history_journal_bottom, { :journal => journal }) %>
app/views/issues/bulk_edit.html.erb:<%= call_hook(:view_issues_bulk_edit_details_bottom, { :issues => @issues }) %>
app/views/issues/_form.html.erb:<%= call_hook(:view_issues_form_details_top, { :issue => @issue, :form => f }) %>
app/views/issues/_form.html.erb:<%= call_hook(:view_issues_form_details_bottom, { :issue => @issue, :form => f }) %>
```

フック名 | ファイル
-- | --
view_layouts_base_sidebar | app/helpers/application_helper.rb
view_my_account_contextual | app/views/my/account.html.erb
view_my_account | app/views/my/account.html.erb
view_my_account_preferences | app/views/my/account.html.erb
view_time_entries_context_menu_start | app/views/context_menus/time_entries.html.erb
view_time_entries_context_menu_end | app/views/context_menus/time_entries.html.erb
view_issues_context_menu_start | app/views/context_menus/issues.html.erb
view_issues_context_menu_end | app/views/context_menus/issues.html.erb
view_welcome_index_left | app/views/welcome/index.html.erb
view_welcome_index_right | app/views/welcome/index.html.erb
view_journals_notes_form_after_notes | app/views/journals/_notes_form.html.erb
view_journals_update_js_bottom | app/views/journals/update.js.erb
view_reports_issue_report_split_content_left | app/views/reports/issue_report.html.erb
view_reports_issue_report_split_content_right | app/views/reports/issue_report.html.erb
view_timelog_edit_form_bottom | app/views/timelog/_form.html.erb
view_time_entries_bulk_edit_details_bottom | app/views/timelog/bulk_edit.html.erb
view_custom_fields_form_upper_box | app/views/custom_fields/_form.html.erb
view_settings_general_form | app/views/settings/_general.html.erb
view_users_form | app/views/users/_form.html.erb
view_users_form_preferences | app/views/users/_form.html.erb
view_search_index_options_content_bottom | app/views/search/index.html.erb
view_versions_show_contextual | app/views/versions/show.html.erb
view_issue_statuses_form | app/views/issue_statuses/_form.html.erb
view_repositories_show_contextual | app/views/repositories/changes.html.erb
view_repositories_show_contextual | app/views/repositories/annotate.html.erb
view_repositories_show_contextual | app/views/repositories/show.html.erb
view_repositories_show_contextual | app/views/repositories/entry.html.erb
view_projects_settings_members_table_header | app/views/projects/settings/_members.html.erb
view_projects_settings_members_table_row | app/views/projects/settings/_members.html.erb
view_projects_show_left | app/views/projects/show.html.erb
view_projects_show_right | app/views/projects/show.html.erb
view_projects_show_sidebar_bottom | app/views/projects/show.html.erb
view_projects_form | app/views/projects/_form.html.erb
view_calendars_show_bottom | app/views/calendars/show.html.erb
view_issues_index_bottom | app/views/issues/index.html.erb
view_issues_sidebar_issues_bottom | app/views/issues/_sidebar.html.erb
view_issues_sidebar_planning_bottom | app/views/issues/_sidebar.html.erb
view_issues_sidebar_queries_bottom | app/views/issues/_sidebar.html.erb
view_issues_show_details_bottom | app/views/issues/show.html.erb
view_issues_show_description_bottom | app/views/issues/show.html.erb
view_issues_edit_notes_bottom | app/views/issues/_edit.html.erb
view_issues_new_top | app/views/issues/new.html.erb
view_issues_history_journal_bottom | app/views/issues/_history.html.erb
view_issues_bulk_edit_details_bottom | app/views/issues/bulk_edit.html.erb
view_issues_form_details_top | app/views/issues/_form.html.erb
view_issues_form_details_bottom | app/views/issues/_form.html.erb