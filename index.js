#!/usr/bin/env node
/**
 * Crowdbotics Modules tool
 *
 * Run it anywhere with: cb
 *
 * Commands available:
 * - parse
 * - demo
 * - add
 * - remove
 * - create
 * - commit
 * - init
 * - upgrade
 * - help
 */
import arg from "arg";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import findGitRoot from "find-git-root";

import { parseModules } from "./scripts/parse.js";
import { createDemo } from "./scripts/demo.js";
import { addModules } from "./scripts/add.js";
import { info } from "./scripts/info.js";
import { removeModules } from "./scripts/remove.js";
import { commitModules } from "./scripts/commit-module.js";
import { upgradeScaffold } from "./scripts/upgrade.js";
import {
  valid,
  invalid,
  section,
  isUserEnvironment,
  isLoginNotReqCommand
} from "./utils.js";
import { createModule } from "./scripts/create.js";
import { login } from "./scripts/login.js";
import { configFile } from "./scripts/utils/configFile.js";
import { sendFeedback } from "./scripts/feedback.js";
import { logout } from "./scripts/logout.js";
import { modulesArchive, modulesGet, modulesList } from "./scripts/modules.js";
import { publish } from "./scripts/publish.js";
import {
  validateEnvironmentDependencies,
  EnvironmentDependency
} from "./scripts/utils/environment.js";
import { analytics } from "./scripts/analytics/wrapper.js";
import {
  HAS_ASKED_OPT_IN_NAME,
  OPT_IN_NAME
} from "./scripts/analytics/config.js";
import { EVENT } from "./scripts/analytics/constants.js";
import { configureInitialLogin } from "./scripts/analytics/scripts.js";
import { sentryMonitoring } from "./scripts/utils/sentry.js";
import { setModuleDetails } from "./scripts/setModuleDetails.js";
import { isUserLoggedIn } from "./scripts/utils/auth.js";
import { logger, prettyPrintShellOutput } from "./scripts/utils/logger.js";

const GLOBAL_ARGS = {
  "--verbose": Boolean,
  "--skip-login-check": Boolean
};

const gitRoot = () => {
  try {
    return path.dirname(findGitRoot(process.cwd()));
  } catch {
    invalid(
      `This command must be executed inside a git repository.
Visit our official documentation for more information and try again: https://docs.crowdbotics.com/creating-reusable-modules`
    );
  }
};

async function dispatcher() {
  const useDefaults = process.env.npm_config_yes;

  // check config if the inital login has been done
  const isInitialLogin = configFile.get(HAS_ASKED_OPT_IN_NAME) || false;
  if (!isInitialLogin && isUserEnvironment && !useDefaults) {
    await configureInitialLogin();
  }

  // Compulsory dependencies check on each command
  // Note: This is a forced check, so no cache is used
  // consider performance implications when adding new dependencies
  validateEnvironmentDependencies([EnvironmentDependency.CLI], true, false);

  const command = process.argv[2];

  if (!command) {
    return commands.help();
  }

  if (!Object.prototype.hasOwnProperty.call(commands, command)) {
    invalid(`command doesn't exist: ${command}`);
  }

  sentryMonitoring.registerCommandName(command);

  const isLoggedIn = isUserLoggedIn();
  const skipLoginCheck = process.argv.includes("--skip-login-check");

  if (!skipLoginCheck && !isLoggedIn && !isLoginNotReqCommand(command)) {
    section(
      "We see you are not logged in. Please log in to run Crowdbotics commands"
    );
    await login();
  }

  await commands[command]();

  if (!analytics.event.name && !useDefaults) {
    analytics.sendEvent({
      name: EVENT.OTHER,
      properties: {
        command,
        fullCommand: process.argv.slice(2, process.argv.length).join(" ")
      }
    });
  }
}

const commands = {
  demo: async () => {
    const args = arg({
      ...GLOBAL_ARGS,
      "--source": String
    });

    const { "--source": source = "master" } = args;

    await createDemo(path.join(gitRoot(), "demo"), source);
    valid("demo app successfully generated");
  },
  parse: () => {
    const args = arg({
      ...GLOBAL_ARGS,
      "--source": String,
      "--write": String
    });

    if (!args["--source"]) {
      invalid("missing required argument: --source");
    }

    const data = parseModules(path.join(args["--source"]), gitRoot());
    if (args["--write"] && process.exitCode !== 1) {
      fs.mkdirSync(path.dirname(path.join(args["--write"])), {
        recursive: true
      });
      fs.writeFileSync(
        path.join(args["--write"]),
        JSON.stringify(data, null, 2),
        "utf8"
      );
    }
  },
  add: () => {
    validateEnvironmentDependencies([
      EnvironmentDependency.Python,
      EnvironmentDependency.Yarn
    ]);

    const args = arg({
      ...GLOBAL_ARGS,
      "--source": String,
      "--project": String
    });
    const modules = args._.slice(1);
    if (!modules.length) {
      invalid("please provide the name of the modules to be installed");
    }
    addModules(modules, args["--source"], args["--project"], gitRoot());
  },
  remove: () => {
    validateEnvironmentDependencies([EnvironmentDependency.Yarn]);

    const args = arg({
      ...GLOBAL_ARGS,
      "--source": String,
      "--project": String
    });
    const modules = args._.slice(1);
    if (!modules.length) {
      invalid("please provide the name of the modules to be removed");
    }
    removeModules(modules, args["--source"], args["--project"], gitRoot());
  },
  create: () => {
    validateEnvironmentDependencies([EnvironmentDependency.Python]);

    const args = arg({
      ...GLOBAL_ARGS,
      "--name": String,
      "--type": String,
      "--target": String,
      "--search-description": String,
      "--acceptance-criteria": String
    });

    analytics.sendEvent({
      name: EVENT.CREATE_MODULE,
      properties: { Name: args["--name"] }
    });

    createModule(
      args["--name"],
      args["--type"],
      args["--target"],
      args["--search-description"],
      args["--acceptance-criteria"],
      gitRoot()
    );
  },
  commit: () => {
    const args = arg({
      ...GLOBAL_ARGS,
      "--source": String
    });
    const modules = args._.slice(1);
    if (!modules.length) {
      invalid("please provide the name of the modules to be commited");
    }
    commitModules(modules, args["--source"], gitRoot());
  },
  init: () => {
    validateEnvironmentDependencies([EnvironmentDependency.Git]);

    const args = arg({
      ...GLOBAL_ARGS,
      "--name": String
    });
    if (!args["--name"]) {
      invalid("missing required argument: --name");
    }
    const baseDir = path.join(process.cwd(), args["--name"]);

    logger.verbose("init base dir", baseDir);

    const git = spawnSync("git init", [args["--name"]], {
      cwd: process.cwd(),
      shell: true
    });
    if (git.error) {
      invalid("git init failed", git.stderr);
    }
    const gitignore = `logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
node_modules/
.npm
.DS_Store
.idea
demo`;
    fs.mkdirSync(path.join(baseDir, "modules"));
    fs.writeFileSync(path.join(baseDir, ".gitignore"), gitignore, "utf8");
    fs.writeFileSync(path.join(baseDir, "modules", ".keep"), "", "utf8");
    const gitAddResult = spawnSync("git add .gitignore modules", [], {
      cwd: baseDir,
      shell: true
    });

    logger.verbose("init git add", prettyPrintShellOutput(gitAddResult));

    const gitCommitResult = spawnSync("git commit -m 'Initial commit'", [], {
      cwd: baseDir,
      shell: true
    });

    logger.verbose("init git commit", prettyPrintShellOutput(gitCommitResult));
  },
  upgrade: () => {
    const args = arg({
      ...GLOBAL_ARGS,
      "--version": String
    });
    analytics.sendEvent({ name: EVENT.UPGRADE });
    upgradeScaffold(args["--version"]);
  },
  login: () => {
    login();
  },
  logout: () => {
    logout();
  },
  info: () => {
    info();
  },
  config: () => {
    const args = arg({
      ...GLOBAL_ARGS
    });

    const action = args._[1];
    const key = args._[2];
    const value = args._[3];

    if (!action.length) {
      return invalid("Please provide the action to perform on the config");
    }

    switch (action) {
      case "set":
        if (!key) {
          return invalid("Please specify the config key to set.");
        }
        if (!value) {
          return invalid("Please specify the config value to set.");
        }

        configFile.set(key, value);
        configFile.save();

        break;
      case "get":
        if (!key) {
          return invalid("Please specify the config key to get.");
        }

        section(configFile.get(key));

        break;
      default:
        invalid(`Invalid action "${action}" for config command`);
    }
  },

  modules: async () => {
    const args = arg({
      ...GLOBAL_ARGS,
      "--search": String,
      "--visibility": String,
      "--status": String,
      "--page": String,
      "--unarchive": Boolean,
      "--name": String,
      "--description": String,
      "--acceptance-criteria": String,
      "--search-description": String
    });

    let id;
    const action = args._[1];

    if (!action.length) {
      // TODO - Print help?
      return invalid(
        "Please provide the action to perform on the modules, i.e. modules list"
      );
    }

    switch (action) {
      case "list":
        analytics.sendEvent({ name: EVENT.LIST_MODULES });
        await modulesList({
          search: args["--search"],
          status: args["--status"],
          visibility: args["--visibility"],
          page: args["--page"] ? Number(args["--page"]) : undefined
        });
        break;

      case "get":
        id = args._[2];
        if (!id) {
          return invalid(
            "Please provide the id of the module to get, i.e. modules get <123>"
          );
        }

        await modulesGet(id);
        break;

      case "set":
        id = args._[2];

        if (!id) {
          return invalid(
            "Please provide the id of the module to change info for, i.e. modules set <123>"
          );
        }

        await setModuleDetails(
          id,
          args["--name"],
          args["--description"],
          args["--acceptance-criteria"],
          args["--search-description"]
        );

        break;

      case "archive":
        id = args._[2];
        if (!id) {
          return invalid(
            "Please provide the id of the module to archive, i.e. modules archive <123>"
          );
        }

        await modulesArchive(id, !!args["--unarchive"]);
        break;

      case "help":
        section(
          `Commands available:
            list    List the current modules available to install
                    --search <query> Search for a module by given text
                    --status <published | archived> Search for a module by either published or archived modules (default all)
                    --visibility <private | public> Search for a module with a specific visibility (default all)
            get     <id>  Get the details for the specified module
            archive <id> Archive the specified module to prevent future installation to a project
                    --unarchive Undo the archive of the module to set the status back to Published
          `
        );
        break;

      default:
        invalid(`Invalid action "${action}" for modules command`);
    }
  },
  publish: () => {
    analytics.sendEvent({
      name: EVENT.PUBLISH_MODULES
    });
    publish();
  },

  feedback: () => {
    const args = arg({
      ...GLOBAL_ARGS
    });
    const action = args._[1];

    if (!action) {
      return invalid(
        "Please provide the message or action to perform for feedback"
      );
    }
    switch (action) {
      case "help":
        console.log(`
        Influence how Crowdbotics shapes and grows its developer tools. Use the feedback
        command to send ideas and recommendations to our Product Team any time. We may
        contact you to follow up.

        Please contact Support for help using Crowdbotics or to report errors, bugs, and
        other issues.
        https://app.crowdbotics.com/dashboard/user/support
        `);
        break;

      default:
        sendFeedback(action);
    }
  },
  optout: () => {
    if (!configFile.get(OPT_IN_NAME)) {
      console.log("You are already opted out for analytics");
      return;
    }
    configFile.set(OPT_IN_NAME, false);
    configFile.save();
    valid("Successfully opted out of analytics");
  },
  optin: () => {
    if (configFile.get(OPT_IN_NAME)) {
      console.log("You are already opted in for analytics");
      return;
    }
    configFile.set(OPT_IN_NAME, true);
    configFile.save();
    valid("Successfully opted in of analytics");
  },
  help: () => {
    console.log(`usage: cb <command>

Commands available:
  add               Install a module in the demo app
  commit            Update an existing module from the demo source code
  create            Create a new module of a given type
  demo              Generate a local React Native and Django demo app
  feedback          Send feedback to Crowdbotics to let us know how we're doing
  help              Show this help page
  init              Initialize a blank modules repository
  login             Login to your Crowdbotics account. May require 2FA (two-factor authentication).
  logout            Logout of your Crowdbotics account
  modules           Manage modules for your organization
  modules archive   Sets module into archived state
  modules get       Get information about a module by id
  modules list      Lists modules available
  modules set       Set information about a module by id such as name, description, acceptance criteria, and search description. The new values must be wrapped in quotes such as "value"
  optin             Opt in for Crowdbotics analytics
  optout            Opt out for Crowdbotics analytics
  parse             Parse and validate your modules
  publish           Publish your modules to your organization's private catalog
  remove            Remove a module from the demo app
  upgrade           Upgrade your existing app's scaffold to the latest version


Create a demo app:
  cb demo

Create a module of a given type:
  cb create --name <module-name> --type <all/react-native/django/custom>

Get information about a module by id:
  cb modules get <module-id>

Initialize a modules repository:
  cb init --name <my-modules-repository-name>

Install one or modules to your demo app:
  cb add <module-name> <module-name-2>

  The new values must be wrapped in quotes "<value>".

Install modules from other directory:
  cb add --source ../other-repository <module-name>

Install modules to other app that is not "demo":
  cb add --project ../other-project <module-name>

Parse and validate your modules:
  cb parse --source <path>

Parse modules and write the data to a json file:
  cb parse --source <path> --write <path>

Remove modules from app that is not "demo":
  cb remove --project ../other-project <module-name>

Remove one or modules from your demo app:
cb remove <module-name> <module-name-2>

Set information about a module by id such as name, description, acceptance criteria, and search description:
cb modules set <module-id> --name "New Module Name" --description "A detailed description of the module" --acceptance-criteria "The criteria that must be met for this module"

Update a module definition from the demo app:
  cb commit <module-name>

Update a module definition from other app:
  cb commit <module-name> --source <path>

Upgrade your scaffold to the latest master:
  cb upgrade

Upgrade your scaffold to a specific version (git tag, git commit or branch name):
  cb upgrade --version 2.3.0

Glossary:
  <module-name> stands for the name of the directory where the module is defined.
`);
  }
};

try {
  dispatcher().catch((error) => {
    sentryMonitoring.captureException(error);
    invalid(error);
  });
} catch (err) {
  sentryMonitoring.captureException(err);
  invalid(err);
}
