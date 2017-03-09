'use strict'

const fs = require('fs')
const warn = require("./talk").warn
const debug = require("./talk").debug
const _ = require("./config")

/**
 * Write the file list of the data folder to disk
 * @param {String[]} files
 * @param {function} cb
 */
  const writeFileList = (files, cb) => {
    fs.writeFile(_.FILE_LIST, JSON.stringify({ files }), err => {
      if (err) {
        warn("File list cache could not be written to disk...")
        warn("Dumping error message and ignoring")
        console.log(err)
        cb(err)
      }

      cb(null)
    })
  }

/**
 * Write the crawled data to disk
 * @param {object} crawledData
 * @param {function} cb
 */
  const writeContent = (crawledData, cb) => {
    fs.writeFile(_.CACHE_FILE, JSON.stringify(crawledData), err => {
      if (err) {
        warn("Tags occurrences cache could not be written to disk...")
        warn("Dumping error message and ignoring")
        console.log(err)
      }

      cb(null)
    })
  }

/**
 * Checks if the cache is fresh (are there new/missing files in the data folder?)
 * and returns the content of the cache if it exists
 * @param {function} cb
 * @return {object[]} crawledData
 */
  const read = cb => {
    // Try to read FILE_LIST
    fs.readFile(_.FILE_LIST, (err, fileListRaw) => {
      if (err) {
        // If FILE_LIST doesn't exist (or is unreadable)
        debug("Cache file list couldn't be read")
        cb(_.NO_CACHE)
      } else {
        debug("Cache file list exists")

        try {
          // Otherwise try to parse the JSON
          const cachedFileList = JSON.parse(fileListRaw).files

          debug("And is valid JSON")

          // If JSON is readable, scan data folder for new / missing files
          fs.readdir(_.DATA_FOLDER, (err, files) => {
            if (err) {
              // Folder is unreadable, give up on cache
              debug("Couldn't read data folder. Continuing but this doesn't look good...")
              cb(_.NO_CACHE)
            } else {
              if (files.length === cachedFileList.length) {
                // If the data directory files list is the same length as the cached
                // list, we check that all files in the data directory are present
                // in the cached list. If one is missing, then the cache is stale.
                const stale = cachedFileList.some(file => files.indexOf(file) === -1)

                if (stale) {
                  debug("Cache is stale")
                  cb(_.STALE_CACHE)
                } else {
                  // Cache looks fresh, we try to retrieve the content from CACHE_FILE
                  debug("Cache is fresh")
                  fs.readFile(_.CACHE_FILE, (err, cacheRaw) => {
                    if (err) {
                      debug("But it couldn't be read")
                      cb(_.NO_CACHE)
                    } else {
                      debug("And it can be read")

                      try {
                        // Finally we try to parse the JSON and return the content as
                        // an object
                        const crawledData = JSON.parse(cacheRaw)

                        debug("Returning cached results.")
                        cb(_.FRESH, crawledData)
                      } catch(err) {
                        debug("But it is not valid JSON")
                        cb(_.UNREADABLE_CACHE)
                      }
                    }
                  })
                }
              } else {
                debug("Cache is stale")
                cb(_.STALE_CACHE)
              }
            }
          })
        } catch(err) {
          debug("But it is not valid JSON")
          cb(_.UNREADABLE_CACHE)
        }
      }
    })
  }

  module.exports = {
    read,
    writeFileList,
    writeContent
  }
