'use strict'

/**
 * Recursively traverses all nested objects in the data
 * and feeds tagsList with tags arrays
 * (liberally inspired from http://stackoverflow.com/a/8085118)
 * @param {object[]} obj
 */
const findTagsLists = obj => {
  let tagsList = []

  // traverse all properties
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (prop === "tags") {
        // tags found! add them to the list
        tagsList = tagsList.concat(obj[prop])
      } else {
        // recurse through all other object type properties
        // (arrays are typeof 'object' too for some reason)
        if (typeof obj[prop] === "object") {
          tagsList = tagsList.concat(findTagsLists(obj[prop]))
        }
      }
    }
  }

  return tagsList
}

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
    const tagsList = findTagsLists(data)

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
