var DATE1;//开始时间

//页面载入完成计算
var finish_load = () => {
    var date2 = new Date();
    $('#e_time').text(date2.getTime() - DATE1.getTime());
    $('#r_time').text(new Date().Format("yyyy-MM-dd hh:mm:ss"));
};

//页面警告
var page_waiting = (str) => {
    var $page_waiting = $('.page-waiting');
    var width = '-' + parseInt($page_waiting.css('width')) / 2 + 'px';
    $page_waiting.text(str).css('margin-left', width).show();
    setTimeout(function () {
        $('.page-waiting').fadeOut(500);
    }, 1000);
};

//注册事件
var register_event = () => {

};

//查询用户信息


//初始化变量、函数
DATE1 = new Date();
register_event();