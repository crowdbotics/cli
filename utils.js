export const generateCommand = (str) => str.join(" ");

const VALID_MARK = "\u2705";
const INVALID_MARK = "\u274C";
const WARNING_MARK = "\u26A0";

export const valid = (...args) => {
  console.log(VALID_MARK, ...args);
};

export const invalid = (...args) => {
  console.error(INVALID_MARK, ...args);
  process.exit(1);
};

export const warn = (...args) => {
  console.log(WARNING_MARK, ...args);
};

export const section = (...args) => {
  console.log("");
  console.log(">", ...args);
};

export const isUserEnvironment = !process?.env?.CI && !process?.env?.CIRCLE_JOB;

export const compareVersions = (v1, v2) => {
  // Split version strings into parts and convert them to numbers
  // return -1 if v1 < v2, 1 if v1 > v2, and 0 if v1 == v2
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  const maxLength = Math.max(parts1.length, parts2.length);
  for (let i = 0; i < maxLength; i++) {
    const num1 = parts1[i] ?? 0;
    const num2 = parts2[i] ?? 0;
    if (num1 !== num2) {
      return Math.sign(num1 - num2);
    }
  }
  return 0;
};
