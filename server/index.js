import Koa from 'koa';
import Koa_logger from 'koa-logger';
import Koa_favicon from 'koa-favicon';
import Koa_convert from 'koa-convert';
import Koa_json from 'koa-json';
import Koa_body_parser from 'koa-bodyparser';
import Koa_Nunjucks from 'koa-nunjucks-2';
import {system_config} from './config.js';
import path from 'path';
import serve from 'koa-static2';
import session from "koa-session2";
import main_routes from './api/routes/main-routes';
import plugin_loader from './app/tool/plugin_loader.js';

//import assemble from 'assemble';

//初始化
const app = new Koa();
const body_parser = new Koa_body_parser();

const env = system_config.System_type || 'development';//判断开发模式


app //初始化中间件
    .use(Koa_convert(body_parser))  //请求体解析中间件
    .use(Koa_convert(Koa_json()))   //json格式中间件
    .use(Koa_convert(Koa_logger()))
    .use(Koa_convert(Koa_favicon(path.join(__dirname, '../app/assets/img/favicon.ico'))))  //设置favicon.ico路径
    .use(serve("app", path.join(__dirname, '../app'))) //设置静态资源路径
    .use(session())
    .use(Koa_Nunjucks({  //Nunjucks模板引擎配置
        ext: 'html',
        path: path.join(__dirname, 'app/themes/'+system_config.System_theme+'/template'), //引入主题模板
        nunjucksConfig: {
            autoescape: false
        }
    }))
    .use(plugin_loader(system_config.System_plugin_path))
    .use(main_routes.routes())
    .use(main_routes.allowedMethods())
    //404
    .use((ctx) => {
        ctx.status = 404;
        ctx.body = "没找到这个页面 - 404";
    });

// logger
if (env === 'development') {
    app.use((ctx, next) => {   //输出执行时间
        const start = new Date();
        return next().then(() => {
            const ms = new Date() - start;
            console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
        });
    })
}

app.listen(system_config.HTTP_server_port);

console.log("Now start HTTP server on port " + system_config.HTTP_server_port + "...");

export default app;
