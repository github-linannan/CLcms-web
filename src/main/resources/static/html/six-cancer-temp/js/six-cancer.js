/**
 * Created by 朱庆燕 on 2018/3/30.
 */
$("#pageBtn1").on("click",function () {
    $("#page1").addClass('dis-none');
    $("#page2").removeClass('dis-none');
});
$("#pageBtn2").on("click",function () {
    $("#page2").addClass('dis-none');
    $("#page3").removeClass('dis-none');
});
$("#pageBtn3").on("click",function () {
    $("#page3").addClass('dis-none');
    $("#page4").removeClass('dis-none');
});
$(document).ready(function () {
    $("#tab>aside>ul>.result-tit").click(function () {
        $(this).siblings(".result-detail").slideToggle(300).siblings();
        if ($(this).find("i").hasClass("fa-angle-up")) {
            $(this).find("i").removeClass("fa-angle-up").addClass("fa-angle-down");
        }
        else {
            $(this).find("i").removeClass("fa-angle-down").addClass("fa-angle-up");
        }
        $(this).next(".result-detail").removeClass("dis-none");
    });

    $("#tab>aside>ul>.result-detail").click(function () {
        $(this).next(".result-data").slideToggle(300).siblings();
        if ($(this).find("i").hasClass("fa-angle-down")) {
            $(this).find("i").removeClass("fa-angle-down").addClass("fa-angle-up");
        }
        else {
            $(this).find("i").removeClass("fa-angle-up").addClass("fa-angle-down");
        }
        $(this).next(".result-data").removeClass("dis-none");
    });
});