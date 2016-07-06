import {pool, query} from "../db/mysql.js";
import {system_config} from "../../config.js";

export default function () {
    let check_PROCEDURE = "select count(`name`) AS result from mysql.proc where db = '" + system_config.mysql_database + "' and `type` = 'PROCEDURE' AND `name` = 'p1'";

    function get_posts() {
        return Promise.all([
            pool.query("SELECT `option_name`,`option_value` FROM `bm_options` WHERE `option_id` < 7"),
            pool.query("CALL p1(0,10)"),
            pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_public_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID`"),
            pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_author` = `bm_users`.`ID`")
        ]).then(data => {
            return {
                options: data[0],
                posts: data[1][0],
                posts_public_all: data[2],
                posts_all: data[3]
            };
        }, console.log);
    }

    return query(check_PROCEDURE).then(data => {
        if(!data[0].result){
            let creact_PROCEDURE = "CREATE PROCEDURE p1(m int,n int) BEGIN  IF (SELECT COUNT(information_schema.VIEWS.TABLE_SCHEMA)  FROM information_schema.VIEWS   WHERE information_schema.VIEWS.TABLE_NAME='view_post') THEN 	SELECT T1.* ,`post_category` FROM  		(SELECT T1.*,`post_tag` FROM  			(SELECT * FROM `view_post` ORDER BY `ID` DESC LIMIT m,n) AS T1  			LEFT OUTER JOIN 			(SELECT `view_post`.`ID` ,Group_concat(`bm_terms`.`name`) AS `post_tag`  			FROM `bm_term_relationships`,`bm_term_taxonomy`,`bm_terms`,`view_post` 			WHERE `object_id` = `view_post`.`ID` AND `bm_term_taxonomy`.`term_taxonomy_id` = `bm_term_relationships`.`term_taxonomy_id` AND `bm_terms`.`term_id` =  `bm_term_taxonomy`.`term_id` AND `taxonomy` = 'post_tag' GROUP BY `object_id` 			) AS T2  			ON T1.ID = T2.ID) AS T1 		LEFT OUTER JOIN 			(SELECT `view_post`.`ID` ,Group_concat(`bm_terms`.`name`) AS `post_category`  			FROM `bm_term_relationships`,`bm_term_taxonomy`,`bm_terms`,`view_post` 			WHERE `object_id` = `view_post`.`ID` AND `bm_term_taxonomy`.`term_taxonomy_id` = `bm_term_relationships`.`term_taxonomy_id` AND `bm_terms`.`term_id` =  `bm_term_taxonomy`.`term_id` AND `taxonomy` = 'category' GROUP BY `object_id` 			) AS T3  		ON T1.ID = T3.ID 	ORDER BY T1.ID DESC; ELSE 	CREATE VIEW `view_post` AS 	(SELECT `bm_posts`.`ID` ,`post_title`,`post_date`, `post_content`,`display_name`  			FROM `bm_posts`,`bm_users`  			WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` ORDER BY `bm_posts`.`ID` DESC); 	SELECT T1.* ,`post_category` FROM  		(SELECT T1.*,`post_tag` FROM  			(SELECT * FROM `view_post` ORDER BY `ID` DESC LIMIT m,n) AS T1  			LEFT OUTER JOIN 			(SELECT `view_post`.`ID` ,Group_concat(`bm_terms`.`name`) AS `post_tag`  			FROM `bm_term_relationships`,`bm_term_taxonomy`,`bm_terms`,`view_post` 			WHERE `object_id` = `view_post`.`ID` AND `bm_term_taxonomy`.`term_taxonomy_id` = `bm_term_relationships`.`term_taxonomy_id` AND `bm_terms`.`term_id` =  `bm_term_taxonomy`.`term_id` AND `taxonomy` = 'post_tag' GROUP BY `object_id` 			) AS T2  			ON T1.ID = T2.ID) AS T1 		LEFT OUTER JOIN 			(SELECT `view_post`.`ID` ,Group_concat(`bm_terms`.`name`) AS `post_category`  			FROM `bm_term_relationships`,`bm_term_taxonomy`,`bm_terms`,`view_post` 			WHERE `object_id` = `view_post`.`ID` AND `bm_term_taxonomy`.`term_taxonomy_id` = `bm_term_relationships`.`term_taxonomy_id` AND `bm_terms`.`term_id` =  `bm_term_taxonomy`.`term_id` AND `taxonomy` = 'category' GROUP BY `object_id` 			) AS T3  		ON T1.ID = T3.ID 	ORDER BY T1.ID DESC; END IF; END";
            return query(creact_PROCEDURE).then(data => {
                if(data.serverStatus == 2){
                    return get_posts();
                }else{
                    return '500';
                }
            });
        }else{
            return get_posts();
            // return query('DROP PROCEDURE p1').then(data => {
            //     console.log(data);
            //     console.log(data.serverStatus);
            // });
        }
    });
};



