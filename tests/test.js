const chai = require('chai');
const expect = chai.expect; // we are using the "expect" style of Chai

describe("test", () => {
  it("should test", () => {
    expect({}).to.be.an("object")
    expect({}).to.be.empty
  })
})
