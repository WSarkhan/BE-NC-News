const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article: ${article_id}`,
        });
      } else {
        return rows[0];
      }
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles
    ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      const articleComments = rows.map((article) => {
        return db
          .query(
            `
        SELECT COUNT(*)::INT
         FROM comments WHERE article_id = ${article.article_id};`
          )
          .then(({ rows }) => {
            article.comment_count = rows[0].count;
            return article;
          });
      });

      return Promise.all(articleComments).then((articlesWithAddedComments) => {
        return articlesWithAddedComments;
      });
    });
};

