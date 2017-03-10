/* jshint expr:true */
/*jshint unused:false*/
'use strict'

const chai = require('chai')
const expect = chai.expect

describe("formatOutput", () => {
  const formatOutput = require("../app/formatOutput")

  it("should return an empty string for an empty object", () => {
    expect(formatOutput({ })).to.be.a('string');
    expect(formatOutput({ })).to.equal('');
  })

  const expectedOutput =
`pepperoni      12
pizza          1`

  it("should return the appropriate string for a non-empty object", () => {
    const nonEmptyResults = {
      pepperoni: 12,
      pizza: 1
    }

    expect(formatOutput(nonEmptyResults)).to.be.a('string');
    expect(formatOutput(nonEmptyResults)).to.equal(expectedOutput);
  })

  it("should still return the appropriate string even if object is not sorted", () => {
    const nonSortedResults = {
      pizza: 1,
      pepperoni: 12
    }

    expect(formatOutput(nonSortedResults)).to.be.a('string');
    expect(formatOutput(nonSortedResults)).to.equal(expectedOutput);
  })
})
