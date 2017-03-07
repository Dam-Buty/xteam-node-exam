/* jshint expr:true */

const chai = require('chai');
const expect = chai.expect; // we are using the "expect" style of Chai

describe("searchTags : Reduces a crawled data object to the tags we're actually searching", () => {
  const searchTags = require("../lib/searchTags")

  const crawledData = {
    pepperoni: 12,
    pizza: 1,
    diet: 3,
    coke: 6
  }

  const searchedTags = [ "pizza", "diet" ]

  it("should return an empty object if searched tags array is empty", () => {
    expect(searchTags([], crawledData)).to.be.an("object")
    expect(searchTags([], crawledData)).to.be.empty
  })

  it("should return a 0 score line when a tag is not found", () => {
    const tagNotFound = [ "cheese" ]

    const zeroScoreLine = {
      cheese: 0
    }

    expect(searchTags(tagNotFound, crawledData)).to.be.an("object")
    expect(searchTags(tagNotFound, crawledData)).to.eql(zeroScoreLine)
  })

  it("should return only 0 score lines if crawled data is empty", () => {
    const zeroScoreLines = {
      pizza: 0,
      diet: 0
    }

    expect(searchTags(searchedTags, {})).to.be.an("object")
    expect(searchTags(searchedTags, {})).to.eql(zeroScoreLines)
  })

  it("should return the appropriate filtered data if neither is empty", () => {
    const filteredData = {
      pizza: 1,
      diet: 3
    }

    expect(searchTags(searchedTags, crawledData)).to.be.an("object")
    expect(searchTags(searchedTags, crawledData)).to.eql(filteredData)
  })
})
