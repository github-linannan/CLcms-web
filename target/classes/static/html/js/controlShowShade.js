/**
 * Created by linannan on 2017/11/27.
 */
/*control hide or show shade*/
var win_hg,bg_layer,web_set,web_set_reg,navbar_collapse,web_set_cls,person_info_down;
var person_info_links, person_link_reg, ps_info_len;
var bg_lay_hg;

String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
$(function(){
    web_set_event();
    person_pos_event();
    bg_layer_hg();
    person_link_event();
    doc_clk_event();
    window.onresize = function() {
        bg_layer_hg();
    };
});
    /**
     * 顶部 右侧 个人资料
     */
    function person_link_event() {
        if (document.getElementById("person-info-down") != null) {
            person_info_links = document.getElementsByClassName("person-info-down", "a", "person-info-link");
            person_link_reg = new RegExp("(^|\\s)person_link_bgnone(\\s|$)");
            ps_info_len = person_info_links.length;
            for (var i = 0; i < ps_info_len; i++) {

                person_info_links[i].addEventListener("touchstart", function() {
                    for (var j = 0; j < ps_info_len - 1; j++) {
                        person_info_links[j].className = person_info_links[j].className.replace(person_link_reg, "");
                    }
                    var prev_ele = this.previousSibling;

                    while (prev_ele.nodeName != "A") {
                        prev_ele = prev_ele.previousSibling;
                        if (prev_ele == null)
                            break;
                    }
                    if (prev_ele != null) {

                        prev_ele.className = prev_ele.className + " person_link_bgnone";
                    }
                }, false);
            }
        }
    }
    function hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(obj, cls) {
        if (!this.hasClass(obj, cls)) obj.className += " " + cls;
    }

    function removeClass(obj, cls) {
        if (hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }

    function toggleClass(obj,cls){
        if(hasClass(obj,cls)){
            removeClass(obj, cls);
        }else{
            addClass(obj, cls);
        }
    }
    function bg_layer_hg() {
        bg_layer = document.getElementById("bg-layer");
        win_hg = document.documentElement.clientHeight + 10 + "px";
        bg_lay_hg = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight) + 10 + "px";
        bg_layer.style.height = bg_lay_hg;
    }

    function bg_layer_show() {
        bg_layer = document.getElementById("bg-layer");
        bg_layer.style.display = "block";
        bg_layer.style.zIndex = 4;
        $("#bg-layer").animate({
            "opacity" : "0.3"
        }, 100);
    }

    function bg_layer_hide() {
        bg_layer = document.getElementById("bg-layer");
        navbar_collapse = document.getElementById("navbar-collapse");
        bg_layer.style.zIndex = 0;
        $("#bg-layer").animate({
            "opacity" : "0"
        }, 100);
        bg_layer.style.display = "none";
        if (navbar_collapse != null){
            removeClass(navbar_collapse, 'in');
        }
    }

    function web_set_event() {
        web_set = document.getElementById("web-set");
        navbar_collapse = document.getElementById("navbar-collapse");
        web_set_reg = new RegExp("(^|\\s)web_set_clk(\\s|$)");
        if (web_set != null) {
            web_set.onclick = function() {
                web_set_cls = web_set.className;
                if (navbar_collapse.style.display == "block") {
                    bg_layer_hide();
                   /* web_set_hide();*/
                    removeClass(navbar_collapse, 'in');
                } else {
                    bg_layer_show();
                    addClass(navbar_collapse, 'in');
                    web_set.className = web_set_cls + " web_set_clk";
                 /*   $("#navbar-collapse").animate({
                        "top" : "42px"
                    }, 300);*/
                }
            };
        }
    }

    function web_set_hide() {
        if (navbar_collapse != null && web_set_cls != null) {
            navbar_collapse.style.display = "none";
            web_set.className = web_set_cls.replace(web_set_reg, "");
          /*  $("#navbar-collapse").animate({
                "top": "-200px"
            }, 300);*/
            document.getElementsByTagName("body")[0].style.overflow = "auto";
        }
    }
    function person_pos_event() {
        var take_icon = document.getElementById("take-icon");
        person_pos = document.getElementById("person-pos");
        person_info_down = document.getElementById("person-info-down");
        if (person_pos != null && take_icon != null) {
            person_pos.onclick = function() {
                if (person_info_down.style.display == "block") {
                    bg_layer_hide();
                    person_info_hide();
                } else {
                    bg_layer_show();
                    person_info_down.style.display = "block";
                    $("#person-info-down").animate({
                        "right" : "0px"
                    }, 300);
                }
            };
            take_icon.onclick = function() {
                bg_layer_hide();
                person_info_hide();
            };
        }
    }
        /*个人中心隐藏*/
    function person_info_hide() {
        bg_layer.style.zIndex = 1;
        if (person_info_down != null) {
            person_info_down.style.display = "none";
            $("#person-info-down").animate({
                "right" : "-222px"
            }, 300);
            document.getElementsByTagName("body")[0].style.overflow = "auto";
            for (var j = 0; j < ps_info_len - 1; j++) {
                person_info_links[j].className = person_info_links[j].className.replace(person_link_reg, "");
            }
        }
    }
    function doc_clk_event(){
        bg_layer = document.getElementById("bg-layer");
        bg_layer.onclick = function() {
            person_info_hide();
            bg_layer_hide();
        };
    }

