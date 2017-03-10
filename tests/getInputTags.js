/* jshint expr:true */
/*jshint unused:false*/
'use strict'

const chai = require('chai')
const expect = chai.expect
const fs = require("fs")
const _ = require("../lib/config.js")
const mockCli = require("mock-cli")

const renameTagsFile = done => {
  // rename tags.txt as tags.txt.bak
  fs.rename(_.TAGS_FILE, _.TAGS_FILE + ".bak", err => {
    done()
  })
}

const restoreTagsFile = done => {
  // remove tags.txt
  fs.unlink(_.TAGS_FILE, err => {
    // restore original tags.txt
    fs.rename(_.TAGS_FILE + ".bak", _.TAGS_FILE, err => {
      done()
    })
  })
}

// We use this function to create a tags.txt file based on one of the mock stdins
const writeTagsFileFromMockStdin = mock => {
  fs.createReadStream('tests/mocks/' + mock).pipe(fs.createWriteStream(_.TAGS_FILE))
}

describe("getInputTags", () => {
  const getInputTags = require("../app/getInputTags")

  const emptyArgument = ["node", "index.js"]
  const expectedTags = ["pepperoni", "pizza"]

  let kill

  // We use this function to create stub CLI environments with custom
  // arguments (process.argv) and stdin
  const createMockCli = (args, stdinMock, done) => {
    // Stub stdin by piping the content of one of our mock stdins
    const emptyStream = fs.createReadStream("tests/mocks/" + stdinMock)

    const stdio = {
      stdin: emptyStream,
      // stdin: emptyStream,
      stdout: process.stdout,
      stderr: process.stderr
    }

    kill = mockCli(args, stdio)

    done()
  }

  describe("with no stdin and no argument", () => {
    beforeEach(done => {
      createMockCli(emptyArgument, "emptyStdin", done)
    })

    afterEach(done => {
      // This kills the stub CLI environment
      kill()
      done()
    })

    describe("when no tags.txt file is present", () => {
      before(renameTagsFile)

      it("should return no tags and a NO_TAG_LIST error", done => {
        getInputTags((err, tags) => {
          expect(tags).to.be.undefined
          expect(err).to.equal(_.NO_TAG_LIST)
          done()
        })
      })

      after(restoreTagsFile)
    })

    describe("when the tags.txt file is empty", () => {
      before(done => {
        renameTagsFile(() => {
          writeTagsFileFromMockStdin('emptyStdin')
          done()
        })
      })

      it("should return no tags and a EMPTY_TAG_LIST error", done => {
        getInputTags((err, tags) => {
          expect(tags).to.be.undefined
          expect(err).to.equal(_.EMPTY_TAG_LIST)
          done()
        })
      })

      after(restoreTagsFile)
    })

    describe("when tags.txt contains valid tags", () => {
      before(done => {
        renameTagsFile(() => {
          writeTagsFileFromMockStdin('fullStdin')
          done()
        })
      })

      it("should return an array of tags and no error", done => {
        getInputTags((err, tags) => {
          expect(err).to.be.null
          expect(tags).to.be.an("array")
          expect(tags).to.deep.equal(expectedTags)
          done()
        })
      })

      after(restoreTagsFile)
    })

    describe("when tags.txt contains valid tags and null values (empty lines)", () => {
      before(done => {
        renameTagsFile(() => {
          writeTagsFileFromMockStdin('fullStdinWithNull')
          done()
        })
      })

      it("should return an array of tags with null values ignored, and no error", done => {
        getInputTags((err, tags) => {
          expect(err).to.be.null
          expect(tags).to.be.an("array")
          expect(tags).to.deep.equal(expectedTags)
          done()
        })
      })

      after(restoreTagsFile)
    })
  })

  describe("with arguments and no piped data", () => {
    const emptyListArgument = ["node", "index.js", ",,,"]
    const fullArgument = ["node", "index.js", "pepperoni,pizza"]
    const fullArgumentWithNull = ["node", "index.js", ",,pepperoni,pizza,,"]

    describe("when the argument is present but has no tags names", () => {
      before(done => {
        createMockCli(emptyListArgument, "emptyStdin", done)
      })

      it("should return no tags and a EMPTY_TAG_LIST error", done => {
        getInputTags((err, tags) => {
          expect(tags).to.be.undefined
          expect(err).to.equal(_.EMPTY_TAG_LIST)
          done()
        })
      })

      after(done => {
        kill()
        done()
      })
    })

    describe("when the argument contains valid tags names", () => {
      before(done => {
        createMockCli(fullArgument, "emptyStdin", done)
      })

      it("should return an array of tags and no error", done => {
        getInputTags((err, tags) => {
          expect(err).to.be.null
          expect(tags).to.be.an("array")
          expect(tags).to.deep.equal(expectedTags)
          done()
        })
      })

      after(done => {
        kill()
        done()
      })
    })

    describe("when the argument contains valid tags names and null values", () => {
      before(done => {
        createMockCli(fullArgumentWithNull, "emptyStdin", done)
      })

      it("should return an array of tags with null values ignored, and no error", done => {
        getInputTags((err, tags) => {
          expect(err).to.be.null
          expect(tags).to.be.an("array")
          expect(tags).to.deep.equal(expectedTags)
          done()
        })
      })

      after(done => {
        kill()
        done()
      })
    })
  })

  describe("with piped data in stdin", () => {
    describe("when data contains valid tags", () => {
      before(done => {
        createMockCli(emptyArgument, "fullStdin", done)
      })

      it("should return an array of tags and no error", done => {
        getInputTags((err, tags) => {
          expect(err).to.be.null
          expect(tags).to.be.an("array")
          expect(tags).to.deep.equal(expectedTags)
          done()
        })
      })

      after(done => {
        kill()
        done()
      })
    })

    describe("when data contains valid tags and null values", () => {
      before(done => {
        createMockCli(emptyArgument, "fullStdinWithNull", done)
      })

      it("should return an array of tags with null values ignored, and no error", done => {
        getInputTags((err, tags) => {
          expect(err).to.be.null
          expect(tags).to.be.an("array")
          expect(tags).to.deep.equal(expectedTags)
          done()
        })
      })

      after(done => {
        kill()
        done()
      })
    })
  })
})
