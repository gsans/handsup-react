'use strict';

const port = process.env.PORT || 3000;
const Koa = require('koa');
const serve = require('koa-static');
const convert = require('koa-convert');
const app = new Koa();
const _use = app.use;
app.use = (x) => _use.call(app, convert(x));
app.use(serve('./dist'));

const server = app.listen(port, function () {
 let host = server.address().address;
 let port = server.address().port;
 console.log('listening at http://%s:%s', host, port);
});