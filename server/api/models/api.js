import {pool} from "../db/mysql.js";

export default function () {
    return Promise.all([
        pool.query("SELECT `option_name`,`option_value` FROM `bm_options` WHERE `option_id` < 7"),
        pool.query("SELECT T1.*,`post_category` FROM " +
            "(SELECT `bm_posts`.`ID` ,`post_title`,`post_date`,`display_name`,Group_concat(`bm_terms`.`name`) AS `post_tag` FROM `bm_term_relationships`,`bm_term_taxonomy`,`bm_terms`,`bm_posts`,`bm_users` WHERE `object_id` = `bm_posts`.`ID` AND `bm_term_taxonomy`.`term_taxonomy_id` = `bm_term_relationships`.`term_taxonomy_id` AND `bm_terms`.`term_id` =  `bm_term_taxonomy`.`term_id`  AND `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` AND `taxonomy` = 'post_tag' GROUP BY `object_id` ORDER BY `bm_posts`.`ID` DESC) AS T1 ," +
            "(SELECT `bm_posts`.`ID`, Group_concat(`bm_terms`.`name`) AS `post_category` FROM `bm_term_relationships`,`bm_term_taxonomy`,`bm_terms`,`bm_posts`,`bm_users` WHERE `object_id` = `bm_posts`.`ID` AND `bm_term_taxonomy`.`term_taxonomy_id` = `bm_term_relationships`.`term_taxonomy_id` AND `bm_terms`.`term_id` =  `bm_term_taxonomy`.`term_id`  AND `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` AND `taxonomy` = 'category' GROUP BY `object_id` ORDER BY `bm_posts`.`ID` DESC) AS T2 " +
            "WHERE T1.ID = T2.ID LIMIT 10"),
        pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_public_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID`"),
        pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_author` = `bm_users`.`ID`")
    ]).then(data => {
        console.log(data[4]);
        return {
            options: data[0],
            posts: data[1],
            posts_public_all: data[2],
            posts_all: data[3]
        };
    }, console.log);
};

