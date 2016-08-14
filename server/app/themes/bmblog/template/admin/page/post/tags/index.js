var NOW_PAGE, ALL_PAGES, DATE1, ORDER_BY, ORDER_TYPE, TERM, FREQUENCY;//相对的全局变量,当前页面/总页面/开始时间/排序依据/排序类型/筛选分类或标签/请求次数

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
    //切换页面事件
    $(".current-page").keydown(function () {
        $(this).css('width', ($(this).val().length * 6.75 + 10));
        //回车
        if (event.keyCode == 13) {
            var input_page = $(this).val();
            if (input_page > 0 && input_page <= ALL_PAGES) {
                get_tags(input_page);
            } else {
                page_waiting('最大只能输入 ' + ALL_PAGES);
            }
        }
    });

    $('.first-page').click(function () {
        if (NOW_PAGE == '1') {
            page_waiting('已经是第一页');
        } else {
            get_tags(1);
        }
    });

    $('.last-page').click(function () {
        if (NOW_PAGE == 1) {
            page_waiting('已经是第一页');
        } else {
            get_tags(NOW_PAGE - 1);
        }
    });

    $('.next-page').click(function () {
        if (NOW_PAGE == ALL_PAGES) {
            page_waiting('已经是最后一页');
        } else {
            get_tags(parseInt(NOW_PAGE) + 1);
        }
    });

    $('.final-page').click(function () {
        if (ALL_PAGES == NOW_PAGE) {
            page_waiting('已经是最后一页');
        } else {
            get_tags(ALL_PAGES);
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
        get_tags(NOW_PAGE);
        if (last_o != click_class[2]) {
            $('.' + last_o).attr('style', '');
        }
        $click_child.css('display', 'inline');
        last_o = click_class[2];
    });

    //添加标签按钮事件
    $('#commit-tags').click(function () {
        var tag_slug = null;
        if($('#tag-slug').val() == '' || $('#tag-slug').val() == null){
            tag_slug = encodeURI($('#tag-name').val());
        }else{
            tag_slug = encodeURI($('#tag-slug').val());
        }
        $.ajax({
            cache: false,
            type: 'PUT',
            url: "/api/blog/posts",
            async: true,
            data: {
                api_get: 'terms',
                taxonomy: 'post_tag',
                name: $('#tag-name').val(),
                slug: tag_slug,
                parent: '0'
            },
            dataType: "json",
            success: function (result) {
                if (result.err == 500) {
                    $("#main").html('<h1>数据错误</h1>');
                } else {
                    if(result.status == 'exists'){
                        page_waiting('此标签名称已存在。');
                    }else if(result.status == 'error'){
                        page_waiting(result.back);
                    }else if(result.status == 'ok'){
                        page_waiting('添加成功');
                        get_tags(1);
                    }
                }
            }
        });
    })
};

//获取文章列表详情AJAX
var get_tags = function (page) {
    DATE1 = new Date();
    $.ajax({
        cache: false,
        type: 'POST',
        url: "/api/blog/posts",
        async: true,
        data: {
            api_get: 'terms',
            target: 'post_tag',
            page: page,
            term: TERM,
            order_by: ORDER_BY,
            order_type: ORDER_TYPE
        },
        dataType: "json",
        success: function (result) {
            if (result.err == 500) {
                $("#main").html('<h1>数据错误</h1>');
            } else {
                ALL_PAGES = result.page_all;
                NOW_PAGE = result.page_now;

                //仅查询一次
                if(FREQUENCY == 1){
                    FREQUENCY++;
                }

                //处理统计
                $(".all_category").text(result.all_terms.length);
                $(".all_page").text(ALL_PAGES);

                var terms_select = '<option value="-1">无</option';
                for (var s = 0; s < result.all_terms.length; s++) {
                    if (result.all_terms[s]['parent'] != '0') {
                        result.all_terms[s].name = '&nbsp;&nbsp;&nbsp;' + result.all_terms[s].name;
                    }
                    terms_select += '<option value="' + result.all_terms[s].term_id + '">' + result.all_terms[s].name + '</option>';
                }
                $("#parent").append(terms_select);

                //处理文章列表
                $(".current-page").val(NOW_PAGE).css('width', NOW_PAGE.length * 6.75 + 10);
                var title_max_width = parseInt($('.main').css('width')) * 0.45 + 'px';
                var body = '';
                for (var a = 0; a < result.terms.length; a++) {
                    body += '<tr>' +
                        '<td><input type="checkbox"></td>' +
                        '<td class="post-td"><a href="#/edit/post/' + result.terms[a].term_id + '" target="_blank"><div class="post_title" style="max-width:' + title_max_width + '">' + result.terms[a].name + '</div></a></br><div class="post-control">编辑 | 快速编辑 | 移至回收站 | 查看</div></td>' +
                        '<td><a href="#/edit/post/' + result.terms[a].term_id + '" target="_blank">' + decodeURI(result.terms[a].slug) + '</a></td>' +
                        '<td>' + result.terms[a].count + '</td>' +
                        '</tr>';
                }
                $('.filter-all').text(result.terms.length);
                $("tbody").html(body);
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
ORDER_BY = '';
ORDER_TYPE = 'DESC';
FREQUENCY = 1;
get_tags(1);
register_event();