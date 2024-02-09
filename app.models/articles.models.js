const { getTopics } = require("../app.controllers/topics.controllers");
const db = require("../db/connection");
const { fetchTopics } = require("./topics.models");

exports.findIfArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article: ${article_id}`,
        });
      }
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id=comments.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article: ${article_id}`,
        });
      }
      return rows[0];
    });
};

exports.fetchArticles = (topic, sort_by = "created_at", order = "DESC", articleTopics) => {
  return db
    .query("SELECT * FROM topics")
    .then(({ rows }) => {
      let whitelistedTopic = [];
      rows.map((row) => {
        whitelistedTopic.push(row.slug);
      });
      return whitelistedTopic;
    })
    .then((whitelistedTopic) => {
      if (topic && whitelistedTopic.includes(topic) === true) {
        return db
          .query(
            `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles
          WHERE topic = $1
          ORDER BY ${sort_by} ${order};`,
            [topic]
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

            return Promise.all(articleComments).then(
              (articlesWithAddedComments) => {
                return articlesWithAddedComments;
              }
            );
          });
      } else if (!topic) {
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

            return Promise.all(articleComments).then(
              (articlesWithAddedComments) => {
                return articlesWithAddedComments;
              }
            );
          });
      } else if (!whitelistedTopic.includes(topic)) {
        return Promise.reject({
          status: 404,
          msg: `Articles with topic ${topic} not found`,
        });
      }
    });
};

exports.changeArticle = (inc_votes, article_id) => {
  return this.fetchArticleById(article_id).then((result) => {
    return db
      .query(
        `UPDATE articles SET votes = votes+$1 WHERE article_id = $2 RETURNING *`,
        [inc_votes, article_id]
      ).then(()=>{
        return db
        .query(
          `SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count 
          FROM articles 
          LEFT JOIN comments 
          ON articles.article_id=comments.article_id 
          WHERE articles.article_id = $1 
          GROUP BY articles.article_id;`,
          [article_id]
        )
      })
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
