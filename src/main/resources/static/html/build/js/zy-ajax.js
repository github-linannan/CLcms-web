web_url="http://10.10.7.11:8082/",$.extend({paging:function(e,r,t,a){a=a||10,e.pagination(r,{current_page:0,callback:t,items_per_page:a,load_first_page:!1,num_edge_entries:1,num_display_entries:4,prev_text:"上一页",next_text:"下一页"})},ajaxByGet:function(e,r,t){var a=layer.load();jQuery.ajax({url:web_url+e,type:"GET",contentType:"application/json; charset=utf-8",data:r,cache:!1,dataType:"json",success:function(r){201==r.code?layer.msg("Created"):401==r.code?layer.msg("Unauthorized"):403==r.code?layer.msg("Unauthorized"):404==r.code?layer.msg("Not Found"):20007==r.code||740==r.code?("login/login"!=e&&(localStorage.current_url=window.location.href),window.location.href="login.html"):t(r),layer.close(a)},error:function(){layer.close(a),localStorage.current_url="",layer.open("获取数据失败请稍后再试！")}})},ajaxByPost:function(e,r,t,a){jQuery.ajax({url:web_url+e,type:"POST",contentType:"application/json; charset=utf-8",data:JSON.stringify(r),cache:!1,dataType:"json",success:function(r){201==r.code?layer.msg("Created"):401==r.code?layer.msg("Unauthorized"):403==r.code?layer.msg("Unauthorized"):404==r.code?layer.msg("Not Found"):20007==r.code||740==r.code?("login/login"!=e&&(localStorage.current_url=window.location.href),window.location.href="login.html"):t(r)},error:function(){localStorage.current_url="",layer.msg("获取数据失败请稍后再试！")}})},getUrlParam:function(e){var r=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),t=window.location.search.substr(1).match(r);return null!=t?unescape(t[2]):null},getUrlArgs:function(e){e=e||window.location.href;var r=-1===(e=decodeURIComponent(e)).indexOf("?")?"":e.substring(e.indexOf("?")+1),t={};if(""!==r){r=r.split("&");for(var a=0;a<r.length;a++){t[r[a].split("=")[0]]=r[a].split("=")[1]}}return t},onlyNum:function(e){e.on("keyup",function(e){var r=$(this);r.val(r.val().replace(/[^\d.]/g,""))})},validate:function(e){var r="",t=e.valTrim();switch(e.attr("id")){case"phone":""===t?r="请输入手机号":t.match(/^1(3|4|5|7|8)\d{9}$/)||(r="请输入正确的手机号码");break;case"pwd":""===t&&(r="请输入密码");break;case"fnewPwd":""===t?r="请输入新密码":t.match(/^[a-zA-Z0-9]{8,16}$/)?$("#pwd").valTrim()==t&&(r="新密码和旧密码不能相同"):r="请输入正确的密码格式";break;case"fconfirmPwd":console.log($("#fnewPwd").valTrim()),""===t?r="请输入确认密码":$("#fnewPwd").valTrim()!=t&&(r="两次密码输入不一致");break;case"newPwd":""===t?r="请输入新密码":t.match(/^[a-zA-Z0-9]{8,16}$/)||(r="请输入正确的密码格式");break;case"confirmPwd":""===t?r="请输入确认密码":$("#newPwd").valTrim()!=t&&(r="两次密码输入不一致");break;case"verify-code":""===t&&(r="请输入6位验证码")}return""!=r?(layer.msg(r),e.addClass("border-error"),!1):(e.removeClass("border-error"),!0)},getTimeDetail:function(e,r){var t;"now"===e?t=new Date:(e=parseInt(e),t=new Date(e)),console.log(t);var a=function(e){return e<10&&(e="0"+e),e},n={year:t.getFullYear(),month:a(parseInt(t.getMonth()+1)),date:a(t.getDate()),hour:a(t.getHours()),minute:a(t.getMinutes()),second:a(t.getSeconds()),week:t.getDay()};return 1==r?n.year+"年"+n.month+"月"+n.date+"日    "+n.hour+":"+n.minute+":"+n.second:2==r?n.year+"-"+n.month+"-"+n.date+" "+n.hour+":"+n.minute:3==r?n.year+"-"+n.month+"-"+n.date+" 23:59":4==r?n.year+"."+n.month+"."+n.date:n},getSfm:function(e){return Math.floor(e/3600)+":"+Math.floor(e/60%60)+":"+Math.floor(e%60)}}),jQuery.fn.valTrim=function(){return String.prototype.trim||(String.prototype.trim=function(){return this.replace(/(^\s*)|(\s*$)/g,"")}),$(this).val().trim()};