const devIndex = require("../db/data/development-data/index");
const testIndex = require("../db/data/test-data/index");
describe("Development data index has all required keys", () => {
  test("should come back with correct keys for development index", () => {
    expect(Object.keys(devIndex)).toEqual([
      "articleData",
      "commentData",
      "topicData",
      "userData",
    ]);
  });
});

describe("Test data index has all required keys", () => {
  test("should come back with keys for test index", () => {
    expect(Object.keys(testIndex)).toEqual([
      "articleData",
      "commentData",
      "topicData",
      "userData",
    ]);
  });
});
