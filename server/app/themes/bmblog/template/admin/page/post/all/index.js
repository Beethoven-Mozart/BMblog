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

$.ajax({
    cache: false,
    type: 'POST',
    url: "/api/blog/posts",
    async: true,
    data: {
        api_get: 'post'
    },
    dataType: "json",
    success: function (result) {
        if (result.err == 500) {
            $("#content-main").html('<h1>数据错误</h1>');
        } else {
            $(".all_post").text(result.posts_all);
            $(".public_post").text(result.posts_public_all);
            $(".all_page").text(result.posts_page_all);
            var body = '';
            for (var a in result.posts) {
                if(result.posts[a].post_category == null){
                    result.posts[a].post_category = '-';
                }else{
                    result.posts[a].post_category = result.posts[a].post_category.split(',');
                    for (var b in result.posts[a].post_category) {
                        result.posts[a].post_category[b] = '<a href="/' + result.posts[a].post_category[b] + '" target="_blank">' + result.posts[a].post_category[b] + '</a>';
                    }
                }
                if(result.posts[a].post_tag == null){
                    result.posts[a].post_tag = '-';
                }else {
                    result.posts[a].post_tag = result.posts[a].post_tag.split(',');
                    for (var c in result.posts[a].post_tag) {
                        result.posts[a].post_tag[c] = '<a href="/tag/' + result.posts[a].post_tag[c] + '" target="_blank">' + result.posts[a].post_tag[c] + '</a>';
                    }
                }
                body += '<tr>' +
                    '<td><input type="checkbox"></td>' +
                    '<td>' + result.posts[a].post_title + '</td>' +
                    '<td>' + result.posts[a].display_name + '</td>' +
                    '<td>' + result.posts[a].post_category + '</td>' +
                    '<td>' + result.posts[a].post_tag + '</td>' +
                    '<td>' + result.posts[a].comment_count + '</td>' +
                    '<td>' + result.posts[a].post_date + '</td>' +
                    '</tr>';
            }
            $("tbody").html(body);
            var date2 = new Date();
            $('#e_time').text(date2.getTime() - date1.getTime());
            $('#r_time').text(new Date().Format("yyyy-MM-dd hh:mm:ss"));
        }
    },
    error: function (err) {
        $("#content-main").html('<h1>' + err.responseText + '(' + err.status + ')' + '</h1>');
        console.log(err);
    }
});