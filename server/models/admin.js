import {query} from "../lib/mysql.js";
import {CheckPassword} from '../tool/ass';
import fs from 'fs';
import path from 'path';

export var login_post = (ctx)=> {
    return query("SELECT * FROM  `bm_users`  WHERE `user_login` = '" + ctx.request.body.username + "'").then(result => {
        var check = null;
        if (CheckPassword(ctx.request.body.password, result[0].user_pass)) {
            //身份认证成功
            result[0].user_pass = '1';
            ctx.session.user_id = result[0].ID;
            return {status: 200, check: 'ok', user_info: result[0]};
        } else {
            return {status: 403, check: 'no_acc'};
        }
    });
};

export var logout_post = (ctx)=> {
    return new Promise(function (resolve, reject) {
        ctx.session = null;
        resolve({status: 200, check: 'ok'});
    });
};

export var page_get = (ctx)=> {
    let user_id = ctx.session.user_id;
    if ((user_id != '' || user_id != null) && user_id > 0) {
        var paths = path.join(__dirname, '../../app/themes/bmblog/template/admin/page/' + ctx.params.name + '/' + ctx.params.route + '/index');
        return new Promise(function (resolve, reject) {
            fs.exists(paths + '.html', function (exists) {
                if (exists) {
                    fs.readFile(paths + '.html', 'utf-8', function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                } else {
                    resolve('404');
                }
            });
        });

    } else {
        return new Promise(function (resolve, reject) {
            resolve('403');
        });
    }
};

export var page_post = (ctx)=> {
    let user_id = ctx.session.user_id;
    if ((user_id != '' || user_id != null) && user_id > 0) {
        var path_url = path.join(__dirname, '../../app/themes/bmblog/template/admin/page/' + ctx.params.name + '/');
        var header = path_url + ctx.request.body.route + '/header';
        var paths = path_url + ctx.request.body.route + '/index';

        var get_head_js = new Promise(function (resolve, reject) {
            fs.exists(header + '.js', function (exists) {
                if (exists) {
                    fs.readFile(header + '.js', 'utf-8', function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                } else {
                    resolve('404');
                }
            });
        });

        var get_css = new Promise(function (resolve, reject) {
            fs.exists(paths + '.css', function (exists) {
                if (exists) {
                    fs.readFile(paths + '.css', 'utf-8', function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                } else {
                    resolve('404');
                }
            });
        });

        var get_js = new Promise(function (resolve, reject) {
            fs.exists(paths + '.js', function (exists) {
                if (exists) {
                    fs.readFile(paths + '.js', 'utf-8', function (err, data) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                } else {
                    resolve('404');
                }
            });
        });

        return Promise.all([
            get_head_js,
            get_css,
            get_js
        ]).then(([head, css, js]) => {
            var status = 200;
            if (css == '404' || js == '404') {
                status = 404;
                return {
                    status: status
                }
            } else {
                return {
                    status: status,
                    head_js: head,
                    css: css,
                    js: js
                };
            }
        });
    } else {
        return new Promise((resolve, reject) => {
            resolve({
                status: 403
            });
        });
    }
};
