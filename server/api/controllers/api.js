import {system_config} from '../../config.js';
import {setString, option_format} from '../../app/tool/common_tool.js';
import {default as api,module_get_api as get_type} from '../models/api.js';
import moment from 'moment';

moment.locale(system_config.System_country);//设置当地时间格式

export default (ctx) => {
    if (ctx.params.api_type == 'blog') {
        if (ctx.request.body.api_get == 'post') {
            return api(ctx).then((result) => {
                if (result.length == 0 || result == '500') {
                    ctx.body = {
                        err: '500'
                    };
                } else {
                    for (var a = 0; a < result.posts.length; a++) {
                        result.posts[a].post_date = moment(result.posts[a].post_date).format('ll'); //格式化时间
                    }
                    var posts_page_all = Math.ceil(result.posts_other_info[0].all / 10);
                    ctx.body = {
                        options: option_format(result.options),
                        posts: result.posts,
                        posts_public: result.posts_public[0].posts_public,
                        posts_draft: result.posts_draft[0].posts_draft,
                        posts_page_all: posts_page_all,
                        posts_tag: result.posts_tag,
                        posts_category: result.posts_category,
                        posts_now: ctx.request.body.post_page
                    };
                }
            });
        }
    } else {
        console.log('位置API。');
    }
};

export var get_api = (ctx) => {
    return get_type(ctx).then(function (value) {
        console.log('ccc');
        ctx.body = value;
        console.log(value);
    }, function (error) {
        console.log(error);
    });
};