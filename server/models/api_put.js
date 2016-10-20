const {query} = require("./mysql.js");
const {system_config} = require('../../config.js');
const underscore = require('underscore');
const moment = require('moment-timezone');

moment.locale(system_config.System_country);//设置当地时间格式

//添加新文章
export default (ctx) => {

    var add_terms = (post_id) => {
        //新增多条tag——不考虑重复
        var insert_tags = (names) => {
            return new Promise((resolve, reject) => {
                if (names[0] == '404') {
                    let back = {
                        status: 'ok'
                    };
                    resolve(back);
                } else {
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
                                    values2 = "(" + data1.insertId + ",'post_tag','',0,1)";
                                    new_tags_id.push(data1.insertId.toString());
                                } else {
                                    new_tags_id.push((parseInt(data1.insertId) + n).toString());
                                    values2 += ",(" + (parseInt(data1.insertId) + n) + ",'post_tag','',0,1)";
                                }
                            }
                            let sql_2 = "INSERT INTO `bm_term_taxonomy` (`term_id`,`taxonomy`,`description`,`parent`,`count`) VALUES " + values2;
                            return query(sql_2);
                        } else {
                            reject('添加失败,terms受影响行数:' + data2.affectedRows);
                        }
                    }).then(data2 => {
                        if (data2.affectedRows > 0) {
                            var insert_ids = [];
                            for (var z = 0; z < data2.affectedRows; z++) {
                                insert_ids.push(data2.insertId + z);
                            }

                            let back = {
                                status: 'insert_ok',
                                insert_ids: insert_ids
                            };
                            resolve(back);
                        } else {
                            reject('添加失败,taxonomy受影响行数:' + data2.affectedRows);
                        }
                    });
                }
            });
        };

        //更新term的count
        var update_term_count = (term_taxonomy_id) => {
            return new Promise((resolve, reject) => {
                var old_terms = "`term_taxonomy_id` = " + term_taxonomy_id[0];
                for (var n = 1; n < term_taxonomy_id.length; n++) {
                    old_terms += " OR `term_taxonomy_id` = " + term_taxonomy_id[n];
                }
                let update_term_sql = "UPDATE `bm_term_taxonomy` SET `count` = `count` + 1  WHERE " + old_terms;
                return query(update_term_sql).then(update_term => {
                    if (update_term.affectedRows == term_taxonomy_id.length) {
                        resolve('ok');
                    } else {
                        reject('更新term的count失败!');
                    }
                });
            });
        };

        var category_ids = ctx.request.body.category;
        if (category_ids != '' && category_ids != null) {
            category_ids = category_ids.split(',');
        } else {
            category_ids = ['1'];
        }
        var category_sql = "`bm_terms`.`term_id` = " + category_ids[0];
        for (var n = 1; n < category_ids.length; n++) {
            category_sql += " OR `bm_terms`.`term_id` = " + category_ids[n];
        }

        var tags_name = ctx.request.body.post_tag;
        var tags_sql = '';
        if (tags_name != '' && tags_name != null) {
            tags_name = tags_name.split(',');
            for (var o = 0; o < tags_name.length; o++) {
                tags_sql += " OR `bm_terms`.`name` = '" + tags_name[o] + "'";
            }
        }


        let SELECT_terms = "SELECT `bm_term_taxonomy`.`term_taxonomy_id`,`bm_term_taxonomy`.`taxonomy`,`bm_terms`.`name` " +
            "FROM `bm_terms`,`bm_term_taxonomy` " +
            "WHERE `bm_terms`.`term_id` = `bm_term_taxonomy`.`term_id` " +
            "AND (" +
            category_sql + tags_sql +
            ")";

        return query(SELECT_terms).then(terms => {
            if (terms.length > 0) {
                var exist_name = [];
                var term_taxonomy_id = [];
                for (var n in terms) {
                    if (terms[n].taxonomy == 'post_tag') {
                        exist_name.push(terms[n].name);
                    }
                    term_taxonomy_id.push(terms[n].term_taxonomy_id);
                }

                var new_tags_name = [];
                if (exist_name.length == tags_name.length || exist_name.length <= 0) {
                    new_tags_name = ['404'];
                } else {
                    new_tags_name = underscore.difference(tags_name, exist_name);
                }

                return Promise.all([insert_tags(new_tags_name), update_term_count(term_taxonomy_id)]).then(terms_status => {
                    console.log(terms_status);
                    if ((terms_status[0].status == 'ok' || terms_status[0].status == 'insert_ok') && terms_status[1] == 'ok') {
                        var add_terms = "(" + post_id + "," + term_taxonomy_id[0] + ",0)";
                        for (var n = 1; n < term_taxonomy_id.length; n++) {
                            add_terms += ",(" + post_id + "," + term_taxonomy_id[n] + ",0)";
                        }
                        if (terms_status[0].status == 'insert_ok') {
                            for (var q = 0; q < terms_status[0].insert_ids.length; q++) {
                                add_terms += ",(" + post_id + "," + terms_status[0].insert_ids[q] + ",0)";
                            }
                        }

                        let add_post_term_sql = "INSERT INTO `bm_term_relationships` (`object_id`,`term_taxonomy_id`,`term_order`) VALUES " + add_terms;

                        return query(add_post_term_sql).then(terms_add_status => {
                            if (terms_add_status.affectedRows > 0) {
                                return 'ok';
                            } else {
                                return '添加失败,无法写入post_term数据。';
                            }
                        });
                    } else {
                        return 500;
                    }
                });
            } else {
                return 500;
            }
        });

        // var add_tags = (get_post_tag) => {
        //     ES7 检查数组中是否包含某元素
        //     const contains = (() =>
        //         Array.prototype.includes
        //             ? (arr, value) => arr.includes(value)
        //             : (arr, value) => arr.some(el => el === value))();
        //
        //     检查是否存在标签记录并返回term_id
        //     var check_post_tag = (data, tag) => {
        //         return new Promise(function (resolve, reject) {
        //             var tags = tag.split(',');
        //             var tags_term_taxonomy_id = [];
        //             var new_tag_names = [];
        //             for (var s = 0; s < data.length; s++) {
        //                 for (var n = 0; n < tags.length; n++) {
        //                     if (data[s].name == tags[n]) {
        //                         tags_term_taxonomy_id.push(data[s].term_taxonomy_id.toString());
        //                         new_tag_names.push(data[s].name);
        //                     }
        //                 }
        //             }
        //             var result = {
        //                 old_tags_id: tags_term_taxonomy_id,
        //                 new_tag_names: underscore.difference(tags, new_tag_names)
        //             };
        //             resolve(result);
        //         });
        //     };

        //         var old_tags_id;
        //         if (get_post_tag != '') {
        //             let SELECT_terms = "SELECT `bm_term_taxonomy`.`term_taxonomy_id`,`bm_terms`.`name` " +
        //                 "FROM `bm_terms`,`bm_term_taxonomy` " +
        //                 "WHERE `bm_terms`.`term_id` = `bm_term_taxonomy`.`term_id` " +
        //                 "AND `bm_term_taxonomy`.`taxonomy` = 'post_tag' ";
        //             return query(SELECT_terms).then(data => {
        //                 if (data != '') {
        //                     return check_post_tag(data, get_post_tag);
        //                 } else {
        //                     return '500';
        //                 }
        //             }).then(tags=> {
        //                 old_tags_id = tags.old_tags_id;
        //                 if (tags.new_tag_names.length > 0) {
        //                     return insert_tags(tags.new_tag_names);
        //                 } else {
        //                     return new Promise((resolve, reject) => {
        //                         resolve('new_tag_zero');
        //                     });
        //                 }
        //             }).then(data => {
        //                 var post_tags = [];
        //                 if (data != 'new_tag_zero' && old_tags_id.length > 0) {
        //                     post_tags = underscore.union(data, old_tags_id);
        //                 } else if (old_tags_id.length <= 0) {
        //                     post_tags = data;
        //                 } else if (data == 'new_tag_zero') {
        //                     post_tags = old_tags_id;
        //                 }
        //                 //如果没有标签
        //                 return new Promise((resolve, reject) => {
        //                     resolve(post_tags);
        //                 });
        //             });
        //         } else {
        //             //如果没有标签
        //             return new Promise((resolve, reject) => {
        //                 resolve('tag_zero');
        //             });
        //         }
        //     };
        //
        //     return Promise.all([add_category(ctx.request.body.category), add_tags(ctx.request.body.post_tag)]).then(terms => {
        //         var back_terms = [];
        //         if (terms[1] != 'tag_zero') {
        //             back_terms = underscore.union(terms[0], terms[1]);
        //         } else {
        //             back_terms = terms[0];
        //         }
        //
        //         var add_terms = null;
        //         for (var n = 0; n < back_terms.length; n++) {
        //             if (add_terms == null) {
        //                 add_terms = "(" + post_id + "," + back_terms[n] + ",0)";
        //             } else {
        //                 add_terms += ",(" + post_id + "," + back_terms[n] + ",0)";
        //             }
        //         }
        //
        //         let add_term_sql = "INSERT INTO `bm_term_relationships` (`object_id`,`term_taxonomy_id`,`term_order`) VALUES " + add_terms;
        //         console.log(add_term_sql);
        //         return query(add_term_sql).then(terms_add_status => {
        //             if (terms_add_status.affectedRows > 0) {
        //                 console.log(terms_add_status.insertId);
        //                 return terms_add_status.insertId;
        //             } else {
        //                 return '添加失败,无法写入term数据。';
        //             }
        //         });
        //     });
    };

    //插入文章数据
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
    //var add_post_sql = "INSERT INTO `bm_posts` (`post_author`, `post_date`, `post_date_gmt`, `post_content`, `post_title`, `post_excerpt`, `post_status`, `comment_status`, `ping_status`, `post_password`, `post_name`, `to_ping`, `pinged`, `post_modified`, `post_modified_gmt`, `post_content_filtered`, `post_parent`, `guid`, `menu_order`, `post_type`, `post_mime_type`, `comment_count`) VALUES (" + '0' + ")";

    return query(add_post_sql).then(back_id => {
        if (back_id.affectedRows > 0) {
            //console.log(back_id.insertId);
            return add_terms(back_id.insertId);
        } else {
            return '添加失败,无法写入文章数据。';
        }
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