var NOW_PAGE, ALL_PAGES, DATE1, ORDER_BY, ORDER_TYPE, POST_STATUS, TERM, FREQUENCY;//相对的全局变量,当前页面/总页面/开始时间/排序依据/排序类型/文章总状态/筛选分类或标签/请求次数

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
    //文章状态切换
    $('.post-all').click(function () {
        POST_STATUS = 'all';
        get_posts(NOW_PAGE);
    });

    $('.post-publish').click(function () {
        POST_STATUS = 'publish';
        get_posts(NOW_PAGE);
    });

    $('.post-draft').click(function () {
        POST_STATUS = 'draft';
        get_posts(NOW_PAGE);
    });

    //切换页面事件
    $(".current-page").keydown(function () {
        $(this).css('width', ($(this).val().length * 6.75 + 10));
        //回车
        if (event.keyCode == 13) {
            var input_page = $(this).val();
            if (input_page > 0 && input_page <= ALL_PAGES) {
                get_posts(input_page);
            } else {
                page_waiting('最大只能输入 ' + ALL_PAGES);
            }
        }
    });

    $('.first-page').click(function () {
        if (NOW_PAGE == '1') {
            page_waiting('已经是第一页');
        } else {
            get_posts(1);
        }
    });

    $('.last-page').click(function () {
        if (NOW_PAGE == 1) {
            page_waiting('已经是第一页');
        } else {
            get_posts(NOW_PAGE - 1);
        }
    });

    $('.next-page').click(function () {
        if (NOW_PAGE == ALL_PAGES) {
            page_waiting('已经是最后一页');
        } else {
            get_posts(parseInt(NOW_PAGE) + 1);
        }
    });

    $('.final-page').click(function () {
        if (ALL_PAGES == NOW_PAGE) {
            page_waiting('已经是最后一页');
        } else {
            get_posts(ALL_PAGES);
        }
    });

    //文章排序
    var last_o;
    $('.order_by').click(function () {
        var $click_child = $(this).find('i');
        var click_class = $click_child.attr('class').split(' ');
        if (click_class[1] == 'fa-caret-down') {
            ORDER_TYPE = 'ASC';
            $click_child.attr('class', 'fa fa-caret-up ' + click_class[2]);
        } else {
            ORDER_TYPE = 'DESC';
            $click_child.attr('class', 'fa fa-caret-down ' + click_class[2]);
        }
        ORDER_BY = click_class[2];
        get_posts(NOW_PAGE);
        if (last_o != click_class[2]) {
            $('.' + last_o).attr('style', '');
        }
        $click_child.css('display', 'inline');
        last_o = click_class[2];
    });
};

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
            //DATE1 = new Date();
            if (result.err == 500) {
                $("#main").html('<h1>数据错误</h1>');
            } else {
                ALL_PAGES = result.posts_page_all;
                NOW_PAGE = result.posts_now;

                //仅查询一次
                if(FREQUENCY == 1){
                    //处理统计
                    $(".all_post").text(result.posts_publish + result.posts_draft);
                    $(".public_post").text(result.posts_publish);
                    if (result.posts_draft == 0) { //如果草稿为0,则隐藏。
                        $(".post-draft-div").hide();
                    } else {
                        $(".draft_post").text(result.posts_draft);
                    }
                    $(".all_page").text(ALL_PAGES);
                }


                //处理文章列表
                $(".current-page").val(NOW_PAGE).css('width', NOW_PAGE.length * 6.75 + 10);
                var title_max_width = parseInt($('.main').css('width')) * 0.45 + 'px';
                var body = '';
                for (var a = 0; a < result.posts.length; a++) {
                    body += '<tr>' +
                        '<td><input type="checkbox"></td>' +
                        '<td class="post-td"><a href="#/edit/post/' + result.posts[a].ID + '" target="_blank"><div class="post_title" style="max-width:' + title_max_width + '">' + result.posts[a].post_title + '</div>' + result.posts[a].post_status_show + '</a></br><div class="post-control">编辑 | 快速编辑 | 移至回收站 | 查看</div></td>' +
                        '<td><a href="#/edit/post/' + result.posts[a].ID + '" target="_blank">' + result.posts[a].display_name + '</a></td>' +
                        '<td>' + result.posts[a].post_status + '</td>' +
                        '</tr>';
                }
                $('.filter-all').text(result.posts_now_all);
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
POST_STATUS = 'all';
ORDER_BY = 'date';
ORDER_TYPE = 'DESC';
FREQUENCY = 1;
get_posts(1);
register_event();