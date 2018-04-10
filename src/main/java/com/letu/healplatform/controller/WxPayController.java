package com.letu.healplatform.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.letu.healplatform.service.WxPayService;

@Controller
@RequestMapping("/wxPayBack")
public class WxPayController {

	private  Logger log=LoggerFactory.getLogger(WxPayController.class);
	
	@Autowired
	private WxPayService  wxPayService;
	@ResponseBody
	@PostMapping(value="/wxPayCallback")
	 public Object  alipayCallback(HttpServletRequest request, HttpServletResponse response){
	        InputStream inStream;
			try {
				inStream = request.getInputStream();
		        ByteArrayOutputStream outSteam = new ByteArrayOutputStream();
		        byte[] buffer = new byte[1024];
		        int len = 0;
		        while ((len = inStream.read(buffer)) != -1) {
		            outSteam.write(buffer, 0, len);
		        }
		        outSteam.close();
		        inStream.close();
		        String result = new String(outSteam.toByteArray(), "utf-8");
		        log.info("支付成功返回：{}",result);
		        return wxPayService.updateOrderByPay(result);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[系统异常校验错误]]></return_msg></xml>"; 
	  }
	
}
