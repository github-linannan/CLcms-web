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
public class AlipayService {

	private Logger log=LoggerFactory.getLogger(AlipayService.class);
	  @Autowired  
	  private RestTemplate restTemplate; 
	  
	  public String  updateOrderByPay(Map<String,String>  data){
		   String body= JSONObject.toJSONString(data);
		   log.info(body);
		  ResponseEntity<String> responseEntity = restTemplate.getForEntity("http://localhost:8082/pay/payCallBack?body={1}", String.class, body);
		  log.info("保存结果"+responseEntity.getBody());
		  return responseEntity.getBody();
	  }
	  
}
