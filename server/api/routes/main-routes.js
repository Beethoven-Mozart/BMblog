import Koa_router from 'koa-router';
import controllers from '../controllers';

const router = new Koa_router();

router
    .get('/', controllers.home.default) // HOME 路由
    .get('/page/:num', controllers.home.list)
    .get('/:id.html', controllers.post.default)
    .get('/admin', controllers.admin.default)
    .get('/admin/login', controllers.admin.login)
    .post('/admin/login', controllers.admin.login_post)
    .get('/:page', controllers.page.default)
    .get('/:page', controllers.page.page)
    .get('/:page/page/:num', controllers.page.list)
    .get('/tag/:name', controllers.tag.default)
    .get('/tag/:name/page/:num', controllers.tag.list)
;

module.exports = router;
