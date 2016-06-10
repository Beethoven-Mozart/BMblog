import {system_config} from '../../config.js';
import mysql from 'mysql';
import async from 'async';

export var pool = mysql.createPool({
    //connectionLimit: 4,     //连接池最多可以创建的连接数
    host: system_config.mysql_host,
    user: system_config.mysql_user,
    password: system_config.mysql_password,
    database: system_config.mysql_database,
    port: system_config.mysql_port,
    insecureAuth: true
});

//对外接口返回Promise函数形式
//执行一行SQL语句并返回结果
export var query = function (sql) {
    return new Promise(function(resolve,reject){
        pool.getConnection(function (err, conn) {
            if (err) {
                console.log("Error Connected to MySQL! " + err);
                reject(err);
            } else {
                console.log("Connected to MySQL once.");
                conn.query(sql, function (err, vals) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        //释放连接
                        conn.release();
                        //事件驱动回调
                        resolve(vals);
                    }
                });
            }
        });
    });
};

//异步执行多行SQL语句并返回结果
export var querys = function (sqls) {
    return new Promise(function(resolve,reject){
        pool.getConnection(function (err, conn) {
            if (err) {
                console.log("Error Connected to MySQL! " + err);
                reject(err);
            } else {
                console.log("Connected to MySQL once.");
                async.map(sqls, function (item, callback) {
                    conn.query(item, function (err, results) {
                        callback(err, results);
                    });
                }, function (err, results) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        //释放连接
                        conn.release();
                        resolve(results);
                    }
                });
                // Q.all(sqls.map(sql => {
                //     return new Promise((resolve) => {
                //         conn.query(sql, (err, result) => {
                //             if (err) {
                //                 reject(err);
                //             } else {
                //                 resolve(result);
                //             }
                //
                //         });
                //     });
                // })).spread(function(){
                //     resolve(arguments)
                // });
            }
        });
    });
};

//建立MySQL连接
export var query_once_start = function () {
    return new Promise(function(resolve,reject){
        pool.getConnection(function (err, conn) {
            if (err) {
                console.log("Error Connected to MySQL! " + err);
                reject(err);
            } else {
                console.log("建立了一个MySQL连接");
                resolve(conn);
            }
        });
    });
};

//并发执行多行SQL语句并返回结果
export var querys_Parallelism = function (sql) {
    return new Promise(function(resolve,reject){
        async.parallel(sql, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

//顺序执行多行SQL语句并返回结果
export var querys_ASC = function (sql) {
    return new Promise(function(resolve,reject){
        async.series(sql, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

//顺序执行多行SQL语句并返回结果 - 事务
export var querys_Tx = function (sql) {
    return new Promise(function(resolve,reject){
        async.waterfall(sql, function (err, results) {
            if (err) {
                if(err == "no_acc"){
                    err = {check:err};
                    resolve(err);
                }else{
                    reject(err);
                }
            } else {
                resolve(results);
            }
        });
    });
};
