(function () {
    var token = MyLocalStorage.Cache.get('token');
    var infoObj = {
        init: function () {

            infoObj.yesEntry();
            infoObj.educatInspector();
            infoObj.entrySave();
        },

        validate2: function (ele) {
            var msg = "";
            var value = ele.val(),
                id = ele.attr('name');
            switch (id) {
                case 'userinfoDrink':
                    if (value === "") {
                        msg = "请选择饮酒史";
                    }
                    break;
                case 'userinfoExperience':
                    if (value === "") {
                        msg = "请选择运动习惯";
                    }
                    break;
                case 'userinfoEat':
                    if (value === "") {
                        msg = "请选择饮食习惯";
                    }
                    break;
                case 'userinfoSleep':
                    if (value === "") {
                        msg = "请选择睡眠质量";
                    }
                    break;
                // case 'userinfoMedicalhistory':
                //     if (value === "") {
                //         msg = "请输入快递单号";
                //     }
                //     break;
                // case 'userinfoFamilyhistory':
                //     if (value === "" ) {
                //         msg = "请选择采样时间";
                //     }
                //     break;

            }
            if (msg != "") {//校验失败
                layer.msg(msg);
                ele.addClass('border-error');
                return false;
            } else {
                ele.removeClass('border-error');
            }
            return true;
        },
        //有-输入框
        yesEntry: function () {
            $(".yes").on("click", function () {
                $(this).parent('div').next('.yesBox').removeClass('dis-none');
            })
            $(".no").on("click", function () {
                $(this).parent('div').next('.yesBox').addClass('dis-none');
            })

        },

        //点击确定
        entrySave: function () {
            $("#entry2-btn").on("click", function () {
                var isValidate;
                $(":input,select", "#adsList").each(function () {
                    isValidate = infoObj.validate2($(this));
                    if (!isValidate) {
                        return isValidate;
                    }
                });
                if (isValidate) {
                    var param = {};
                    $(":input[name^=u],select[name^=u]").each(function (v, i) {
                        if (this.value != "")
                            param[this.name] = this.value;
                        param["token"] = token;
                        param["userinfoId"] = $.getUrlParam('userinfoId');
                    });
                    $.ajaxByPost("userInfo/update", param, function (data) {
                        if (data.code == 200) {//成功
                            console.log(data);
                            window.location.href = 'infoEntryDetail.html';
                        } else {
                            layer.msg(data.detailMessage);
                        }
                    });
                }
            });
        },
        //字典查询
        educatInspector: function () {
            $.ajaxByPost("typeGroup/findTypeGroupAll", {
                token: token,
                type: "饮酒史,运动习惯,饮食习惯,睡眠质量"
            }, function (result) {
                if (result.code == 200) {//成功
                    var jigTemp = '<option value="">请选择</option>', educTemp1 = '<option value="">请选择</option>',
                        shipTemp = '<option value="">请选择</option>', shipTemp = '<option value="">请选择</option>';

                    $.each(result.data["饮酒史"], function (i, val) {
                        educTemp1 += '<option value=' + i + '>' + val + '</option>';
                    });
                    $("select[name=userinfoDrink]").empty().append(educTemp1);

                    $.each(result.data["运动习惯"], function (i, val) {
                        jigTemp += '<option value=' + i + '>' + val + '</option>';
                    });
                    $("select[name=userinfoExperience]").empty().append(jigTemp);

                    $.each(result.data["饮食习惯"], function (i, val) {
                        shipTemp += '<option value=' + i + '>' + val + '</option>';
                    });
                    $("select[name=userinfoEat ]").empty().append(shipTemp);

                    $.each(result.data["睡眠质量"], function (i, val) {
                        shipTemp += '<option value=' + i + '>' + val + '</option>';
                    });
                    $("select[name=userinfoSleep]").html(shipTemp);
                } else {
                    layer.msg(result.detailMessage);
                }
            });

        },
        //检测人详情
        // seeInspector:function () {
        //     $.ajaxByPost("users/findDeatilUsers", {
        //         token: token,
        //         userId:$.getUrlParam('userId')
        //     },function(result){
        //         if (result.code == 200) {//成功
        //             console.log(result);
        //             $(":input[names^=user],select").each(function(){
        //                 (result.data)[$(this).attr("names")]!=null?$(this).val((result.data)[$(this).attr("names")]):this.value;
        //             });
        //         }else{
        //             layer.msg(result.detailMessage);
        //         }
        //     });
        //
        // },

        //提交编辑检测人
        // compileInspector:function() {
        //     $("#addInspector").on("click",function () {
        //         var isValidate;
        //         $(":input,a","#adsList").each(function(){
        //             isValidate = infoObj.validate($(this));
        //             if(!isValidate){
        //                 return isValidate;
        //             }
        //         });
        //         if(isValidate) {
        //             var param = {};
        //             $(":input[names^=user]").each(function (v, i) {
        //                 if (this.value != "")
        //                     param[$(this).attr("names")] = this.value;
        //                 param["token"] = token;
        //                 param["userId"]= $.getUrlParam('userId');
        //             });
        //             $.ajaxByPost("users/update", param, function (data) {
        //                 if (data.code == 200) {//成功
        //                     console.log(data);
        //                     window.location.href='inspectorManage.html';
        //                 } else {
        //                     // console.log("error");
        //                     layer.msg(data.detailMessage);
        //                 }
        //             });
        //         }
        //     });
        // },
    };
    $(infoObj.init);
})();
