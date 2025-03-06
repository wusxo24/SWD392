const express = require("express");
const cookieParser = require("cookie-parser");

const applyMiddleware = (app) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
};

module.exports = applyMiddleware;
