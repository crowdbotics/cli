import { execSync, spawnSync } from "node:child_process";
import { invalid, section, valid } from "../../utils.js";
import { configFile } from "./configFile.js";
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
  CookieCutter: "cookiecutter"
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

  if (EnvironmentDependency.CookieCutter) {
    const cookiecutter = spawnSync("cookiecutter --version", {
      cwd: userdir,
      shell: true,
      encoding: "utf8"
    });

    logger.verbose("Cookiecutter dependency check", cookiecutter);

    if (!cookiecutter.stderr && !cookiecutter.error) {
      environmentVersions.cookiecutter = cookiecutter.stdout;
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
    EnvironmentDependency.CookieCutter
  ],
  force = false
) {
  section("Checking environment compatibility");

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

  const environmentVersions = {
    ...cachedEnvironmentVersions,
    ...currentEnvironmentVersions
  };

  configFile.set(ENVIRONMENT_VERSIONS_CONFIG_NAME, environmentVersions);
  configFile.save();

  const printInvalidMessage = (message) =>
    invalid(
      `${message}\n\nVisit the following page for environment requirements https://github.com/crowdbotics/modules?tab=readme-ov-file#requirements-for-contributing`
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
}
