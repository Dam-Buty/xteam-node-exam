
const chai = require('chai');
const expect = chai.expect; // we are using the "expect" style of Chai


describe("getInputTags : Get input tags from stdin, argv or tags.txt", () => {
  const getInputTags = require("../lib/getInputTags")

  getInputTags(expect) // just to shut jshint up
})
