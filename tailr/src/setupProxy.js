const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:3000', // Your Node.js server
            changeOrigin: true,
        })
    );
    app.use(
        '/python-api',
        createProxyMiddleware({
            target: 'http://localhost:5000', // Your Python server
            changeOrigin: true,
        })
    );
};

