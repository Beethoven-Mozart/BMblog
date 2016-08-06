var simplemde_CSS = "/assets/css/admin/simplemde.min.css";//CSS文件路径
if ($('#other_css').attr("src") != simplemde_CSS) {
    $('head').append('<link rel="stylesheet" href="' + simplemde_CSS + '" id="other_css">')
        .append('<link rel="stylesheet" href="/assets/css/admin/fileinput.min.css" id="other_css">');
}

var main_js = function () {
    DATE1 = new Date();
    var DATE1, FREQUENCY, NOW_POST_ID;//相对的全局变量,开始时间/请求次数

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

    //载入编辑器
    var simplemde = new SimpleMDE({element: document.getElementById("edit")});

    //获取文章列表详情AJAX
    var get_post = function (post_id) {
        $.ajax({
            cache: false,
            type: 'POST',
            url: "/api/blog/posts",
            async: true,
            data: {
                api_get: 'post',
                post_id: post_id,
            },
            dataType: "json",
            success: function (result) {
                if (result.err == 500) {
                    $("#main").html('<h1>数据错误</h1>');
                } else {
                    if (FREQUENCY == 1) {

                    }
                    $('.post-title').val(result.post.post_title);
                    simplemde.value(result.post.post_content);
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

    //获取所有category
    var get_category_all = function () {
        $.ajax({
            cache: false,
            type: 'POST',
            url: "/api/blog/posts",
            async: true,
            data: {
                api_get: 'terms',
                target: 'category',
                page: '1',
                order_by: 'by_count'
            },
            dataType: "json",
            success: function (result) {
                if (result.err == 500) {
                    $("#main").html('<h1>数据错误</h1>');
                } else {
                    console.time('a');
                    var category_all = '<ul>';
                    var category_children = [];
                    var new_category_parent = null;
                    for (var n = 0; n < result.all_terms.length; n++) {
                        if (result.all_terms[n].parent == 0) {
                            category_all += '<li><label class="select-it"><input value="' + result.all_terms[n].term_id + '" type="checkbox"> ' + result.all_terms[n].name + '</label></li>';
                            new_category_parent += '<option value="' + result.all_terms[n].term_id + '">' + result.all_terms[n].name + '</option>';
                        } else {
                            category_children.push(result.all_terms[n]);
                            new_category_parent += '<option value="' + result.all_terms[n].term_id + '">&nbsp;&nbsp;&nbsp;' + result.all_terms[n].name + '</option>';
                        }
                    }
                    $('.category-all').html(category_all + '</ul>');
                    $('.new_category_parent').append(new_category_parent);

                    for (var i = 0; i < category_children.length; i++) {
                        $('.category-all input').each(function () {
                            if ($(this).val() == category_children[i].parent) {
                                var $this_parent = $(this).parent().parent();
                                if ($this_parent.find('ul').length) {
                                    $this_parent.find('ul').append('<li><label class="select-it"><input value="' + category_children[i].term_id + '" type="checkbox"> ' + category_children[i].name + '</label></li>');
                                } else {
                                    $this_parent.append('<ul class="children"><li><label class="select-it"><input value="' + category_children[i].term_id + '" type="checkbox"> ' + category_children[i].name + '</label></li></ul>');
                                }
                            }
                        })
                    }

                    var category_pop = '<ul>';
                    for (var n = 0; n < result.terms.length; n++) {
                        category_pop += '<li><label class="select-it"><input value="' + result.terms[n].term_id + '" type="checkbox"> ' + result.terms[n].name + '</label></li>';
                    }
                    $('.category-pop').html(category_pop + '</ul>');
                    console.timeEnd('a');
                }
            },
            error: function (err) {
                $("#main").html('<h1>' + err.responseText + '(' + err.status + ')' + '</h1>');
                console.log(err);
            }
        });
    };

    //获取所有post_tag
    var get_post_tag_all = function () {
        $.ajax({
            cache: false,
            type: 'POST',
            url: "/api/blog/posts",
            async: true,
            data: {
                api_get: 'terms',
                target: 'post_tag',
                page: '1',
                order_by: 'by_count'
            },
            dataType: "json",
            success: function (result) {
                if (result.err == 500) {
                    $("#main").html('<h1>数据错误</h1>');
                } else {
                    console.time('b');
                    var tags = '';
                    for (var n = 0; n < result.all_terms.length; n++) {
                        tags += '<a href="javascript:;" title="' + result.all_terms[n].count + '" style="font-size: ' + result.all_terms[n].count * 2 + 'px;">' + result.all_terms[n].name + '</a>';
                    }
                    $('.tag-adder .tags').html(tags);

                    //注册添加tag到文本框事件
                    $('.tags a').click(function () {
                        var text = $(this).text();
                        var old_text = $('.tag-name').val();
                        if (old_text == '' || old_text == null) {
                            $('.tag-name').val(text);
                        } else {
                            //检查是否已存在同名标签
                            if ($.inArray(text, old_text.split(',')) == -1) {
                                $('.tag-name').val(old_text + ',' + text);
                            }
                        }

                    });

                    console.timeEnd('b');
                }
            },
            error: function (err) {
                $("#main").html('<h1>' + err.responseText + '(' + err.status + ')' + '</h1>');
                console.log(err);
            }
        });
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
            console.log('文章标题', $('#post-title').val());
            console.log('文章内容', simplemde.value());
            console.log('分类目录', $('.category-all').text());
            console.log('文章标签', $('#tag-name').val());
            console.log('特色图片');

            // $.ajax({
            //     cache: false,
            //     type: 'POST',
            //     url: "/api/blog/posts",
            //     async: true,
            //     data: {
            //         api_get: 'post',
            //         post_content: simplemde.value()
            //     },
            //     dataType: "json",
            //     success: function (result) {
            //         if (result.err == 500) {
            //         }
            //     }
            // });
        });

        //分类目录选择事件
        var now_category_tab = 'category-all';
        $('.category-tabs li').click(function () {
            $('.category-tabs li').attr('class', '');
            now_category_tab = $(this).addClass('tabs').attr('id');
            $('.tabs-panel').hide();
            $('.' + now_category_tab).show();
        });

        //添加新的分类目录事件
        $('.add-category').click(function () {
            $('.category-add').slideDown(300);
        });

        //显示tags
        var show_tag = 0;
        $('.show-tag').click(function () {
            if (show_tag == 0) {
                get_post_tag_all();
                $('.tags').show();
                show_tag = 1;
            } else {
                $('.tags').hide();
                show_tag = 0;
            }
        });

        //上传插件
        var upload_one_img = 0;
        $('#upload_one_img').click(function () {
            if(upload_one_img == 0){
                $.getScript("/assets/js/admin/fileinput.min.js", function () {
                    $.getScript("/assets/js/admin/fileinput_locale_zh.js", function () {
                        var filename_save;
                        $("#input-id").fileinput({
                            language: 'zh',
                            showCaption: false,
                            uploadUrl: 'userupdata.php', // you must set a valid URL here else you will get an error，填写对应/api/imgurl路径即可
                            allowedFileExtensions: ['jpg', 'png', 'gif', 'doc', 'zip', 'docx', 'jpeg', 'docx', 'ppt', 'pptx', 'pdf', 'xls', 'xlsx'],
                            overwriteInitial: false,
                            maxFileSize: 1024000,
                            maxFilesNum: 1,
                            slugCallback: function (filename) {
                                return filename.replace('(', '_').replace(']', '_');
                            }
                        });
                        $('.upload_atr').show();
                    });
                });
                upload_one_img = 1;
            }else{
                $('.upload_atr').hide();
                upload_one_img = 0;
            }
        });

    };

    //初始化变量、函数
    NOW_POST_ID = $_GET('post');
    get_category_all();
    if (NOW_POST_ID != null) {
        $('.post-page-title').text('编辑文章');
        FREQUENCY = 1;
        get_post(NOW_POST_ID);
    } else {
        finish_load();
    }
    register_event();
    loading_page_func($_GET(1));
};

$.getScript("/assets/js/admin/simplemde.min.js", function () {
    main_js();
});
