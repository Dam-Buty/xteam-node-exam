/* jshint expr:true */
/*jshint unused:false*/

'use strict'

const chai = require('chai')
const expect = chai.expect
const fs = require("fs")
const _ = require("../lib/config.js")
const mockCli = require("mock-cli")

const renameTagsFile = done => {
  fs.rename(_.TAGS_FILE, _.TAGS_FILE + ".bak", err => {
    done()
  })
}

const restoreTagsFile = done => {
  fs.unlink(_.TAGS_FILE, err => {
    fs.rename(_.TAGS_FILE + ".bak", _.TAGS_FILE, err => {
      done()
    })
  })
}

const writeTagsFileFromMockStdin = mock => {
  fs.createReadStream('tests/mocks/' + mock).pipe(fs.createWriteStream(_.TAGS_FILE))
}

describe("getInputTags", () => {
  const getInputTags = require("../app/getInputTags")

  const originalArguments = process.argv

  const emptyArgument = ["node", "index.js"]
  const emptyListArgument = ["node", "index.js", ",,,"]
  const fullArgument = ["node", "index.js", "pepperoni,pizza"]
  const fullArgumentWithNull = ["node", "index.js", ",,pepperoni,pizza,,"]

  const expectedTags = ["pepperoni", "pizza"]

  describe("with no stdin and no argument", () => {
    // before(done => {
    //   process.argv = emptyArgument
    //   emptyStream.pipe(process.stdin)
    //   done()
    // })

    let kill

    describe("and no tags.txt file", () => {
      before(done => {
        const emptyStream = fs.createReadStream("tests/mocks/emptyStdin")
        const stdio = {
          stdin: emptyStream,
          stdout: process.stdout,
          stderr: process.stderr
        }

        renameTagsFile(() => {
          kill = mockCli(emptyArgument, stdio, (err, results) => {
            // console.log("++")
            // console.log(err)
            // console.log(results)
            // console.log("++")
          })
          done()
        })
      })

      it("should return no tags and a NO_TAG_LIST error", done => {
        getInputTags((err, tags) => {
          expect(tags).to.be.undefined
          expect(err).to.equal(_.NO_TAG_LIST)
          done()
        })
      })

      after(done => {
        kill()
        restoreTagsFile(done)
      })
    })

    describe("and an empty tags.txt file", () => {
      before(done => {
        const emptyStream = fs.createReadStream("tests/mocks/emptyStdin")
        const stdio = {
          stdin: emptyStream,
          stdout: process.stdout,
          stderr: process.stderr
        }

        renameTagsFile(() => {
          writeTagsFileFromMockStdin('emptyStdin')
          kill = mockCli(emptyArgument, stdio, (err, results) => {
            // console.log("++")
            // console.log(err)
            // console.log(results)
            // console.log("++")
          })
          done()
        })
      })

      it("should return no tags and a EMPTY_TAG_LIST error", done => {
        getInputTags((err, tags) => {
          expect(tags).to.be.undefined
          expect(err).to.equal(_.NO_TAG_LIST)
          done()
        })
      })

      after(done => {
        kill()
        restoreTagsFile(done)
      })
    })
  })

  // it("should really be tested", done => {
  //   done()
  // })
})
