import {
    default as put_post,
    module_put_terms as put_terms,
} from '../models/api_put.js';
import {getJsonLength} from '../../app/tool/common_tool.js';

export var api_put = (ctx) => {
    if (ctx.params.api_type == 'blog') {
        switch (ctx.request.body.api_get) {
            case 'post': {
                console.time('putterms');
                return put_post(ctx).then((result) => {
                    console.timeEnd('putterms');
                    if (result == '' || result == '500') {
                        ctx.body = {
                            err: '500'
                        };
                    } else {
                        if (result != null && result.indexOf('添加失败') != -1) {
                            ctx.body = {
                                status: 'error',
                                back: result
                            };
                        } else {
                            ctx.body = {
                                status: 'ok',
                                back: result
                            };
                        }
                    }
                });
            }
                break;
            case 'terms': {
                return put_terms(ctx).then((result) => {
                    if (result == '' || result == '500') {
                        ctx.body = {
                            err: '500'
                        };
                    } else {
                        if (result == 'exists') {
                            ctx.body = {
                                status: result
                            };
                        } else if (result != null && result.indexOf('添加失败') != -1) {
                            ctx.body = {
                                status: 'error',
                                back: result
                            };
                        } else {
                            ctx.body = {
                                status: 'ok',
                                back: result
                            };
                        }

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