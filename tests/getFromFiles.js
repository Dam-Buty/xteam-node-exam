/* jshint expr:true */
/*jshint unused:false*/

const chai = require('chai');
const expect = chai.expect; // we are using the "expect" style of Chai

const fs = require("fs")

const DATA_FOLDER = "data"

const NO_DATA_FOLDER = 1
const EMPTY_DATA_FOLDER      = 2
const NO_VALID_DATA          = 3

describe("getFromFiles", () => {
  const getFromFiles = require("../lib/getFromFiles")

  let actualFileList = []

  describe("with no data folder", () => {
    before(done => {
      fs.rename(DATA_FOLDER, DATA_FOLDER + ".bak", (err) => {
        done()
      })
    })

    it("should return NO_DATA_FOLDER", done => {
      getFromFiles((err, contents, files) => {
        expect(err).to.equal(NO_DATA_FOLDER)
        done()
      })
    })

    after(done => {
      fs.rename(DATA_FOLDER + ".bak", DATA_FOLDER, (err) => {
        done()
      })
    })
  })

  describe("with an empty data folder", () => {
    before(done => {
      fs.rename(DATA_FOLDER, DATA_FOLDER + ".bak", err => {
        fs.mkdir(DATA_FOLDER, err => {
          done()
        })
      })
    })

    it("should return EMPTY_DATA_FOLDER", done => {
      getFromFiles((err, contents, files) => {
        expect(err).to.equal(EMPTY_DATA_FOLDER)
        done()
      })
    })

    after(done => {
      fs.unlink(DATA_FOLDER, err => {
        fs.rename(DATA_FOLDER + ".bak", DATA_FOLDER, (err) => {
          done()
        })
      })
    })
  })

  describe("with a data folder containing actual JSON data", () => {
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

    it("should return 'contents', an array of parsed objects", done => {
        getFromFiles((err, contents, files) => {
          expect(err).to.be.null
          expect(contents).to.be.an("array")
          expect(contents[0]).to.be.an("object")
          done()
        })
    })

    it("should return 'files', the file list of the data directory as an array", done => {
        getFromFiles((err, contents, files) => {
          expect(err).to.be.null
          expect(files).to.be.an("array")
          expect(files[0]).to.be.a("string")
          expect(files).to.deep.equal(actualFileList)
          done()
        })
    })
  })
})
