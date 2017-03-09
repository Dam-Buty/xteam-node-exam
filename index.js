'use strict'

const getInputTags = require("./lib/getInputTags")
const getFromFiles = require("./lib/getFromFiles")
const crawlData = require("./lib/crawlData")
const searchTags = require("./lib/searchTags")
const formatOutput = require("./lib/formatOutput")
const getFromCache = require("./lib/cache").read
const error = require("./lib/talk").error
const respond = require("./lib/talk").respond
const debug = require("./lib/talk").debug
const cache = require("./lib/cache")

let results = ""
let formattedOutput = ""

const EMPTY_TAG_LIST = -1

// We start by clearing the screen
process.stdout.write('\x1Bc');

// First fetch the tags to be searched
getInputTags((err, tags) => {
  if (err !== null) {
    if (err === EMPTY_TAG_LIST) {
      error("The provided tag list was empty")
    } else {
      error("No tag list was provided")
    }
    process.exit(1)
  }

  // Print the tags array to console
  debug(tags.map(tag => "'" + tag + "'").join(", "))

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
      debug("No cache available, getting data from the JSON files")
      // If cache is absent or stale, then fetch the data from the JSON files
      getFromFiles((err, data, files) => {
        if (err !== null) {
          error("No data could be found. Exiting process...")
          process.exit(1)
        }

        // Write the file list to disk (used to check cache freshness)
        cache.writeFileList(files, () => {
          // Then crawl the JSON data to count tag occurrences

          const crawledData = crawlData(data)

          // Write the crawled data to disk
          cache.writeContent(crawledData, () => {
            // And finally reduce the crawled data
            // to the tags we're actually searching
            results = searchTags(tags, crawledData)

            // format the results and print to console
            formattedOutput = formatOutput(results)
            respond(formattedOutput)

            process.exit(0)
          })
        })
      })
    }
  })


})
