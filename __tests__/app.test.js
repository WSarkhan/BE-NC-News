const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const data = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  describe("/api", () => {
    test("GET /api status 200: should return with an object with keys that show all the available endpoints on the API", () => {
      return request(app)
        .get("/api/")
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual(data);
        });
    });
    describe("GET /api/topics", () => {
      test("GET /api/topics status 200: should return a list of all topics", () => {
        return request(app)
          .get("/api/topics/")
          .expect(200)
          .then(({ body }) => {
            expect(typeof body).toBe("object");
            body.forEach((topic) => {
              expect(Object.keys(topic)).toEqual(["slug", "description"]);
            });
          });
      });
    });
    describe("GET /api/articles/:article_id", () => {
      test("Status 200: Should respond with an article object using the id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            expect(typeof res.body).toBe("object");
          });
      });
      test("Status 400: Should respond with a an error message when given invalid id", () => {
        return request(app)
          .get("/api/articles/not-an-article")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Bad request");
          });
      });
      test("Status 404: Should respond with a an error message when given a valid but not existing id", () => {
        article_id = 999;
        return request(app)
          .get(`/api/articles/${article_id}`)
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe(
              `No article found for article: ${article_id}`
            );
          });
      });
    });
  });
});
