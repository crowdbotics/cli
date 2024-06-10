import { configFile } from "../utils/configFile.js";
import { formatUrlPath } from "../utils/url.js";
import { HOST_CONFIG_NAME, DEFAULT_HOST } from "../utils/constants.js";
import {
  DEVELOPMENT_SEGMENT_KEY,
  PRODUCTION_SEGMENT_KEY
} from "./constants.js";

export const HAS_ASKED_OPT_IN_NAME = "has-asked-opt-in-default";
export const OPT_IN_NAME = "opted-in-default";

const isProductionEnvironment =
  !configFile.get(HOST_CONFIG_NAME) ||
  formatUrlPath(configFile.get(HOST_CONFIG_NAME)) ===
    formatUrlPath(DEFAULT_HOST);

export const SEGMENT_API_KEY = isProductionEnvironment
  ? PRODUCTION_SEGMENT_KEY
  : DEVELOPMENT_SEGMENT_KEY;
