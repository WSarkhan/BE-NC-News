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

exports.fetchArticles = (topic, sort_by = "created_at", order = "DESC") => {
  return fetchTopics()
    .then((topics) => {
      const whitelistedTopics = topics.map((topic) => topic.slug);
      if (topic && !whitelistedTopics.includes(topic)) {
        return Promise.reject({
          status: 404,
          msg: `Articles with topic ${topic} not found`,
        });
      } else {
        let query = `
          SELECT articles.article_id, articles.title, articles.topic, articles.author, 
                 articles.created_at, articles.votes, articles.article_img_url,
                 COUNT(comments.article_id)::INT AS comment_count
          FROM articles
          LEFT JOIN comments ON articles.article_id = comments.article_id
        `;
        const params = [];
        if (topic) {
          query += ` WHERE articles.topic = $1`;
          params.push(topic);
        }

        query += `
          GROUP BY articles.article_id
          ORDER BY ${sort_by} ${order};
        `;

        return db.query(query, params)
          .then(({ rows }) => {
            if (rows.length === 0) {
              return [];
            } else {
              return rows;
            }
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
