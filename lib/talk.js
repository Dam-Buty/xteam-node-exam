/* jshint expr:true */

const PREFIX = "====> "
const ERROR_PREFIX = PREFIX + "X "
const WARNING_PREFIX = PREFIX + "! "
const DEBUG_PREFIX = PREFIX + "+ "

const RESULTS_HEADER =
`|=======|
|RESULTS|
|=======|
`

/**
 * Adds a prefix to every line of a multiline string
 * @param {String} message
 * @param {String} prefix
 */
const prefixLines = (message, prefix) => message
  .split("\n")
  .map(line => prefix + line)
  .join("\n")

/**
 * Prints an error to the console
 * @param {String} message
 */
  const error = message => {
    process.env.NODE_ENV === "test" || console.log(prefixLines(message, ERROR_PREFIX))
  }

/**
 * Prints an error to the console
 * @param {String} message
 */
  const warn = message => {
    process.env.NODE_ENV === "test" || console.log(prefixLines(message, WARNING_PREFIX))
  }

/**
 * Debugs to the console only in development
 * @param {String} message
 */
  const debug = message => {
    if (process.env.NODE_ENV === "development") {
      process.env.NODE_ENV === "test" || console.log(prefixLines(message, DEBUG_PREFIX))
    }
  }

/**
 * Prints to the console without prefix
 */
  const respond = message => {
    console.log(RESULTS_HEADER)
    console.log(message)
  }

  module.exports = {
    error,
    warn,
    debug,
    respond
  }
