// var otherJS="xx.js";//js文件路径
// document.write('<scr' + 'ipt type="text/javascript" src="'+otherJS+'"></scr' + 'ipt>');
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
        // if (result.html == 404) {
        //     $('#ajax-css').remove();
        //     $("#content-main").html('<h1>页面不存在! - 405</h1>');
        // } else {
        //     $("#content-main").html(result.html);
        //     $('#ajax-css').remove();
        //     $("head").append('<style type="text/css" id="ajax-css">' + result.css + '</style>');
        //     eval(result.js);
        // }
        function sleep(n) {
            var start = new Date().getTime();
            while (true)  if (new Date().getTime() - start > n) break;
        }

        //sleep(3000);
        var body = '';
        for (var a in result.posts) {
            body += '<tr>' +
                '<td><input type="checkbox"></td>' +
                '<td>' + result.posts[a].post_title + '</td>' +
                '<td>' + result.posts[a].display_name + '</td>' +
                '<td>' + result.posts[a].display_name + '</td>' +
                '<td>' + result.posts[a].display_name + '</td>' +
                '<td>' + result.posts[a].display_name + '</td>' +
                '<td>' + result.posts[a].post_date + '</td>' +
                '</tr>';
        }


        $("tbody").html(body);
    },
    error: function (err) {
        $("#content-main").html('<h1>' + err.responseText + '(' + err.status + ')' + '</h1>');
        console.log(err);
    }
});