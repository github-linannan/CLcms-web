/**
 * Created by zy on 2017/11/27.
 */
(function(){
	   var ua = window.navigator.userAgent.toLowerCase();
    var loginObj = {
        init: function(){
            console.log(localStorage.current_url);
            loginObj.telLogin();
            loginObj.idLogin();
            loginObj.verify();
        },
        login: function(args){//用户登陆
            $.ajaxByPost("login/login",args,function(data){
            	var token=data.data.token;
                MyLocalStorage.Cache.put("userInfo", data.data);
                console.log(data);
                if (data.code == 200) {//成功
                    // layer.msg(data.detailMessage);
                	var wxType=0;
             	   if(ua.match(/MicroMessenger/i) == 'micromessenger'){
             		   wxType=1;
             	   	}
             	     //微信访问，判断有无openId,无则需要授权
             	    if(wxType==1&&data.data.openId==""){
             	    	 $.ajax({
             	 			"url": web_url + "/wxAuthorize",
             	 			method: "get",
             	 			data:{"token":token},
             	 			contentType: "application/json;charset=UTF-8",
             	 			success: function(data){
             	 		        window.location.href=data;
             	 			},error: function(XMLHttpRequest,textStatus,errorThrown){
             	 				alert(textStatus);
             	 			}
             	 		});
             	    }else{
             	    	 MyLocalStorage.Cache.put('token',token);
             	    	 window.location.href = "index.html";
             	    }
                	
                  
                   
                }else{
                    layer.msg(data.detailMessage);
                }
            });
        },
        telLogin: function(){//短信登录
            $("#infoLogin").on("click",function(){
                var isValidate = true;
                $("input","#infoForm").each(function(){
                    isValidate = $.validate($(this));
                    if(!isValidate){
                        return isValidate;
                    }
                });
                if(isValidate){
                    var type = $(".select:first").data("type");
                    var args = {
                        telephone:$("#infoPhone").valTrim(),
                        code:$("#verity").valTrim(),
                        type:2
                    };

                    loginObj.login(args);
                }
            });
        },
        idLogin: function(){//账号登陆
            $("#loginBtn").on("click",function(){
                var isValidate = true;
                $("input","#telForm").each(function(){
                    var $input = $(this);
                    isValidate = $.validate($input);
                    return isValidate;
                });
                if(isValidate){

                    var args = {
                        telephone:$("#phone").valTrim(),
                        password:$("#pwd").valTrim(),
                        type:1//1-密码登录，2-短信登录
                    };
                    loginObj.login(args);
                }
            });
        },
        verify: function(){
            $(".verify-code").on("click",function(){
                var $verifyBtn = $(this);
                var seconds = 60;
                var telIsRight = $.validate($("#infoPhone"));
                if($verifyBtn.hasClass("inactive")||!telIsRight){
                    return;
                }
                $.ajaxByPost("login/sendCode",{
                    telephone:$("#infoPhone").valTrim()
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
    };
    $(loginObj.init);
})();