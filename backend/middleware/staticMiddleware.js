const express = require("express");
const path = require("path");

const staticMiddleware = express.static(path.join(__dirname, "../public/images"));

module.exports = staticMiddleware;

// Cấu hình bằng json
// app.use("/", require("./routes/index"));
// app.set("views", path.join(__dirname, "views"));