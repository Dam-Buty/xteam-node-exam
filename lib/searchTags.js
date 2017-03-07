

/**
 * Searches the crawled results for the searched tags
 * Returns a results object
 * looking like :
 * {
 *  spoon: 2,
 *  fork: 0,
 *  ...
 * }
 * @param {object[]} data
 * @return {object} filteredData
 */
  const searchTags = (tags, results) => {
    return Object.keys(results)              // Scan through all the tags
    .filter(tag => tags.indexOf(tag) !== -1) // Keep only those present in the tags array
    .reduce((filteredData, tag) => {         // Create the filtered data object
      filteredData[tag] = results[tag] || 0  // If the tag isn't present we create a 0 score line

      return filteredData
    }, {})
  }

  module.exports = searchTags
