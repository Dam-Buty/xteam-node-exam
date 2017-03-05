const fs = require('fs')

const FRESH = 0
const NO_CACHE = 1
const STALE_CACHE = 2
const UNREADABLE_CACHE = 3

const DATA_FOLDER = "data"
const FILE_LIST = ".cache.fileList.json"
const CACHE_FILE = ".cache.content.json"

/**
 * Checks if the cache is fresh (are there new/missing files in the data folder?)
 * and returns the content of the cache if it exists
 * @param {function} cb
 * @return {object[]} crawledData
 */
  const getFromCache = cb => {
    fs.readFile(FILE_LIST, (err, fileListRaw) => {
      if (err) {
        cb(NO_CACHE)
      }

      try {
        const cachedFileList = JSON.parse(fileListRaw).files

        fs.readDir(DATA_FOLDER, (err, files) => {
          if (err) {
            cb(NO_CACHE)
          }

          if (files.length === cachedFileList.length) {
            const stale = cachedFileList.some(file => files.indexOf(file) === -1)

            if (stale) {
              cb(STALE_CACHE)
            } else {
              fs.readFile(CACHE_FILE, (err, cacheRaw) => {
                if (err) {
                  cb(NO_CACHE)
                }

                try {
                  const crawledData = JSON.parse(cacheRaw)
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

  module.exports = getFromCache
