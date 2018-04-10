package com.letu.healplatform.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSONObject;

@Service
public class WxPayService {

	private Logger log=LoggerFactory.getLogger(WxPayService.class);
	  @Autowired  
	  private RestTemplate restTemplate; 
	  
	  
	  public String  updateOrderByPay(String  result){
		   log.info(result);
		  ResponseEntity<String> responseEntity = restTemplate.getForEntity("http://localhost:8082/pay/wxPayCallBack?body={1}", String.class, result);
		  log.info("保存结果"+responseEntity.getBody());
		  
		  return responseEntity.getBody();
	  }
}
