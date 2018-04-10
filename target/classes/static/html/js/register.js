/**
 * Created by zy on 2017/11/27.
 */

(function(){
    var registerObj = {
        init: function(){
            registerObj.verify();
            registerObj.register();
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
        register: function(){
            $("#register").on("click",function(){
                var isValidate = true;
                $("input","#registerForm").each(function(){
                    var $input = $(this);
                    isValidate = $.validate($input);
                    return isValidate;
                });
                if(isValidate){
                    $.ajaxByPost("login/register",{
                        telephone:$("#phone").valTrim(),
                        code:$("#verity").valTrim(),
                        password:$("#newPwd").valTrim(),
                        invite:$("#invite").valTrim(),
                    },function(data){
                        if (data.code == 200) {//成功
                            // registerObj.loading();
                            window.location.href = "login.html";
                        }else{
                            layer.msg(data.detailMessage);
                        }
                    });
                }
            });
        },
        loading:function () {
            layer.msg("保存成功！", {
                time : 5000,
                shade: 0.6,
                success: function(layero,index){
                    var msg = layero.text();
                    var i = 5;
                    var timer = null;
                    var fn = function() {
                        layero.find(".layui-layer-content").text(msg+'('+i+')');
                        if(!i) {
                            layer.close(index);
                            clearInterval(timer);
                        }
                        i--;
                    };
                    timer = setInterval(fn, 1000);
                    fn();
                },
            }, function() {
                $("#btnSave").removeAttr("disabled");
            });
        }
    };
    $(registerObj.init);
})();