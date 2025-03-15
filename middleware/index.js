const express = require("express");

const applyMiddleware = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};

module.exports = applyMiddleware;