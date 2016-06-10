import {query_once_start, querys_Tx} from '../db/mysql.js';
import {CheckPassword} from '../../app/tool/ass';

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