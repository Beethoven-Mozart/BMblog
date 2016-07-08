var NOW_PAGE, ALL_PAGES, DATE1, ORDER_BY, ORDER_TYPE;//相对的全局变量,当前页面/总页面/开始时间

//页面载入完成计算
var finish_load = function () {
    var date2 = new Date();
    $('#e_time').text(date2.getTime() - DATE1.getTime());
    $('#r_time').text(new Date().Format("yyyy-MM-dd hh:mm:ss"));
};

//时间格式化
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
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

//去重
var hovercUnique = function (arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
};

//计算发布文章月份
var date_group = function (str) {
    for (var n = 0; n < str.length; n++) {
        str[n] = str[n].split('月')[0];
    }
    return hovercUnique(str);
};

//注册事件
var register_event = function () {
    //切换页面事件
    $(".current-page").keydown(function () {
        $(this).css('width', ($(this).val().length * 6.75 + 10));
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
    var last;
    $('.order_by').click(function () {
        console.log($(this).find('i').attr('class').splice(' '));

        // if(n == 0){
        //     ORDER_TYPE = 'ASC';
        //     n = 1;
        // }else{
        //     ORDER_TYPE = 'DESC';
        //     n = 0
        // }
        // ORDER_BY = 'date';
        // get_posts(NOW_PAGE);
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
            order_by: ORDER_BY,
            order_type: ORDER_TYPE
        },
        dataType: "json",
        success: function (result) {
            if (result.err == 500) {
                $("#content-main").html('<h1>数据错误</h1>');
            } else {
                ALL_PAGES = result.posts_page_all;
                NOW_PAGE = result.posts_now;
                //处理统计
                $(".all_post").text(result.posts_all);
                $(".public_post").text(result.posts_public_all);
                $(".all_page").text(ALL_PAGES);

                //处理日期归组
                var dates = [];
                for (var q = 0; q < result.posts.length; q++) {
                    dates[q] = result.posts[q].post_date;
                }
                var date_g = date_group(dates);
                for (var z = 0; z < date_g.length; z++) {
                    $('.filter-by-date').append('<option value="' + date_g[z].replace('年', '') + '">' + date_g[z] + '月</option>');
                }

                //处理分类
                var html_category = '';
                for (var n = 0; n < result.post_category.length; n++) {
                    if (result.post_category[n]['parent'] != '0') {
                        result.post_category[n].category_name = '&nbsp;&nbsp;&nbsp;' + result.post_category[n].category_name;
                    }
                    html_category += '<option class="level-0" value="' + result.post_category[n].term_id + '">' + result.post_category[n].category_name + '</option>';
                }
                $('.post_category').append(html_category);

                //处理文章列表
                $(".current-page").val(NOW_PAGE).css('width', NOW_PAGE.length * 6.75 + 10);
                var title_max_width = parseInt($('.main').css('width')) * 0.45 + 'px';
                var body = '';
                for (var a = 0; a < result.posts.length; a++) {
                    //分类
                    if (result.posts[a].post_category == null) {
                        result.posts[a].post_category = '-';
                    } else {
                        result.posts[a].post_category = result.posts[a].post_category.split(',');
                        for (var b = 0; b < result.posts[a].post_category.length; b++) {
                            result.posts[a].post_category[b] = '<a href="/' + result.posts[a].post_category[b] + '" target="_blank">' + result.posts[a].post_category[b] + '</a>';
                        }
                    }
                    //标签
                    if (result.posts[a].post_tag == null) {
                        result.posts[a].post_tag = '-';
                    } else {
                        result.posts[a].post_tag = result.posts[a].post_tag.split(',');
                        for (var c = 0; c < result.posts[a].post_tag.length; c++) {
                            result.posts[a].post_tag[c] = '<a href="/tag/' + result.posts[a].post_tag[c] + '" target="_blank">' + result.posts[a].post_tag[c] + '</a>';
                        }
                    }
                    //评论
                    if (result.posts[a].comment_count < 10) {
                        result.posts[a].comment_count = '&nbsp;&nbsp;&nbsp;' + result.posts[a].comment_count;
                    } else if (result.posts[a].comment_count < 100) {
                        result.posts[a].comment_count = '&nbsp;&nbsp;' + result.posts[a].comment_count;
                    }
                    body += '<tr>' +
                        '<td><input type="checkbox"></td>' +
                        '<td class="post-td"><a href="#/edit/post/' + result.posts[a].ID + '" target="_blank"><div class="post_title" style="max-width:' + title_max_width + '">' + result.posts[a].post_title + '</div></a></br><div class="post-control">编辑 | 快速编辑 | 移至回收站 | 查看</div></td>' +
                        '<td><a href="#/edit/post/' + result.posts[a].ID + '" target="_blank">' + result.posts[a].display_name + '</a></td>' +
                        '<td>' + result.posts[a].post_category + '</td>' +
                        '<td>' + result.posts[a].post_tag + '</td>' +
                        '<td>' + result.posts[a].comment_count + '</td>' +
                        '<td>已发布</br>' + result.posts[a].post_date + '</td>' +
                        '</tr>';
                }
                $("tbody").html(body);
                finish_load();
            }
        },
        error: function (err) {
            $("#content-main").html('<h1>' + err.responseText + '(' + err.status + ')' + '</h1>');
            console.log(err);
        }
    });
};

//初始化变量、函数
ORDER_BY = 'date';
ORDER_TYPE = 'DESC';
get_posts(1);
register_event();