const db = require("../config/connection");
const Promise = require("promise");
const ObjectId = require("mongodb").ObjectId;
const { userCollection, cartCollection } = require("../config/Collection");

// database handling

module.exports = {
  checkUser: (data) => {
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(userCollection)
        .findOne({ uid: data[0].uid });

      console.log("user found");
      if (user) {
        // console.log(user);
        resolve(user);
      } else {
        db.get()
          .collection(userCollection)
          .insertOne(data[0])
          .then((doc) => {
            console.log(doc.ops[0]._id);
            data[0]._id = doc.ops[0]._id;
            resolve(data);
          })
          .catch((err) => console.log(err));
      }
    });
  },
  addToCart: (words, userid, url) => {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>> words", words, userid, url);
    let proObj = {
      url: url,
      wordCount: words,
      _id: ObjectId(),
    };
    return new Promise(async (resolve, reject) => {
      // console.log(words, userid);
      let userCart = await db
        .get()
        .collection(cartCollection)
        .findOne({ user: ObjectId(userid) });

      if (userCart) {
        console.log("cart found");
        db.get()
          .collection(cartCollection)
          .updateOne(
            { user: ObjectId(userid) },
            {
              $push: { product: proObj },
            }
          )
          .then((resposnse) => {
            resolve(resposnse);
          });
      } else {
        console.log("cart not  found");
        let cartObject = {
          user: ObjectId(userid),
          fav: [],
          product: [proObj],
        };
        db.get()
          .collection(cartCollection)
          .insertOne(cartObject)
          .then((response) => {
            resolve(response);
          });
      }
    });
  },
  getUserCartItem: (id) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(cartCollection)
        .findOne({ user: ObjectId(id) });
      console.log(cart);
      if (cart != null) {
        resolve({ products: cart.product, fav: cart.fav });
      }
    });
  },
  deleteuserword: (id, userid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(cartCollection)
        .updateOne(
          { user: ObjectId(userid) },
          {
            $pull: { product: { _id: ObjectId(id) } },
          }
        )
        .then((resposnse) => {
          resolve(resposnse);
        });
    });
  },
  setUnfav: (id, userid, value, i) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(cartCollection)
        .updateOne(
          { user: ObjectId(userid) },
          {
            $pull: { fav: ObjectId(id) },
          }
        )
        .then((resposnse) => {
          resolve(resposnse);
        });
    });
  },
  setFav: (id, userid) => {
    return new Promise(async (resolve, reject) => {
      let fav = await db
        .get()
        .collection(cartCollection)
        .aggregate([
          { $match: { user: ObjectId(userid) } },
          {
            $unwind: "$fav",
          },
          { $match: { fav: ObjectId(id) } },
        ])
        .toArray();
      if (fav.length === 1) {
        console.log("found");
      } else {
        db.get()
          .collection(cartCollection)
          .updateOne(
            { user: ObjectId(userid) },
            {
              $push: { fav: ObjectId(id) },
            }
          )
          .then((resposnse) => {
            resolve(resposnse);
          });
      }
    });
  },
};
