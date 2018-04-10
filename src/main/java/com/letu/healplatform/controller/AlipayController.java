package com.letu.healplatform.controller;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alipay.api.internal.util.AlipaySignature;
import com.letu.healplatform.config.AlipayConfig;
import com.letu.healplatform.service.AlipayService;

@Controller
@RequestMapping("/CallBack")
public class AlipayController {
	
	private static Logger log=LoggerFactory.getLogger(AlipayController.class);
	
  @Autowired
	private  AlipayService  alipayService;
	
	/***
	 * 支付成功异步回调
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@PostMapping(value="/getPayback")
	public Object getPayback(HttpServletRequest request,HttpServletRequest response){
		//获取支付宝POST过来反馈信息
		Map<String,String> params = new HashMap<String,String>();
		Map requestParams = request.getParameterMap();
		for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i]
						: valueStr + values[i] + ",";
			}
			//乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
			//valueStr = new String(valueStr.getBytes("ISO-8859-1"), "gbk");
			params.put(name, valueStr);
		}
		return alipayService.updateOrderByPay(params);
		
	}
	
	@GetMapping(value="/test1")
	 public Object  test(HttpServletRequest request,HttpServletResponse response,Map<String, Object> map){
			map.put("outTradeNo", "0001");
			map.put("payType", "支付宝支付");
			map.put("totalAmount", "0.01");
			map.put("payTime", "2018-02-06 15:15:56");
			return "success";
	}
	
	public Object getWxPayback(HttpServletRequest request,HttpServletRequest response){
			log.info("微信支付回调结果");
			return "SUCCESS";		
	}
	
	/***
	 * 跳转到页面
	 * @param request
	 * @param response
	 * @param result
	 * @return
	 */
	@GetMapping(value="/alipayCallback")
	 public Object  alipayCallback(HttpServletRequest request,HttpServletResponse response,Map<String, Object> result){
			//获取支付宝GET过来反馈信息
			Map<String,String> params = new HashMap<String,String>();
			Map requestParams = request.getParameterMap();
			for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
				String name = (String) iter.next();
				String[] values = (String[]) requestParams.get(name);
				String valueStr = "";
				for (int i = 0; i < values.length; i++) {
					valueStr = (i == values.length - 1) ? valueStr + values[i]
							: valueStr + values[i] + ",";
				}
				//乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
				try {
					valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				params.put(name, valueStr);
			}
			log.info(params.toString());
			//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//
			//商户订单号

			try {
				String out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"),"UTF-8");
			
			//支付宝交易号

			String trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"),"UTF-8");

			//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//
			//计算得出通知验证结果
			//boolean AlipaySignature.rsaCheckV1(Map<String, String> params, String publicKey, String charset, String sign_type)
			boolean verify_result = AlipaySignature.rsaCheckV1(params, AlipayConfig.ALIPAY_PUBLIC_KEY, AlipayConfig.CHARSET, "RSA2");
			
			if(verify_result){//验证成功
				//////////////////////////////////////////////////////////////////////////////////////////
				//请在这里加上商户的业务逻辑程序代码
				//该页面可做页面美工编辑
				result.put("outTradeNo", params.get("out_trade_no"));
				result.put("payType", "支付宝支付");
				result.put("totalAmount", params.get("total_amount"));
				result.put("payTime", params.get("timestamp"));
                return "success";
				//——请根据您的业务逻辑来编写程序（以上代码仅作参考）——
				//////////////////////////////////////////////////////////////////////////////////////////
			}else{
				//该页面可做页面美工编辑
				 return "fail";
			}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			 return "fail";
		 
	 }
	
}
