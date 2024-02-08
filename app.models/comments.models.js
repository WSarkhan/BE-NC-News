const format = require("pg-format");
const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No Comments found for article ${article_id}`,
        });
      }
      return rows;
    });
};

exports.insertComment = (article_id, body, username) => {
  const created_at = new Date(Date.now());
  let votes = 0;
  const comment = [body, votes, username, article_id, created_at];
  const sqlQuery = format(
    `INSERT INTO comments (body, votes, author, article_id, created_at) VALUES %L RETURNING *`,
    [comment]
  );
  return db.query(sqlQuery).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found comment by the id of: ${comment_id}`,
        });
      }
    });
};
