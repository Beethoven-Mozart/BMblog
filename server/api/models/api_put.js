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

//新增分类
export var module_put_terms = (ctx) => {
    var sql_1 = "SELECT `bm_terms`.`term_id` " +
        "FROM `bm_terms`,`bm_term_taxonomy` " +
        "WHERE `bm_terms`.`term_id` = `bm_term_taxonomy`.`term_id`" +
        "AND `bm_term_taxonomy`.`taxonomy` = '" + ctx.request.body.category + "' " +
        "AND `bm_terms`.`name` = '" + ctx.request.body.tag_name + "' " +
        "OR `bm_terms`.`name` = '" + ctx.request.body.tag_name + "'";
    var sql_2 = '';
    return query(sql_1).then(data1 => {
        console.log(data1);
        if (data1 != '') {
            result = {
                a: data1,
                b:'aa'
            };
            return data1;
        } else {
            //return query(sql_2);
        }
    }).then(data2 => {

        return data2;
    });
};