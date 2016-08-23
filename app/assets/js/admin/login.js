$('document').ready(function () {
    var login = function () {
        $.ajax({
            type: 'POST',
            url: "/admin/login",
            data: {
                username: $("#login-name").val(),
                password: $("#login-pass").val()
            },
            dataType: "json",
            success: function (result) {
                if (result.statue == 200 && result.check == "ok") {

                    window.location.href = "/admin";
                } else if (result.check == "no_acc") {
                    alert("用户名或密码不正确!");
                }else{
                    alert("系统错误。");
                }
            },
            error: function (err) {
                console.log(err);
                alert("通信发送错误,请检查网络连接.");
            }
        });
    };

//当登录按钮被按下
    $("#log_in").click(function () {
        login();
    });

    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            login();
        }
    });

    console.time("check");

    $("#browser").text(detector.browser.name + " " + detector.browser.fullVersion);
    $("#engine").text(detector.engine.name + " " + detector.browser.fullVersion);
    $("#engine_mod").text(detector.engine.mode + " " + detector.engine.fullMode);
    $("#os").text(detector.os.name + " " + detector.os.fullVersion);
    $("#device").text(detector.device.name + " " + detector.device.fullVersion);
    // 判断老旧浏览器
    if(detector.browser.ie && detector.browser.version < 9){
        $("#info").html('<div class="alert alert-danger" role="alert">你的浏览器太老了。管理系统暂不支持IE9以下浏览器。请升级浏览器或使用Chrome浏览器。</div>');
    }

    if (Modernizr.applicationcache) {
        $("#applicationcache").html('<i class="glyphicon glyphicon-ok"></i>');
    } else {
        $("#applicationcache").html('<i class="glyphicon glyphicon-remove"></i>');
    }

    if (Modernizr.localstorage) {
        $("#localstorage").html('<i class="glyphicon glyphicon-ok"></i>');
    } else {
        $("#localstorage").html('<i class="glyphicon glyphicon-remove"></i>');
    }

    if (Modernizr.sessionstorage) {
        $("#sessionstorage").html('<i class="glyphicon glyphicon-ok"></i>');
    } else {
        $("#sessionstorage").html('<i class="glyphicon glyphicon-remove"></i>');
    }

    if (Modernizr.json) {
        $("#json").html('<i class="glyphicon glyphicon-ok"></i>');
    } else {
        $("#json").html('<i class="glyphicon glyphicon-remove"></i>');
    }

    if (Modernizr.canvas) {
        $("#canvas").html('<i class="glyphicon glyphicon-ok"></i>');
    } else {
        $("#canvas").html('<i class="glyphicon glyphicon-remove"></i>');
    }

    if (Modernizr.rgba) {
        $("#rgba").html('<i class="glyphicon glyphicon-ok"></i>');
    } else {
        $("#rgba").html('<i class="glyphicon glyphicon-remove"></i>');
    }

    if (Modernizr.supports) {
        $("#supports").html('<i class="glyphicon glyphicon-ok"></i>');
    } else {
        $("#supports").html('<i class="glyphicon glyphicon-remove"></i>');
    }

    console.timeEnd("check");
});