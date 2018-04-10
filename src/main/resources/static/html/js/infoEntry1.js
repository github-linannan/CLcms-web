(function () {
    var token = MyLocalStorage.Cache.get('token');

    var infoObj = {
        init: function () {
            infoObj.calendar();//日历加载
            infoObj.selectInspector();//选择检测人
            infoObj.entrySave();
            infoObj.educatInspector();

            //page2
            infoObj.yesEntry();
            infoObj.educatInspector2();
            // infoObj.entrySave2();
            //page3

        },
        //日期加载
        calendar: function () {
            var calendar = new lCalendar();
            calendar.init({
                'trigger': '#birthData',
                'type': 'date'
            });
        },
        validate: function (ele) {
            var msg = "";
            var value = ele.val(),
                id = ele.attr('name');
            switch (id) {
                case "tSampleType":
                    if (value === "") {
                        msg = "请选择样本类型";
                    }
                    break;
                // case 'tSiProject':
                //     if (value === "") {
                //         msg = "请选择检测项目";
                //     }
                //     break;
                case 'tSampleNumber':
                    if (value === "") {
                        msg = "请输入采样编号";
                    }
                    break;
                case 'userId':
                    if (value === "") {
                        msg = "请选择检测人";
                    }
                    break;
                case 'orderReturnShipNumber':
                    if (value === "") {
                        msg = "请输入快递单号";
                    }
                    break;
                case 'orderDetectionShipTime':
                    if (value === "") {
                        msg = "请选择采样时间";
                    }
                    break;

            }
//                console.log(msg);
            if (msg != "") {//校验失败
                layer.msg(msg);
                ele.addClass('border-error');
                return false;
            } else {
                ele.removeClass('border-error');
            }
            return true;
        },
        //选择检测人
        selectInspector: function () {
            var uname = MyLocalStorage.Cache.get('userName');
            $('input[name=userId]').val(uname);
        },

        //点击确定
        entrySave: function () {
            $("#entry1-btn").on("click", function () {
                var a = MyLocalStorage.Cache.get('orderInfo');
                console.log(a);
                var isValidate;
                $("input,select", "#entry1List").each(function () {
                    isValidate = infoObj.validate($(this));
                    if (!isValidate) {
                        return isValidate;
                    }
                });
                if (isValidate) {
                    var param = {};
                    $(":input[name^=t],:input[name^=u],select[name^=t],:input[name^=o]").each(function (v, i) {
                        if (this.value != "")
                            param[this.name] = this.value;
                        param["token"] = token;
                        param["userId"] = $.getUrlParam('userId');
                        param["orderNumber"] = MyLocalStorage.Cache.get('orderInfo').orderNumber;
                        param["orderinfoId"] = MyLocalStorage.Cache.get('orderInfo').orderInfoId;
                        param['userinfoId']='';
                        param["orderSendId"]='';
                    });
                    $.ajaxByPost("orderSendInfo/insert", param, function (data) {
                        if (data.code == 200) {//成功
                            console.log(data);
                            $("#entryPage1").addClass('dis-none');
                            $("#entryPage2").removeClass('dis-none');
                            infoObj.entrySave2(data.data.userinfoId);
                            console.log(data.data.orderSendId);
                            infoObj.entryDetail(data.data.orderSendId);
                            // infoObj.seeInspector(data.data.userinfoId);
                            // window.location.href = 'infoEntry2.html?userinfoId=' + data.data.userinfoId;
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
                type: "样本类型"
            }, function (result) {
                if (result.code == 200) {//成功
                    var educTemp = '<option value="">请选择</option>';
                    $.each(result.data["样本类型"], function (i, val) {
                        educTemp += '<option value=' + i + '>' + val + '</option>';
                    });
                    $("select[name=tSampleType]").empty().append(educTemp);
                } else {
                    layer.msg(result.detailMessage);
                }
            });

        },



        //page2-------------
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
                $(this).parent('div').next('.yesBox').addClass('dis-none').val(null);
            })
        },
        //点击确定
        entrySave2: function (d) {
            $("#entry2-btn").on("click", function () {
                var isValidate;
                $(":input,select", "#entry2List").each(function () {
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
                        param["userinfoId"] = d;
                        param["userId"]=$.getUrlParam('userId');
                    });
                    $.ajaxByPost("userInfo/update", param, function (data) {
                        if (data.code == 200) {//成功
                            console.log(data);
                            $("#entryPage2").addClass('dis-none');
                            $("#entryDetail").removeClass('dis-none');
                            infoObj.userDetail(d);
                            // infoObj.entryDetail(data.data.orderSendId);
                            // window.location.href = 'infoEntryDetail.html';
                        } else {
                            layer.msg(data.detailMessage);
                        }
                    });
                }
            });
        },
        //字典查询
        educatInspector2: function () {
            $.ajaxByPost("typeGroup/findTypeGroupAll", {
                token: token,
                type: "饮酒史,运动习惯,饮食习惯,睡眠质量"
            }, function (result) {
                if (result.code == 200) {//成功
                    var jigTemp = '<option value="">请选择</option>', educTemp1 = '<option value="">请选择</option>',
                        shipTemp = '<option value="">请选择</option>', sleepTemp = '<option value="">请选择</option>';

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
                        sleepTemp += '<option value=' + i + '>' + val + '</option>';
                    });
                    $("select[name=userinfoSleep]").empty().append(sleepTemp);
                } else {
                    layer.msg(result.detailMessage);
                }
            });

        },

        //page3详情页--------

        //录入信息详情
        entryDetail: function (sendId) {
            console.log(sendId);
            $.ajaxByPost("orderSendInfo/findOrderSendInfo", {
                token: token,
                orderSendId:sendId
            }, function (result) {
                console.log(result);
                if (result.code == 200) {//成功
                    $("span[name^=u],span[name^=o],span[name^=t],label[name^=u]").each(function(){
                        console.log($(this).html());
                        (result.data)[$(this).attr('name')]!=null?$(this).html((result.data)[$(this).attr('name')]):this.value;
                    });
                } else {
                    layer.msg(result.detailMessage);
                }
            });
        },
        userDetail: function (uid) {
            console.log(uid);
            $.ajaxByPost("userInfo/findDeatilUserInfo", {
                token: token,
                userinfoId:uid
            }, function (result) {
                console.log(result);
                if (result.code == 200) {//成功
                    $("span[name^=u],p[name^=u]").each(function(){
                        console.log($(this).attr('name'));
                        (result.data)[$(this).attr('name')]!=null?$(this).html((result.data)[$(this).attr('name')]):this.value;
                    });
                } else {
                    layer.msg(result.detailMessage);
                }
            });
        },
    };
    $(infoObj.init);
})();
