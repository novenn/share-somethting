// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');
console.log('*****\nSetting up proxy\n*****')
module.exports = function(app) {
  app.use("/api/", createProxyMiddleware({
      target: 'http://localhost:9527/api/',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': '',
      // },
    })
  );

  app.use("/uploads/", createProxyMiddleware({
    target: 'http://localhost:9527/uploads/',
    changeOrigin: true,
    // pathRewrite: {
    //   '^/api': '',
    // },
  })
);
};