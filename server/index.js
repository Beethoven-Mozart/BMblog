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
import session from "koa-session";
import main_routes from './api/routes/main-routes';
import error_routes from './api/routes/error-routes.js';
import plugin_loader from './app/tool/plugin_loader.js';

const app = new Koa();
const body_parser = new Koa_body_parser();
const env = system_config.System_type || 'development';//Current mode

app.keys = ['BMblog'];
app //Start module
    .use(Koa_convert(body_parser))  //Processing request
    .use(Koa_convert(Koa_json()))   //Json handle module
    .use(Koa_convert(Koa_logger()))
    .use(Koa_convert(Koa_favicon(path.join(__dirname, '../app/assets/img/favicon.ico'))))
    .use(serve("assets", path.resolve(__dirname, '../app/assets'))) //Static resource
    .use(Koa_convert(session(app)))
    .use(Koa_Nunjucks({  //Nunjucks Config
        ext: 'html',
        path: path.join(__dirname, 'app/themes/' + system_config.System_theme + '/template'), //Themes
        nunjucksConfig: {
            autoescape: false
        }
    }))
    .use(plugin_loader(system_config.System_plugin_path))
    .use(main_routes.routes())
    .use(main_routes.allowedMethods())
    .use(error_routes());

if (env === 'development') { // logger
    app.use((ctx, next) => {
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
