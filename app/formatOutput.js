'use strict'

const COLUMN_WIDTH = 15
const PAD = " "
const EMPTY_COLUMN = PAD.repeat(COLUMN_WIDTH)
const LINE_SEPARATOR = "\n"

/**
 * Sorts and formats the filtered data object for printing on the console.
 * Each line is padded with the PAD character to COLUMN_WIDTH :
 * |=======|
 * |RESULTS|
 * |=======|
 * cookie        7
 * dough         2
 * @param {object[]} results
 * @return {String} formattedOutput
 */
  const formatOutput = results => {
    return Object.keys(results)
      // sort by score before formatting
      .sort((a, b) => results[b] - results[a])
      // format in columns of COLUMN_WIDTH with the scores
      .map(tag => (tag + EMPTY_COLUMN).substring(0, COLUMN_WIDTH) + results[tag])
      .join(LINE_SEPARATOR)
  }

  module.exports = formatOutput
