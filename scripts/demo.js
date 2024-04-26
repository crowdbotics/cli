import path from "path";
import fs from "fs";
import { section } from "../utils.js";
import fetch from "node-fetch";
import config from "../config.js";
import unzipper from "unzipper";

async function downloadAndExtract(url, target) {
  const rnResponse = await fetch(url);
  if (rnResponse.ok && rnResponse.body) {
    rnResponse.body.pipe(unzipper.Extract({ path: target }));
  }
}

export async function createDemo(dir, target = "master") {
  const rnDemoUrl = `${config.constants.REACT_NATIVE_SCAFFOLD_REPO_ORIGIN}/raw/${target}/dist/react-native-demo.zip`;
  const djangoDemoUrl = `${config.constants.DJANGO_SCAFFOLD_REPO_ORIGIN}/raw/${target}/dist/django-demo.zip`;

  if (fs.existsSync(dir)) {
    section("Removing previous demo app");
    fs.rmSync(dir, { recursive: true });
  }

  fs.mkdirSync(dir, { recursive: true });
  await downloadAndExtract(rnDemoUrl, dir);
  await downloadAndExtract(djangoDemoUrl, path.join(dir, "backend"));
}
