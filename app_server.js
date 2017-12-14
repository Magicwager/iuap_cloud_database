var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.develop.config');

var express = require('express');
var proxy = require('http-proxy-middleware');
var app = express();
var port = 5001;
var ip = '127.0.0.1';

// 配置反向代理
const context = [`/basedoc/bd/attr/extendFields`, `/basedoc/bd/attr/extendField`]
const options = {
  target: 'http://127.0.0.1:8180',
  changeOrigin: true
}
const apiProxy = proxy(options)
app.use(context, apiProxy);


var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true
  }
}));
// app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath, lazy: false, watchOptions: {aggregateTimeout: 300,poll: true}}))
app.use(webpackHotMiddleware(compiler));
app.use('/', express.static(__dirname + '/client/'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/client/dev.html');
});

app.listen(port, ip, function (error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==>    Listening on port %s. Open up http://%s:%s/ in your browser.", port, ip, port)
  }
});
