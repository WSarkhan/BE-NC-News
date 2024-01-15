const db = require("../db/connection");
const fs = require("fs/promises");

exports.fetchApi = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf8").then((data) => {
    return data
  });
};
