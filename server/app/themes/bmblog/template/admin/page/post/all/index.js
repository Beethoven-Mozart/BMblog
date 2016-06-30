$.ajax({
    cache: false,
    type: 'POST',
    url: "/api",
    async: true,
    data: {
        api_get: 'post'
    },
    dataType: "json",
    success: function (result) {
        if (result.err == 500) {
            $("#content-main").html('<h1>数据错误</h1>');
        } else {
            console.log(result);
            $("#all_post").text(result.posts_all);
            $("#public_post").text(result.posts_public_all);
            var body = '';
            for (var a in result.posts) {
                body += '<tr>' +
                    '<td><input type="checkbox"></td>' +
                    '<td>' + result.posts[a].post_title + '</td>' +
                    '<td>' + result.posts[a].display_name + '</td>' +
                    '<td>' + result.posts[a].display_name + '</td>' +
                    '<td>' + result.posts[a].post_tag + '</td>' +
                    '<td>' + result.posts[a].display_name + '</td>' +
                    '<td>' + result.posts[a].post_date + '</td>' +
                    '</tr>';
            }
            $("tbody").html(body);
        }
    },
    error: function (err) {
        $("#content-main").html('<h1>' + err.responseText + '(' + err.status + ')' + '</h1>');
        console.log(err);
    }
});