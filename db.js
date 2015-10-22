var MongoClient = require('mongodb').MongoClient;
var Q = require("q");

function *connect() {
  var conn = Q.nbind(MongoClient.connect, MongoClient);
  return yield conn("mongodb://localhost:27017/nodejs-email-demo");
}

module.exports = {
  save: function*(token, content) {
    var db = yield connect();
    var collection = db.collection("emails");

    var insert = Q.nbind(collection.insertOne, collection);
    yield insert({
      token: token,
      content: content
    });

    db.close();
  },

  find: function*(token) {
    var db = yield connect();
    var collection = db.collection("emails");

    var find = Q.nbind(collection.findOne, collection);
    var email = yield find({ token: token });

    db.close();
    return email;
  }
}
