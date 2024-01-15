const express = require('express');
const { getTopics } = require('./app.controllers/topics.controllers');
const { handleCustomErrors, handlePsqlErrors, handleInternalServerErrors } = require('./errors');
const app = express();



app.get('/api/topics', getTopics)

app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleInternalServerErrors)

module.exports = app;