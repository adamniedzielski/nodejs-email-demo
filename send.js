var co = require("co");
var nodemailer = require('nodemailer');
var Q = require("q");

function *send() {
  var transporter = nodemailer.createTransport({
    port: 1025
  });

  var rawSend = Q.nbind(transporter.sendMail, transporter);
  yield rawSend({
      from: 'test1@example.com',
      to: 'test2@example.com',
      subject: 'Test',
      text: 'Test123!'
  });
}

co(function* () {
  yield send();
}).catch(function (err) {
  console.error(err.stack);
});
