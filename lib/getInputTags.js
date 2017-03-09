const fs = require('fs')
const debug = require("./talk.js").debug
const error = require("./talk.js").error

const TAGS_FILE = 'tags.txt'
const EMPTY_TAG_LIST = -1

/*******************
 * Helper Functions
 *******************/

/**
 * Return data piped through stdin or null if no data
 * @param {function} cb
 * @return {String} stdin
 */
const readStdin = cb => {
  let stdin = ""

  process.stdin.setEncoding('utf8')

  // Start processing stream from stdin
  process.stdin.on('readable', () => {
    console.log("33")
    var chunk = process.stdin.read()
      console.log("44")

    if (chunk === null) {
      // If we get a null chunk and stdin is empty
      // then we haven't been piped anything so we return null
      if (!stdin) {
        // Pausing the stream allows the process to exit gracefully
        debug("Nothing in stdin")
        process.stdin.pause()
        cb(null)
      }
    } else {
      stdin = stdin + chunk
    }
  })

  // When the whole stream is consumed
  process.stdin.on('end', () => {
    console.log("55")
    cb(stdin)
  })
}

/**
 * Gets the input from tags.txt
 * @param {function} cb
 * @return {String[]} data
 */
 const readTagsFile = cb => {
   fs.readFile(TAGS_FILE, 'utf8', (err, data) => {
     if (err) {
       if (err.code === "ENOENT") {
         error("File " + TAGS_FILE + " could not be found")
         cb(err)
       } else {
         error("There was an error reading the " + TAGS_FILE + " file :")
         error(err)
         cb(err)
       }
     }

     cb(null, data)
   })
 }

 /**
  * Turns the raw data into an array of trimmed tags
  * @param {function} cb
  * @return {String[]} tags
  */
 const sanitizeInput = input => {
   const byLine = input.split("\n")
   let array = []

   // Note that if the input is multiline, tags can contain commas
   if (byLine.length > 1) {
     array = byLine
   } else {
     array = input.split(",")
   }

   // Return the array trimmed and with empty strings filtered out
   return array
    .map(tag => tag.trim())
    .filter(String)
 }

 /*******************
  * Main function
  *******************/

/**
 * Gets the input from (in order of priority) :
 * - stdin (piped data)
 * - the CLI argument
 * - the tags.txt file
 * @param {function} cb
 * @return {String[]} input
 */
const getInputTags = cb => {
  const sanitizedCb = input => {
    const sanitizedInput = sanitizeInput(input)

    if (sanitizedInput.length) {
      cb(null, sanitizedInput)
    } else {
      cb(EMPTY_TAG_LIST)
    }
  }

  console.log("++")

  readStdin(stdin => {
    console.log("11111")
    console.log(stdin)
    if (stdin) {
      debug("Got tags from stdin :")
      sanitizedCb(stdin)
    } else {
      if (process.argv[2]) {
        debug("Got tags from argument :")
        sanitizedCb(process.argv[2])
      } else {
        readTagsFile((err, tagsFile) => {
          if (!err) {
            debug("Got tags from tags file :")
            sanitizedCb(tagsFile)
          } else {
            cb(err)
          }
        })
      }
    }
  })
}

module.exports = getInputTags
