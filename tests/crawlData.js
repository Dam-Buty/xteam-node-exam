/* jshint expr:true */
'use strict'

const chai = require('chai')
const expect = chai.expect

describe("crawlData", () => {
  const crawlData = require("../app/crawlData")

  it("should return an empty object if data array is empty", () => {
    expect(crawlData([])).to.be.an("object")
    expect(crawlData([])).to.be.empty
  })

  const emptyData = [
    { type: 1, tags: [] },
    { type: 2, nested: { type: 3, tags: [] } }
  ]

  it("should return an empty object if all tags arrays are empty", () => {
    expect(crawlData(emptyData)).to.be.an("object")
    expect(crawlData(emptyData)).to.be.empty
  })

  const topLevelData = emptyData.concat([
    { type: 1, tags: ["check", "check", "one", "two"] }
  ])

  it("should count tags on top level ...", () => {
    const expectedResult = {
      check: 2,
      one: 1,
      two: 1
    }

    expect(crawlData(topLevelData)).to.be.an("object")
    expect(crawlData(topLevelData)).to.deep.equal(expectedResult)
  })

  const nestedData = topLevelData.concat([
    { type: 2, nested: { type: 3, tags: ["check", "three", "four"] }},
    { type: 2, nested: {
      type: 4,
      subNested: { type: 5, tags: ["one", "more", "time", "please"]},
      even: { more: { tags: ["one", "two", "three"] } }
    }},
    { type:10, array: [
      { tags: ["time"] },
      { type: 10, otherArray: [
        { type: 666, tags: ["mic", "check"]},
        { type: 667, tags: ["mic"]}
      ]}
    ]}
  ])

  it("... and in nested objects", () => {
    const expectedResult = {
      check: 4,
      one: 3,
      two: 2,
      three: 2,
      time: 2,
      mic: 2,
      four: 1,
      more: 1,
      please: 1
    }

    expect(crawlData(nestedData)).to.be.an("object")
    expect(crawlData(nestedData)).to.deep.equal(expectedResult)
  })
})
