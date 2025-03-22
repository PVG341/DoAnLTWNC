const express = require("express");

const bodyParserMiddleware = [
    express.json(),
    express.urlencoded({ extended: true })
];

module.exports = bodyParserMiddleware;