import path from "path";
import {
  ManifestTransformer,
  execShellCommand,
  read,
  generate,
  pretty,
  write,
  parse
} from "./utils.js";

const modules = process.argv.slice(2)[0];
const cwd = process.cwd();
const demoDir = path.join(process.cwd(), "demo");
modules.map(module => {
  process.chdir(cwd);
  const originModuleDir = path.join(process.cwd(), "react-native", module);
  const targetModuleDir = path.join(demoDir, "src", "modules");
  const moduleName = `@modules/${module}`;

  let packages = [moduleName];

  // Remove x-dependencies
  const packageJSON = JSON.parse(
    read(path.join(originModuleDir, "package.json"))
  );
  if (packageJSON.hasOwnProperty("x-dependencies")) {
    const deps = packageJSON["x-dependencies"];
    // TODO: Do we want to remove blindly? What if the user installed that dep too?
    for (const [key, _] of Object.entries(deps)) {
      packages.push(`${key}`);
    }
  }

  // Remove packages
  packages = packages.join(" ");
  process.chdir(demoDir);
  execShellCommand(`yarn remove ${packages}`);
  const rmDir = path.join(targetModuleDir, module);
  execShellCommand(`rm -rf ${rmDir}`)

  // Update manifest
  const manifest = path.join(targetModuleDir, "manifest.js");
  let code = read(manifest);
  const transformer = new ManifestTransformer({ add: false, module: module });
  let node = parse(code);
  node = transformer.visit(node);
  code = pretty(generate(node));
  write(manifest, code);
});