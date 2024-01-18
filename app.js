const express = require("express");
const { getTopics } = require("./app.controllers/topics.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleInternalServerErrors,
} = require("./errors");
const { getApi } = require("./app.controllers/api.controllers");
const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("./app.controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
} = require("./app.controllers/comments.controllers");
const { getUsers } = require("./app.controllers/users.controlles");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleInternalServerErrors);

module.exports = app;
