package com.letu.healplatform.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.letu.healplatform.service.WxPlatformService;


@Controller
public class WxPlatformController {

	@Autowired
	private WxPlatformService  wxPlatformService;
	private  Logger log=LoggerFactory.getLogger(WxPlatformController.class);
	//微信公众平台验证url是否有效使用的接口
		@RequestMapping(value="/weixin",method=RequestMethod.GET,produces="text/html;charset=UTF-8")
		@ResponseBody
		public String initWeixinURL(HttpServletRequest request){
			String echostr = request.getParameter("echostr");
			String signature = request.getParameter("signature");
			String timestamp = request.getParameter("timestamp");
			String nonce = request.getParameter("nonce");
			Map<String,Object> param=new HashMap<String,Object>();
			  param.put("echostr", echostr);
			  param.put("signature", signature);
			  param.put("timestamp", timestamp);
			  param.put("nonce", nonce);
			return wxPlatformService.checkWeixinReques(JSONObject.toJSONString(param));
		}
	
		
	    @GetMapping("/getCode")
		public Object getCode(String code,String state,Model map){
			Map<String,Object> result=new HashMap<String,Object>();
			log.info("code={},state={}",code,state);
			result.put("code", code);
			result.put("token", state);
			map.addAttribute("token", state);
			 wxPlatformService.getWxOpenId(JSONObject.toJSONString(result));
			//return JSONObject.toJSONString(result);
			return "index";
		}
	
}
