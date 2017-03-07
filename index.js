'use strict'

const getInputTags = require("./lib/getInputTags.js")
const cache = require("./lib/cache.js")
const getFromFiles = require("./lib/getFromFiles.js")
const crawlData = require("./lib/crawlData.js")
const searchTags = require("./lib/searchTags.js")
const respondAndExit = require("./lib/respondAndExit.js")

let results = ""

// First fetch the tags to be searched
getInputTags((err, tags) => {
  if (err !== null) {
    console.error("XXX - Usage : pipe, arg or tags.txt file")
    process.exit(1)
  }

  console.log("====> " + tags.map(tag => "'" + tag + "'"))

  console.log(cache)
  console.log(cache.read)

  // Then try to get the results from cache
  cache.read((err, crawledData) => {
    if (err === null) {
      // If the cache was fresh, then we just need to
      // reduce the results to the tags we're actually searching
      results = searchTags(tags, crawledData)

      respondAndExit(results)
    } else {
      // If cache is absent or stale, then fetch the data from the JSON files
      getFromFiles((err, data) => {
        if (err !== null) {
          console.error("XXX - No data could be found. Exiting process...")
          process.exit(1)
        }

        // Then crawl the JSON data to count tag occurrences
        crawlData(data, crawledData => {
          // And finally reduce the crawled data
          // to the tags we're actually searching
          results = searchTags(tags, crawledData)

          respondAndExit(results)
        })
      })
    }
  })


})
