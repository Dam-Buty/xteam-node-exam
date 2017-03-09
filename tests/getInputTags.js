/* jshint expr:true */
/*jshint unused:false*/

const chai = require('chai');
const expect = chai.expect; // we are using the "expect" style of Chai
const mockCli = require('mock-cli')
const fs = require("fs")
const Readable = require("stream").Readable

const TAGS_FILE = 'tags.txt'
const EMPTY_TAG_LIST = -1

const removeTagsFile = done => {
  fs.rename(TAGS_FILE, TAGS_FILE + ".bak", err => {
    done()
  })
}

const restoreTagsFile = done => {
  fs.unlink(TAGS_FILE, err => {
    fs.rename(TAGS_FILE + ".bak", TAGS_FILE, err => {
      done()
    })
  })
}

const streamString = string => {
  let s = new Readable()
  s.push(string)
  s.push(null)
  return s
}

describe("getInputTags", () => {
  const getInputTags = require("../lib/getInputTags")

  const argv = ["should be node", "should be index.js"]
  const stdio = {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr
  }

  describe("with no input and no tags file", () => {
    before(done => {
      mockCli(argv, stdio, (err, results) => {
        console.log("--")
      })
      removeTagsFile(done)
    })

    it("should return an error", done => {
      getInputTags((err, tags) => {
        console.log(err)
        expect(err).to.not.be.null
        done()
      })
    })

    it("should test something else", done => {
      expect([1].indexOf(2)).to.equal(-1)
      done()
    })

    after(restoreTagsFile)
  })

  // describe("using tags.txt file", () => {
  //   const expectedTags = [
  //     "pepperoni",
  //     "pizza",
  //     "mozzarella"
  //   ]
  //
  //   before(done => {
  //     removeTagsFile(() => {
  //       // Doctor a special tags.txt file
  //       fs.writeFile(TAGS_FILE, expectedTags.join("\n"), err => {
  //         done()
  //       })
  //     })
  //   })
  //
  //   it("should return by default the expected list without error", done => {
  //     getInputTags((err, tags) => {
  //       expect(err).to.be.null
  //       expect(tags).to.deep.equal(expectedTags)
  //       done()
  //     })
  //   })
  //
  //   after(restoreTagsFile)
  // })
})
