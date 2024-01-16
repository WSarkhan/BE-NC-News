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
    describe("/api/topics", () => {
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
    describe("/api/articles", () => {
      describe('GET api/articles', () => {
          test('status 200: should return a list of all articles', ()=>{
              
              expect().toBe();
              expect().toEqual();
          });
      });
      describe("GET /api/articles/:article_id", () => {
        test("Status 200: Should respond with an article object using the id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              const { article } = body;
              expect(article).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              });
              expect(typeof article).toBe("object");
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.title).toBe("string");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.author).toBe("string");
              expect(typeof article.body).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
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
});
