import {
    default as get_posts,
    module_put_terms as put_terms,
} from '../models/api_put.js';

export var api_put = (ctx) => {
    if (ctx.params.api_type == 'blog') {
        switch (ctx.request.body.api_get) {
            case 'post': {
                return put_post(ctx).then((result) => {
                    if (result.length == 0 || result == '500') {
                        ctx.body = {
                            err: '500'
                        };
                    } else {
                        ctx.body = {};
                    }
                });
            }
                break;
            case 'terms': {
                return put_terms(ctx).then((result) => {
                    if (result.length == 0 || result == '500') {
                        ctx.body = {
                            err: '500'
                        };
                    } else {
                        ctx.body = {
                            a: ctx.request.body.tag_name
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