const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  describe("/api", () => {
    describe("GET /api/topics", () => {
      test("GET /api/topics status 200: should return a list of all topics", () => {
        return request(app)
          .get("/api/topics/")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual([
              { slug: "mitch", description: "The man, the Mitch, the legend" },
              { slug: "cats", description: "Not dogs" },
              { slug: "paper", description: "what books are made of" },
            ]);
            body.forEach((topic) => {
              expect(Object.keys(topic)).toEqual(["slug", "description"]);
            });
          });
      });
    });
  });
});
