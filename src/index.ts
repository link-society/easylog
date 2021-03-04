export enum LogLevel {
  Debug = 1,
  Info,
  Warning,
  Error,
}

export interface LogWriter {
  log(message: string): void,
  warn(message: string): void,
  error(message: string): void
}

export type LogRecord = {
  [property: string]: string | number | boolean
}

export type LogProcessor = (record: LogRecord) => LogRecord
export type ErrorProcessor = (error: Error) => LogRecord

export type LoggingConfiguration = {
  level: LogLevel,
  writer: LogWriter,
  processor: LogProcessor,
  errorProcessor: ErrorProcessor
}

const makeLogFormatter = (config: LoggingConfiguration) =>
  (targetLevel: LogLevel, record: LogRecord): void => {
    const { level, writer, processor } = config

    if (targetLevel >= level) {
      const proplist = Object.entries(processor(record))
      const logLine = proplist.reduce(
        (acc, [key, val = '']) => `${acc} ${key}="${val.toString()}"`,
        `level=${LogLevel[targetLevel].toLowerCase()} timestamp=${Date.now()}`
      )

      switch (targetLevel) {
        case LogLevel.Debug:
        case LogLevel.Info:
          writer.log(logLine)
          break

        case LogLevel.Warning:
          writer.warn(logLine)
          break

        case LogLevel.Error:
          writer.error(logLine)
      }
    }
  }

class Logger {
  #config: LoggingConfiguration

  constructor() {
    this.#config = {
      level: (process.env.NODE_ENV === 'production' ? LogLevel.Info : LogLevel.Debug),
      writer: console,
      processor: record => record,
      errorProcessor: error => ({
        type: error.name,
        message: error.message,
        stack: error.stack || ''
      })
    }
  }

  get formatter() {
    return makeLogFormatter(this.#config)
  }

  configure(config: Partial<LoggingConfiguration>) {
    if (typeof config.level !== 'undefined') {
      this.#config.level = config.level
    }

    if (typeof config.writer !== 'undefined') {
      this.#config.writer = config.writer
    }

    if (typeof config.processor !== 'undefined') {
      this.#config.processor = config.processor
    }

    if (typeof config.errorProcessor !== 'undefined') {
      this.#config.errorProcessor = config.errorProcessor
    }
  }

  get config(): Readonly<LoggingConfiguration> {
    return this.#config
  }

  debug(record: LogRecord) {
    this.formatter(LogLevel.Debug, record)
  }

  info(record: LogRecord) {
    this.formatter(LogLevel.Info, record)
  }

  warn(record: LogRecord) {
    this.formatter(LogLevel.Warning, record)
  }

  error(error: Error) {
    this.formatter(LogLevel.Error, this.#config.errorProcessor(error))
  }
}

export default new Logger()
