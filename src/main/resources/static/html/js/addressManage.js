(function () {
    var token=MyLocalStorage.Cache.get('token');
    var addressObj = {
        init: function () {
            addressObj.Address();
            addressObj.addBtn();
            /*addressObj.selectAds();*/

        },
        Address: function () {
                $.ajaxByPost("receiveAddress/findByLoginId", {
                    token: MyLocalStorage.Cache.get('token'),
                }, function (data) {
                    console.log(data);
                    if (data.code == 200) {//成功
                        console.log(data.data);
                        //判断地址是否为空的情况
                        if(data.data.length>0){
                            $(".zy-address-null").addClass('dis-none');
                            $(".zy-footer").removeClass('dis-none');
                        }else{
                            $(".zy-address-null").removeClass('dis-none');
                            $(".zy-footer").addClass('dis-none');
                        }
                        var html="";
                        for(var i=0; i<data.data.length; i++){
                            html+='<aside class="add-list"> <div class="add-li"> <i class="dis-none" id="adsId">'+data.data[i].addressId+'</i><label id="name">'+data.data[i].addressName+'</label><span id="phone">'+data.data[i].addressTelephone+'</span><p id="address">'+data.data[i].addressComplete+'</p></div>'
                            if(data.data[i].addressDefault==1){
                                html+='<div><input type="checkbox" name="address" checked="checked" id="checkAds'+[i]+'" class="dis-none"><label for="checkAds'+[i]+'" class="ids zy-select">';
                            }else{
                                html+='<div><input type="checkbox" name="address" id="checkAds'+[i]+'" class="dis-none"><label for="checkAds'+[i]+'" class="ids">';
                            }
                             html+='</label><label>设为默认地址</label><a href="javascript:;" class="compile" >编辑</a><a href="javascript:;" class="deletAds">删除</a></div></aside>';
                        }
                        $(".zy-address-m").html(html);
                        addressObj.deleteAds();
                        /*addressObj.selectAds();*/
                        addressObj.checkOnly();
                    } else {
                        window.location.href="login.html"
                    }
                    $(".compile").on("click",function() {
                        var url = "addAddress.html?addressId=" + $(this).parent().prev().find("i").html();
                        window.location.href = url;
                    });
                });
            },
        checkOnly:function () {
            $("input[name='address']").on("click",function () {
                var addDefualt;
                    if ($(this).is(':checked')){
                        addDefualt=1;
                        $("#adsList .add-list .ids").removeClass('zy-select');
                        $(this).next().addClass('zy-select');
                        $("#adsList .add-list input").prop('checked', false);
                        $(this).prop('checked', true);
                    }
                    else{
                        addDefualt=0;
                        $("#adsList .add-list .ids").removeClass('zy-select');
                        // $(this).next().removeClass('zy-select');
                        $("#adsList .add-list input").prop('checked', false);
                        $(this).prop('checked', false);
                    }
                    $.ajaxByPost("receiveAddress/update", {
                        token: MyLocalStorage.Cache.get('token'),
                        addressId:$(this).parent().prev().find("i").html(),
                        addressDefault:addDefualt
                    }, function (data) {
                        if (data.code == 200) {//成功
                            console.log(data);
                            layer.load(2,{time: 2});
                        }
                    })
            })
        },
        addBtn:function () {
            $(".addBtn").on("click",function() {
                window.location.href = "addAddress.html?add=1";
            })
        },
        selectAds:function () {
            $(".add-li").on("click",function() {
                window.location.href = "submitOrder.html?addressId=" + $(this).find("i").html();
            })
        },
        deleteAds:function () {
            $(".deletAds").on("click",function () {
                var that=this;
                $.ajaxByPost("receiveAddress/delete", {
                    token: MyLocalStorage.Cache.get('token'),
                    addressId:$(this).parent().prev().find("i").html()
                }, function (data) {
                    if (data.code == 200) {//成功
                        $(that).parents(".add-list").remove();
                    } else {
                        layer.msg(data.detailMessage);
                    }
                });
            })

        },
    }
    $(addressObj.init);
})();
