import {login_post as model_login_post, page_post as model_admin_page_post} from '../models/admin';

export default (ctx) => {
    let user_id = ctx.session.user_id;
    if ((user_id != '' || user_id != null) && user_id > 0) {
        return ctx.render('admin/index', {double: 'rainbow'});
    } else {
        ctx.redirect('/admin/login');
        ctx.status = 302;
    }
};

export var login = (ctx) => {
    return ctx.render('admin/login');
};

export var login_post = (ctx) => {
    return model_login_post(ctx).then((result) => {
        console.log(result);
        if (result.length == 0) {
            ctx.throw(500, '服务器错误');
        } else {
            ctx.set("Content-Type", "application/json;charset=utf-8");
            ctx.body = result;
        }
    });
};

export var logout_post = (ctx) => {
    return model_login_post(ctx).then((result) => {
        console.log(result);
        if (result.length == 0) {
            ctx.throw(500, '服务器错误');
        } else {
            ctx.set("Content-Type", "application/json;charset=utf-8");
            ctx.body = result;
        }
    });
};

export var page = (ctx) => {
    return model_admin_page_post(ctx).then((result) => {
        console.log(ctx.session);
        ctx.body = result;
    });
};