import fs from 'node:fs';
import path from 'node:path';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogContext {
  path?: string;
  method?: string;
  statusCode?: number;
  userId?: string;
  [key: string]: unknown;
}

class Logger {
  private logDir: string;
  private errorLogPath: string;
  private combinedLogPath: string;

  constructor() {
    this.logDir = path.resolve(process.cwd(), 'logs');
    this.errorLogPath = path.join(this.logDir, 'error.log');
    this.combinedLogPath = path.join(this.logDir, 'combined.log');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch (err) {
      console.error('[Logger] Failed to create logs directory:', err);
    }
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: unknown): string {
    const timestamp = new Date().toISOString();
    const contextStr = context && Object.keys(context).length > 0
      ? ` | Context: ${JSON.stringify(context)}`
      : '';
    
    let errorDetails = '';
    if (error) {
      if (error instanceof Error) {
        errorDetails = `\n  Error Name: ${error.name}\n  Error Message: ${error.message}\n  Stack: ${error.stack || 'N/A'}`;
      } else {
        errorDetails = `\n  Error Details: ${JSON.stringify(error, null, 2)}`;
      }
    }

    return `[${timestamp}] [${level}] ${message}${contextStr}${errorDetails}\n`;
  }

  private appendToFile(filePath: string, content: string): void {
    try {
      this.ensureLogDirectory();
      fs.appendFileSync(filePath, content, 'utf8');
    } catch (err) {
      console.error(`[Logger] Failed to write to log file (${filePath}):`, err);
    }
  }

  public info(message: string, context?: LogContext): void {
    const formatted = this.formatMessage('INFO', message, context);
    console.log(`\x1b[36m[INFO]\x1b[0m ${message}`, context || '');
    this.appendToFile(this.combinedLogPath, formatted);
  }

  public warn(message: string, context?: LogContext): void {
    const formatted = this.formatMessage('WARN', message, context);
    console.warn(`\x1b[33m[WARN]\x1b[0m ${message}`, context || '');
    this.appendToFile(this.combinedLogPath, formatted);
  }

  public error(message: string, error?: unknown, context?: LogContext): void {
    const formatted = this.formatMessage('ERROR', message, context, error);
    console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`, error || '', context || '');
    this.appendToFile(this.combinedLogPath, formatted);
    this.appendToFile(this.errorLogPath, formatted);
  }

  public debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      const formatted = this.formatMessage('DEBUG', message, context);
      console.debug(`\x1b[35m[DEBUG]\x1b[0m ${message}`, context || '');
      this.appendToFile(this.combinedLogPath, formatted);
    }
  }
}

export const logger = new Logger();
