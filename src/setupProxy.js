const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware('/zapi',
        {
            target : 'http://218.94.57.151:8087',
            changeOrigin : true,  // 设置跨域请求

            pathRewrite : {
                '/zapi' : '' // 将/api/v1 变为 ''
            }
        })
    );
};
 