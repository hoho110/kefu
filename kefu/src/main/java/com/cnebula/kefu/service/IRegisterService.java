package com.cnebula.kefu.service;

import com.cnebula.kefu.service.model.Register;

public interface IRegisterService {
	public void create(Register register) throws Exception;
	public int count(long startTime,long endTime) throws Exception;
}
