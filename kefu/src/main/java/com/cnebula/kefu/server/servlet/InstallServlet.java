package com.cnebula.kefu.server.servlet;

import static com.cnebula.kefu.server.tools.StringUtils.checkNotNull;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cnebula.kefu.server.tools.ServletUtils;
import com.cnebula.kefu.service.IInstallService;
import com.cnebula.kefu.service.model.Install;
@Controller
public class InstallServlet{
	Logger log=Logger.getLogger(this.getClass());
	@Autowired
	IInstallService installService;
	@RequestMapping(value={"/kefu/install"})
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding(ServletUtils.CHARSET);
		try {
			log.debug("requestUrl="+ServletUtils.buildURL(request));
			String terminalType=checkNotNull("terminalType", request.getParameter("terminalType"));
			String imeiNum=checkNotNull("imeiNum",request.getParameter("imeiNum"));
			String appName=checkNotNull("appName",request.getParameter("appName"));
			String appPkgName=checkNotNull("appPkgName",request.getParameter("appPkgName"));
			Install install=new Install();
			install.setTerminalType(terminalType);
			install.setImeiNum(imeiNum);
			install.setAppName(appName);
			install.setAppPkgName(appPkgName);
			installService.create(install);
			
			response.setStatus(200);
			ServletUtils.writeText(response, "汇报安装成功");
		} catch (Exception e) {
			log.error(e.getMessage(),e);
			response.sendError(400, e.getMessage());
		}
	}
}
