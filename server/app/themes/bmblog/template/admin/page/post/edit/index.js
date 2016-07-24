var simplemde_CSS = "/assets/css/admin/simplemde.min.css";//CSS文件路径
if ($('#other_css').attr("src") != simplemde_CSS) {
    $('head').append('<link rel="stylesheet" href="' + simplemde_CSS + '" id="other_css">');
}
$.getScript("/assets/js/admin/simplemde.min.js", function () {
    var DATE1, ORDER_BY, ORDER_TYPE, POST_STATUS, TERM, FREQUENCY;//相对的全局变量,当前页面/总页面/开始时间/排序依据/排序类型/文章总状态/筛选分类或标签/请求次数

//页面载入完成计算
    var finish_load = function () {
        var date2 = new Date();
        $('#e_time').text(date2.getTime() - DATE1.getTime());
        $('#r_time').text(new Date().Format("yyyy-MM-dd hh:mm:ss"));
    };

//页面警告
    var page_waiting = function (str) {
        var $page_waiting = $('.page-waiting');
        var width = '-' + parseInt($page_waiting.css('width')) / 2 + 'px';
        $page_waiting.text(str).css('margin-left', width).show();
        setTimeout(function () {
            $('.page-waiting').fadeOut(500);
        }, 1000);
    };

//注册事件
    var register_event = function () {
        //tag隐藏
        var tmp4 = 1;
        $('.tag-caret').click(function () {
            var $tag = $(this).parent().parent();
            if (tmp4 == 1) {

                $tag.find('.tag-content').slideUp(200, function () {
                    $tag.find('.tag-title').css('border-bottom', '0px');
                });
                $(this).find('i').attr('class', 'fa fa-caret-up');
                tmp4 = 0;
            } else {
                $tag.find('.tag-content').slideDown(200, function () {
                    $tag.find('.tag-title').css('border-bottom', '1px solid #eef1f5');
                });
                $(this).find('i').attr('class', 'fa fa-caret-down');
                tmp4 = 1;
            }
        });

        //发布文章按钮
        $(".save-post").click(function () {
            $.ajax({
                cache: false,
                type: 'POST',
                url: "/api/blog/posts",
                async: true,
                data: {
                    api_get: 'post',
                    post_page: post_page,
                    post_status: POST_STATUS,
                    term: TERM,
                    order_by: ORDER_BY,
                    order_type: ORDER_TYPE,
                    post_content: simplemde.value()
                },
                dataType: "json",
                success: function (result) {
                    if (result.err == 500) {
                    }
                }
            });
        })
    };

//载入编辑器
    var simplemde = new SimpleMDE({element: document.getElementById("edit")});

//获取文章列表详情AJAX
    var get_posts = function (post_page) {
        DATE1 = new Date();
        $.ajax({
            cache: false,
            type: 'POST',
            url: "/api/blog/posts",
            async: true,
            data: {
                api_get: 'post',
                post_page: post_page,
                post_status: POST_STATUS,
                term: TERM,
                order_by: ORDER_BY,
                order_type: ORDER_TYPE
            },
            dataType: "json",
            success: function (result) {
                if (result.err == 500) {
                    $("#main").html('<h1>数据错误</h1>');
                } else {

                    $("tbody").html(body);
                    FREQUENCY++;
                    finish_load();
                }
            },
            error: function (err) {
                $("#main").html('<h1>' + err.responseText + '(' + err.status + ')' + '</h1>');
                console.log(err);
            }
        });
    };

//初始化变量、函数
    TERM = 'all';
    FREQUENCY = 1;
    get_posts(1);
    register_event();
});
