# ZennifyFrameworkCLI

Zennify Enterprise Framework Deployment Tool

[![Version](https://img.shields.io/npm/v/ZennifyFrameworkCLI.svg)](https://npmjs.org/package/ZennifyFrameworkCLI)
[![CircleCI](https://circleci.com/gh/WiznoForce/ZennifyFrameworkPlugin/tree/master.svg?style=shield)](https://circleci.com/gh/WiznoForce/ZennifyFrameworkPlugin/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/WiznoForce/ZennifyFrameworkPlugin?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/ZennifyFrameworkPlugin/branch/master)
[![Codecov](https://codecov.io/gh/WiznoForce/ZennifyFrameworkPlugin/branch/master/graph/badge.svg)](https://codecov.io/gh/WiznoForce/ZennifyFrameworkPlugin)
[![Greenkeeper](https://badges.greenkeeper.io/WiznoForce/ZennifyFrameworkPlugin.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/WiznoForce/ZennifyFrameworkPlugin/badge.svg)](https://snyk.io/test/github/WiznoForce/ZennifyFrameworkPlugin)
[![Downloads/week](https://img.shields.io/npm/dw/ZennifyFrameworkCLI.svg)](https://npmjs.org/package/ZennifyFrameworkCLI)
[![License](https://img.shields.io/npm/l/ZennifyFrameworkCLI.svg)](https://github.com/WiznoForce/ZennifyFrameworkPlugin/blob/master/package.json)

<!-- toc -->
* [ZennifyFrameworkCLI](#zennifyframeworkcli)
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g ZennifyFrameworkCLI
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
ZennifyFrameworkCLI/0.0.1 win32-x64 node-v12.18.2
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx zenn:trigger:create -s <string> [-e <array>] [--notrigger] [--nohandler] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-zenntriggercreate--s-string--e-array---notrigger---nohandler--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx zenn:trigger:test [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-zenntriggertest--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx zenn:trigger:create -s <string> [-e <array>] [--notrigger] [--nohandler] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Generate Apex Trigger for use with Zennify Framework

```
USAGE
  $ sfdx zenn:trigger:create -s <string> [-e <array>] [--notrigger] [--nohandler] [-v <string>] [-u <string>] 
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -e, --events=events                                                               Events the Trigger should fire for.
                                                                                    (i.e. BEFORE_INSERT,BEFORE_UPDATE)

  -s, --sobjecttype=sobjecttype                                                     (required) API Name of SObject to
                                                                                    create Trigger For

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

  --nohandler                                                                       Set this flag if you want to exclude
                                                                                    creating the Handler Class

  --notrigger                                                                       Set this flag if you want to exclude
                                                                                    creating the Trigger

EXAMPLE
  $ sfdx zenn:trigger:create --sobjecttype Account
```

_See code: [lib\commands\zenn\trigger\create.js](https://github.com/WiznoForce/ZennifyFrameworkPlugin/blob/v0.0.1/lib\commands\zenn\trigger\create.js)_

## `sfdx zenn:trigger:test [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Generate Apex Trigger for use with Zennify Framework

```
USAGE
  $ sfdx zenn:trigger:test [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx zenn:trigger:create --sobjecttype Account
```

_See code: [lib\commands\zenn\trigger\test.js](https://github.com/WiznoForce/ZennifyFrameworkPlugin/blob/v0.0.1/lib\commands\zenn\trigger\test.js)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->

# Debugging your plugin

We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command:

1. Start the inspector

If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch:

```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```

Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:

```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program.
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
   <br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
   Congrats, you are debugging!
