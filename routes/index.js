var express = require("express");
var router = express.Router();
const cheerio = require("cheerio");
const fetch = require("node-fetch");

// user helpers
const {
  checkUser,
  addToCart,
  getUserCartItem,
  deleteuserword,
  setUnfav,
  setFav,
} = require("../Helpers/userhelpers");



/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/", (req, res) => {
  var words;
  const url = req.body.url;
  const userid = req.body.userid;
  console.log(userid);
  fetch(url)
    .then((r) => r.text())
    .then((t) => {
      words = cheerio.load(t).text().trim().split(" ");
      // console.log(words.length);
      addToCart(words.length, userid, url);
      // addToCart(12345, "601d4437b33d5b34707a6700", "safsdaf");

      res.send({ wordLength: words.length, words: words });
    })
    .catch((err) => {
      res.send(err);
    });
});
router.post("/user", (req, res) => {
  checkUser(req.body.providerData).then((resposne) => {
    res.send(resposne);
  });
});
router.get("/userwordlist", async (req, res) => {
  // console.log("called");
  // console.log(req.query.user);
  let cart = await getUserCartItem(req.query.user);
  console.log(cart);
  res.send(cart);
});
router.post("/deleteuserword", (req, res) => {
  // console.log(req.body.params.id);
  deleteuserword(req.body.params.id, req.body.params.user._id).then(
    (response) => {
      res.send(response);
    }
  );
});
router.post("/setUnfav", (req, res) => {
  // console.log(req.body.params);
  setUnfav(req.body.params.id, req.body.params.user._id).then((respos) => {
    res.send(respos);
  });
});
router.post("/setfav", (req, res) => {
  // console.log(req.body.params);
  setFav(req.body.params.id, req.body.params.user._id).then((respos) => {
    res.send(respos);
  });
});

router.get("/test", (req, res) => {
  getUserCartItem()
});

module.exports = router;
