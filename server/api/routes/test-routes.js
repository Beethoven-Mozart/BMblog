import Koa_router from 'koa-router';
import {system_config} from '../../config';
//临时import
import {
    query,
    querys,
    querys_ASC,
    querys_Tx,
    querys_Parallelism,
    query_once_start
} from '../db/test-mysql';

const mysql_prefix = system_config.mysql_prefix;//数据库前缀
const router = new Koa_router();

router
    .get('/test/querys/:name', (ctx) => {
    var sqls = {
        table_a: "select count(*) from bm_posts",
        table_b: "select count(*) from bm_terms",
        table_c: "select count(*) from bm_terms",
        table_d: "select count(*) from bm_terms",
        table_e: "select count(*) from bm_terms",
        table_f: "select count(*) from bm_terms",
        table_g: "select count(*) from bm_terms",
        table_h: "select count(*) from bm_users"
    };
    // var sqls = [
    //         "select count(*) from bm_posts",
    //         "select count(*) from bm_terms",
    //         "select count(*) from bm_terms",
    //         "select count(*) from bm_terms",
    //         "select count(*) from bm_terms",
    //         "select count(*) from bm_terms",
    //         "select count(*) from bm_terms",
    //         "select count(*) from bm_users"
    // ];
    return querys(sqls).then((post) => {
        if (post.length == 0) {
            ctx.throw(404, '未找该页面。');
        } else {
            ctx.body = post;
        }
    });
})

    .get('/test/querys_Parallelism/:name', (ctx) => {
        return query_once_start().then((conn) => {
            var sqls_ob = {
                table_a: function (callback) {
                    conn.query('select count(*) from bm_posts', function (err, result) {
                        callback(err, result[0]); // 将结果传入callback
                    });
                },
                table_b: function (callback) {
                    conn.query('select count(*) from bm_terms', function (err, result) {
                        callback(err, result[0]);
                    });
                },
                table_c: function (callback) {
                    conn.query('select count(*) from bm_users', function (err, result) {
                        callback(err, result[0]);
                    });
                }
            };
            return querys_Parallelism(sqls_ob).then((post) => {
                if (post.length == 0) {
                    ctx.throw(404, '未找该页面。');
                } else {
                    //释放连接
                    conn.release();
                    console.log("连接已被关闭。");
                    ctx.body = post;
                }
            });
        });
    })

    .get('/test/querys_ASC/:name', (ctx) => {
        return query_once_start().then((conn) => {
            // sqls_ob是一个Object
            var sqls_ob = {
                table_a: function (callback) {
                    conn.query('select count(*) from bm_posts', function (err, result) {
                        callback(err, result[0]); // 将结果传入callback
                    });
                },
                table_b: function (callback) {
                    conn.query('select count(*) from bm_terms', function (err, result) {
                        callback(err, result[0]);
                    });
                },
                table_c: function (callback) {
                    conn.query('select count(*) from bm_users', function (err, result) {
                        callback(err, result[0]);
                    });
                }
            };

            return querys_ASC(sqls_ob).then((post) => {
                if (post.length == 0) {
                    ctx.throw(404, '未找该页面。');
                } else {
                    //释放连接
                    conn.release();
                    ctx.body = post;
                }
            });
        });
    })

    .get('/test/querys_Tx/:name', (ctx) => {
        return query_once_start().then((conn) => {
            var sqls = [
                function (callback) {
                    conn.beginTransaction(function (err) {
                        callback(err);
                    });
                },

                function (callback) {
                    conn.query('select ID from bm_posts WHERE `ID` = 5', function (err, result) {
                        if (err) {
                            conn.rollback(); // 发生错误事务回滚
                            callback(err);
                        } else {
                            callback(err, result); // 生成的ID会传给下一个任务
                        }
                    });
                },

                function (last, callback) {
                    console.log(last);
                    conn.query('select * from bm_posts WHERE `ID` = ' + last[0].ID, function (err, result) {
                        if (err) {
                            conn.rollback(); // 发生错误事务回滚
                            callback(err);
                        } else {
                            callback(err, result[0]); // 生成的ID会传给下一个任务
                        }
                    });
                },

                function (result, callback) {
                    conn.commit(function (err) {
                        callback(err, result);
                    });
                }
            ];

            return querys_Tx(sqls).then((post) => {
                if (post.length == 0) {
                    ctx.throw(404, '未找该页面。');
                } else {
                    //释放连接
                    conn.release();
                    ctx.body = post;
                }
            });
        });
    });

module.exports = router;