(function () {
    var proid="",cityid="",areaid="",addDefualt="";
    var token=MyLocalStorage.Cache.get('token');
    var inspeObj = {
        init: function () {
            inspeObj.citySelect();
            inspeObj.calendar();
            inspeObj.educatInspector();
            inspeObj.genderSelect();
            if ($.getUrlParam('userId')==0){
                $("#addInspector").addClass("add-btn");
                inspeObj.addInspector();
            }else{
                inspeObj.seeInspector();
                inspeObj.compileInspector();
                $("#addInspector").addClass("sava-btn");
            }
        },

        //日期加载
        calendar:function () {
            var calendar = new lCalendar();
            calendar.init({
                'trigger': '#birthData',
                'type': 'date'
            });
        },
        validate: function(ele){
            var msg = "";
            var value = ele.val(),
                id = ele.attr('names');
            var selval=$(".userJig").val();
            console.log(selval);
            var citys=$("#sel_city").html().indexOf("请选择");
            switch (id) {
                case 'userName':
                    if (value === "") {
                        msg = "请输入姓名";
                    }
                    break;
                case 'userTelephone':
                    if (value === "") {
                        msg = "请输入手机号";
                    }
                    else if(!value.match(/^1[34578]\d{9}$/)){
                        msg = "请输入正确的手机号";
                    }
                    break;
                // case 'userAddress':
                //     if (citys>=0) {
                //         msg = "请选择收货地区";
                //     }
                //     break;
                // case 'userAddressInfo':
                //     if (value === "") {
                //         msg = "请输入详细门牌号";
                //     }
                //     break;
                case 'userBirthday':
                    if (value === "") {
                        msg = "请选择出生日期";
                    }
                    break;
                case 'userHeight':
                    if (value === "") {
                        msg = "请输入身高";
                    }
                    break;
                case 'userWeight':
                    if (value === "") {
                        msg = "请输入体重";
                    }
                    break;
                case 'userNative':
                    if (value === "" || value===undefined) {
                        msg = "请选择籍贯";
                    }
                    break;
                case 'userRelationship':
                    if (value === "" || value===undefined) {
                        msg = "请选择家庭关系";
                    }
                    break;
                case 'userEducation':
                    if (value === "" || value===undefined) {
                        msg = "请选择教育程度";
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
        //性别选择
        genderSelect:function () {
          $(".gender-sel .girl").on("click",function () {
              $(this).find('img').attr('src','images/girl-sel.png');
              $(".boy").find('img').attr('src','images/boy.png');
          })
           $(".gender-sel .boy").on("click",function () {
                $(this).find('img').attr('src','images/boy-sel.png');
               $(".girl").find('img').attr('src','images/girl.png');
           })
        },
        //新增检测人
        addInspector: function(){
            $("#addInspector").on("click",function () {
                var isValidate;
                $(":input,a,select","#adsList").each(function(){
                    isValidate = inspeObj.validate($(this));
                    if(!isValidate){
                        return isValidate;
                    }
                });
                if(isValidate){
                    var  param={};
                   var gender= $(".boy").find('img').attr('src')==='images/boy-sel.png';
                    $(":input[names^=user]").each(function(v,i){
                        if(this.value!="")
                            param[$(this).attr("names")]=this.value;
                        param["token"]=token;
                        param["userSex"]=(gender===true)?'男':'女';
                    });
                    $.ajaxByPost("users/insert",param,function(data){
                        if (data.code == 200) {//成功
                            console.log(data);
                            window.location.href='inspectorManage.html';
                        }else{
                            layer.msg(data.detailMessage);
                        }
                    });
                }
            });
        },
        //检测人详情
        seeInspector:function () {
            $.ajaxByPost("users/findDeatilUsers", {
                token: token,
                userId:$.getUrlParam('userId')
            },function(result){
                if (result.code == 200) {//成功
                    // console.log(result);
                    $(":input[names^=user],select,a").each(function(){
                        (result.data)[$(this).attr("names")]!=null?$(this).val((result.data)[$(this).attr("names")]):this.value;
                        if(result.data.userSex=="男"){
                            $(".boy").find('img').attr('src','images/boy-sel.png');
                            $(".girl").find('img').attr('src','images/girl.png');
                        }
                        else {
                            $(".boy").find('img').attr('src','images/boy.png');
                            $(".girl").find('img').attr('src','images/girl-sel.png');
                        }
                    });
                }else{
                    layer.msg(result.detailMessage);
                }
            });
        },
        //字典查询教育
        educatInspector:function () {
            $.ajaxByPost("typeGroup/findTypeGroupAll", {
                token: token,
                type:"教育程度,家庭关系,籍贯"
            },function(result){
                if (result.code == 200) {//成功
                            var educTemp='<option value="">请选择</option>',jigTemp='<option value="">请选择</option>',shipTemp='<option value="">请选择</option>';
                            $.each(result.data["教育程度"],function(i,val){
                                educTemp+= '<option value='+i+'>'+val+'</option>';
                            });
                            $(".userEduc").empty().append(educTemp);
                        $.each(result.data["籍贯"],function(i,val){
                            jigTemp+= '<option value='+i+'>'+val+'</option>';
                        });
                        $(".userJig").empty().append(jigTemp);
                        $.each(result.data["家庭关系"],function(i,val){
                            shipTemp+= '<option value='+i+'>'+val+'</option>';
                        });
                        $(".userShip").empty().append(shipTemp);
                }else{
                    layer.msg(result.detailMessage);
                }
            });

        },
        //提交编辑检测人
        compileInspector:function() {
            $("#addInspector").on("click",function () {
                var isValidate;
                $(":input,a,select","#adsList").each(function(){
                    isValidate = inspeObj.validate($(this));
                    if(!isValidate){
                        return isValidate;
                    }
                });
                if(isValidate) {
                    var gender= $(".boy").find('img').attr('src')==='images/boy-sel.png';
                    var param = {};
                    $(":input[names^=user],a").each(function (v, i) {
                        if (this.value != "")
                            param[$(this).attr("names")] = this.value;
                        param["token"] = token;
                        param["userSex"]=(gender===true)?'男':'女';
                    });
                    $.ajaxByPost("users/update", param, function (data) {
                        if (data.code == 200) {//成功
                            console.log(data);
                            window.location.href='inspectorManage.html';
                        } else {
                            // console.log("error");
                            layer.msg(data.detailMessage);
                        }
                    });
                }
            });
        },

        //地址选择
        citySelect:function () {
            $("#sel_city").on("click",function(){
                // 底部提示
                layer.open({
                    type:1,
                    anim: 2,
                    skin:'layui-layer-demo',
                    area: ['90%', '130px'],
                    title:'地址选择',
                    shadeClose: true, //开启遮罩关闭
                    closeBtn: 0, //不显示关闭按钮
                    content: '<aside class="zy-province"><select id="province">\
                    <option value="">选择省</option></select><select id="city">\
                    <option value="">选择市</option></select>\
                    <select id="area"><option>选择区</option></select></aside>',
                    skin: 'footer',
                    success: function(){
                        inspeObj.addressChange();
                    },
                    end: function () {
                        // location.reload();
                    }
                });
            });
        },
        addressChange:function(){
            //获取省
            $.ajaxByPost("area/findArea",{
                provincePid:0
            },function (data) {
                var prohtml = "";
                if (data.code == 200) {//成功
                    console.log(data);
                    for(var i=0; i<data.data.length; i++){
                        prohtml+='<option value='+ data.data[i].provinceId +'>'+ data.data[i].provinceName +'</option>'
                    }
                    $("#province").append(prohtml);
                    console.log(data);
                }else{
                    layer.msg(data.detailMessage);
                }
            });
            //省市区的选择
            $("#province").on("change",function () {
                proid=$(this).val();
                $.ajaxByPost("area/findArea",{
                    provincePid:$(this).val()
                },function (data1) {
                    var cityhtml = "";
                    for(var i=0; i<data1.data.length; i++) {
                        cityhtml += '<option  value="'+ data1.data[i].provinceId +'">' + data1.data[i].provinceName + '</option>'
                    }
                    $("#city").append(cityhtml);
                });
            });
            $("#city").on("change",function () {
                cityid=$(this).val();
                $.ajaxByPost("area/findArea",{
                    provincePid:$(this).val()
                },function (data2) {
                    if(data2.data.length<1){
                        var allads2=$("#province option:selected").text()+" "+$("#city option:selected").text();
                        $("#sel_city").val(allads2);
                        layer.closeAll();
                    }else{
                        var areahtml = "";
                        for(var i=0; i<data2.data.length; i++) {
                            areahtml += '<option  value='+ data2.data[i].provinceId +'>' + data2.data[i].provinceName + '</option>'
                        }
                        $("#area").append(areahtml);
                    }
                });
            });

            $("#area").on("change",function () {
                areaid=$(this).val();
                var allads=$("#province option:selected").text()+" "+$("#city option:selected").text()+" "+$("#area option:selected").text();
                $("#sel_city").val(allads);
                layer.closeAll();
            });
        },
    };
    $(inspeObj.init);
})();
