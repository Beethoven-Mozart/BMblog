import {querys} from '../db/mysql.js';

export default (ctx) => {
    var sql = {
        options: "SELECT `option_name`,`option_value` FROM `bm_options` WHERE `option_id` < 7",
        post: "SELECT * FROM `bm_posts` WHERE `ID` IN (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `bm_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `bm_terms` WHERE `name` = '" + ctx.params.name + "' OR `slug` = '" + ctx.params.name + "') AND `taxonomy` = 'post_tag')) ORDER BY `bm_posts`.`ID` DESC LIMIT 10",
        post_all: "SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts` WHERE `ID` IN (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `bm_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `bm_terms` WHERE `name` = '" + ctx.params.name + "' OR `slug` = '" + ctx.params.name + "') AND `taxonomy` = 'post_tag'))",
        tag: "SELECT `name` AS `tag_name` FROM `bm_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
        category: "SELECT `name` AS `category_name` FROM `bm_terms` WHERE `term_id` in (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
        friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `bm_links` WHERE `link_id` in (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `bm_terms` WHERE `name` = '友情链接'))"
    };

    return querys(sql).then((result) => {
        return result;
    });
};

export var list = (ctx) => {
    var limit = parseInt((parseInt(ctx.params.num) - 1) * 10) + "," + 10;
    var sql = {
        options: "SELECT `option_name`,`option_value` FROM `bm_options` WHERE `option_id` < 7",
        post: "SELECT * FROM `bm_posts` WHERE `ID` IN (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `bm_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `bm_terms` WHERE `name` = '" + ctx.params.name + "' OR `slug` = '" + ctx.params.name + "') AND `taxonomy` = 'post_tag')) ORDER BY `bm_posts`.`ID` DESC LIMIT " + limit,
        post_all: "SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts` WHERE `ID` IN (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `bm_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `bm_terms` WHERE `name` = '" + ctx.params.name + "' OR `slug` = '" + ctx.params.name + "') AND `taxonomy` = 'post_tag'))",
        tag: "SELECT `name` AS `tag_name` FROM `bm_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
        category: "SELECT `name` AS `category_name` FROM `bm_terms` WHERE `term_id` in (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
        friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `bm_links` WHERE `link_id` in (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `bm_terms` WHERE `name` = '友情链接'))"
    };
    
    return querys(sql).then((result) => {
        return result;
    });
};
