
const PREFIX = "====> "
const ERROR_PREFIX = PREFIX + "X "
const WARNING_PREFIX = PREFIX + "! "
const DEBUG_PREFIX = PREFIX + "+ "

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
 * Prints a message to the console
 * @param {String} message
 */
  const talk = message => {
    console.log(prefixLines(message, PREFIX))
  }

/**
 * Prints an error to the console
 * @param {String} message
 */
  const error = message => {
    console.log(prefixLines(message, ERROR_PREFIX))
  }

/**
 * Prints an error to the console
 * @param {String} message
 */
  const warn = message => {
    console.log(prefixLines(message, WARNING_PREFIX))
  }

/**
 * Debugs to the console only in development
 * @param {String} message
 */
  const debug = message => {
    if (process.env.NODE_ENV === "development") {
      console.log(prefixLines(message, DEBUG_PREFIX))
    }
  }

/**
 * Debugs to the console only in development
 * @param {String} message
 */
  const respond = console.log

  module.exports = {
    talk,
    error,
    warn,
    debug,
    respond
  }
