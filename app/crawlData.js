'use strict'

/**
 * Crawls the data from the JSON files
 * And returns a crawled data object looking like this :
 * {
 *  pizza: 12,
 *  spoon: 2,
 *  ...
 * }
 * @param {object[]} data
 * @return {object} crawledData
 */
  const crawlData = data => {
    let tagsList = []

    /**
     * Recursively traverses all nested objects in the data
     * and feeds tagsList with tags arrays
     * (liberally inspired from http://stackoverflow.com/a/8085118)
     * @param {object[]} obj
     */
    const findTagsLists = obj => {
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (prop === "tags") {
            tagsList = tagsList.concat(obj[prop])
          } else {
            // Strings will be iterated by (for..in) infinitely, causing
            // stack size explosion, so they shouldn't be recursed through
            if (typeof obj[prop] !== "string") {
              findTagsLists(obj[prop])
            }
          }
        }
      }
    }

    findTagsLists(data)

    // Build the crawledData object
    // filter(Boolean) just filters out falsy entries (null, undefined, etc...)
    const crawledData = tagsList.filter(Boolean).reduce((acc, val) => {
      if (acc[val] !== undefined) {
        acc[val] = acc[val] + 1
      } else {
        acc[val] = 1
      }

      return acc
    }, {})

    return crawledData
  }

  module.exports = crawlData
