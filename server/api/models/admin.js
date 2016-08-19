import {query_once_start, querys_Tx} from '../db/test-mysql.js';
import {CheckPassword} from '../../app/tool/ass';
import fs from 'fs';
import path from 'path';

export var login_post = (ctx)=> {
    return query_once_start().then((conn) => {
        var sql = [
            function (callback) {
                conn.beginTransaction(function (err) {
                    callback(err);
                });
            },

            function (callback) {
                conn.query("SELECT * FROM  `bm_users`  WHERE `user_login` = '" + ctx.request.body.username + "'", function (err, result) {
                    if (err || result.length == 0) {
                        conn.rollback(); // 发生错误事务回滚
                        callback(err || "no_acc");
                    } else {
                        if (CheckPassword(ctx.request.body.password, result[0].user_pass)) {
                            //身份认证成功
                            result[0].user_pass = '1';
                            ctx.session.user_id = result[0].ID;
                            callback(err, result[0]); // 生成的ID会传给下一个任务
                        } else {
                            conn.rollback(); // 发生错误事务回滚
                            callback(err || "no_acc");
                        }
                    }
                });
            },

            // function (last, callback) {
            //     console.log(last);
            //     conn.query('SELECT `user_pass`,`ID` FROM yidata.bm_users WHERE `ID` = ' + last, function (err, result) {
            //         if (err) {
            //             conn.rollback(); // 发生错误事务回滚
            //             callback(err);
            //         } else {
            //             callback(err, result[0]); // 生成的ID会传给下一个任务
            //         }
            //     });
            // },

            function (result, callback) {
                conn.commit(function (err) {
                    var check = null;
                    if (result != "no_acc") {
                        check = {statue: 200, check: 'ok', user_info: result};
                    } else {
                        check = {statue: 403, check: 'no_acc'};
                    }
                    callback(err, check);
                });
            }
        ];

        return querys_Tx(sql).then((result) => {
            //释放连接
            conn.release();
            return result;
        });
    });
};

export var page_post = (ctx)=> {
    let user_id = ctx.session.user_id;
    if ((user_id != '' || user_id != null) && user_id > 0) {
        var path_url = path.join(__dirname, '../../app/themes/bmblog/template/admin/page/' + ctx.params.name + '/');
        var paths = path_url + ctx.request.body.route + '/index';//临时
        var get_html = new Promise(function (resolve, reject) {
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
            get_html,
            get_css,
            get_js
        ]).then(([html, css, js]) => {
            var status = 200;
            if (html == '404' || css == '404' || js == '404') {
                status = 404;
                return {
                    status: status
                }
            } else {
                return {
                    status: status,
                    html: html,
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