const Koa = require('koa');
const Koa_logger = require('koa-logger');
const Koa_favicon = require('koa-favicon');
const Koa_convert = require('koa-convert');
const Koa_json = require('koa-json');
const Koa_body_parser = require('koa-bodyparser');
const Koa_Nunjucks = require('koa-nunjucks-2');
const {system_config} = require('./config.js');
const path = require('path');
const serve = require('koa-static2');
const session = require('koa-session');
const main_routes = require('./api/routes/main-routes');
const error_routes = require('./api/routes/error-routes.js');
const plugin_loader = require('./app/tool/plugin_loader.js');

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
