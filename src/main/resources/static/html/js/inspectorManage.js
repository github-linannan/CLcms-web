//检测人管理
(function () {
    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            if (obj[matchs.replace(/\$/g, "")] == null) {
                return matchs;
            } else {
                var key = matchs.replace(/\$/g, "");
                var returns = key == "goodsShortname" ? (obj[key].length > 10 ? obj[key].substring(0, 10) : obj[key]) : obj[key];
                return (returns + "") == "undefined" ? "" : returns;
            }
        });
    };
    var token = MyLocalStorage.Cache.get('token');

    var inspectorObj = {
        init: function () {
            inspectorObj.inspectorList();
            // inspectorObj.addBtn();
            inspectorObj.addInspector();

        },
        //检测人列表
        inspectorList: function () {
            $.ajaxByPost("users/findDetectionUsers", {
                token: token,
            }, function (result) {
                console.log(result);
                if (result.code == 200) {//成功
                    var htmlTemp = $("textarea").val(), htmlProductList = '';
                    console.log(result.data);
                    var dataLists = result.data;
                    for (var i = 0; i < dataLists.length; i++) {
                        htmlProductList += htmlTemp.temp(dataLists[i]);
                    }
                } else {
                    layer.msg(result.detailMessage);
                }

                $('#tempInspectorList').html(htmlProductList);
                inspectorObj.compileInspector();
                inspectorObj.deleteInspector();
                inspectorObj.selectInspector();
            });
        },

        //选中检测人
        selectInspector:function () {
          $("#tempInspectorList label,#tempInspectorList span").on("click",function () {
              var v=$(this).nextAll('.compileInsp').attr("userid");
              var n=$(this).parent('li').find('label').html();
             MyLocalStorage.Cache.put('userName',n);
              // MyLocalStorage.Cache.put('userId',uid);
              window.location.href = "infoEntry1.html?userId="+v;
          })
        },
        //新增检测人跳转
        addInspector: function () {
            $(".add-inspector-btn").on("click", function () {
                window.location.href = "inspectorAdd.html?userId=0";
            })
        },
        //编辑检测人跳转
        compileInspector: function () {
            $(".compileInsp").on("click", function () {
                window.location.href = "inspectorAdd.html?userId=" + $(this).attr("userId");
            })
        },


        //删除检测人
        deleteInspector: function () {
            $(".deleteInspe").on("click", function () {
                var that = this;
                $.ajaxByPost("users/delete", {
                    token: token,
                    userId: $(this).next("a").attr("userId")
                }, function (result) {
                    if (result.code == 200) {//成功
                        $(that).parent("li").remove();
                    } else {
                        layer.msg(result.detailMessage);
                    }
                });
            })

        },
    }
    $(inspectorObj.init);
})();
