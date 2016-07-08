import {pool, query} from "../db/mysql.js";
import {system_config} from "../../config.js";

//获取文章列表详情,该页面请勿使用自动排版
export default function (ctx) {
    let check_VIEW = "SELECT COUNT(information_schema.VIEWS.TABLE_SCHEMA) AS `result`" +
                        "FROM information_schema.VIEWS " +
                        "WHERE information_schema.VIEWS.TABLE_NAME='bm_view_post'";//检查视图是否存在
    let limit = parseInt((parseInt(ctx.request.body.post_page) - 1) * 10) + "," + 10;//文章分页
    var posts_order_by = 'post_date';
    switch (ctx.request.body.order_by){
        case 'date':
            posts_order_by = 'post_date';
            break;
        case 'title':
            posts_order_by = 'post_title';
            break;
        case 'comment':
            posts_order_by = 'comment_count';
            break;
    }
    var posts_order_type = 'DESC';
    if(ctx.request.body.order_type == 'ASC'){
        posts_order_type = 'ASC';
    }
    let str_posts = "SELECT A1.* ,`post_category` FROM " +
                        "(SELECT T1.*,`post_tag` FROM " +
                            "(SELECT * FROM `bm_view_post` ORDER BY `" + posts_order_by + "` " + posts_order_type + " LIMIT " + limit + ") AS T1 " +
                            "LEFT OUTER JOIN " +
                            "(SELECT `bm_view_post`.`ID` ,Group_concat(`bm_terms`.`name`) AS `post_tag` " +
                                "FROM `bm_term_relationships`,`bm_term_taxonomy`,`bm_terms`,`bm_view_post` " +
                                "WHERE `object_id` = `bm_view_post`.`ID` " +
                                    "AND `bm_term_taxonomy`.`term_taxonomy_id` = `bm_term_relationships`.`term_taxonomy_id` " +
                                    "AND `bm_terms`.`term_id` =  `bm_term_taxonomy`.`term_id` " +
                                    "AND `taxonomy` = 'post_tag' " +
                                "GROUP BY `object_id`) AS T2 " +
                        "ON T1.ID = T2.ID) AS A1, " +
                        "(SELECT `bm_view_post`.`ID` ,Group_concat(`bm_terms`.`name`) AS `post_category` " +
                            "FROM `bm_term_relationships`,`bm_term_taxonomy`,`bm_terms`,`bm_view_post` " +
                            "WHERE `object_id` = `bm_view_post`.`ID` " +
                                "AND `bm_term_taxonomy`.`term_taxonomy_id` = `bm_term_relationships`.`term_taxonomy_id` " +
                                "AND `bm_terms`.`term_id` =  `bm_term_taxonomy`.`term_id` " +
                                "AND `taxonomy` = 'category' " +
                            "GROUP BY `object_id`) AS A2 " +
                    "WHERE A1.ID = A2.ID;";

    var get_posts = function () {
        return Promise.all([
            //查询设置
            pool.query("SELECT `option_name`,`option_value` " +
                            "FROM `bm_options` " +
                            "WHERE `option_id` < 7"),
            //查询文章列表
            pool.query(str_posts),
            //查询已发布文章总数
            pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_public_all` FROM `bm_posts`,`bm_users` " +
                "WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID`"),
            //查询未发布文章总数
            pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts`,`bm_users` " +
                "WHERE `post_type` = 'post' AND `post_author` = `bm_users`.`ID`"),
            //查询文章分类
            pool.query("SELECT T1.*,`parent` FROM " +
                            "(SELECT `term_id`,`name` AS `category_name` FROM `bm_terms` " +
                                "WHERE `term_id` in  " +
                                    "(SELECT `term_id` FROM `bm_term_taxonomy` " +
                                        "WHERE `taxonomy` = 'category' " +
                                            "AND `count` != 0)" +
                            ") AS T1, " +
                            "(SELECT `term_id`,`parent` FROM `bm_term_taxonomy` " +
                                "WHERE `taxonomy` = 'category' " +
                                "AND `count` != 0" +
                            ") AS T2 " +
                        "WHERE T1.`term_id` = T2.`term_id`; ")
        ]).then(data => {
            return {
                options: data[0],
                posts: data[1],
                posts_public_all: data[2],
                posts_all: data[3],
                post_category: data[4]
            };
        }, console.log);
    };

    //判断是否存在视图
    return query(check_VIEW).then(data => {
        //如果不存在则创建视图
        if (!data[0].result) {
            let create_VIEW = "CREATE OR REPLACE VIEW `bm_view_post` AS " +
                "(SELECT `bm_posts`.`ID`, `post_title`, `post_date`, `display_name`, `comment_count` " +
                "FROM `bm_posts`,`bm_users` " +
                "WHERE `post_type` = 'post' " +
                    "AND `post_status` = 'publish' " +
                    "AND `post_author` = `bm_users`.`ID` " +
                "ORDER BY `bm_posts`.`ID` DESC);";
            return query(create_VIEW).then(data => {
                if (data.serverStatus == 2) {
                    return get_posts();
                } else {
                    return '500';
                }
            });
        } else {
            return get_posts();
        }
    });
};



