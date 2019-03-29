// @flow

export class Logger {
  tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  enhancedLog(level: string, ...data: any): void {
    const strToLog = `${level.toUpperCase()} - ${this.tag}: `;
    console[level](strToLog, ...data);
  }

  log(...data: any): void {
    this.enhancedLog('log', ...data);
  }

  info(...data: any): void {
    this.enhancedLog('info', ...data);
  }

  error(...data: any): void {
    this.enhancedLog('error', ...data);
  }

  debug(...data: any): void {
    this.enhancedLog('debug', ...data);
  }

  warn(...data: any): void {
    this.enhancedLog('warn', ...data);
  }

  table(...data: any): void {
    this.enhancedLog('table', ...data);
  }
}
