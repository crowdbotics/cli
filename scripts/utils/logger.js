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
