# BMblog

BMblog仍处于开发阶段,尚无稳定版本。请关注项目,敬请期待第一个测试版的发布。

BMblog 是一个极速高效,拓展性强的博客系统.
BMblog is a fast blog framework.

BMblog使用MySQL数据库,,后端采用REST API service.前后端可实现完全分离式的开发.

_make.exe是编译BMblog必需的软件，请防止杀毒软件自动删除._

## Install
```bash
npm install
npm start
```



Open [http://localhost:3000/](http://localhost:3000/) in the browser.

## Windows系统下安装和部署BMblog
确保已经安装部署node.js和github.
###复制BMblog到本地
在命令行中输入
```bash
git clone https://github.com/Beethoven-Mozart/BMblog.git
```
###安装BMblog
将本地BMblog仓库设置为当前目录.
```bash
npm install
npm start
```

在浏览器中输入[http://localhost:3000/](http://localhost:3000/)并打开，即可进入BMblog.

## 引入的包和库的说明
"dependencies":   
    "babel-core": babel核心库
    "babel-preset-stage-3": "^6.5.0",
    "babel-runtime": "^6.6.1",
    "bluebird": "^3.4.0",
    "koa": "^2.0.0-alpha.7",
    "koa-bodyparser": "^2.0.1",
    "koa-compose": "^3.1.0",
    "koa-convert": "^1.2.0",
    "koa-favicon": "^2.0.0",
    "koa-json": "^1.1.3",
    "koa-logger": "^1.3.0",
    "koa-nunjucks-2": "^3.0.0-alpha.4",
    "koa-router": "^7.0.1",
    "koa-session": "^3.3.1",
    "koa-static2": "^0.1.8",
    "marked": "^0.3.5",
    "moment-timezone": "^0.5.5",
    "promise-mysql": "^1.3.2",
    "request": "^2.73.0",
    "require-directory": "^2.1.1",
    "underscore": "^1.8.3",
    "ursa": "^0.9.4"
  },
  "devDependencies": {
    "babel-cli": "^6.7.5",
    "babel-plugin-transform-es2015-classes": "^6.8.0",
    "babel-plugin-transform-runtime": "^6.7.5",
    "babel-preset-es2015": "^6.6.0",
    "babel-register": "^6.7.2",
    "browser-sync": "^2.12.3",
    "gulp": "^3.9.1",
    "mocha": "^2.4.5",
    "nodemon": "^1.9.2",
    "should": "^8.3.2",
    "supertest": "^1.2.0",
    "webpack": "^1.13.0",
    "webpack-dev-server": "^1.14.1"
  }

## 版本更新记录
v0.0.2 alpha 2016年10月19日09:56:50  
调整BMblog系统结构,使之更适合大型系统。

v0.0.1 beta 2016年05月14日12:52:12  
使用koa2重写BMblog

v0.0.5 alpha 2016年03月19日12:11:23  
取消了"postinstall": "make".