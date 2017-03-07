const fs = require('fs')
const warn = require("./talk.js").warn
const debug = require("./talk.js").debug

const FRESH = null
const NO_CACHE = 1
const STALE_CACHE = 2
const UNREADABLE_CACHE = 3

const DATA_FOLDER = "data"
const FILE_LIST = ".cache.fileList.json"
const CACHE_FILE = ".cache.content.json"

/**
 * Write the file list of the data folder to disk
 * @param {String[]} files
 * @param {function} cb
 */
  const writeFileList = (files, cb) => {
    fs.writeFile(FILE_LIST, JSON.stringify({ files }), err => {
      if (err) {
        warn("File list cache could not be written to disk...")
        warn("Dumping error message and ignoring")
        console.log(err)
      }

      cb()
    })
  }

/**
 * Write the crawled data to disk
 * @param {object} crawledData
 * @param {function} cb
 */
  const writeContent = (crawledData, cb) => {
    fs.writeFile(CACHE_FILE, JSON.stringify(crawledData), err => {
      if (err) {
        warn("Tags occurrences cache could not be written to disk...")
        warn("Dumping error message and ignoring")
        console.log(err)
      }

      cb()
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
    fs.readFile(FILE_LIST, (err, fileListRaw) => {
      if (err) {
        // If FILE_LIST doesn't exist (or is unreadable)
        debug("Cache file list couldn't be read")
        cb(NO_CACHE)
      } else {
        debug("Cache file list exists")

        try {
          // Otherwise try to parse the JSON
          const cachedFileList = JSON.parse(fileListRaw).files

          debug("And is valid JSON")

          // If JSON is readable, scan data folder for new / missing files
          fs.readdir(DATA_FOLDER, (err, files) => {
            if (err) {
              // Folder is unreadable, give up on cache
              debug("Couldn't read data folder. Continuing but this doesn't look good...")
              cb(NO_CACHE)
            } else {
              if (files.length === cachedFileList.length) {
                // If the data directory files list is the same length as the cached
                // list, we check that all files in the data directory are present
                // in the cached list. If one is missing, then the cache is stale.
                const stale = cachedFileList.some(file => files.indexOf(file) === -1)

                if (stale) {
                  debug("Cache is stale")
                  cb(STALE_CACHE)
                } else {
                  // Cache looks fresh, we try to retrieve the content from CACHE_FILE
                  debug("Cache is fresh")
                  fs.readFile(CACHE_FILE, (err, cacheRaw) => {
                    if (err) {
                      debug("But it couldn't be read")
                      cb(NO_CACHE)
                    } else {
                      debug("And it can be read")

                      try {
                        // Finally we try to parse the JSON and return the content as
                        // an object
                        const crawledData = JSON.parse(cacheRaw)

                        debug("Returning cached results.")
                        cb(FRESH, crawledData)
                      } catch(err) {
                        debug("But it is not valid JSON")
                        cb(UNREADABLE_CACHE)
                      }
                    }
                  })
                }
              } else {
                debug("Cache is stale")
                cb(STALE_CACHE)
              }
            }
          })
        } catch(err) {
          debug("But it is not valid JSON")
          cb(UNREADABLE_CACHE)
        }
      }
    })
  }

  module.exports = {
    read,
    writeFileList,
    writeContent
  }
