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
    describe("GET /api/users", () => {
      test("Status 200: should return all users as an array of objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const { users } = body;
            expect(users.length).toEqual(4);
            users.forEach((user) => {
              expect(user.hasOwnProperty("username")).toBe(true);
              expect(user.hasOwnProperty("name")).toBe(true);
              expect(user.hasOwnProperty("avatar_url")).toBe(true);
            });
          });
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
        test("Status 200: should return a list of all articles", () => {
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
      describe("GET api/articles?topic=", () => {
        test("Status 200: Should return a list of all articles with the same topic", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(typeof articles).toBe("object");
              expect(articles.length).toBe(12);
              expect(articles).toBeSorted("created_at");
              expect(articles).toBeSorted({ descending: true });
              articles.forEach((article) => {
                expect(typeof article.article_id).toBe("number");
                expect(typeof article.title).toBe("string");
                expect(typeof article.topic).toBe("string");
                expect(article.topic).toBe("mitch");
                expect(typeof article.author).toBe("string");
                expect(typeof article.created_at).toBe("string");
                expect(typeof article.votes).toBe("number");
                expect(typeof article.article_img_url).toBe("string");
                expect(typeof article.body).toBe("undefined");
                expect(typeof article.comment_count).toBe("number");
              });
            });
        });
        test("Status 404: Should return an article not found with this topic", () => {
          return request(app)
            .get("/api/articles?topic=science")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe(
                `Articles with topic science not found`
              );
            });
        });
      });
    });

    describe("GET /api/articles/:article_id", () => {
      test("Status 200: Should respond with an article object using the id and now with a comment count", () => {
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
              comment_count: 11,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("Status 200: Should respond with an article object with comment count 0 when the article has no comments", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article).toEqual({
              article_id: 2,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              author: "icellusedkars",
              body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              created_at: "2020-10-16T05:03:00.000Z",
              title: "Sony Vaio; or, The Laptop",
              topic: "mitch",
              votes: 0,
              comment_count: 0,
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
    });
    describe("PATCH /api/articles/:article_id", () => {
      test("Status 200: Should update article with correct votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
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
              votes: 101,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("Status 200: Should update article with correct vote if inc_votes is negative", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -100 })
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
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("Status 404: Should return not found if article id is valid but incorrect", () => {
        return request(app)
          .patch("/api/articles/999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe(`No article found for article: 999`);
          });
      });
      test("Status 400: Should return Bad request if article id is not valid", () => {
        return request(app)
          .patch("/api/articles/not-an-article")
          .send({ inc_votes: 1 })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe(`Bad request`);
          });
      });
      test("Status 400: Should return Bad request if body has a string instead of a number", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "string" })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe(`Bad request`);
          });
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
      test("Status 400: Should respond with Bad request if username is not a string", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ body: "Hello ", username: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(`Bad request`);
          });
      });
      test("Status 400: Should respond with Bad request if body is not a string", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ body: 1, username: "butter_bridge" })
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
            expect(body.msg).toBe(`No user found by the name of not_a_user`);
          });
      });
    });
    describe("DELETE /api/comments/:comment_id", () => {
      test("Status 204: Deletes the comment using comment_id", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
      test("Status 404: When given a valid Id but no comment exists", () => {
        return request(app)
          .delete("/api/comments/999")
          .expect(404)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not found comment by the id of: 999");
          });
      });
      test("Status 400: When given an invalid Id ", () => {
        return request(app)
          .delete("/api/comments/not-an-id")
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });
    });
  });
});
