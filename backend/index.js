const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/db");
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRouter");
const taskRouter = require("./routes/taskRouter");
const projectRouter = require("./routes/projectRouter");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // allow all for dev
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/task", taskRouter);
app.use("/project", projectRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
