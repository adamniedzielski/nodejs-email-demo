var co = require("co");
var nodemailer = require('nodemailer');
var Q = require("q");
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var uuid = require('node-uuid');
var db = require('./db');

function *send() {
  var transporter = nodemailer.createTransport({
    port: 1025
  });

  var token = uuid.v4();

  var content = yield renderContent(token);

  var rawSend = Q.nbind(transporter.sendMail, transporter);
  yield [rawSend({
      from: 'test1@example.com',
      to: 'test2@example.com',
      subject: 'Test',
      html: content.html
  }), saveContent(token, content)];
}

function *renderContent(token) {
  var templateDir = path.join(__dirname, 'invitation');
  var invitation = new EmailTemplate(templateDir);
  var context = {
    userName: "Adam",
    viewInBrowserUrl: "http://localhost:3000/emails/" + token
  };

  var render = Q.nbind(invitation.render, invitation);
  return yield render(context);
}

function *saveContent(token, content) {
  yield db.save(token, content.html);
}

co(function* () {
  yield send();
}).catch(function (err) {
  console.error(err.stack);
});
