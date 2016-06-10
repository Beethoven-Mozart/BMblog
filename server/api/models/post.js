import {querys} from '../db/mysql.js';

export var model_post = (ctx)=> {
    var sql = {
        options: "SELECT `option_name`,`option_value` FROM `bm_options` WHERE `option_id` < 7",
        post: "SELECT * FROM `bm_posts` WHERE `ID` = " + ctx.params.id + " AND `post_type` = 'post' AND `post_status` = 'publish'",
        comment: "SELECT * FROM `bm_comments` WHERE `comment_post_ID` = " + ctx.params.id + " AND `comment_parent` = 0 ORDER BY `comment_ID` DESC",
        comment_back: "SELECT * FROM `bm_comments` WHERE `comment_post_ID` = " + ctx.params.id + " AND `comment_parent` != 0 ORDER BY `comment_ID` ASC",
        tag: "SELECT `name` AS `tag_name` FROM `bm_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
        category: "SELECT `name` AS `category_name` FROM `bm_terms` WHERE `term_id` in (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
        friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `bm_links` WHERE `link_id` in (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `bm_terms` WHERE `name` = '友情链接'))"
    };
    return querys(sql).then((result) => {
        return result;
    });
};