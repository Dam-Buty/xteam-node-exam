const fs = require('fs')

const FRESH = 0
const NO_CACHE = 1
const STALE_CACHE = 2
const UNREADABLE_CACHE = 3

const DATA_FOLDER = "data"
const FILE_LIST = ".cache.fileList.json"
const CACHE_FILE = ".cache.content.json"

/**
 * Write the file list of the data folder to disk
 * @param {String[]} files
 */
  const writeFileList = files => {
    fs.writeFile(FILE_LIST, JSON.stringify({ files }), err => {
      if (err) {
        console.log("III - File list cache could not be written to disk...")
        console.log("III - Dumping error message and ignoring")
        console.log(err)
      }
    })
  }

/**
 * Write the crawled data to disk
 * @param {object} crawledData
 */
  const writeContent = crawledData => {
    fs.writeFile(CACHE_FILE, JSON.stringify(crawledData), err => {
      if (err) {
        console.log("III - Tags occurrences cache could not be written to disk...")
        console.log("III - Dumping error message and ignoring")
        console.log(err)
      }
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
    console.log("err")
    
    fs.readFile(FILE_LIST, (err, fileListRaw) => {
      if (err) {
        // If FILE_LIST doesn't exist (or is unreadable)
        cb(NO_CACHE)
      }

      try {
        // Otherwise try to parse the JSON
        const cachedFileList = JSON.parse(fileListRaw).files

        // If JSON is readable, scan data folder for new / missing files
        fs.readDir(DATA_FOLDER, (err, files) => {
          if (err) {
            // Folder is unreadable, give up on cache
            cb(NO_CACHE)
          }

          if (files.length === cachedFileList.length) {
            // If the data directory files list is the same length as the cached
            // list, we check that all files in the data directory are present
            // in the cached list. If one is missing, then the cache is stale.
            const stale = cachedFileList.some(file => files.indexOf(file) === -1)

            if (stale) {
              cb(STALE_CACHE)
            } else {
              // Cache looks fresh, we try to retrieve the content from CACHE_FILE
              fs.readFile(CACHE_FILE, (err, cacheRaw) => {
                if (err) {
                  cb(NO_CACHE)
                }

                try {
                  // Finally we try to parse the JSON and return the content as
                  // an object
                  const crawledData = JSON.parse(cacheRaw)
                  console.log("III - Got results from cache")
                  cb(FRESH, crawledData)
                } catch(err) {
                  cb(UNREADABLE_CACHE)
                }
              })
            }
          } else {
            cb(STALE_CACHE)
          }
        })
      } catch(err) {
        cb(UNREADABLE_CACHE)
      }
    })
  }

  module.exports = {
    read,
    writeFileList,
    writeContent
  }
