# easylog

EasyLog is a very simple and minimalist logging library. It exists because this
code was copied/pasted in almost every project we maintain.

## Installation

```
$ yarn add @link-society/easylog
```

## Usage

**In TypeScript:**

```typescript
import logging, { LogLevel } from '@link-society/easylog'

logging.configure({
  level: LogLevel.Info
})

logging.debug({ foo: 'bar' }) // will not be printed
logging.info({ foo: 'bar' })  // will be printed
```

**In NodeJS:**

```javascript
const { default: logging, LogLevel } = require('@link-society/easylog')

logging.configure({
  level: LogLevel.Info
})

logging.debug({ foo: 'bar' }) // will not be printed
logging.info({ foo: 'bar' })  // will be printed
```

## API

The methods `debug`, `info` and `warn` accepts a `LogRecord` object, it is an
object whose properties are either a `string`, a `number` or a `boolean`.

The method `error` accepts an `Error` object and and will generate the
`LogRecord` object.

The method `configure` accepts an object with the following properties:

| Name | Type | Description |
|---|---|---|
| `level` | `Optional<LogLevel>` | Minimum logging level required to be written to the output |
| `writer` | `Optional<LogWriter>` | Object used to write the output (example: `console`) |
| `processor` | `Optional<LogProcessor>` | Function used to transform the log record before writing it |
| `errorProcessor` | `Optional<ErrorProcessor>` | Function used to generate the log record from an error |

## License

This library is released under the terms of the [MIT License](./LICENSE.txt).
