'use strict'

const fs = require('fs')
const path = require('path')
const warn = require("../lib/talk").warn
const debug = require("../lib/talk").debug
const error = require("../lib/talk").error
const _ = require("../lib/config")

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
    const filePath = path.join(_.DATA_FOLDER, file)

    debug("Reading file : " + file)

    // Try to read the file
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        warn("File " + file + " could not be read... ignoring")
        cb(err)
      }

      try {
        // Try to parse the JSON and return it
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
  * and returns their parsed contents in an array of objects
  * @param {function} cb
  * @return {object[]} contents
  * @return {String[]} files
  */
const getFromFiles = cb => {
  // Scan the data folder
  fs.readdir(_.DATA_FOLDER, (err, files) => {
    if (err) {
      error("Error reading the data directory!")
      cb(_.NO_DATA_FOLDER)
    }

    // If the data folder is not empty
    if (files.length) {
      let contents = []
      let remaining = files.length

      // Loop on all the files
      files.forEach(file => readFile(file, (err, content) => {
        if (err === null) {
          // push all parsed content into an array
          contents.push(content)
        }

        remaining = remaining - 1

        if (!remaining) {
          // When we've passed the last file we can return the contents array
          if (contents.length) {
            cb(null, contents, files)
          } else {
            // If there was no valid JSON in the folder we return an error
            cb(_.NO_VALID_DATA)
          }
        }
      }))
    } else {
      // If the data folder is empty we return an error
      cb(_.EMPTY_DATA_FOLDER)
    }
  })
}

module.exports = getFromFiles
