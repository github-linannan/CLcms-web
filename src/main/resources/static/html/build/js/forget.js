!function(){var e={init:function(){e.verify(),e.findPwd()},verify:function(){$(".verify-code").on("click",function(){var e=$(this),n=60,o=$.validate($("#phone"));!e.hasClass("inactive")&&o&&(console.log($("#phone").valTrim()),$.ajaxByPost("login/sendCode",{telephone:$("#phone").valTrim()},function(o){if(console.log(o),200==o.code){e.addClass("inactive").html(n+"秒");var i=setInterval(function(){e.html(n+"秒"),1==n&&(clearInterval(i),e.removeClass("inactive").html("获取验证码")),n--},1e3);console.log(o)}else layer.msg(o.detailMessage)}))})},findPwd:function(){$("#rePwd").on("click",function(){var e=!0;$("input","#forgetForm").each(function(){var n=$(this);return e=$.validate(n)}),e&&$.ajaxByPost("login/forgetPassword",{telephone:$("#phone").valTrim(),code:$("#verify").valTrim(),password:$("#newPwd").valTrim()},function(e){console.log(e),200==e.code?window.location.href="login.html":layer.msg(e.detailMessage)})})}};$(e.init)}();