/* jshint expr:true */
/*jshint unused:false*/
'use strict'

const chai = require('chai')
const expect = chai.expect
const fs = require("fs")
const _ = require("../lib/config")

describe("getFromFiles", () => {
  const getFromFiles = require("../app/getFromFiles")

  let actualFileList = []

  describe("with no data folder", () => {
    before(done => {
      fs.rename(_.DATA_FOLDER, _.DATA_FOLDER + ".bak", (err) => {
        done()
      })
    })

    it("should return NO_DATA_FOLDER", done => {
      getFromFiles((err, contents, files) => {
        expect(err).to.equal(_.NO_DATA_FOLDER)
        done()
      })
    })

    after(done => {
      fs.rename(_.DATA_FOLDER + ".bak", _.DATA_FOLDER, (err) => {
        done()
      })
    })
  })

  describe("with an empty data folder", () => {
    before(done => {
      fs.rename(_.DATA_FOLDER, _.DATA_FOLDER + ".bak", err => {
        fs.mkdir(_.DATA_FOLDER, err => {
          done()
        })
      })
    })

    it("should return EMPTY_DATA_FOLDER", done => {
      getFromFiles((err, contents, files) => {
        expect(err).to.equal(_.EMPTY_DATA_FOLDER)
        done()
      })
    })

    after(done => {
      fs.unlink(_.DATA_FOLDER, err => {
        fs.rename(_.DATA_FOLDER + ".bak", _.DATA_FOLDER, (err) => {
          done()
        })
      })
    })
  })

  describe("with a data folder containing actual JSON data", () => {
    before(done => {
      fs.readdir(_.DATA_FOLDER, (err, files) => {
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
