const EMPTY_COLUMN = "               "
const COLUMN_WIDTH = EMPTY_COLUMN.length
const LINE_SEPARATOR = "\n"

/**
 * Displays the result in the console
 * @param {Array[]} results
 */
  const respondAndExit = results => {
    // Format output for each line : `<tag name>   <score>`
    // (tag name is padded to COLUMN_WIDTH)
    const formattedOutput =
      results
      .map(line => (line[0] + EMPTY_COLUMN).substring(0, COLUMN_WIDTH) + line[1])
      .join(LINE_SEPARATOR)

    // Display the results
    console.log("RESULTS")
    console.log("=======")
    console.log(formattedOutput)

    process.exit(0)
  }

  module.exports = respondAndExit
