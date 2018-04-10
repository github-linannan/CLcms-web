	function getQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	
	function formatDate(date)   { 
		if(date == null || date == ''){
			return '';
		}
		date = date.substring(0,date.length-2);
		date=date.replace(/-/g,"/");  
		var now = new Date(date);
    	var year=now.getFullYear();   
    	var month=now.getMonth()+1;   
    	var date=now.getDate();   
    	var hour=now.getHours();   
    	var minute=now.getMinutes();   
    	var second=now.getSeconds();   
		var formatDate = year+"年"+month+"月"+date+"日  ";
		if(hour <= 12){
			formatDate = formatDate + "上午";
		} else {
			formatDate = formatDate + "下午";
		}
    	return formatDate;   
   	}   