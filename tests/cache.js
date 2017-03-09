/* jshint expr:true */

const chai = require('chai');
const expect = chai.expect; // we are using the "expect" style of Chai

const fs = require("fs")

const FRESH = null
const NO_CACHE = 1
const STALE_CACHE = 2
const UNREADABLE_CACHE = 3

const DATA_FOLDER = "data"
const FILE_LIST = ".cache.fileList.json"
const CACHE_FILE = ".cache.content.json"

const cleanUp = done => {
  fs.unlink(FILE_LIST, err => {
    fs.unlink(CACHE_FILE, err => {
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
      expect(err).to.equal(NO_CACHE)
        done()
    })
  })

  describe("File list", () => {
    const filesList = [
      "1.json",
      "2.json"
    ]

    describe("Unreadable data", () => {
      before(done => {
        // Write invalid JSON data to file list
        fs.writeFile(FILE_LIST, "Invalid JSON data", () => {
          done()
        })
      })

      it("should return UNREADABLE_CACHE if the file list is not valid JSON", done => {
        cache.read(err => {
          expect(err).to.equal(UNREADABLE_CACHE)
          done()
        })
      })
    })

    describe("Readable data", () => {
      it("should create a filesList JSON cache", done => {
        cache.writeFileList(filesList, err => {
          expect(err).to.be.null
          done()
        })
      })

      it("should be able to read it and parse it back", done => {
        fs.readFile(FILE_LIST, (err, data) => {
          expect(err).to.be.null
          expect(JSON.parse(data).files).to.eql(filesList)
          done()
        })
      })

      it("should return STALE_CACHE when the file list doesn't match the directory content", done => {
        cache.read(err => {
          expect(err).to.equal(STALE_CACHE)
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
      fs.readdir(DATA_FOLDER, (err, files) => {
        actualFilesList = files
        cache.writeFileList(actualFilesList, err => {
          done()
        })
      })
    })

    it("should return NO_CACHE when cache looks fresh but no content cache exists", done => {
      cache.read(err => {
        expect(err).to.equal(NO_CACHE)
        done()
      })
    })

    describe("Unreadable data", () => {
      before(done => {
        // Write invalid JSON data to content cache
        fs.writeFile(CACHE_FILE, "Invalid JSON data", () => {
          done()
        })
      })

      it("should return UNREADABLE_CACHE if the content cache is not valid JSON", done => {
        cache.read(err => {
          expect(err).to.equal(UNREADABLE_CACHE)
          done()
        })
      })
    })

    describe("Readable data", () => {
      it("should create a valid JSON content cache", done => {
        cache.writeContent(contentCache, err => {
          expect(err).to.be.null
          done()
        })
      })

      it("should be able to read it, and parse it back", done => {
        fs.readFile(CACHE_FILE, (err, data) => {
          expect(err).to.be.null
          expect(JSON.parse(data)).to.eql(contentCache)
          done()
        })
      })

      it("should return the cached content and no error", done => {
        cache.read((err, content) => {
          expect(err).to.equal(FRESH)
          expect(content).to.eql(contentCache)
          done()
        })
      })
    })
  })

  // remove any existing cache files
  after(cleanUp)
})
