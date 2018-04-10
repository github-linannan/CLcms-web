/**
 * Created by zy on 2017/11/30.
 */
$(document).ready(function () {
    $(".zy-progress>ul .progress-tit>div").click(function () {
        $(this).next("aside").slideToggle(300).siblings();
        if ($(this).find("i>img").attr("src")==='images/down.png') {
            $(this).find("i>img").attr("src","images/up.png");
            $(this).next("article").removeClass("dis-none");
        }
        else {
            $(this).find("i>img").attr("src","images/down.png");
            $(this).next("article").addClass("dis-none");
        }
    });
});

