/**
 * Created by zy on 2017/11/30.
 */
$(function () {
    $(".report-result aside>ul .result-tit").click(function () {
        // $(this).nextAll("li").slideToggle(300).siblings();
        if ($(this).find("i>img").attr("src")==='images/down.png') {
            $(this).find("i>img").attr("src","images/up.png");
            $(this).nextAll(".result-detail").removeClass("dis-none").slideDown(300);
        }
        else {
            $(this).find("i>img").attr("src","images/down.png");
            $(this).nextAll(".result-detail").addClass("dis-none").slideUp(300);
        }
    });

    $(".report-result aside>ul .result-detail").click(function () {
        if($(this).find("i>img").attr("src")==='images/down_blue.png'){
            $(this).find("i>img").attr("src","images/up_blue.png");
            $(this).next(".result-data").removeClass("dis-none").slideDown(300);
        }
        else {
            $(this).find("i>img").attr("src","images/down_blue.png");
            $(this).next(".result-data").addClass("dis-none").slideUp(300);
        }
    })
});

