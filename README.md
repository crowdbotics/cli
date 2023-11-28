oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g crowdbotics-cli
$ crowdbotics-cli COMMAND
running command...
$ crowdbotics-cli (--version)
crowdbotics-cli/0.0.0 linux-x64 node-v18.18.2
$ crowdbotics-cli --help [COMMAND]
USAGE
  $ crowdbotics-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`crowdbotics-cli hello PERSON`](#crowdbotics-cli-hello-person)
* [`crowdbotics-cli hello world`](#crowdbotics-cli-hello-world)
* [`crowdbotics-cli help [COMMANDS]`](#crowdbotics-cli-help-commands)
* [`crowdbotics-cli plugins`](#crowdbotics-cli-plugins)
* [`crowdbotics-cli plugins:install PLUGIN...`](#crowdbotics-cli-pluginsinstall-plugin)
* [`crowdbotics-cli plugins:inspect PLUGIN...`](#crowdbotics-cli-pluginsinspect-plugin)
* [`crowdbotics-cli plugins:install PLUGIN...`](#crowdbotics-cli-pluginsinstall-plugin-1)
* [`crowdbotics-cli plugins:link PLUGIN`](#crowdbotics-cli-pluginslink-plugin)
* [`crowdbotics-cli plugins:uninstall PLUGIN...`](#crowdbotics-cli-pluginsuninstall-plugin)
* [`crowdbotics-cli plugins reset`](#crowdbotics-cli-plugins-reset)
* [`crowdbotics-cli plugins:uninstall PLUGIN...`](#crowdbotics-cli-pluginsuninstall-plugin-1)
* [`crowdbotics-cli plugins:uninstall PLUGIN...`](#crowdbotics-cli-pluginsuninstall-plugin-2)
* [`crowdbotics-cli plugins update`](#crowdbotics-cli-plugins-update)

## `crowdbotics-cli hello PERSON`

Say hello

```
USAGE
  $ crowdbotics-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/danielsousaio/crowdbotics-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `crowdbotics-cli hello world`

Say hello world

```
USAGE
  $ crowdbotics-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ crowdbotics-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/danielsousaio/crowdbotics-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `crowdbotics-cli help [COMMANDS]`

Display help for crowdbotics-cli.

```
USAGE
  $ crowdbotics-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for crowdbotics-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `crowdbotics-cli plugins`

List installed plugins.

```
USAGE
  $ crowdbotics-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ crowdbotics-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/index.ts)_

## `crowdbotics-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ crowdbotics-cli plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ crowdbotics-cli plugins add

EXAMPLES
  $ crowdbotics-cli plugins add myplugin 

  $ crowdbotics-cli plugins add https://github.com/someuser/someplugin

  $ crowdbotics-cli plugins add someuser/someplugin
```

## `crowdbotics-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ crowdbotics-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ crowdbotics-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/inspect.ts)_

## `crowdbotics-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ crowdbotics-cli plugins install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ crowdbotics-cli plugins add

EXAMPLES
  $ crowdbotics-cli plugins install myplugin 

  $ crowdbotics-cli plugins install https://github.com/someuser/someplugin

  $ crowdbotics-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/install.ts)_

## `crowdbotics-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ crowdbotics-cli plugins link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ crowdbotics-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/link.ts)_

## `crowdbotics-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ crowdbotics-cli plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ crowdbotics-cli plugins unlink
  $ crowdbotics-cli plugins remove

EXAMPLES
  $ crowdbotics-cli plugins remove myplugin
```

## `crowdbotics-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ crowdbotics-cli plugins reset
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/reset.ts)_

## `crowdbotics-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ crowdbotics-cli plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ crowdbotics-cli plugins unlink
  $ crowdbotics-cli plugins remove

EXAMPLES
  $ crowdbotics-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/uninstall.ts)_

## `crowdbotics-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ crowdbotics-cli plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ crowdbotics-cli plugins unlink
  $ crowdbotics-cli plugins remove

EXAMPLES
  $ crowdbotics-cli plugins unlink myplugin
```

## `crowdbotics-cli plugins update`

Update installed plugins.

```
USAGE
  $ crowdbotics-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/update.ts)_
<!-- commandsstop -->
