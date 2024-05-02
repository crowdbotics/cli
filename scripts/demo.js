import path from "path";
import fs from "fs";
import { section } from "../utils.js";
import fetch from "node-fetch";
import config from "../config.js";
import unzipper from "unzipper";
import { logger } from "./utils/logger.js";

async function downloadAndExtract(url, target) {
  logger.verbose("demo download request", target, url);

  const rnResponse = await fetch(url);

  logger.verbose(
    "demo download response",
    rnResponse.status,
    rnResponse.statusText
  );

  if (rnResponse.ok && rnResponse.body) {
    rnResponse.body.pipe(unzipper.Extract({ path: target }));
  } else {
    throw new Error("Failed to download scaffold for demo app.");
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
