import {system_config} from '../config.js';
import {setString, option_format} from '../tool/common_tool.js';
import {default as home, list as model_list} from '../models/home.js';
import moment from 'moment-timezone';

moment.locale(system_config.System_country);//设置当地时间格式

export default (ctx) => {
    return home().then((result) => {
        if (result.length == 0) {
            ctx.throw(404, '未找该页面或没有任何文章内容!');
        } else {
            for (var a = 0; a < result.posts.length; a++) {
                result.posts[a].post_content = setString(result.posts[a].post_content.replace(/<[^>]+>/g, ""), 200);//去掉所有的html标记
                result.posts[a].post_date = moment(result.posts[a].post_date).format('ll'); //格式化时间
            }

            var temp = Math.ceil(parseInt(result.posts_all[0].posts_all) / 10);
            var posts_all = [temp];
            for (var z = 0; z < temp; z++) {
                posts_all[z] = z + 1;
            }

            var posts = {
                options: option_format(result.options),
                posts: result.posts,
                posts_page_all: posts_all,
                posts_now: "1",
                post_tag: result.post_tag,
                post_category: result.post_category,
                friendly_link: result.friendly_link
            };

            return ctx.render('list', posts);
        }
    });
};

export var list = (ctx) => {
    return model_list(ctx).then((result) => {
        if (result.length == 0) {
            ctx.throw(404, '未找该页面或没有任何文章内容!');
        } else {
            for (var a = 0; a < result.posts.length; a++) {
                result.posts[a].post_content = setString(result.posts[a].post_content.replace(/<[^>]+>/g, ""), 200);//去掉所有的html标记
                result.posts[a].post_date = moment(result.posts[a].post_date).format('ll'); //格式化时间
            }

            var temp = Math.ceil(parseInt(result.posts_all[0].posts_all) / 10);
            var posts_page_all = [temp];
            for (var z = 0; z < temp; z++) {
                posts_page_all[z] = z + 1;
            }

            var posts = {
                options: option_format(result.options),
                posts: result.posts,
                posts_page_all: posts_page_all,
                posts_now: ctx.params.num,
                post_tag: result.tag,
                post_category: result.category,
                friendly_link: result.friendly_link
            };

          return ctx.render('list', posts);
        }
    });
};
