const {
  fetchArticleById,
  fetchArticles,
} = require("../app.models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req,res,next) => {
  const {inc_votes} = req.body
  const {article_id} = req.params

  changeArticle(inc_votes, article_id).then((changedArticle) =>{
    res.status(200).send({changedArticle})
  })


}

