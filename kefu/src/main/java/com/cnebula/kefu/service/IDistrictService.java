package com.cnebula.kefu.service;

import java.util.List;

import com.cnebula.kefu.service.model.District;

public interface IDistrictService {
	/**
	 * 返回所有的省市信息
	 * @return
	 */
	public List<District> findAll();
}
