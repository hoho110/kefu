package com.cnebula.kefu.service;

import java.util.List;

import com.cnebula.kefu.service.model.Install;
import com.cnebula.kefu.service.statistics.InstallStatistics;

public interface IInstallService {
	public void create(Install install) throws Exception;
	public List<InstallStatistics> count(String terminalType,String appPkgName,long startTime,long endTime) throws Exception;
}
