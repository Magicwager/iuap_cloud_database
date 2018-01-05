var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.develop.config');

var express = require('express');
var proxy = require('http-proxy-middleware');
var app = express();
var port = 5001;
var ip = '127.0.0.1';

/* 配置反向代理 start */
const context = [`/ext/bd/attr/extendFields`,
                 `/ext/bd/attr/extendField/`,
                 `/ext/bd/attr/extendField`,
                  `/ext/bd/attr/doccustoms`,
                  `/basedoc-mc/manage/save`,
                  `/basedoc-mc/manage/listorgsettings`
                ]
const options = {
  //target: 'http://127.0.0.1:8180',      // 币种
  //target: 'http://10.6.254.170:8180',   // 自定义项
  target: 'http://10.11.64.78:8080',      // 分级管理
  changeOrigin: true
}
const apiProxy = proxy(options)
app.use(context, apiProxy);
/* 配置反向代理 end */

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
