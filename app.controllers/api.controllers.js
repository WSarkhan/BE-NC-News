
const { fetchApi } = require("../app.models/api.models");



exports.getApi = (req,res,next) => {
  fetchApi().then((data) => {
    
    const parsed = JSON.parse(data)
    console.log(parsed)
     res.status(200).send(parsed);
    })
    .catch((err) => {
      next(err);
    });
};

