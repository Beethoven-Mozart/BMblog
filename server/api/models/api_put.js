import {query} from "../db/mysql.js";
import {system_config} from '../../config.js';
import underscore from 'underscore';
import moment from 'moment';

moment.locale(system_config.System_country);//设置当地时间格式

//新增多条tag——不考虑重复 失败返回false,成功返回添加的term_id对象
var add_terms = function (names) {
    var values = null;
    for (var i in names) {
        if (values == null) {
            values = "('" + names[i] + "','" + encodeURI(names[i]) + "',0)";
        } else {
            values += ",('" + names[i] + "','" + encodeURI(names[i]) + "',0)";
        }
    }
    let sql_1 = "INSERT INTO `bm_terms` (`name`,`slug`,`term_group`) VALUES " + values + ";";
    var new_tags_id = [];
    return query(sql_1).then(data1 => {
        if (data1.affectedRows > 0) {
            var values2 = null;
            for (var n = 0; n < data1.affectedRows; n++) {
                if (values2 == null) {
                    values2 = "(" + data1.insertId + ",'post_tag','',0)";
                    new_tags_id.push(data1.insertId.toString());
                } else {
                    new_tags_id.push((parseInt(data1.insertId) + n).toString());
                    values2 += ",(" + (parseInt(data1.insertId) + n) + ",'post_tag','',0)";
                }
            }
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

    let now_time = moment().format("YYYY-MM-DD HH:mm:ss");
    let now_time_gmt = moment(now_time).tz("Europe/London").format("YYYY-MM-DD HH:mm:ss");
    var add_post_objects = {
        post_author: 1,
        post_date: now_time,
        post_date_gmt: now_time_gmt,
        post_content: ctx.request.body.post_content,
        post_title: ctx.request.body.post_title,
        post_excerpt: '',
        post_status: 'publish',
        comment_status: 'open',
        ping_status: 'open',
        post_password: '',
        post_name: decodeURI(ctx.request.body.post_title),
        to_ping: '',
        pinged: '',
        post_modified: now_time,
        post_modified_gmt: now_time_gmt,
        post_content_filtered: '',
        post_parent: 0,
        guid: 'id',
        menu_order: 0,
        post_type: 'post',
        post_mime_type: '',
        comment_count: 0
    };
    var array_sql = underscore.pairs(add_post_objects);
    var string_sql = '';
    for (var n = 0; n < array_sql.length; n++) {
        if (typeof array_sql[n][1] == 'string') {
            string_sql += "`" + array_sql[n][0] + "`='" + array_sql[n][1] + "', ";
        } else {
            string_sql += "`" + array_sql[n][0] + "`=" + array_sql[n][1] + ', ';
        }
    }
    var add_post_sql = "INSERT INTO `bm_posts` SET " + string_sql.substring(0, string_sql.length - 2);
    console.log(add_post_sql);
    // var add_post_sql = "INSERT INTO `bm_posts` (`post_author`, `post_date`, `post_date_gmt`, `post_content`, `post_title`, `post_excerpt`, `post_status`, `comment_status`, `ping_status`, `post_password`, `post_name`, `to_ping`, `pinged`, `post_modified`, `post_modified_gmt`, `post_content_filtered`, `post_parent`, `guid`, `menu_order`, `post_type`, `post_mime_type`, `comment_count`) VALUES (" + '0' + ")";

    var add_post = () => {
        return query(add_post_sql).then(back_id => {

        });
    };

    var add_terms = (post_id) => {
        var add_category = (get_category) => {
            if (get_category != '') {
                return new Promise(function (resolve, reject) {
                    resolve(get_category.split(','));
                });
            } else {
                return new Promise(function (resolve, reject) {
                    resolve('category_zero');
                });
            }
        };

        var add_tags = (get_post_tag) => {
            //ES7 检查数组中是否包含某元素
            const contains = (() =>
                Array.prototype.includes
                    ? (arr, value) => arr.includes(value)
                    : (arr, value) => arr.some(el => el === value))();

            //检查是否存在标签记录并返回term_id
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
                                tags_id.push(data[s].term_id.toString());
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

            var old_tags_id;
            if (get_post_tag != '') {
                let SELECT_terms = "SELECT `bm_terms`.`term_id`,`bm_terms`.`name` " +
                    "FROM `bm_terms`,`bm_term_taxonomy` " +
                    "WHERE `bm_terms`.`term_id` = `bm_term_taxonomy`.`term_id` " +
                    "AND `bm_term_taxonomy`.`taxonomy` = 'post_tag' ";
                return query(SELECT_terms).then(data => {
                    if (data != '') {
                        return check_post_tag(data, get_post_tag);
                    } else {
                        return '500';
                    }
                }).then(tags=> {
                    old_tags_id = tags.tags_id;
                    if (tags.new_tag_names.length > 0) {
                        return add_terms(tags.new_tag_names);
                    } else {
                        return new Promise((resolve, reject) => {
                            resolve('new_tag_zero');
                        });
                    }
                }).then(data => {
                    var post_tags = [];
                    if (data != 'new_tag_zero' && old_tags_id.length > 0) {
                        post_tags = underscore.union(data, old_tags_id);
                    } else if (data != 'new_tag_zero') {
                        post_tags = data;
                    } else {
                        post_tags = old_tags_id;
                    }
                    //如果没有标签
                    return new Promise((resolve, reject) => {
                        resolve(post_tags);
                    });
                });
            } else {
                //如果没有标签
                return new Promise((resolve, reject) => {
                    resolve('tag_zero');
                });
            }
        };
        return Promise.all([add_category(ctx.request.body.category), add_tags(ctx.request.body.post_tag)]).then(terms => {
            var back_terms = [];
            return new Promise((resolve, reject) => {
                if (terms[0] != 'category_zero' && terms[1] != 'tag_zero') {
                    back_terms = underscore.union(terms[0], terms[1]);
                } else if (data != 'category_zero') {
                    back_terms = terms[0];
                } else {
                    back_terms = terms[1];
                }
                resolve(back_terms);
            });
        });
    };

    return add_terms().then(terms => {
        console.log(terms);
        return terms;
        // return new Promise(function (resolve, reject) {
        //     resolve(terms);
        // });
    });
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