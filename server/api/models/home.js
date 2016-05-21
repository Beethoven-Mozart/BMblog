import {insert, updata, find, findone} from '../db/curd'
import {pool} from "../db/mysql.js";
import {querys} from "../db/test-mysql.js";
import {system_config} from '../../config.js';
import {setString} from '../../app/tool/common_tool.js';
const mysql_prefix = system_config.mysql_prefix;//数据库前缀

    var find_sql = find(
        'bm_options',
        ['option_name', 'option_value'],
        {
            'and': {
                name: 'option_id',
                value: 7,
                op: "<"
            }
        });
export default function () {



    return Promise.all([
        pool.query(find_sql),
        pool.query("SELECT `bm_posts`.`ID` ,`post_title`,`post_date`, `post_content`,`display_name` FROM `" + mysql_prefix + "posts`,`" + mysql_prefix + "users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` ORDER BY `bm_posts`.`ID` DESC LIMIT 10;"),
        pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID`"),
        pool.query("SELECT `name` AS `tag_name` FROM `bm_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)"),
        pool.query("SELECT `name` AS `category_name` FROM `bm_terms` WHERE `term_id` in (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)"),
        pool.query("SELECT `link_url`,`link_name`,`link_target` FROM `bm_links` WHERE `link_id` in (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `bm_terms` WHERE `name` = '友情链接'))")
    ]).then(data => {
        return {
            options: data[0],
            posts: data[1],
            posts_all: data[2],
            post_tag: data[3],
            post_category: data[4],
            friendly_link: data[5]
        };
    }, console.log);
};

export var list = (ctx)=> {

   var limit = parseInt((parseInt(ctx.params.num) - 1) * 10) + "," + 10;
   return Promise.all([
        pool.query(find_sql),
        pool.query("SELECT `bm_posts`.`ID` ,`post_title`,`post_date`, `post_content`,`display_name` FROM `" + mysql_prefix + "posts`,`" + mysql_prefix + "users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` ORDER BY `bm_posts`.`ID` DESC LIMIT " + limit,),
        pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID`"),
        pool.query("SELECT `name` AS `tag_name` FROM `bm_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)"),
        pool.query("SELECT `name` AS `category_name` FROM `bm_terms` WHERE `term_id` in (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)"),
        pool.query("SELECT `link_url`,`link_name`,`link_target` FROM `bm_links` WHERE `link_id` in (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `bm_terms` WHERE `name` = '友情链接'))")
    ]).then(data => {
        return {
            options: data[0],
            posts: data[1],
            posts_all: data[2],
            post_tag: data[3],
            post_category: data[4],
            friendly_link: data[5]
        };
    }, console.log);
};