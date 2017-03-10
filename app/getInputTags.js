'use strict'

const fs    = require('fs')
const debug = require("../lib/talk").debug
const error = require("../lib/talk").error
const _     = require("../lib/config")

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
  let exited = false

  process.stdin.setEncoding('utf8')

  // Start processing stream from stdin
  process.stdin.on('readable', () => {
    var chunk = process.stdin.read()

    if (chunk === null) {
      // If we get a null chunk and stdin is empty
      // then we haven't been piped anything so we just stop the stream and return null
      if (!stdin) {
        debug("Nothing in stdin")
        process.stdin.pause()
        if (!exited) {
          exited = true
          cb(null)
        }
      }
    } else {
      stdin = stdin + chunk
    }
  })

  // When the whole stream is consumed
  process.stdin.on('end', () => {
    // The stub we use in unit testing doesn't work exactly like the real deal
    // so we need to check for double callback executions
    if (!exited) {
      exited = true
      cb(stdin)
    }
  })
}

/**
 * Gets the input from tags.txt
 * @param {function} cb
 * @return {String[]} data
 */
 const readTagsFile = cb => {
   fs.readFile(_.TAGS_FILE, 'utf8', (err, data) => {
     if (err) {
       if (err.code === "ENOENT") {
         error("File " + _.TAGS_FILE + " could not be found")
         cb(err)
       } else {
         error("There was an error reading the " + _.TAGS_FILE + " file :")
         error(err)
         cb(err)
       }
     } else {
       cb(null, data)
     }
   })
 }

 /**
  * Turns the raw data into an array of trimmed tags
  * @param {String} input
  * @return {String[]} tags
  */
 const sanitizeInput = input => {
   const byLine = input.split("\n")
   let tags = []

   // Note that if the input is multiline, tags can contain commas
   if (byLine.length > 1) {
     tags = byLine
   } else {
     tags = input.split(",")
   }

   // Return the array trimmed and with empty strings filtered out
   return tags
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
 * @return {String[]} tags
 */
const getInputTags = cb => {
  const sanitizedCb = input => {
    const tags = sanitizeInput(input)

    if (tags.length) {
      cb(null, tags)
    } else {
      // If the tags list is empty we must return an error
      cb(_.EMPTY_TAG_LIST)
    }
  }

  readStdin(stdin => {
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
            cb(_.NO_TAG_LIST)
          }
        })
      }
    }
  })
}

module.exports = getInputTags
