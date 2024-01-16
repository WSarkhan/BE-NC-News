const express = require("express");
const { getTopics } = require("./app.controllers/topics.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleInternalServerErrors,
} = require("./errors");
const { getApi } = require("./app.controllers/api.controllers");
const { getArticleById, getArticles} = require("./app.controllers/article.controllers");
const { getCommentsByArticleId } = require("./app.controllers/comments.controllers");
const app = express();


app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleInternalServerErrors);

module.exports = app;
