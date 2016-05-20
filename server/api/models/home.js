import {insert,updata,find,findone} from '../db/curd'
import {system_config} from '../../config.js';
import mysql from 'mysql';
var pool = mysql.createPool({
    //connectionLimit: 4,     //连接池最多可以创建的连接数
    host: system_config.mysql_host,
    user: system_config.mysql_user,
    password: system_config.mysql_password,
    database: system_config.mysql_database,
    port: system_config.mysql_port,
    insecureAuth: true
});

function index(fn){
	new Promise(function(resolve,reject){
		pool.getConnection(function(err,conn){
			if(err){
				reject(err);
				return false;
			}
			resolve(conn)
		})
	}).then(function(conn){
		Promise.all([
						new Promise(function(resolve,reject){
							// "SELECT `option_name`,`option_value` FROM `bm_options` WHERE `option_id` < 7",
							var sql=find('bm_options',['option_name','option_value'],{'and':{name:'option_id',value:7,op:"<"}})
							conn.query(sql,function(err,data){
									if(err){
										reject(err);
										return ;
									}
									resolve(data);
								})
						}),
						
						new Promise(function(resolve,reject){
							// "SELECT `bm_posts`.`ID` ,`post_title`,`post_date`, `post_content`,`display_name` FROM `" + mysql_prefix + "posts`,`" + mysql_prefix + "users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` ORDER BY `bm_posts`.`ID` DESC LIMIT 10"
							var sql=find('bm_posts,bm_users',['`bm_posts`.`ID`','post_title','post_date','post_content','display_name'],
							{'and':{name:'post_type',value:'post'},
							 'and':{name:'post_status',value:'publish'},
							 'and':{name:'post_author',value:'`bm_users`.`id`'}
							},'10',"`bm_posts`.`ID` DESC ")
							conn.query(sql,function(err,data){
									if(err){
										reject(err);
										return ;
									}
									resolve(data);
								})
						}),
						new Promise(function(resolve,reject){
							// "SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID`",
							var sql=find('bm_posts',['count(`bm_posts`.`ID`) AS `posts_all` '],
							{'and':{name:'post_type',value:'post'},
							 'and':{name:'post_status',value:'publish'},
							 'and':{name:'post_author',value:'`bm_users`.`id`'}
							})
							conn.query(sql,function(err,data){
									if(err){
										reject(err);
										return ;
									}
									resolve(data);
								})
						}),
						new Promise(function(resolve,reject){
							sql="SELECT `name` AS `tag_name` FROM `bm_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)";
							conn.query(sql,function(err,data){
									if(err){
										reject(err);
										return ;
									}
									resolve(data);
								})
						}),
						 
						new Promise(function(resolve,reject){
							sql="SELECT `name` AS `category_name` FROM `bm_terms` WHERE `term_id` in (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)";
							conn.query(sql,function(err,data){
									if(err){
										reject(err);
										return ;
									}
									resolve(data);
								})
						}),
						new Promise(function(resolve,reject){
							sql= "SELECT `link_url`,`link_name`,`link_target` FROM `bm_links` WHERE `link_id` in (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `bm_terms` WHERE `name` = '友情链接'))";
							conn.query(sql,function(err,data){
									if(err){
										reject(err);
										return ;
									}
									resolve(data);
								})
						})
					]).then(function(data){
						conn.release();
						fn(data)
					});		
	})
}
export var home={
	index:index
}
