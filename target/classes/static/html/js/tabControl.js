$(document).ready(function() {
    jQuery.tab_cont = function (tab_tit,tab_conbox, affair) {
        $(tab_conbox).children("li").hide();
        $(tab_tit).children("li:first").addClass("select").show();
        $(tab_conbox).children("li:first").show();
        $(tab_tit).children("li").bind(affair, function () {
            $(this).addClass("select").siblings("li").removeClass("select");
            var activeindex = $(tab_tit).find("li").index(this);
            $(tab_conbox).children("li").eq(activeindex).show().removeClass("dis-none").siblings().hide();
            return false;
        });
    };
    /*调用方法如下：*/
    $.tab_cont("#tabs-head", "#allForm", "click");
    // $.tab_cont("#tabs2", "#tab_conbox2", "mouseenter");
});