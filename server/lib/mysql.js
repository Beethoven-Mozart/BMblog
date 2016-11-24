const mysql = require('promise-mysql');
const {system_config} = require('../config.js');
const {sql_format} = require('../tool/common_tool.js');

var pool = mysql.createPool({
    //connectionLimit: 4,     //连接池最多可以创建的连接数
    host: system_config.mysql_host,
    user: system_config.mysql_user,
    password: system_config.mysql_password,
    database: system_config.mysql_database,
    port: system_config.mysql_port,
    insecureAuth: true
});

//执行一行SQL语句并返回结果
export let query = (sql) => {
    return pool.query(sql_format(sql));
};

//执行多行SQL语句并返回结果
export let querys = (sqls) => {
    let keys = Object.keys(sqls);
    let list = Object.values(sqls);
    let promises = list.map(function (sql) {
        return query(sql);
    });

    return Promise.all(promises).then(data => {
        let result = {};
        for(let index in data) {
            result[keys[index]] = data[index];
        }
        return result;
    });
};

//返回连接
export let getSqlConnection = () => {
    return pool.getConnection().disposer(function(connection) {
        pool.releaseConnection(connection);
    });
};

//连接使用方法
//var Promise = require("bluebird");
// Promise.using(getSqlConnection(), function(connection) {
//     return connection.query('select `name` from hobbits').then(function(row) {
//         return process(rows);
//     }).catch(function(error) {
//         console.log(error);
//     });
// })