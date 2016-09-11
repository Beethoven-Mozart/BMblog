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

## 版本更新记录
v0.0.1 beta 2016年05月14日12:52:12
使用koa2重写BMblog

v0.0.5 alpha 2016年03月19日12:11:23
取消了"postinstall": "make".