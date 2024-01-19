const { fetchApi } = require("../app.models/api.models");

exports.getApi = (req, res, next) => {
  fetchApi()
    .then((apiEndpointsData) => {
      const parsedApiEndpoints = JSON.parse(apiEndpointsData);
      res.status(200).send({endpoints: parsedApiEndpoints});
    })
    .catch((err) => {
      next(err);
    });
};
