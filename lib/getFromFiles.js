const fs = require('fs')
const path = require('path')
const warn = require("./talk.js").warn
const debug = require("./talk.js").debug
const error = require("./talk.js").error

const DATA_FOLDER = "data"

const NO_DATA_FOLDER = 1
const EMPTY_DATA_FOLDER      = 2
const NO_VALID_DATA          = 3

/*******************
 * Helper Functions
 *******************/

/**
 * Reads a JSON file, parses it and returns its content as an object
 * @param {String} file
 * @param {function} cb
 * @return {object} parsedContent
 */
  const readFile = (file, cb) => {
    const filePath = path.join(DATA_FOLDER, file)

    debug("Reading file : " + file)

    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        warn("File " + file + " could not be read... ignoring")
        cb(err)
      }

      try {
        let parsedContent = JSON.parse(content)
        cb(null, parsedContent)
      } catch(err) {
        warn("File " + file + " does not appear to be valid JSON... ignoring")
        cb(err)
      }
    })
  }

/*******************
 * Main function
 *******************/

 /**
  * Scans the data folder for JSON files
  * and returns their contents in an array of objects
  * @param {function} cb
  * @return {object[]} contents
  * @return {String[]} files
  */
const getFromFiles = cb => {
  fs.readdir(DATA_FOLDER, (err, files) => {
    if (err) {
      error("Error reading the data directory!")
      cb(NO_DATA_FOLDER)
    }

    if (files.length) {
      let contents = []
      let remaining = files.length

      files.forEach(file => readFile(file, (err, content) => {
        if (err === null) {
          contents.push(content)
        }

        remaining = remaining - 1

        // If we've passed the last file then we can return the contents array
        if (!remaining) {
          if (contents.length) {
            cb(null, contents, files)
          } else {
            cb(NO_VALID_DATA)
          }
        }
      }))
    } else {
      cb(EMPTY_DATA_FOLDER)
    }
  })
}

module.exports = getFromFiles
