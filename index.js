'use strict'

// Application modules
const getInputTags = require("./app/getInputTags")
const getFromFiles = require("./app/getFromFiles")
const crawlData = require("./app/crawlData")
const searchTags = require("./app/searchTags")
const formatOutput = require("./app/formatOutput")
// Cache functions
const getFromCache = require("./lib/cache").read
const cacheFileList = require("./lib/cache").writeFileList
const cacheContent = require("./lib/cache").writeContent
// Talk functions
const error = require("./lib/talk").error
const respond = require("./lib/talk").respond
const debug = require("./lib/talk").debug
const warn = require("./lib/talk").warn

let results = ""
let formattedOutput = ""

// We start by clearing the screen
process.stdout.write('\x1Bc');

// First fetch the tags to be searched
getInputTags((err, tags) => {
  if (err !== null) {
    error("No tag list was provided")

    warn("You can search for tags in three ways :")
    warn("- by piping them to stdin ('cat tags.txt | xteam')")
    warn("- by adding them as a command line argument ('xteam lorem,ipsum')")
    warn("- by running xteam in a folder containing a 'tags.txt' file")
    warn("")
    warn("Tag lists can be comma-separated, or separated by new lines. If your tags might contain commas, you need to use the new lines format.")

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
          error("No data could be found.")
          warn("The xteam executable will look for valid JSON files in a subfolder named 'data'.")
          process.exit(1)
        }

        // Write the file list to disk (used to check cache freshness)
        cacheFileList(files, () => {
          // Then crawl the JSON data to count tag occurrences

          const crawledData = crawlData(data)

          // Write the crawled data to disk
          cacheContent(crawledData, () => {
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
