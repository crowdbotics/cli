class Logger {
  constructor() {
    this._verboseEnabled = process.argv.includes("--verbose");

    this.log("Verbose mode enabled");
  }

  log(...messages) {
    if (!this._verboseEnabled) {
      return;
    }
    console.info("[verbose]", `[${new Date().toISOString()}]`, ...messages);
  }
}

export const logger = new Logger();
