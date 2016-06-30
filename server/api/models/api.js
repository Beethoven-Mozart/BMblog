import {pool} from "../db/mysql.js";

export default function () {
    return Promise.all([
        pool.query("SELECT `option_name`,`option_value` FROM `bm_options` WHERE `option_id` < 7"),
        pool.query("SELECT `bm_posts`.`ID` ,`post_title`,`post_date`,`display_name` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` ORDER BY `bm_posts`.`ID` DESC LIMIT 10;"),
        pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_public_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID`"),
        pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_author` = `bm_users`.`ID`"),
        pool.query("SELECT `name` AS `tag_name` FROM `bm_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)"),
        pool.query("SELECT `name` AS `category_name` FROM `bm_terms` WHERE `term_id` in (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)"),
    ]).then(data => {
        return {
            options: data[0],
            posts: data[1],
            posts_public_all: data[2],
            posts_all: data[3],
            post_tag: data[4],
            post_category: data[5]
        };
    }, console.log);
};

