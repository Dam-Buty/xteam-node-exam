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
 * @param {object} crawledData
 * @return {object} results
 */
  const searchTags = (tags, crawledData) => {
    return tags
    .reduce((results, tag) => {
      // for each tag we get the score in the crawledData object
      // or create a 0 score line
      results[tag] = crawledData[tag] || 0
      return results
    }, {})
  }

  module.exports = searchTags
