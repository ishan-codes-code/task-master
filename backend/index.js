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
    origin:
      "https://1b57e44a-991a-4eb9-9662-666a3ba399d6-00-370g4lciek7gs.sisko.replit.dev:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/task", taskRouter);
app.use("/project", projectRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
