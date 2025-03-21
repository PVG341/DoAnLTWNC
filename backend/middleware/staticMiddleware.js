const path = require("path");

// Cấu hình bằng json
app.use("/", require("./routes/index"));
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));