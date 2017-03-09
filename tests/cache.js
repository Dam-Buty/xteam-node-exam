/* jshint expr:true */
'use strict'

const chai = require('chai')
const expect = chai.expect
const fs = require("fs")
const _ = require("../lib/config")


const cleanUp = done => {
  fs.unlink(_.FILE_LIST, err => {
    fs.unlink(_.CACHE_FILE, err => {
      done()
    })
  })
}

describe("Cache", () => {
  const cache = require("../lib/cache")

  // remove any existing cache files
  before(cleanUp)

  it("should return NO_CACHE when neither files are present", done => {
    cache.read(err => {
      expect(err).to.equal(_.NO_CACHE)
        done()
    })
  })

  describe("File list", () => {
    const filesList = [
      "1.json",
      "2.json"
    ]

    describe("with invalid JSON", () => {
      before(done => {
        // Write invalid JSON data to file list
        fs.writeFile(_.FILE_LIST, "Invalid JSON data", () => {
          done()
        })
      })

      it("should return UNREADABLE_CACHE", done => {
        cache.read(err => {
          expect(err).to.equal(_.UNREADABLE_CACHE)
          done()
        })
      })
    })

    describe("with valid JSON", () => {
      it("should create a filesList JSON cache", done => {
        cache.writeFileList(filesList, err => {
          expect(err).to.be.null
          done()
        })
      })

      it("should be able to read it and parse it back", done => {
        fs.readFile(_.FILE_LIST, (err, data) => {
          expect(err).to.be.null
          expect(JSON.parse(data).files).to.eql(filesList)
          done()
        })
      })

      it("should return STALE_CACHE when the file list doesn't match the directory content", done => {
        cache.read(err => {
          expect(err).to.equal(_.STALE_CACHE)
          done()
        })
      })
    })
  })

  describe("Content", () => {
    const contentCache = {
      pepperoni: 12,
      pizza: 2,
      mozzarella: 5,
      sticks: 5
    }

    let actualFilesList = [ ]

    // Refresh the cache file list with the actual content of the data directory
    before(done => {
      fs.readdir(_.DATA_FOLDER, (err, files) => {
        actualFilesList = files
        cache.writeFileList(actualFilesList, err => {
          done()
        })
      })
    })

    it("should return NO_CACHE when cache looks fresh but no content cache exists", done => {
      cache.read(err => {
        expect(err).to.equal(_.NO_CACHE)
        done()
      })
    })

    describe("with invalid JSON", () => {
      before(done => {
        // Write invalid JSON data to content cache
        fs.writeFile(_.CACHE_FILE, "Invalid JSON data", () => {
          done()
        })
      })

      it("should return UNREADABLE_CACHE if the content cache is not valid JSON", done => {
        cache.read(err => {
          expect(err).to.equal(_.UNREADABLE_CACHE)
          done()
        })
      })
    })

    describe("with valid JSON", () => {
      it("should create a valid JSON content cache", done => {
        cache.writeContent(contentCache, err => {
          expect(err).to.be.null
          done()
        })
      })

      it("should be able to read it, and parse it back", done => {
        fs.readFile(_.CACHE_FILE, (err, data) => {
          expect(err).to.be.null
          expect(JSON.parse(data)).to.eql(contentCache)
          done()
        })
      })

      it("should return the cached content and no error", done => {
        cache.read((err, content) => {
          expect(err).to.equal(_.FRESH)
          expect(content).to.eql(contentCache)
          done()
        })
      })
    })
  })

  // remove any existing cache files
  after(cleanUp)
})
