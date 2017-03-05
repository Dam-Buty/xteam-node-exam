

/**
 * Searches the crawled results for the searched tags
 * Returns a results array, sorted by descending score,
 * looking like :
 * [
 *  ["pizza", 12],
 *  ["spoon", 2],
 *  ["umbrella", 0]
 * ]
 * @param {object[]} data
 * @return {object} results
 */
  const searchTags = (tags, results) => {
    return tags
      .map(tag => [tag, results[tag] || 0])
      .sort((a, b) => b[1] - a[1])
  }

  module.exports = searchTags
