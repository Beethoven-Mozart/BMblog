$('document').ready(function () {
    var login = function () {
        $.ajax({
            type: 'POST',
            url: "/admin/login",
            data: {
                username: $("#login-name").val(),
                password: $("#login-pass").val()
            },
            dataType: "json",
            success: function (result) {
                if (result.statue == 200 && result.check == "ok") {
                    console.log("身份验证成功!");
                    window.location.href = "/admin";
                } else if (result.check == "no_acc") {
                    alert("用户名或密码不正确!");
                }else{
                    alert("系统错误。");
                }
            },
            error: function (err) {
                console.log(err);
                alert("通信发送错误,请检查网络连接.");
            }
        });
    };

//当登录按钮被按下
    $("#log_in").click(function () {
        login();
    });

    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            login();
        }
    });
});