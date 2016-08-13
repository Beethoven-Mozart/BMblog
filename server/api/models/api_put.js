import {querys, query} from "../db/mysql.js";

//获取文章列表详情,该页面请勿使用自动排版
export default function (ctx) {
    return query().then(data => {
        if (data.serverStatus == 2) {
            return get_posts();
        } else {
            return '500';
        }
    });
};

//新增term
export var module_put_terms = (ctx) => {
    let sql_1 = "SELECT `bm_terms`.`term_id` " +
        "FROM `bm_terms`,`bm_term_taxonomy` " +
        "WHERE `bm_terms`.`term_id` = `bm_term_taxonomy`.`term_id`" +
        "AND `bm_term_taxonomy`.`taxonomy` = '" + ctx.request.body.category + "' " +
        "AND (`bm_terms`.`name` = '" + ctx.request.body.tag_name + "' " +
        "OR `bm_terms`.`slug` = '" + ctx.request.body.tag_slug + "')";
    let sql_2 = "INSERT INTO `bm_terms` (`name`,`slug`,`term_group`) VALUES ('" + ctx.request.body.tag_name + "','" + ctx.request.body.tag_slug + "',0);";
    return query(sql_1).then(data1 => {
        if (data1 != '') {
            return 'exists';
        } else {
            // return query('INSERT INTO `bm_terms` SET ?', {
            //     name: ctx.request.body.tag_name,
            //     slug: ctx.request.body.tag_slug,
            //     term_group: 0
            // });
            return query(sql_2);
        }
    }).then(data2 => {
        if (data2.affectedRows > 0) {
            let sql_3 = "INSERT INTO `bm_term_taxonomy` (`term_id`,`taxonomy`,`description`,`parent`) VALUES (" + data2.insertId + ",'" + ctx.request.body.category + "',''," + ctx.request.body.tag_parent + ")";
            // return query('INSERT INTO `bm_term_taxonomy` SET ?', {
            //     term_id: data2.insertId,
            //     taxonomy: ctx.request.body.category,
            //     description: '',
            //     parent: ctx.request.body.tag_parent,
            // });
            return query(sql_3);
        } else if (data2 == 'exists') {
            return data2;
        } else {
            return '添加失败,terms受影响行数:' + data2.affectedRows;
        }
    }).then(data3 => {
        if (data3.affectedRows > 0) {
            return 'ok:' + data3.insertId;
        } else if (data3 == 'exists') {
            return data3;
        } else {
            return '添加失败,taxonomy受影响行数:' + data3.affectedRows;
        }
    });
};