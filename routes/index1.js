var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const Promise = require("promise");
const sanitizeHtml = require("sanitize-html");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/", (req, res) => {
  var txt;
  console.log(req.body.url);
  fetch(req.body.url)
    .then((r) => r.text().trim())
    .then((t) => {
      txt = sanitizeHtml(t, {
        allowedTags: [
          "em",
          "strong",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "bold",
          "p",
        ],
        allowedAttributes: {
          a: ["href"],
        },
      });
      console.log("value", txt.length);
      res.send(txt);
    });
});

module.exports = router;
