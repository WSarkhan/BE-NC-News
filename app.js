const express = require('express');
const { getTopics } = require('./app.controllers/topics.controllers');
const { handleCustomErrors, handlePsqlErrors, handleInternalServerErrors } = require('./errors');
const { getApi } = require('./app.controllers/api.controllers');
const app = express();



app.get('/api/topics', getTopics)

app.get('/api', getApi)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleInternalServerErrors)

module.exports = app;