"use strict"

module.exports = function() {
    
    return function(ctx, next) {
        switch (ctx.status) {
            case 404:
            ctx.body = "没找到这个页面 - 404";
            break;
        }

        return next();
    }
}
