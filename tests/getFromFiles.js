/* jshint expr:true */

const chai = require('chai');
const expect = chai.expect; // we are using the "expect" style of Chai

const fs = require("fs")

const DATA_FOLDER = "data"

describe("getFromFiles", () => {
  const getFromFiles = require("../lib/getFromFiles")

  let actualFileList = []

  before(done => {
    fs.readdir(DATA_FOLDER, (err, files) => {
      actualFileList = files
      done()
    })
  })

  it("should return no error", done => {
    getFromFiles((err, contents, files) => {
      expect(err).to.be.null
      done()
    })
  })

  it("should return an array of parsed objects", done => {
      getFromFiles((err, contents, files) => {
        expect(err).to.be.null
        expect(contents).to.be.an("array")
        expect(contents[0]).to.be.an("object")
        done()
      })
  })

  it("should return the file list of the data directory as an array", done => {
      getFromFiles((err, contents, files) => {
        expect(err).to.be.null
        expect(files).to.be.an("array")
        expect(files[0]).to.be.a("string")
        expect(files).to.deep.equal(actualFileList)
        done()
      })
  })
})
