!function(){var e={init:function(){e.Address(),e.addBtn()},Address:function(){$.ajaxByPost("receiveAddress/findByLoginId",{token:MyLocalStorage.Cache.get("token")},function(d){if(console.log(d),200==d.code){console.log(d.data),d.data.length>0?($(".zy-address-null").addClass("dis-none"),$(".zy-footer").removeClass("dis-none")):($(".zy-address-null").removeClass("dis-none"),$(".zy-footer").addClass("dis-none"));for(var s="",a=0;a<d.data.length;a++)s+='<aside class="add-list"> <div class="add-li"> <i class="dis-none" id="adsId">'+d.data[a].addressId+'</i><label id="name">'+d.data[a].addressName+'</label><span id="phone">'+d.data[a].addressTelephone+'</span><p id="address">'+d.data[a].addressComplete+"</p></div>",1==d.data[a].addressDefault?s+='<div><input type="checkbox" name="address" checked="checked" id="checkAds'+[a]+'" class="dis-none"><label for="checkAds'+[a]+'" class="ids zy-select">':s+='<div><input type="checkbox" name="address" id="checkAds'+[a]+'" class="dis-none"><label for="checkAds'+[a]+'" class="ids">',s+='</label><label>设为默认地址</label><a href="javascript:;" class="compile" >编辑</a><a href="javascript:;" class="deletAds">删除</a></div></aside>';$(".zy-address-m").html(s),e.deleteAds(),e.checkOnly()}else window.location.href="login.html";$(".compile").on("click",function(){var e="addAddress.html?addressId="+$(this).parent().prev().find("i").html();window.location.href=e})})},checkOnly:function(){$("input[name='address']").on("click",function(){var e;$(this).is(":checked")?(e=1,$("#adsList .add-list .ids").removeClass("zy-select"),$(this).next().addClass("zy-select"),$("#adsList .add-list input").prop("checked",!1),$(this).prop("checked",!0)):(e=0,$("#adsList .add-list .ids").removeClass("zy-select"),$("#adsList .add-list input").prop("checked",!1),$(this).prop("checked",!1)),$.ajaxByPost("receiveAddress/update",{token:MyLocalStorage.Cache.get("token"),addressId:$(this).parent().prev().find("i").html(),addressDefault:e},function(e){200==e.code&&(console.log(e),layer.load(2,{time:2}))})})},addBtn:function(){$(".addBtn").on("click",function(){window.location.href="addAddress.html?add=1"})},selectAds:function(){$(".add-li").on("click",function(){window.location.href="submitOrder.html?addressId="+$(this).find("i").html()})},deleteAds:function(){$(".deletAds").on("click",function(){var e=this;$.ajaxByPost("receiveAddress/delete",{token:MyLocalStorage.Cache.get("token"),addressId:$(this).parent().prev().find("i").html()},function(d){200==d.code?$(e).parents(".add-list").remove():layer.msg(d.detailMessage)})})}};$(e.init)}();