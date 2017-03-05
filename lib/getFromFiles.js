const fs = require('fs')
const path = require('path')

const DATA_FOLDER = "data"
const FILE_LIST = ".cache.fileList.json"

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

    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        console.error("III - File " + file + " could not be read... ignoring")
        cb(err)
      }

      try {
        let parsedContent = JSON.parse(content)
        cb(null, parsedContent)
      } catch(err) {
        console.error("III - File " + file + " does not appear to be valid JSON... ignoring")
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
  */
const getFromFiles = cb => {
  fs.readdir(DATA_FOLDER, (err, files) => {
    if (err) {
      console.error("XXX - Error reading the data directory!")
      cb(err)
    }

    fs.writeFile(FILE_LIST, JSON.stringify({ files: files }), err => {
      if (err) {
        console.log("III - File list cache could not be written to disk...")
        console.log("III - Dumping error message and ignoring")
        console.log(err)
      }

      let contents = []
      let remaining = files.length

      files.forEach(file => readFile(file, (err, content) => {
        if (err === null) {
          contents.push(content)
        }

        remaining = remaining - 1

        // If we've passed the last file then we can return the contents array
        if (!remaining) {
            cb(null, contents)
        }
      }))
    })
  })
}

module.exports = getFromFiles
