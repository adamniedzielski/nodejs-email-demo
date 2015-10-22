var co = require("co");
var nodemailer = require('nodemailer');
var Q = require("q");
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var uuid = require('node-uuid');
var MongoClient = require('mongodb').MongoClient;

function *send() {
  var transporter = nodemailer.createTransport({
    port: 1025
  });

  var token = uuid.v4();

  var content = yield renderContent();

  var rawSend = Q.nbind(transporter.sendMail, transporter);
  yield [rawSend({
      from: 'test1@example.com',
      to: 'test2@example.com',
      subject: 'Test',
      html: content.html
  }), saveContent(token, content)];
}

function *renderContent() {
  var templateDir = path.join(__dirname, 'invitation');
  var invitation = new EmailTemplate(templateDir);
  var context = { userName: "Adam" };

  var render = Q.nbind(invitation.render, invitation);
  return yield render(context);
}

function *saveContent(token, content) {
  var connect = Q.nbind(MongoClient.connect, MongoClient);
  var db = yield connect("mongodb://localhost:27017/nodejs-email-demo");

  var collection = db.collection('emails');

  var insert = Q.nbind(collection.insertOne, collection);
  yield insert({
    token: token,
    content: content.html
  });

  db.close();
}

co(function* () {
  yield send();
}).catch(function (err) {
  console.error(err.stack);
});
