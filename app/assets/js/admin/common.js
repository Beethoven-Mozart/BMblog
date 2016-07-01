'use strict';

//侧边栏
var nav = responsiveNav(".nav-collapse", { // Selector
    animate: true, // Boolean: Use CSS3 transitions, true or false
    transition: 284, // Integer: Speed of the transition, in milliseconds
    customToggle: "#toggle", // Selector: Specify the ID of a custom toggle
    closeOnNavClick: false, // Boolean: Close the navigation when one of the links are clicked
    openPos: "relative", // String: Position of the opened nav, relative or static
    navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
    navActiveClass: "js-nav-active", // String: Class that is added to  element when nav is active
    jsClass: "js", // String: 'JS enabled' class which is added to  element
    init: function () {
    }, // Function: Init callback
    open: function () {
    }, // Function: Open callback
    close: function () {
    } // Function: Close callback
});

//菜单
var menu = function () {
    var tmp = 1;
    var $last = $('.active');
    $('.nav-collapse > ul > li > a').click(function () {
        var $tmp = $(this).parent();
        if ($tmp.attr("class") == "active") {
            if (tmp == 1) {
                $tmp.children("ul").hide(200, function () {
                    $tmp.find('.icon-right i').attr('class', 'fa fa-angle-left');
                });
                tmp = 2;
            } else {
                $tmp.find('.icon-right i').attr('class', 'fa fa-angle-down');
                $tmp.children("ul").show(200);
                tmp = 1;
            }
        } else {
            $last.removeClass('active');
            $tmp.addClass("active");

            $last.children("ul").hide();
            $last.find('.icon-right i').attr('class', 'fa fa-angle-left');
            $tmp.find('.icon-right i').attr('class', 'fa fa-angle-down');
            $tmp.children("ul").show(200);
            $last = $tmp;
            tmp = 1;
        }
    });

    //菜单隐藏
    var tmp2 = 1;
    $(".admin-top-bars").click(function () {
        if (tmp2 == 1) {
            $("#nav").hide();
            $(".main").css('left', '0');
            tmp2 = 0;
        } else {
            $("#nav").show(200);
            $(".main").css("left", "160px");
            tmp2 = 1;
        }
    });

    //页面导航标示
    var tmp3 = '首页';
    var $last2 = $('.active > ul > li > a:first');
    $(".active > ul").show();
    $('.nav-collapse > ul > li > ul > li > a').click(function () {
        if ($(this).text() != tmp3) {
            $last2.text(tmp3);
            $last2 = $(this);
            tmp3 = $last2.text();
            $last2.html(tmp3 + '<i class="admin-active-now"></i>');
        }
        if ($(document).width() <= 780) {
            nav.close();
        }
    });

    var search = function (string) {
        console.log("搜索" + string);
    };

    //顶部搜索框
    $(".search-click").click(function () {
        if ($(".admin-top-search input").css('width') != '180px') {
            $(".admin-top-search input").css('background-color', '#000');
            $(".search-input").animate({width: "180px"}, 100);
            $(".admin-top-search input").css('text-indent', '5px');
            $(".admin-top-search input").focus();
        } else {
            search($(".admin-top-search input").val());
        }
    });

    $(".admin-top-search input").blur(function () {
        setTimeout(function () {
            $(".search-input").animate({width: "30px"}, 1000, 'swing', function () {
                $(".admin-top-search input").css('background-color', 'transparent');
            });
            $(".admin-top-search input").css('text-indent', '-150000px');
        }, 2000);
    });

    $(".admin-top-search input").keypress(function (e) {
        // 回车键事件
        if (e.which == 13) {
            search($(this).val());
        }
    });

    //页面载入处理
    var now_route = window.location.hash.slice(1);
    if (now_route == 'index' || now_route == null || now_route == "") {
        ajax_page('setting', 'index'); //单独处理无路由标示的情况
    } else {
        //处理标签
        $('.active > ul > li > a:first').text("首页");
        $('.nav-collapse > ul > li > ul > li > a').each(function () {
            if ($(this).attr("href").slice(1) == now_route) {
                $last2 = $(this);
                $(this).html($(this).text() + '<i class="admin-active-now"></i>');
                tmp3 = $(this).text();
                //处理菜单
                var $last3 = $('.active');
                var $tmp = $(this).parent().parent().parent();
                if ($last3 != $tmp) {
                    $last3.removeClass('active');
                    $last3.children("ul").hide();
                    $last3.find('.icon-right i').attr('class', 'fa fa-angle-left');
                    $tmp.addClass("active");
                    $tmp.find('.icon-right i').attr('class', 'fa fa-angle-down');
                    $tmp.children("ul").show(200);
                    $last = $tmp;
                }
            }
        })
    }

    //判断提醒数字
    $(".badge-default").each(function () {
        if ($(this).text() == "9+") {
            $(this).css('padding', '3px 2px');
        }
    });

    //页面滚动事件
    $(document).scroll(function () {
        if ($(this).scrollTop() == 0) {
            $('.admin-top-menu').css('background-color', 'rgba(0, 0, 0, 0.4)');
        } else {
            $('.admin-top-menu').css('background-color', '#000');
        }
    });
};

var date1;

//访问服务器
var ajax_page = function (path, route) {
    date1 = new Date();
    $.ajax({
        cache: false,
        type: 'POST',
        url: "/admin/page/" + path,
        async: true,
        data: {
            route: route
        },
        dataType: "json",
        success: function (result) {
            if (result.html == 404) {
                $('#ajax-css').remove();
                $("#main").html('<h1>页面不存在! - 405</h1>');
            } else {
                $("#main").html(result.html);
                $('#ajax-css').remove();
                $("head").append('<style type="text/css" id="ajax-css">' + result.css + '</style>');
                eval(result.js);
            }
        },
        error: function (err) {
            $('#ajax-css').remove();
            $("#content-main").html('<h1>' + err.responseText + '</h1>');
            console.log(err);
        }
    });
};

//路由
var routers = function () {
    var allroutes = function () {

    };

    var not_found = function () {
        $('#ajax-css').remove();
        $("#content-main").html('<h1>禁止访问! - 403</h1>');
    };

    var routes = {
        '/:path/:route': {
            on: function (path, route) {
                ajax_page(path, route);
            }
        }
    };

    var router = Router(routes);

    router.configure({
        on: allroutes,
        notfound: not_found
    });

    router.init();
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "H+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

$('document').ready(function () {
    menu();
    routers();
});