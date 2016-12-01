const Koa_router = require('koa-router');
let controllers = require('../controllers/index.js');

const router = new Koa_router();

router
    .all('/upload', controllers.upload.upload.array('file'), function (ctx, next) {
        return new Promise(function (resolve, reject) {
            //允许跨域，正式环境要改为对应域名
            ctx.set("Access-Control-Allow-Origin", "*");
            //ctx.req.files.filename = ctx.req.files.path;
            resolve(ctx.body = ctx.req.files);
        });
    })
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
