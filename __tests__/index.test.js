const devIndex = require('../db/data/development-data/index')
const testIndex = require('../db/data/test-data/index')
describe('Development data index has all required keys', () => {
    test('should come back with correct keys for development index', ()=>{
        //Arrange
        //Act
        //Assertion
        expect(Object.keys(devIndex)).toEqual(["articleData", "commentData", "topicData", "userData"]);
        expect().toEqual();
    });
});

describe('Test data index has all required keys', () => {
    test('should come back with keys for test index', ()=>{
        //Arrange
        //Act
        //Assertion
        expect(Object.keys(testIndex)).toEqual(["articleData", "commentData", "topicData", "userData"]);
        expect().toEqual();
    });
});