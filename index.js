'use strict'

const getInputTags = require("./lib/getInputTags.js")
const getFromFiles = require("./lib/getFromFiles.js")
const crawlData = require("./lib/crawlData.js")
const searchTags = require("./lib/searchTags.js")
const formatOutput = require("./lib/formatOutput.js")
const getFromCache = require("./lib/cache.js").read
const talk = require("./lib/talk.js").talk
const error = require("./lib/talk.js").error
const respond = require("./lib/talk.js").respond

let results = ""
let formattedOutput = ""

// First fetch the tags to be searched
getInputTags((err, tags) => {
  if (err !== null) {
    error("Usage : pipe, arg or tags.txt file")
    process.exit(1)
  }

  // Print the tags array to console
  talk(tags.map(tag => "'" + tag + "'"))

  // Then try to get the results from cache
  getFromCache((err, crawledData) => {
    if (err === null) {
      // If the cache was fresh, then we just need to
      // reduce the results to the tags we're actually searching
      results = searchTags(tags, crawledData)

      // format the results and print to console
      formattedOutput = formatOutput(results)
      respond(formattedOutput)

      process.exit(0)
    } else {
      talk("No cache available, getting data from the JSON files")
      // If cache is absent or stale, then fetch the data from the JSON files
      getFromFiles((err, data) => {
        if (err !== null) {
          error("No data could be found. Exiting process...")
          process.exit(1)
        }

        // Then crawl the JSON data to count tag occurrences
        crawlData(data, crawledData => {
          // And finally reduce the crawled data
          // to the tags we're actually searching
          results = searchTags(tags, crawledData)

          // format the results and print to console
          formattedOutput = formatOutput(results)
          respond(formattedOutput)

          process.exit(0)
        })
      })
    }
  })


})
