import {default as admin,login as model_post,login_post as model_login_post} from '../models/admin';
export default (ctx) =>{
    ctx.render('admin/index', {double: 'rainbow'});
};

export var login = (ctx) =>{
    ctx.render('admin/login');
};

export var login_post = (ctx) =>{
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