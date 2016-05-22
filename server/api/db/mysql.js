import mysql from 'promise-mysql';
import async from 'async';
import {system_config} from '../../config.js';
const mysql_prefix = system_config.mysql_prefix;//数据库前缀

export var pool = mysql.createPool({
    //connectionLimit: 4,     //连接池最多可以创建的连接数
    host: system_config.mysql_host,
    user: system_config.mysql_user,
    password: system_config.mysql_password,
    database: system_config.mysql_database,
    port: system_config.mysql_port,
    insecureAuth: true
});

//执行一行SQL语句并返回结果
export function query(sql) {
    return pool.query(sql);
};

//异步执行多行SQL语句并返回结果
export function querys(sqls) {
    return querys_Parallelism(sqls);
};

//建立MySQL连接
export function getConnection() {
    return pool.getConnection();
};

//并发执行多行SQL语句并返回结果
export function querys_Parallelism(sqls) {
    let list = [];

    for(let sql of sqls) {
        list.push(query(sql));
    };

    return Promise.all(list);
};

//顺序执行多行SQL语句并返回结果
// query(sql_1)
//     .then(data1 => {
//         ...
//         return query(sql_2);
//     })
//     .then(data2 => {
//         ...
//         return query(sql_3);
//     })
//     .then(data3 => {
//         ...
//     });
