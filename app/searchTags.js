'use strict'

/**
 * Searches the crawled results for the searched tags
 * Returns a results object
 * looking like :
 * {
 *  spoon: 2,
 *  fork: 0,
 *  ...
 * }
 * @param {String[]} tags
 * @param {object} results
 * @return {object} filteredData
 */
  const searchTags = (tags, results) => {
    return tags
    .reduce((filteredData, tag) => {
      filteredData[tag] = results[tag] || 0 // We create a 0 score line if the tag can't be found

      return filteredData
    }, {})
  }

  module.exports = searchTags
