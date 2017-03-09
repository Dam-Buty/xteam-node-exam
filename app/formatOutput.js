
const COLUMN_WIDTH = 15
const PAD = " "
const EMPTY_COLUMN = PAD.repeat(COLUMN_WIDTH)
const LINE_SEPARATOR = "\n"

/**
 * Formats the filtered data object for printing on the console. Each line is
 * Each line is padded with the PAD character to COLUMN_WIDTH :
 * |=======|
 * |RESULTS|
 * |=======|
 * cookie        7
 * dough         2
 * @param {object[]} filteredData
 * @return {String} formattedOutput
 */
  const formatOutput = filteredData => {
    return Object.keys(filteredData)
      .sort((a, b) => filteredData[b] - filteredData[a]) // sort by score before formatting
      .map(tag => (tag + EMPTY_COLUMN).substring(0, COLUMN_WIDTH) + filteredData[tag])
      .join(LINE_SEPARATOR)
  }

  module.exports = formatOutput
