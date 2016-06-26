import {query_once_start, querys_Tx} from '../db/mysql.js';
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
                conn.query("SELECT `user_pass`,`ID` FROM  bm_users  WHERE user_login = '" + ctx.request.body.username + "'", function (err, result) {
                    if (err || result.length == 0) {
                        conn.rollback(); // 发生错误事务回滚
                        callback(err || "no_acc");
                    } else {
                        if (CheckPassword(ctx.request.body.password, result[0].user_pass)) {
                            callback(err, result[0].ID); // 生成的ID会传给下一个任务
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
                    var check = {check: "ok", user_id: result};
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

export var api_post = (ctx)=> {
    var path_url = path.join(__dirname, '../../app/themes/bmblog/template/admin/api/' + ctx.params.name + '/');
    var paths = path_url + ctx.request.body.route + '/index';
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
        return {
            html: html,
            css: css,
            js: js
        };
    });
};