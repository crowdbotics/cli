import { execSync, spawnSync } from "node:child_process";
import { invalid, section, valid, warn } from "../../utils.js";
import { configFile } from "./configFile.js";
import semver from "semver";
import { logger } from "./logger.js";

const ENVIRONMENT_VERSIONS_CONFIG_NAME = "environment-versions";
const PYTHON_VERSION_REGEX = /Python (3\.[0-9]*)/;

const userdir = process.cwd();

export const execOptions = { encoding: "utf8", stdio: "inherit" };

export const EnvironmentDependency = {
  Yarn: "yarn",
  Git: "git",
  Python: "python",
  PipEnv: "pipenv",
  CookieCutter: "cookiecutter",
  CLI: "cli"
};

/**
 * Setup Python environment to desired version
 * @param {*} options: exec options
 */
export function configurePython(options = execOptions) {
  execSync("pipenv --python 3.8.17", options);
}

function formatStdout(stdout) {
  return stdout.replace(/\n/g, "");
}

export function getEnvironmentVersions(dependencies) {
  const environmentVersions = {};

  if (dependencies.includes(EnvironmentDependency.Yarn)) {
    const yarn = spawnSync("yarn", ["--version"], {
      cwd: userdir,
      shell: true,
      encoding: "utf8"
    });

    logger.verbose("Yarn dependency check", yarn);

    if (!yarn.error && !yarn.stderr) {
      environmentVersions.yarn = formatStdout(yarn.stdout);
    }
  }

  if (dependencies.includes(EnvironmentDependency.Git)) {
    const git = spawnSync("git", ["--version"], {
      cwd: userdir,
      shell: true,
      encoding: "utf8"
    });

    logger.verbose("Git dependency check", git);

    if (!git.error && !git.stderr) {
      environmentVersions.git = formatStdout(git.stdout);
    }
  }

  if (dependencies.includes(EnvironmentDependency.Python)) {
    const python = spawnSync("python", ["--version"], {
      cwd: userdir,
      shell: true,
      encoding: "utf8"
    });

    logger.verbose("Python dependency check", python);

    if (python.stdout && !python.error && !python.stderr) {
      const versionMatch = python.stdout.match(PYTHON_VERSION_REGEX);

      if (versionMatch && versionMatch[1]) {
        environmentVersions.python = versionMatch[1];
      }
    }
  }

  if (dependencies.includes(EnvironmentDependency.PipEnv)) {
    const pipenv = spawnSync("pipenv", ["--version"], {
      cwd: userdir,
      shell: true,
      encoding: "utf8"
    });

    logger.verbose("pipenv dependency check", pipenv);

    if (!pipenv.stderr && !pipenv.error) {
      environmentVersions.pipenv = formatStdout(pipenv.stdout);
    }
  }

  if (dependencies.includes(EnvironmentDependency.CookieCutter)) {
    const cookiecutter = spawnSync("cookiecutter --version", {
      cwd: userdir,
      shell: true,
      encoding: "utf8"
    });

    logger.verbose("Cookiecutter dependency check", cookiecutter);

    if (!cookiecutter.stderr && !cookiecutter.error) {
      environmentVersions.cookiecutter = cookiecutter.stdout.trim();
    }
  }

  if (dependencies.includes(EnvironmentDependency.CLI)) {
    const registryResult = spawnSync("npm view crowdbotics --json", {
      cwd: userdir,
      shell: true,
      encoding: "utf8",
      timeout: 2000 // 2 second to keep the CLI working without internet
    });

    const localCLIResult = spawnSync("npm list -g crowdbotics --depth=0", {
      cwd: userdir,
      shell: true,
      encoding: "utf8",
      timeout: 2000
    });

    if (!registryResult.stderr && !registryResult.error) {
      const result = JSON.parse(registryResult.stdout);
      environmentVersions.cli = {
        registry: {
          version: result?.version,
          latest: result?.["dist-tags"]?.latest,
          lastChecked: new Date().toISOString()
        }
      };
    }

    if (!localCLIResult.stderr && !localCLIResult.error) {
      const localCLI = localCLIResult.stdout.match(/crowdbotics@([0-9.]+)/);
      environmentVersions.cli = {
        ...environmentVersions.cli,
        local: {
          version: localCLI?.[1] || "0.0.0"
        }
      };
    }
  }

  return environmentVersions;
}

export function validateEnvironmentDependencies(
  dependencies = [
    EnvironmentDependency.Yarn,
    EnvironmentDependency.Git,
    EnvironmentDependency.Python,
    EnvironmentDependency.PipEnv,
    EnvironmentDependency.CookieCutter,
    EnvironmentDependency.CLI
  ],
  force = false,
  showTitle = true
) {
  // We don't always want to show the title for future silent validations
  if (showTitle) {
    section("Checking environment compatibility");
  }

  logger.verbose("Validating environment dependencies", dependencies);

  const configValues = configFile.get(ENVIRONMENT_VERSIONS_CONFIG_NAME);

  const cachedEnvironmentVersions = !force && configValues ? configValues : {};

  let missingEnvironmentVersions = dependencies;

  if (!force) {
    missingEnvironmentVersions = dependencies.filter(
      (dependency) => !cachedEnvironmentVersions[dependency]
    );
  }

  const currentEnvironmentVersions = getEnvironmentVersions(
    missingEnvironmentVersions
  );
  logger.verbose("current environment versions", currentEnvironmentVersions);

  const environmentVersions = {
    ...cachedEnvironmentVersions,
    ...currentEnvironmentVersions
  };

  logger.verbose(
    "all environment versions (including cache)",
    currentEnvironmentVersions
  );

  configFile.set(ENVIRONMENT_VERSIONS_CONFIG_NAME, environmentVersions);
  configFile.save();

  const printInvalidMessage = (message) =>
    invalid(
      `${message}\n\nVisit the following page for environment requirements https://docs.crowdbotics.com/v1/docs/set-up-your-dev-env`
    );

  if (dependencies.includes(EnvironmentDependency.Yarn)) {
    if (!environmentVersions.yarn) {
      printInvalidMessage("yarn is not available in your system");
    } else {
      valid("yarn version", environmentVersions.yarn);
    }
  }

  if (dependencies.includes(EnvironmentDependency.Git)) {
    if (!environmentVersions.git) {
      printInvalidMessage("git is not available in your system");
    } else {
      valid(environmentVersions.git);
    }
  }

  if (dependencies.includes(EnvironmentDependency.Python)) {
    if (!environmentVersions.python) {
      printInvalidMessage("Python 3.x is not available in your system");
    } else {
      valid(environmentVersions.python);
    }
  }

  if (dependencies.includes(EnvironmentDependency.PipEnv)) {
    if (!environmentVersions.pipenv) {
      printInvalidMessage("pipenv is not available in your system");
    } else {
      valid(environmentVersions.pipenv);
    }
  }

  if (dependencies.includes(EnvironmentDependency.CookieCutter)) {
    if (!environmentVersions.cookiecutter) {
      printInvalidMessage("cookiecutter is not available in your system");
    } else {
      valid(environmentVersions.cookiecutter);
    }
  }

  if (dependencies.includes(EnvironmentDependency.CLI)) {
    if (!environmentVersions?.cli || !environmentVersions?.cli?.local) {
      logger.verbose("cli is not available in your system");
      return;
    }

    if (!environmentVersions?.cli?.registry) {
      logger.verbose("unable to fetch the latest version of the CLI");
      return;
    }

    const cliVersionMessage = `CLI Version current: ${environmentVersions?.cli?.local?.version} latest: ${environmentVersions?.cli?.registry?.latest}`;
    const updateVersionMessage =
      "You have an older version. Please update to new version by following this command: npm install -g crowdbotics";
    const compare = semver.compare(
      environmentVersions?.cli?.local?.version,
      environmentVersions?.cli?.registry?.latest
    );
    if (compare < 0) {
      warn(cliVersionMessage);
      warn(updateVersionMessage);
    } else {
      valid(cliVersionMessage);
    }
  }
}
