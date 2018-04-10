/**
 * Created by zy on 2017/11/27.
 */

(function(){
    var forgetObj = {
        init: function(){
            forgetObj.setPwd();
        },
        setPwd: function(){
            $("#rePwd").on("click",function(){
                var isValidate = true;
                $("input","#forgetForm").each(function(){
                    var $input = $(this);
                    isValidate = $.validate($input);
                    return isValidate;
                });
                if(isValidate){
                    $.ajaxByPost("login/updatePassword",{
                        token:MyLocalStorage.Cache.get('token'),
                        oldPassword:$("#pwd").valTrim(),
                        newPassword:$("#fnewPwd").valTrim(),
                    },function(data){
                        console.log(data);
                        if (data.code == 200) {//成功
                            layer.msg("设置成功！", {
                                time: 3000,},
                                 function () {
                                    window.location.href = "login.html";
                                }
                            );
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