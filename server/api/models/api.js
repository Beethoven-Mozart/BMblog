import {pool, query} from "../db/mysql.js";
import {system_config} from "../../config.js";
import request from 'request';
import zlib from 'zlib';
import ursa from 'ursa';

//获取文章列表详情,该页面请勿使用自动排版
export default function (ctx) {

    let limit = (parseInt(ctx.request.body.post_page) - 1) * 10 + ",10";//文章分页
    var posts_order_by = 'post_date';
    switch (ctx.request.body.order_by) {
        case 'by_date':
            posts_order_by = 'post_date';
            break;
        case 'by_title':
            posts_order_by = 'post_title';
            break;
        case 'by_comment':
            posts_order_by = 'comment_count';
            break;
    }
    var posts_order_type = 'DESC';
    if (ctx.request.body.order_type == 'ASC') {
        posts_order_type = 'ASC';
    }
    let str_posts = "SELECT A1.* ,`post_category` FROM " +
        "(SELECT T1.*,`post_tag` FROM " +
        "(SELECT * FROM `bm_view_post` ORDER BY `" + posts_order_by + "` " + posts_order_type + "  LIMIT " + limit + ") AS T1 " +
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
        "WHERE A1.ID = A2.ID " +
        "ORDER BY `" + posts_order_by + "` " + posts_order_type + " ;";

    var get_posts = function () {
        return Promise.all([
            //查询设置
            pool.query("SELECT `option_name`,`option_value` " +
                "FROM `bm_options` " +
                "WHERE `option_id` < 7"),
            //查询文章列表
            pool.query(str_posts),
            //查询已发布文章总数
            pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_public` FROM `bm_posts`,`bm_users` " +
                "WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID`"),
            //查询草稿文章总数
            pool.query("SELECT count(`bm_posts`.`ID`) AS `posts_draft` FROM `bm_posts`,`bm_users` " +
                "WHERE `post_type` = 'post' AND `post_status` = 'draft' AND `post_author` = `bm_users`.`ID`"),
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
                "WHERE T1.`term_id` = T2.`term_id`; "),
            pool.query("SELECT count(`ID`) AS `all` FROM `bm_view_post`")
        ]).then(data => {
            return {
                options: data[0],
                posts: data[1],
                posts_public: data[2],
                posts_draft: data[3],
                post_category: data[4],
                posts_page_all: data[5]
            };
        }, console.log);
    };

    let create_VIEW = "CREATE OR REPLACE VIEW `bm_view_post` AS " +
        "(SELECT `bm_posts`.`ID`, `post_title`, `post_date`, `display_name`, `comment_count`, `post_status` " +
        "FROM `bm_posts`,`bm_users` " +
        "WHERE `post_type` = 'post' " +
        "AND `post_status` != 'auto_draft' " +
        "AND `post_author` = `bm_users`.`ID`);";
    return query(create_VIEW).then(data => {
        if (data.serverStatus == 2) {
            return get_posts();
        } else {
            return '500';
        }
    });

    // let check_VIEW = "SELECT COUNT(information_schema.VIEWS.TABLE_SCHEMA) AS `result`" +
    //     "FROM information_schema.VIEWS " +
    //     "WHERE information_schema.VIEWS.TABLE_NAME='bm_view_post'";//检查视图是否存在
    // //判断是否存在视图
    // return query(check_VIEW).then(data => {
    //     //如果不存在则创建视图
    //     if (!data[0].result) {
    //
    //     } else {
    //         return get_posts();
    //     }
    // });
};

export var module_get_api = (ctx) => {
    var public_key = '-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHn/hfvTLRXViBXTmBhNYEIJeG\n' +
        'GGDkmrYBxCRelriLEYEcrwWrzp0au9nEISpjMlXeEW4+T82bCM22+JUXZpIga5qd\n' +
        'BrPkjU08Ktf5n7Nsd7n9ZeI0YoAKCub3ulVExcxGeS3RVxFai9ozERlavpoTOdUz\n' +
        'EH6YWHP4reFfpMpLzwIDAQAB\n' +
        '-----END PUBLIC KEY-----';
    var query_body = {
        username: '373226722',
        token: '42977f2a53ede879d5cd90881b5a5fca',
        functionName: 'preLogin',
        request: {
            PreLoginRequest: {
                osVersion: 'Windows',
                deviceType: 'pad',
                clientVersion: '1.0'
            }
        }
    };

    let promise = new Promise(function (resolve, reject) {
        zlib.deflate(JSON.stringify(query_body), (err, buffer) => {
            if (!err) {
                var data = buffer.toString('base64');
                var data_str = [];
                var a = 0;
                for (var n = 0; n < data.length; n = n + 117) {
                    data_str[a] = data.substring(n, n + 117);
                    a++;
                }
                console.log(data_str);
                var crt = ursa.createPublicKey(public_key);
                var enc_str = '';
                for (var z = 0; z < a; z++) {
                    //data_str[z]
                    enc_str += crt.encrypt('aaaaaa', 'utf8', 'base64');
                }
                resolve(enc_str);
            } else {
                reject(err);
            }
        });
    });
    return promise.then(function (gzip_str) {
        return new Promise(function (resolve, reject) {
            console.log(gzip_str);
            request({
                method: 'POST',
                url: 'https://api.baidu.com/sem/common/HolmesLoginService',
                headers: [{
                    name: 'UUID',
                    value: '00-23-5A-15-99-42'
                }, {
                    name: 'account_type',
                    value: '1'
                }, {
                    name: 'Content-Type',
                    value: 'data/gzencode and rsa public encrypt;charset=UTF-8'
                    // 'UUID': 'test_device',
                    // 'account_type': '1',
                    // 'Content-Type': 'data/gzencode and rsa public encrypt;charset=UTF-8'
                }],
                postData: {
                    serviceName: 'report',
                    methodName: 'query',
                    parameterJSON: gzip_str
                }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log('bbb');
                    body = Buffer.from(body, 'ascii').toString('hex');
                    resolve(body);
                } else {
                    reject(response);
                }
            });
        });
    });
};