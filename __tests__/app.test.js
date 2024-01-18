const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const data = require("../endpoints.json");
require("jest-sorted");

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
      describe("GET api/articles", () => {
        test("status 200: should return a list of all articles", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(typeof articles).toBe("object");
              expect(articles.length).toBe(13);
              expect(articles).toBeSorted("created_at");
              expect(articles).toBeSorted({ descending: true });
              articles.forEach((article) => {
                expect(typeof article.article_id).toBe("number");
                expect(typeof article.title).toBe("string");
                expect(typeof article.topic).toBe("string");
                expect(typeof article.author).toBe("string");
                expect(typeof article.created_at).toBe("string");
                expect(typeof article.votes).toBe("number");
                expect(typeof article.article_img_url).toBe("string");
                expect(typeof article.body).toBe("undefined");
                expect(typeof article.comment_count).toBe("number");
              });
            });
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
        describe("GET /api/articles/:article_id/comments", () => {
          test("Status 200: Should respond with all comments for a given article id in an array ", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                const { comments } = body;
                expect(Array.isArray(comments)).toBe(true);
                expect(comments).toHaveLength(11);
                comments.forEach((comment) => {
                  expect(comment).toHaveProperty("comment_id");
                  expect(comment).toHaveProperty("votes");
                  expect(comment).toHaveProperty("created_at");
                  expect(comment).toHaveProperty("author");
                  expect(comment).toHaveProperty("body");
                  expect(comment).toHaveProperty("article_id");
                });
                expect(comments).toBeSorted("created_at");
                expect(comments).toBeSorted({ descending: true });
              });
          });
          test("Status 404: Should respond with an error message when given a valid id but no comments exist", () => {
            article_id = 2;
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(404)
              .then((res) => {
                expect(res.body.msg).toBe(
                  `No Comments found for article ${article_id}`
                );
              });
          });
          test("Status 404: Should respond with an error message when given a valid id but no article exists yet", () => {
            article_id = 999;
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(404)
              .then((res) => {
                expect(res.body.msg).toBe(
                  `No article found for article: ${article_id}`
                );
              });
          });
          test("Status 400: Should respond with an error message when given an invalid id", () => {
            article_id = "not-an-id";
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(400)
              .then((res) => {
                expect(res.body.msg).toBe(`Bad request`);
              });
          });
        });
        describe("POST /api/articles/:article_id/comments", () => {
          test("Status 201: Should Create a new comment and respond with the comment created", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ body: "Test", username: "butter_bridge" })
              .expect(201)
              .then(({ body }) => {
                const { comment } = body;
                expect(typeof comment).toBe("object");
                expect(comment.hasOwnProperty("comment_id")).toBe(true);
                expect(comment.body).toBe("Test");
                expect(comment.votes).toBe(0);
                expect(comment.author).toBe("butter_bridge");
                expect(comment.article_id).toBe(1);
                expect(comment.hasOwnProperty("created_at")).toBe(true);
              });
          });
          test("Status 400: Should respond with Bad request if body or username is not a string", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ body: "Hello ", username: 1 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe(`Bad request`);
              });
          });
          test("Status 400: Should respond with bad request if article id is not a valid id", () => {
            return request(app)
              .post("/api/articles/not-an-article/comments")
              .send({ body: "Test", username: "butter_bridge" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe(`Bad request`);
              });
          });
          test("Status 404: Should respond with not found if article has recieved a valid but incorrect id", () => {
            return request(app)
              .post("/api/articles/999/comments")
              .send({ body: "Test", username: "butter_bridge" })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe(`No article found for article: 999`);
              });
          });
          test("Status 404: Should respond with user not found if username is not found", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({ body: "Test", username: "not_a_user" })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe(
                  `No user found by the name of not_a_user`
                );
              });
          });
        });
      });
    });
  });
});
