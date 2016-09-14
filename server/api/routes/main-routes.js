const Koa_router = require('koa-router');
let controllers = require('../controllers/index.js');

const router = new Koa_router();

router
    .get('/', controllers.home.default) // HOME 路由
    .put('/api/:api_type/:name', controllers.api_put.api_put)
    .get('/api/:api_type/:name', controllers.api.api_get)
    .post('/api/:api_type/:name', controllers.api.default)
    .get('/page/:num', controllers.home.list)
    .get('/:id.html', controllers.post.default)
    .get('/admin', controllers.admin.default)
    .get('/admin/login', controllers.admin.login)
    .post('/admin/login', controllers.admin.login_post)
    .post('/admin/page/:name', controllers.admin.page)
    .get('/:page', controllers.page.default)
    .get('/:page', controllers.page.page)
    .get('/:page/page/:num', controllers.page.list)
    .get('/tag/:name', controllers.tag.default)
    .get('/tag/:name/page/:num', controllers.tag.list);

module.exports = router;
