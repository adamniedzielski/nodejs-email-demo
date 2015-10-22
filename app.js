var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var db = require("./db");

router.get('/emails/:id', function*() {
  var email = yield db.find(this.params.id);

  if (email) {
    this.body = email.content;
  }
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
