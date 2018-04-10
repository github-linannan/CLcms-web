/**
 * Created by zy on 2017/11/27.
 */

(function(){
    var forgetObj = {
        init: function(){
            forgetObj.verify();
            forgetObj.findPwd();
        },
        verify: function(){
            $(".verify-code").on("click",function(){
                var $verifyBtn = $(this);
                var seconds = 60;
                var telIsRight = $.validate($("#phone"));
                if($verifyBtn.hasClass("inactive")||!telIsRight){
                    return;
                }
                console.log($("#phone").valTrim());
                $.ajaxByPost("login/sendCode",{
                    telephone:$("#phone").valTrim()
                },function(data){
                    console.log(data);
                    if (data.code == 200) {//成功
                        $verifyBtn.addClass("inactive").html(seconds+"秒");
                        var interval = setInterval(function(){
                            $verifyBtn.html(seconds+"秒");
                            if(seconds == 1){
                                clearInterval(interval);
                                $verifyBtn.removeClass("inactive").html("获取验证码");
                            }
                            seconds--;
                        },1000);
                        console.log(data);
                    }else{
                        layer.msg(data.detailMessage);
                    }
                });
            });
        },
        findPwd: function(){
            $("#rePwd").on("click",function(){
                var isValidate = true;
                $("input","#forgetForm").each(function(){
                    var $input = $(this);
                    isValidate = $.validate($input);
                    return isValidate;
                });
                if(isValidate){
                    $.ajaxByPost("login/forgetPassword",{
                        telephone:$("#phone").valTrim(),
                        code:$("#verify").valTrim(),
                        password:$("#newPwd").valTrim(),

                    },function(data){
                        console.log(data);
                        if (data.code == 200) {//成功
                            window.location.href = "login.html";
                        }else{
                            layer.msg(data.detailMessage);
                        }
                    });
                }
            });
        }
    };
    $(forgetObj.init);
})();