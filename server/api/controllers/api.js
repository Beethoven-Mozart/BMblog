import {system_config} from '../../config.js';
import {setString, option_format} from '../../app/tool/common_tool.js';
import {
    default as get_posts,
    module_get_api as get_type,
    module_get_terms as get_terms,
    module_get_post as get_post
} from '../models/api.js';
import moment from 'moment';

moment.locale(system_config.System_country);//设置当地时间格式

export default (ctx) => {
    if (ctx.params.api_type == 'blog') {
        switch (ctx.request.body.api_get) {
            case 'posts': {
                return get_posts(ctx).then((result) => {
                    if (result.length == 0 || result == '500') {
                        ctx.body = {
                            err: '500'
                        };
                    } else {
                        for (var a = 0; a < result.posts.length; a++) {
                            result.posts[a].post_date = moment(result.posts[a].post_date).format('ll'); //格式化时间
                        }
                        var posts_page_all = Math.ceil(result.posts_all[0].all / 10);
                        ctx.body = {
                            options: option_format(result.options),
                            posts: result.posts,
                            posts_publish: result.posts_publish[0].posts_publish,
                            posts_draft: result.posts_draft[0].posts_draft,
                            posts_page_all: posts_page_all,
                            posts_now_all: result.posts_all[0].all,
                            posts_terms: result.posts_terms,
                            posts_date_group: result.posts_date_group,
                            posts_all_terms: result.posts_all_terms,
                            posts_now: ctx.request.body.post_page
                        };
                    }
                });
            }
                break;
            case 'post': {
                return get_post(ctx).then((result) => {
                    if (result.length == 0 || result == '500') {
                        ctx.body = {
                            err: '500'
                        };
                    } else {
                        result.post.post_date = moment(result.post.post_date).format('ll'); //格式化时间
                        ctx.body = {
                            post: result.post[0],
                            all_terms: result.all_terms
                        };
                    }
                });
            }
                break;
            case 'terms': {
                return get_terms(ctx).then((result) => {
                    if (result.length == 0 || result == '500') {
                        ctx.body = {
                            err: '500'
                        };
                    } else {
                        ctx.body = {
                            terms: result.terms,
                            all_terms: result.all_terms,
                            page_now: ctx.request.body.page,
                            page_all: Math.ceil(result.all_terms.length / 10)
                        };
                    }
                });
            }
                break;
            default : {
                ctx.body = {
                    err: '500'
                };
                console.log('未知API。');
            }
        }
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
