console.log("hello start node server");

const express = require("express");
const bodyParser = require("body-parser");
const indexRouter = require("./src/routes/index");
const app = express();
const port = 3700;
const path = require("path");

var cors = require("cors");
var cookieParser = require("cookie-parser");
app.use("/", indexRouter);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("public", express.static("public"));
app.use(cookieParser());

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
