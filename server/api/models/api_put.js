import {query} from "../db/mysql.js";
import underscore from 'underscore';

//新增多条tag——不考虑重复 失败返回false,成功返回添加的term_id对象
var add_terms = function (names) {
    var values = null;
    console.log(names);
    for (var i in names) {
        if (values == null) {
            values = "('" + names[i] + "','" + encodeURI(names[i]) + "',0)";
        } else {
            values += ",('" + names[i] + "','" + encodeURI(names[i]) + "',0)";
        }
    }
    console.log(values);
    let sql_1 = "INSERT INTO `bm_terms` (`name`,`slug`,`term_group`) VALUES " + values + ";";
    var new_tags_id = [];
    return query(sql_1).then(data1 => {
        if (data1.affectedRows > 0) {
            console.log(data1);
            var values2 = null;
            for (var n = 0; n < data1.affectedRows; n++) {
                if (values2 == null) {
                    values2 = "(" + data1.insertId + ",'post_tag','',0)";
                    new_tags_id.push(data1.insertId);
                } else {
                    new_tags_id.push(parseInt(data1.insertId) + n);
                    values2 += ",(" + (parseInt(data1.insertId) + n) + ",'post_tag','',0)";
                }
            }
            console.log(values2);
            let sql_2 = "INSERT INTO `bm_term_taxonomy` (`term_id`,`taxonomy`,`description`,`parent`) VALUES " + values2;
            return query(sql_2);
        } else {
            //return '添加失败,terms受影响行数:' + data2.affectedRows;
            return false
        }
    }).then(data2 => {
        if (data2.affectedRows > 0) {
            return new_tags_id;
        } else {
            //return '添加失败,taxonomy受影响行数:' + data2.affectedRows;
            return false
        }
    });
};

//添加新文章
export default function (ctx) {
    //ES7 检查数组中是否包含某元素
    const contains = (() =>
        Array.prototype.includes
            ? (arr, value) => arr.includes(value)
            : (arr, value) => arr.some(el => el === value))();

    //检查是否存在记录并返回term_id
    var check_post_tag = (data, tag) => {
        return new Promise(function (resolve, reject) {
            // var tag_names = [];
            // for (var s = 0; s < data.length; s++) {
            //     tag_names.push(data[s].name);
            // }
            var tags = tag.split(',');
            var tags_id = [];
            var new_tag_names = [];
            for (var s = 0; s < data.length; s++) {
                for (var n = 0; n < tags.length; n++) {
                    //if (contains(tag_names, tags[n])) {
                    if (data[s].name == tags[n]) {
                        tags_id.push(data[s].term_id);
                        new_tag_names.push(data[s].name);
                    }
                }
            }
            var result = {
                tags_id: tags_id,
                new_tag_names: underscore.difference(tags, new_tag_names)
            };
            resolve(result);
        });
    };

    if (ctx.request.body.post_tag != '') {
        let SELECT_terms = "SELECT `bm_terms`.`term_id`,`bm_terms`.`name` " +
            "FROM `bm_terms`,`bm_term_taxonomy` " +
            "WHERE `bm_terms`.`term_id` = `bm_term_taxonomy`.`term_id` " +
            "AND `bm_term_taxonomy`.`taxonomy` = 'post_tag' ";
        return query(SELECT_terms).then(data => {
            if (data != '') {
                console.time('check_post_tag');
                return check_post_tag(data, ctx.request.body.post_tag).then(tags=> {
                    console.timeEnd('check_post_tag');
                    if (tags.new_tag_names.length > 0) {
                        return add_terms(tags.new_tag_names);
                    }else{
                        return '111';
                    }

                }).then(data => {
                    console.log(data);
                });
            } else {
                return '500';
            }
        });
    }

};

//新增term
export var module_put_terms = (ctx) => {
    let sql_1 = "SELECT `bm_terms`.`term_id` " +
        "FROM `bm_terms`,`bm_term_taxonomy` " +
        "WHERE `bm_terms`.`term_id` = `bm_term_taxonomy`.`term_id`" +
        "AND `bm_term_taxonomy`.`taxonomy` = '" + ctx.request.body.taxonomy + "' " +
        "AND (`bm_terms`.`name` = '" + ctx.request.body.name + "' " +
        "OR `bm_terms`.`slug` = '" + ctx.request.body.slug + "')";
    let sql_2 = "INSERT INTO `bm_terms` (`name`,`slug`,`term_group`) VALUES ('" + ctx.request.body.name + "','" + ctx.request.body.slug + "',0);";
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
            let sql_3 = "INSERT INTO `bm_term_taxonomy` (`term_id`,`taxonomy`,`description`,`parent`) VALUES (" + data2.insertId + ",'" + ctx.request.body.taxonomy + "',''," + ctx.request.body.parent + ")";
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