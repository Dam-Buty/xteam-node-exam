const fs = require('fs')

const CACHE_FILE = ".cache.content.json"

/**
 * Crawls the data from the JSON files
 * And returns a crawled data object looking like this :
 * {
 *  pizza: 12,
 *  spoon: 2
 * }
 * @param {object[]} data
 * @param {function} cb
 * @return {object} crawledData
 */
  const crawlData = (data, cb) => {
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

    fs.writeFile(CACHE_FILE, JSON.stringify(crawledData), err => {
      if (err) {
        console.log("III - Tags occurrences cache could not be written to disk...")
        console.log("III - Dumping error message and ignoring")
        console.log(err)
      }

      cb(crawledData)
    })
  }

  module.exports = crawlData
