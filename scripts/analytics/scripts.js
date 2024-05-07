import { configFile } from "../utils/configFile.js";
import { HAS_ASKED_OPT_IN_NAME, OPT_IN_NAME } from "./config.js";

export const configureInitialLogin = async () => {
  configFile.set(OPT_IN_NAME, true);
  configFile.set(HAS_ASKED_OPT_IN_NAME, true);
  configFile.save();
};
