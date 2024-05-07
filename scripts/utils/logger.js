class Logger {
  constructor() {
    this._verboseEnabled = process.argv.includes("--verbose");

    this.verbose("Verbose mode enabled");
  }

  verbose(...messages) {
    if (!this._verboseEnabled) {
      return;
    }
    console.info("[verbose]", `[${new Date().toISOString()}]`, ...messages);
  }
}

export const logger = new Logger();

export const prettyPrintShellOutput = (shellOutput) => {
  const { output, stdout, stderr, ...rest } = shellOutput;

  return {
    ...rest,
    stdout: stdout?.toString(),
    stderr: stderr?.toString(),
    output: output?.map((item) =>
      item instanceof Buffer ? item.toString() : item
    )
  };
};
