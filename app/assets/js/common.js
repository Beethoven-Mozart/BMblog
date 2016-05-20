//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURIComponent(r[2]);
}

$('document').ready(function () {
    $('pre').each(function (i, block) {
        hljs.highlightBlock(block);
    });

    if ($(".pagination").attr("id")) {
        var get_posts_nums = $(".pagination").attr("id").replace("all_", "").split("_");
        var posts_all = get_posts_nums[0];
        var now_pages = get_posts_nums[1];
        var posts_type = "";
        if (get_posts_nums[2] != null) {
            posts_type = get_posts_nums[2];
        }

        if (now_pages == 1) {
            $(".next .fui-arrow-right").attr("href", posts_type + "/page/2");
            $(".previous .fui-arrow-left").attr("href", "#");
        } else {
            if (now_pages == 2) {
                $(".previous .fui-arrow-left").attr("href", posts_type + "/");
            } else {
                $(".previous .fui-arrow-left").attr("href", posts_type + "/page/" + parseInt(now_pages - 1));
            }

            if (now_pages == posts_all) {
                $(".next .fui-arrow-right").attr("href", "#");
            } else {
                $(".next .fui-arrow-right").attr("href", posts_type + "/page/" + parseInt(parseInt(now_pages) + 1));
            }
        }
    }

    //当登录按钮被按下
    $("#log_in").click(function () {
        $.ajax({
            type: 'POST',
            url: "/admin/login",
            data: {
                username: $("#login-name").val(),
                password: $("#login-pass").val()
            },
            dataType: "json",
            success: function (result) {
                if (result.check == "ok"){
                    alert("验证成功!");
                } else if (result.check == "no_acc") {
                    alert("用户名或密码不正确!");
                }
            },
            error: function (err) {
                console.log(err);
                alert("通信发送错误,请检查网络连接.");
            }
        });
    });


});
