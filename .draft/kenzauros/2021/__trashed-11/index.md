---
title: No Title
date: 2021-06-01
author: kenzauros
tags: [その他, ライフハック]
---

$ sls dynamodb install
Serverless: Deprecation warning: CLI options definitions were upgraded with "type" property (which could be one of "string", "boolean", "multiple"). Below listed plugins do not predefine type for introduced options:
             - ServerlessDynamodbLocal for "online", "port", "cors", "inMemory", "dbPath", "sharedDb", "delayTransientStatuses", "optimizeDbBeforeStartup", "migrate", "seed", "migration", "heapInitial", "heapMax", "convertEmptyValues", "localPath"
            Please report this issue in plugin issue tracker.
            Starting with next major release, this will be communicated with a thrown error.
            More Info: https://www.serverless.com/framework/docs/deprecations/#CLI_OPTIONS_SCHEMA
Started downloading dynamodb-local from http://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz into C:\Repos\private\counselist&#46;dynamodb. Process may take few minutes.

Installation complete!

$ sls dynamodb start --migrate
Serverless: Deprecation warning: CLI options definitions were upgraded with "type" property (which could be one of "string", "boolean", "multiple"). Below listed plugins do not predefine type for introduced options:
             - ServerlessDynamodbLocal for "online", "port", "cors", "inMemory", "dbPath", "sharedDb", "delayTransientStatuses", "optimizeDbBeforeStartup", "migrate", "seed", "migration", "heapInitial", "heapMax", "convertEmptyValues", "localPath"
            Please report this issue in plugin issue tracker.
            Starting with next major release, this will be communicated with a thrown error.
            More Info: https://www.serverless.com/framework/docs/deprecations/#CLI_OPTIONS_SCHEMA
Dynamodb Local Started, Visit: http://localhost:8000/shell
Serverless: DynamoDB - created table counselist-dev-accounts
Serverless: DynamoDB - created table counselist-dev-issues
Serverless: DynamoDB - created table counselist-dev-issues-deltasync