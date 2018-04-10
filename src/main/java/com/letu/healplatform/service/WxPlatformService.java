package com.letu.healplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WxPlatformService {

	  @Autowired  
	  private RestTemplate restTemplate; 
	
	public String  checkWeixinReques(String param){
		
		  ResponseEntity<String> responseEntity = restTemplate.getForEntity("http://localhost:8082/weixin?body={1}", String.class, param);

		return responseEntity.getBody();
	}
	
	public String getWxOpenId(String param){
		  ResponseEntity<String> responseEntity = restTemplate.getForEntity("http://localhost:8082/getWxOpenId?body={1}", String.class, param);

			return responseEntity.getBody();
	}
}
