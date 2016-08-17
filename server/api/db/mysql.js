import mysql from 'promise-mysql';
import {system_config} from '../../config.js';
import {sql_format} from '../../app/tool/common_tool.js';

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
export var query = (sql) => {
    return pool.query(sql_format(sql));
};

//异步执行多行SQL语句并返回结果
export var querys = (sqls) => {
    return querys_Parallelism(sql_format(sqls));
};

//并发执行多行SQL语句并返回结果
export var querys_Parallelism = (sqls) => {
    let keys = Object.keys(sqls);
    let list = Object.values(sqls);
    var promises = list.map(function (sql) {
        return pool.query(sql);
    });

    return Promise.all(promises).then(data => {
        let result = {};
        for(let index in data) {
            result[keys[index]] = data[index];
        }
        return result;
    });
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
