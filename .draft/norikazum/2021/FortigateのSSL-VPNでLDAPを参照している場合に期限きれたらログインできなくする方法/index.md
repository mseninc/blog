---
title: FortigateのSSL-VPNでLDAPを参照している場合に期限きれたらログインできなくする方法
date: 2021-05-31
author: norikazum
tags: [その他, ライフハック]
---

```
#!/bin/bash

# 変数定義
LDAP_PASS=iLe-2014
LDIF=/tmp/deletepasswd.ldif
TODAY=$((`date +%s`/86400))
LOG=/var/log/ldap_deletepasswd.log
DATETIME=`date +%Y/%m/%d_%H:%M:%S`
HOST=`hostname`
TOMAIL=masuda@msen.jp

# userPassword と shadowExpire 共に設定されているエントリーを取得し、
# shadowExpire が現在日付より過去の場合、userPassword を削除する文字列を LDIF ファイルに追記する
ldapsearch -x -LLL -D "cn=Manager,dc=ile,dc=osaka-u,dc=ac,dc=jp" -w ${LDAP_PASS} -b "ou=People,dc=ile,dc=osaka-u,dc=ac,dc=jp" -s sub -S shadowExpire "(&(userPassword=*)(shadowExpire=*))" dn shadowExpire |
  tr -s "\n" |
  awk '{if(NR%2)ORS="\t";else ORS="\n";print}' |
  awk -v today="${TODAY}" -F "\t" '{sub(/^shadowExpire: +/,"",$2); if($2<today)print $1"\nchangetype: modify\ndelete: userPassword\n"}' > ${LDIF}

# LDIF ファイルが空でなければ、 userPassword を削除する更新処理を実行
if [ -s ${LDIF} ]; then
  echo "*******************" >> $LOG
  echo $DATETIME >> $LOG
  echo "*******************" >> $LOG
  ldapmodify -x -D "cn=Manager,dc=ile,dc=osaka-u,dc=ac,dc=jp" -w ${LDAP_PASS} -f ${LDIF} >> $LOG
  echo -n -e "\n" >> $LOG
  echo "${DATETIME} Please Check the $LOG" | /usr/bin/mail -s "[$HOST] **INFO** Expired user processing." ${TOMAIL}
fi

# ファイルを削除
rm -f ${LDIF}

exit 0
```

ログ
```
*******************
2020/02/20_10:31:10
*******************
modifying entry "uid=107080,ou=People,dc=ile,dc=osaka-u,dc=ac,dc=jp"
```