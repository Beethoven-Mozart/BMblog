var nav = responsiveNav(".nav-collapse", { // Selector
    animate: true, // Boolean: Use CSS3 transitions, true or false
    transition: 284, // Integer: Speed of the transition, in milliseconds
    label: "Menu", // String: Label for the navigation toggle
    insert: "before", // String: Insert the toggle before or after the navigation
    customToggle: "", // Selector: Specify the ID of a custom toggle
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
    $(".active > ul").show();
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
            $(".main").css("width", "100%");
            tmp2 = 0;
        } else {
            $("#nav").show(200);
            $(".main").css("width", "76%");
            tmp2 = 1;
        }
    });
};

//路由
var routers = function () {
    var active = function (route) {
        $.ajax({
            cache: false,
            type: 'POST',
            url: "/admin/page/" + route,
            async: true,
            data: {
                img: "1"
            },
            dataType: "json",
            success: function (result) {
                if (result.html == 404) {
                    $('#ajax-css').remove();
                    $("#content-main").html('<h1>页面不存在!</h1>');
                } else {
                    $("#content-main").html(result.html);
                    $('#ajax-css').remove();
                    $("head").append('<style type="text/css" id="ajax-css">' + result.css + '</style>');
                    eval(result.js);
                }
            },
            error: function (err) {
                console.log(err);
                alert("通信发送错误,请检查网络连接.");
            }
        });
    };

    var route = window.location.hash.slice(1);
    if (route == null || route == "") {
        route = 'index';
        active(route);
    }

    var allroutes = function () {

    };

    var routes = {
        '/:route': {
            before: function (route) {

            },
            on: function (route) {
                active(route);
            }
        }
    };
    //
    //routes[route] = eval(active(route));
    //
    var router = Router(routes);

    //
    // a global configuration setting.
    //
    router.configure({
        on: allroutes
    });

    router.init();
};

//异步加载js
var JSLoader = function () {
    //    JSLoader.load('js/test.js' , function () {a();})
    var scripts = {}; // scripts['a.js'] = {loaded:false,funs:[]}

    function getScript(url) {
        var script = scripts[url];
        if (!script) {
            script = {loaded: false, funs: []};
            scripts[url] = script;
            add(script, url);
        }
        return script;
    }


    function run(script) {
        var funs = script.funs,
            len = funs.length,
            i = 0;

        for (; i < len; i++) {
            var fun = funs.pop();
            fun();
        }
    }

    function add(script, url) {
        var scriptdom = document.createElement('script');
        scriptdom.type = 'text/javascript';
        scriptdom.loaded = false;
        scriptdom.src = url;

        scriptdom.onload = function () {
            scriptdom.loaded = true;
            run(script);
            scriptdom.onload = scriptdom.onreadystatechange = null;
        };

        //for ie
        scriptdom.onreadystatechange = function () {
            if ((scriptdom.readyState === 'loaded' ||
                scriptdom.readyState === 'complete') && !scriptdom.loaded) {

                run(script);
                scriptdom.onload = scriptdom.onreadystatechange = null;
            }
        };

        document.getElementsByTagName('head')[0].appendChild(scriptdom);
    }

    return {
        load: function (url) {
            var arg = arguments,
                len = arg.length,
                i = 1,
                script = getScript(url),
                loaded = script.loaded;

            for (; i < len; i++) {
                var fun = arg[i];
                if (typeof fun === 'function') {
                    if (loaded) {
                        fun();
                    } else {
                        script.funs.push(fun);
                    }
                }
            }
        }
    };
};


$('document').ready(function () {
    menu();
    routers();

});