const mongoClient = require("mongodb").MongoClient;

const state = {
  db: null,
};

module.exports.connect = (done) => {
  // const url = "mongodb://localhost:27017";
  const url =
    "mongodb+srv://admin:admin@cluster0.ml63a.mongodb.net/<dbname>?retryWrites=true&w=majority";
  const dbname = "test";

  mongoClient.connect(url, (err, data) => {
    if (err) return done(err);
    state.db = data.db(dbname);
    done();
  });
};

module.exports.get = function () {
  return state.db;
};
