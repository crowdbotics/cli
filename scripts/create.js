import fs, { existsSync } from "fs";
import path from "path";
import { invalid, section } from "../utils.js";
import { execSync } from "child_process";
import {
  pyprojectToml,
  setupPy,
  packageJson,
  indexJs,
  generateMeta
} from "./utils/templates.js";
import { execOptions, configurePython } from "./utils/environment.js";
import inquirer from "inquirer";

function generateRNFiles(base, name, relative = "/") {
  if (relative !== "/") {
    fs.mkdirSync(path.join(base, relative), {
      recursive: true
    });
  }
  fs.writeFileSync(
    path.join(base, relative, "package.json"),
    packageJson(name),
    "utf8"
  );
  fs.writeFileSync(
    path.join(base, relative, "index.js"),
    indexJs(name),
    "utf8"
  );
}

function generateDjangoFiles(base, name, relative = "/") {
  const sanitizedName = name.replaceAll("-", "_");
  const djangoName = `django_${sanitizedName}`;
  const basePath = path.join(base, relative, djangoName);
  const innerAppPath = path.join(basePath, sanitizedName);

  fs.mkdirSync(innerAppPath, { recursive: true });
  execSync(`cd ${innerAppPath}`, execOptions);
  configurePython();
  execSync("pipenv install django==3.2.23", execOptions);
  execSync(
    `pipenv run django-admin startapp ${sanitizedName} ${innerAppPath}`,
    execOptions
  );

  const appsFileData = fs.readFileSync(`${innerAppPath}/apps.py`, "utf8");
  const result = appsFileData.replace(
    /name = '.*'/,
    `name = 'modules.django_${sanitizedName}.${sanitizedName}'`
  );
  fs.writeFileSync(`${innerAppPath}/apps.py`, result, "utf8");

  fs.writeFileSync(
    path.join(base, relative, djangoName, "setup.py"),
    setupPy(sanitizedName),
    "utf8"
  );
  fs.writeFileSync(
    path.join(base, relative, djangoName, "pyproject.toml"),
    pyprojectToml,
    "utf8"
  );
}

const isNameValid = (name) => {
  const pattern = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
  return pattern.test(name);
};

export async function createModule(
  initialName,
  initialType,
  target,
  initialSearchDescription,
  initialAcceptanceCriteria,
  gitRoot
) {
  let name, type, searchDescription, acceptanceCriteria;

  if (initialName) {
    name = initialName;
  } else {
    const { inputName } = await inquirer.prompt({
      message: "Module Name:",
      name: "inputName",
      type: "input"
    });

    name = inputName;
  }

  if (initialType) {
    type = initialType;
  } else {
    const { inputType } = await inquirer.prompt({
      message: "Module Type:",
      name: "inputType",
      type: "list",
      choices: ["all", "react-native", "django"]
    });

    type = inputType;
  }

  if (!name) {
    invalid("missing required argument: --name");
  }
  if (!type) {
    invalid("missing required argument: --type");
  }
  if (!isNameValid(name)) {
    invalid(
      `invalid module name provided: '${name}'. Use only alphanumeric characters, dashes and underscores.`
    );
  }

  if (!initialName) {
    const { inputSearchDescription, inputAcceptanceCriteria } =
      await inquirer.prompt([
        {
          message: "Search Description:",
          name: "inputSearchDescription",
          type: "editor"
        },
        {
          message: "Acceptance Criteria:",
          name: "inputAcceptanceCriteria",
          type: "editor"
        }
      ]);

    searchDescription = inputSearchDescription;
    acceptanceCriteria = inputAcceptanceCriteria;
  }

  const cwd = process.cwd();

  if (target) {
    target = path.join(cwd, target);
  } else {
    target = path.join(gitRoot, "modules");
  }

  const slugMap = {
    all: name,
    "react-native": `react-native-${name}`,
    django: `django-${name}`
  };
  const slug = slugMap[type];

  if (!Object.prototype.hasOwnProperty.call(slugMap, type)) {
    invalid(`invalid module type provided: ${type}`);
  }

  const dir = path.join(target, slug);
  if (existsSync(dir)) invalid(`module named "${slug}" already exists`);

  const meta = generateMeta(name, type, searchDescription, acceptanceCriteria);

  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "meta.json"),
      JSON.stringify(meta, null, 2),
      "utf8"
    );

    section(`generating ${name} module (${type})`);
    switch (type) {
      case "all":
        generateDjangoFiles(dir, name, "/backend/modules");
        generateRNFiles(dir, name, `/modules/${name}`);
        break;
      case "react-native":
        generateRNFiles(dir, name);
        break;
      case "django":
        generateDjangoFiles(dir, name);
        break;
    }
  } catch (error) {
    if (existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
    throw error;
  }
}
