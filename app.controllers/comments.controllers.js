const { fetchArticleById } = require("../app.models/articles.models");
const {
  fetchCommentsByArticleId,
  insertComment,
} = require("../app.models/comments.models");
const { fetchUser } = require("../app.models/user.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const articleQuery = fetchArticleById(article_id);
  const fetchQuery = fetchCommentsByArticleId(article_id);

  Promise.all([fetchQuery, articleQuery])
    .then((response) => {
      const comments = response[0];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { body, username } = req.body;
  const { article_id } = req.params;
  if (typeof body !== "string" || typeof username !== "string") {
    next({ status: 400, msg: "Bad request" });
  } else {
    const articleQuery = fetchArticleById(article_id);
    const userQuery = fetchUser(username);

    Promise.all([articleQuery, userQuery])
      .then((response) => {
        return insertComment(article_id, body, username);
      })
      .then((comment) => {
        res.status(201).send({ comment });
      })
      .catch((err) => {
        next(err);
      });
  }
};
