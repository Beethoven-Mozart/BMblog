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

var finish_load = function () {
    var date2 = new Date();
    $('#e_time').text(date2.getTime() - date1.getTime());
    $('#r_time').text(new Date().Format("yyyy-MM-dd hh:mm:ss"));
};

var page_waiting = function (str) {
    var $page_waiting = $('.page-waiting');
    var width = '-' + parseInt($page_waiting.css('width')) / 2 + 'px';
    $page_waiting.text(str).css('margin-left', width).show();
    setTimeout(function () {
        $('.page-waiting').fadeOut(500);
    }, 1000);
};

var now_page, all_pages;//全局变量,当前页面/总页面

var get_posts = function (post_page) {
    $.ajax({
        cache: false,
        type: 'POST',
        url: "/api/blog/posts",
        async: true,
        data: {
            api_get: 'post',
            post_page: post_page
        },
        dataType: "json",
        success: function (result) {
            if (result.err == 500) {
                $("#content-main").html('<h1>数据错误</h1>');
            } else {
                all_pages = result.posts_page_all;
                now_page = result.posts_now;
                $(".all_post").text(result.posts_all);
                $(".public_post").text(result.posts_public_all);
                $(".all_page").text(all_pages);
                $(".current-page").val(now_page).css('width', now_page.length * 6.75 + 10);
                var title_max_width = parseInt($('.main').css('width')) * 0.45 + 'px';
                var body = '';
                for (var a in result.posts) {
                    if (result.posts[a].post_category == null) {
                        result.posts[a].post_category = '-';
                    } else {
                        result.posts[a].post_category = result.posts[a].post_category.split(',');
                        for (var b in result.posts[a].post_category) {
                            result.posts[a].post_category[b] = '<a href="/' + result.posts[a].post_category[b] + '" target="_blank">' + result.posts[a].post_category[b] + '</a>';
                        }
                    }
                    if (result.posts[a].post_tag == null) {
                        result.posts[a].post_tag = '-';
                    } else {
                        result.posts[a].post_tag = result.posts[a].post_tag.split(',');
                        for (var c in result.posts[a].post_tag) {
                            result.posts[a].post_tag[c] = '<a href="/tag/' + result.posts[a].post_tag[c] + '" target="_blank">' + result.posts[a].post_tag[c] + '</a>';
                        }
                    }
                    body += '<tr>' +
                        '<td><input type="checkbox"></td>' +
                        '<td class="post-td"><a href="#/edit/post/' + result.posts[a].ID + '" target="_blank"><div class="post_title" style="max-width:' + title_max_width + '">' + result.posts[a].post_title + '</div></a></br><div class="post-control">编辑 | 快速编辑 | 移至回收站 | 查看</div></td>' +
                        '<td><a href="#/edit/post/' + result.posts[a].ID + '" target="_blank">' + result.posts[a].display_name + '</a></td>' +
                        '<td>' + result.posts[a].post_category + '</td>' +
                        '<td>' + result.posts[a].post_tag + '</td>' +
                        '<td style="text-align: center">' + result.posts[a].comment_count + '</td>' +
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

get_posts(1);

$(".current-page").keydown(function () {
    $(this).css('width', ($(this).val().length * 6.75 + 10));
});

$('.first-page').click(function () {
    if (now_page == '1') {
        page_waiting('已经是第一页');
    } else {
        get_posts(1);
    }
});

$('.last-page').click(function () {
    if(now_page == 1){
        page_waiting('已经是第一页');
    }else{
        get_posts(now_page - 1);
    }
});

$('.next-page').click(function () {
    if(now_page == all_pages){
        page_waiting('已经是最后一页');
    }else{
        get_posts(parseInt(now_page) + 1);
    }
});

$('.final-page').click(function () {
    if (all_pages == now_page) {
        page_waiting('已经是最后一页');
    } else {
        get_posts(all_pages);
    }
});


