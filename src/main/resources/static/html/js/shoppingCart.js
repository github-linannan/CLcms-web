

$(function () {
    /*var img_url="http://10.10.2.224:8899/";*/
    String.prototype.temp = function (obj) {
        return this.replace(/\$\w+\$/gi, function (matchs) {
            if (obj[matchs.replace(/\$/g, "")] == null) {
                return matchs;
            } else {
                var key=matchs.replace(/\$/g, "");
                var returns =key=="goodsName"?(obj[key].length>20?obj[key].substring(0,20):obj[key]):obj[key];
                return (returns + "") == "undefined" ? "" : returns;
            }
        });
    };

    var htmlShopCartList = '', htmlTemp = $("textarea").val();
    var args = {
        token: checkLogin
    };
    if (checkLogin == null || checkLogin == "") {
        window.location.href = 'login.html';
    } else {
        $.ajaxByPost("shopingCart/findAllCart", args, function (result) {
        if (result.code === 200) {
            var dataLists = result.data;
            if (dataLists.length > 0) {
                dataLists.forEach(function (object, i) {
                    htmlShopCartList += htmlTemp.temp(dataLists[i]).temp(dataLists[i].goods);
                });
            }else {
                layer.msg('您还没有添加任何商品进入购物车哦');
            }

        }
        htmlShopCartList = htmlShopCartList.replace(/#\w+#/gi, function (matchs) {
            return MinImgUrl;
        });
        $('.list-shop-cart').html(htmlShopCartList);

        if (htmlShopCartList.length > 0) {

            //全局的checkbox选中和未选中的样式
            var $allCheckbox = $('input[type="checkbox"]'),     //全局的全部checkbox

                $wholeChexbox = $('.whole_check'),
                $sonCheckBox = $('.son_check'),
                containerPackage = $('.list-shop-cart .container-package'),
                PackageNum = $('.list-shop-cart .container-package').length,
                deleteAll = document.getElementById('delete-all'), // 删除全部按钮
                settlement = $('#settlement');
                $('.text-shop-cart .text-num').html(PackageNum);

            $sonCheckBox.each(function () {
                var len = $sonCheckBox.length;
                var num = 0;
                //判断：所有单个商品是否勾选
                if ($(this).is(':checked')) {
                    num++;
                }
                if (num == len) {
                    $wholeChexbox.prop("checked", true);
                    $wholeChexbox.next('label').addClass('mark');
                } else {
                    //单个商品取消勾选，全局全选取消勾选
                    $wholeChexbox.prop("checked", false);
                    $wholeChexbox.next('label').removeClass('mark');
                }
            });

            //为每行元素添加事件
            for (var i = 0; i < containerPackage.length; i++) {
                //将点击事件绑定到htmlShopCartList元素
                $(containerPackage[i]).on('click', '.add,.minus,.btn-delete', function () {
                    var cls = $(this).attr('class').split(" ")[0];
                    var htmlMinus = $(this).parents('.amount_box').find('.minus');
                    var countInout = $(this).parent().parent().find('input')[0]; // 数目input
                    var value = parseInt(countInout.value); //数目
                    switch (cls) {

                        case 'add': //点击了加号
                            countInout.value= value + 1;
                       /* if(countInout.value > 1 && htmlMinus.hasClass('reSty')){
                        htmlMinus.removeClass('reSty');
                        }*/
                            break;
                        case 'minus': //点击了减号
                            if (value > 1) {
                                countInout.value = value - 1;
                            }
                        /*if(countInout.value==1 && !htmlMinus.hasClass('reSty')){
                         htmlMinus.addClass('reSty');
                        }*/
                            break;
                        case 'btn-delete': //点击了删除

                            var productId = $(this).attr("productId");
                            var deleteData = {
                                token: checkLogin,
                                goodsId: productId
                            };
                            var deleteHtml = $(this).parents(".container-package");
                            layer.confirm(
                                '确定删除此商品吗？',
                                {
                                    title: false,
                                    closeBtn: 0,
                                    yes: function (index, layero) {
                                        $.ajaxByPost("shopingCart/deleteCart", deleteData, function (result) {
                                            if (result.code === 200) {
                                                deleteHtml.remove();
                                            }
                                        });
                                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                                    }
                                });
                            break;
                    }
                    totalMoney();
                })

                // 点击全部删除
                var deleteDataString = [];
                deleteAll.onclick = function () {
                    var allCheckedBox = $('input[type=checkbox]:checked');
                    var deleteHtml = allCheckedBox.parents('.container-package');
                    $('.text-shop-cart .text-num').html(PackageNum-deleteHtml.length);
                    if (allCheckedBox.length >0){
                        for (var i = 0; i < allCheckedBox.length; i++) {
                            if ($(allCheckedBox[i]).attr('id') != 'all'){
                                deleteDataString.push($(allCheckedBox[i]).attr('productId'));
                            }
                        }
                        var deleteData = {
                            token: checkLogin,
                            goodsId: deleteDataString.join(",")
                        };
                        layer.confirm(
                            '确定删除此商品吗？',
                            {
                                 title: false,
                                 closeBtn: 0,
                                 yes: function (index, layero) {
                                     $.ajaxByPost("shopingCart/deleteCart", deleteData, function (result) {
                                         if (result.code === 200) {
                                             deleteHtml.remove();
                                         }
                                     });
                                     layer.close(index); //如果设定了yes回调，需进行手工关闭
                                 }
                            });
                        totalMoney(); //更新总数
                    }else {
                        layer.msg('请选择要删除的商品！')
                    }

                }

                // 给数目输入框绑定keyup事件
                containerPackage[i].getElementsByTagName('input')[1].onkeyup = function () {
                    var val = parseInt(this.value);
                    if (isNaN(val) || val <= 0) {
                        val = 1;
                    }
                    if (this.value != val) {
                        this.value = val;
                    }
                    totalMoney(); //更新总数
                }
            }
            $allCheckbox.click(function () {
                if ($(this).is(':checked')) { /*选中的状态下 分俩种 1 全选按钮2单个*/
                    if ($(this).attr("id") === 'all') {
                        $allCheckbox.prop("checked", true);
                        $allCheckbox.next('label').addClass('mark');
                    } else {
                        $(this).next('label').addClass('mark');
                    }
                } else {
                    if ($(this).attr("id") === 'all') {
                        $allCheckbox.prop("checked", false);
                        $allCheckbox.next('label').removeClass('mark');
                    } else {
                        $(this).next('label').removeClass('mark')
                    }
                }
                totalMoney();
            });
            /*=====================================结算=====================================*/
            settlement.click(function () {
                var productChecked = {},
                    productCheckedIdLists="",
                    productCheckedNumLists = "",
                    allCheckedBox = $('input[type=checkbox]:checked');
                if (allCheckedBox.length >0){
                    for (var i = 0; i < allCheckedBox.length; i++) {
                        if ($(allCheckedBox[i]).attr('id') != 'all'){
                            productCheckedIdLists += $(allCheckedBox[i]).attr('productId')+",";
                            productCheckedNumLists += $(allCheckedBox[i]).parents('.container-package').find('.sum').val()+",";

                            productChecked.productCheckedIdLists = productCheckedIdLists.substring(0, productCheckedIdLists.lastIndexOf(','));
                            productChecked.productCheckedNumLists = productCheckedNumLists.substring(0, productCheckedNumLists.lastIndexOf(','));
                            productChecked.productOrderDegree ="";
                            if(MyLocalStorage.Cache.get('productChecked')){//缓存存在
                                MyLocalStorage.Cache.remove('productChecked'); //移除缓存
                            }
                            MyLocalStorage.Cache.put('productChecked', productChecked,60);
                            window.location.href = 'submitOrder.html';
                        }
                    }
                }else {
                    /*settlement.disabled=true;*/
                    layer.msg('你还没用选中哦')
                }
            });



            //===============================================全局全选与单个商品的关系================================
            $sonCheckBox.each(function () {
                $(this).click(function () {
                    if ($(this).is(':checked')) {
                        //判断：所有单个商品是否勾选
                        var len = $sonCheckBox.length;
                        var num = 0;
                        $sonCheckBox.each(function () {
                            if ($(this).is(':checked')) {
                                num++;
                            }
                        });
                        if (num == len) {
                            $wholeChexbox.prop("checked", true);
                            $wholeChexbox.next('label').addClass('mark');
                        }
                    } else {
                        //单个商品取消勾选，全局全选取消勾选
                        $wholeChexbox.prop("checked", false);
                        $wholeChexbox.next('label').removeClass('mark');
                    }
                    totalMoney();
                });

            })


            //=================================================商品数量==============================================


            /*
             Number.prototype.toFixed = function(s)
             {
             return (parseInt(this * Math.pow( 10, s ) + 0.5)/ Math.pow( 10, s )).toString();
             }*/

            //======================================总计==========================================

            function totalMoney() {
                var total_money = 0,
                    total_count = 0;
                $sonCheckBox.each(function () {
                    if ($(this).is(':checked')) {
                        var unitPrice = $(this).parents().siblings('.box-product-info').find('.btns-deal-product-amount em').html().substring(1); //单价
                        var unitProductNum = $(this).parents().siblings('.box-product-info').find('.btns-deal-product-amount .sum').val();

                        total_money += (parseInt(unitProductNum) * parseFloat(unitPrice));
                        total_count += parseInt(unitProductNum);
                        /!*   total_count += num;*!/ //件数

                    }
                });
                //写入HTML
                if (total_money != 0){
                    $('.sum-price').html('￥' + total_money.toFixed(2));
                }else {
                    $('.sum-price').html('0.00');
                }
                $('#settlement .num').html(total_count);
                if (total_money != 0 && total_count != 0) {
                    if (!$(settlement).hasClass('btn_sty')) {
                        $(settlement).addClass('btn_sty');
                        /*$(settlement).disabled = false;*/
                    }
                } else {
                    if ($(settlement).hasClass('btn_sty')) {
                        $(settlement).removeClass('btn_sty');
                       /* $(settlement).disabled = true;*/
                    }
                }
            }


        }

    })
}

});


