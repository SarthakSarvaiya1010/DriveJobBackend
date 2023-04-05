const newLocal = "express";
const express = require(newLocal);
const users = require("./user");
const jobs = require("./jobs");

const router = express.Router();

// const api = new router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use(users);
router.use(jobs);

module.exports = router;
