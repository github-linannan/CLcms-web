(function () {
    var proid=""
    var cityid="";
    var areaid="";
    var addDefualt="";
    var addressObj = {
        init: function () {
            addressObj.citySelect();
            addressObj.CompileAds();
            addressObj.addAddress();
            addressObj.savaAds();
        },
        validate: function(ele){
            var msg = "";
            var value = ele.valTrim(),
                id = ele.attr('id');
            var citys=ele.html().indexOf("请选择");
            switch (id) {
                case 'name':
                    if (value === "") {
                        msg = "请输入收货人姓名";
                    }
                    break;
                case 'phone':
                    if (value === "") {
                        msg = "请输入收货人手机号";
                    }
                    else if(!value.match(/^1[34578]\d{9}$/)){
                        msg = "请输入正确的手机号";
                    }
                    break;
                case 'sel_city':
                    if (citys>=0) {
                        msg = "请选择收货地区";
                    }
                    break;
                case 'detailAddress':
                    if (value === "") {
                        msg = "请输入详细门牌号";
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
        //新增地址
        addAddress: function(){

            $(".add-btn").on("click",function(){
                var isValidate;
                $(":input,a",".zy-address-add").each(function(){
                    isValidate = addressObj.validate($(this));
                    if(!isValidate){
                       return isValidate;
                    }
                });
                addressObj.defualtCheck();
                if(isValidate){
                    $.ajaxByPost("receiveAddress/insert",{
                        provinceNumber:proid,
                        cityNumber:cityid,
                        areaNumber:areaid,
                        addressInfo:$("#detailAddress").valTrim(),
                        addressRemark:'',
                        token:MyLocalStorage.Cache.get('token'),
                        //cc970308f67640ce8ae2d80df677cdea,
                        addressName:$("#name").valTrim(),
                        addressTelephone:$("#phone").valTrim(),
                        addressComplete:$("#sel_city").html()+$("#detailAddress").valTrim(),
                        addressDefault:addDefualt
                    },function(data){
                        if (data.code == 200) {//成功
                            console.log(data);
                           window.location.href='addressManage.html';
                        }else{
                            layer.msg(data.detailMessage);
                        }
                    });
                }

            });
        },
        //编辑地址
        CompileAds:function() {
                $.ajaxByPost("receiveAddress/findByAddressId", {
                    token: MyLocalStorage.Cache.get('token'),
                    addressId:$.getUrlParam('addressId')
                }, function (data) {
                    if (data.code == 200) {//成功
                        console.log(data);
                        var ads;
                        if(data.data.addressComplete){
                            ads= data.data.addressComplete.replace(data.data.addressInfo ," ");
                        }
                        $("#name").val(data.data.addressName);
                        $("#phone").val(data.data.addressTelephone);
                        $("#sel_city").html(ads);
                        $("#detailAddress").val(data.data.addressInfo);
                        if(data.data.addressDefault==1){
                            $("#defaultSelect").prop("checked",true);
                            $(".ids").addClass('zy-select');
                        }
                        else {
                            $("#defaultSelect").prop("checked",false);
                            $(".ids").removeClass('zy-select');
                        }
                        addressObj.defualtCheck();
                    }else {
                        // console.log("error");
                        layer.msg(data.detailMessage);
                    }
                });
                if ($.getUrlParam('add')==1){
                    $("#addBtn").addClass("add-btn");
                }else{
                    $("#addBtn").addClass("sava-btn");
                }
        },
        //默认选中checkbox
        defualtCheck:function () {
            $(".default-li").on("click",function () {
                if ($(this).find('#defaultSelect').is(':checked')) {
                    addDefualt = 0;
                    $(this).find('.ids').removeClass('zy-select');
                }
                else {
                    addDefualt = 1;
                    $(this).find('.ids').addClass('zy-select');
                }
            })
        },
        //保存地址
        savaAds:function () {
            $(".sava-btn").on("click",function(){
                var isValidate = true;
                $("input",".zy-address-add").each(function(){
                    isValidate = addressObj.validate($(this));
                    return isValidate;
                });
                var defaultadd;
                if($("#defaultSelect").is(":checked")){
                    defaultadd=1;
                }else{
                    defaultadd=0;
                }
                if(isValidate){
                    $.ajaxByPost("receiveAddress/update",{
                            provinceNumber:proid,
                            cityNumber:cityid,
                            areaNumber:areaid,
                            addressInfo:$("#detailAddress").valTrim(),
                            addressRemark:'',
                            token:MyLocalStorage.Cache.get('token'),
                            addressId:$.getUrlParam('addressId'),
                            addressName:$("#name").valTrim(),
                            addressTelephone:$("#phone").valTrim(),
                            addressComplete:$("#sel_city").html()+$("#detailAddress").valTrim(),
                            addressDefault:defaultadd
                    },
                    function (data) {
                        if (data.code == 200) {//成功
                            console.log(data);
                            window.location.href='addressManage.html';
                        }else{
                            layer.msg(data.detailMessage);
                        }
                    })
                }
            })
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
                        addressObj.addressChange();
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
                        $("#sel_city").html(allads2);
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
                $("#sel_city").html(allads);
                layer.closeAll();
            });
        },
    };
    $(addressObj.init);
})();
