import {system_config} from '../../config.js';
import {setString, option_format} from '../../app/tool/common_tool.js';
import {default as api} from '../models/api.js';
import moment from 'moment';

moment.locale(system_config.System_country);//设置当地时间格式

export default (ctx) => {
    return api().then((result) => {
        if (result.length == 0) {
            ctx.body = {
                err: '500'
            };
        } else {
            for (var a = 0; a < result.posts.length; a++) {
                result.posts[a].post_date = moment(result.posts[a].post_date).format('ll'); //格式化时间
            }

            // var temp = parseInt(parseInt(result.posts_all[0].posts_all) / 10 + 1);
            // var posts_all = [temp];
            // for (var z = 0; z < temp; z++) {
            //     posts_all[z] = z + 1;
            // }

            ctx.body = {
                options: option_format(result.options),
                posts: result.posts,
                posts_public_all: result.posts_public_all[0].posts_public_all,
                posts_all:result.posts_all[0].posts_all,
                posts_now: "1",
                post_tag: result.post_tag,
                post_category: result.post_category
            };
        }
    });
};

