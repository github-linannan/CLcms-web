/**
 * Created by zy on 2017/12/12.
 */
(function () {
    $("#quitBtn").on("click", function () {
        $.ajaxByPost("login/quitLogin",
            {token: MyLocalStorage.Cache.get('token')},
            function (data) {
                if (data.code == 200) {
                    window.location.href = "index.html";
                    localStorage.token="";
                }
                else {
                    layer.msg(data.detailMessage);
                }
            })
    })

})()