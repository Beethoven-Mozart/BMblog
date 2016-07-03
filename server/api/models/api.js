import {pool} from "../db/mysql.js";

export default function () {
    var post_str = "SELECT T1.*,`post_category` FROM " +
        "(SELECT T1.*,`post_tag` FROM" +
        "(SELECT `bm_posts`.`ID` ,`post_title`,`post_date`, `post_content`,`display_name` " +
        "FROM `bm_posts`,`bm_users` " +
        "WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` ORDER BY `bm_posts`.`ID`" +
        ") AS T1 " +
        "LEFT OUTER JOIN " +
        "(SELECT `bm_posts`.`ID` ,Group_concat(`bm_terms`.`name`) AS `post_tag` " +
        "FROM `bm_term_relationships`,`bm_term_taxonomy`,`bm_terms`,`bm_posts`,`bm_users` " +
        "WHERE `object_id` = `bm_posts`.`ID` AND `bm_term_taxonomy`.`term_taxonomy_id` = `bm_term_relationships`.`term_taxonomy_id` AND `bm_terms`.`term_id` =  `bm_term_taxonomy`.`term_id`  AND `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` AND `taxonomy` = 'post_tag' GROUP BY `object_id` ORDER BY `bm_posts`.`ID` DESC" +
        ") AS T2 " +
        "ON T1.ID = T2.ID) AS T1 " +
        "LEFT OUTER JOIN " +
        "(SELECT `bm_posts`.`ID`, Group_concat(`bm_terms`.`name`) AS `post_category` " +
        "FROM `bm_term_relationships`,`bm_term_taxonomy`,`bm_terms`,`bm_posts`,`bm_users` " +
        "WHERE `object_id` = `bm_posts`.`ID` AND `bm_term_taxonomy`.`term_taxonomy_id` = `bm_term_relationships`.`term_taxonomy_id` AND `bm_terms`.`term_id` =  `bm_term_taxonomy`.`term_id`  AND `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` AND `taxonomy` = 'category' GROUP BY `object_id` ORDER BY `bm_posts`.`ID` DESC" +
        ") AS T3 " +
        "ON T1.ID = T3.ID " +
        "ORDER BY T1.ID DESC";
    return Promise.all([
        pool.query("SELECT `option_name`,`option_value` FROM `bm_options` WHERE `option_id` < 7"),
        pool.query(post_str),
        pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_public_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID`"),
        pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_author` = `bm_users`.`ID`")
    ]).then(data => {
        return {
            options: data[0],
            posts: data[1],
            posts_public_all: data[2],
            posts_all: data[3]
        };
    }, console.log);
};

