/* jshint expr:true */
'use strict'

const PREFIX = "====> "
const ERROR_PREFIX = PREFIX + "X "
const WARNING_PREFIX = PREFIX + "! "
const DEBUG_PREFIX = PREFIX + "+ "

const RESULTS_HEADER =
`|=======|
|RESULTS|
|=======|
`

const isTesting = process.env.NODE_ENV === "test"
const isDevelopment = process.env.NODE_ENV === "development"

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
    isTesting || console.log(prefixLines(message, ERROR_PREFIX))
  }

/**
 * Prints an error to the console
 * @param {String} message
 */
  const warn = message => {
    isTesting || console.log(prefixLines(message, WARNING_PREFIX))
  }

/**
 * Debugs to the console only in development
 * @param {String} message
 */
  const debug = message => {
    isDevelopment && console.log(prefixLines(message, DEBUG_PREFIX))
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
