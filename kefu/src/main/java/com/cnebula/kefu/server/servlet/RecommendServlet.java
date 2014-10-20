package com.cnebula.kefu.server.servlet;

import static com.cnebula.kefu.server.tools.StringUtils.checkNotNull;
import static com.cnebula.kefu.server.tools.StringUtils.modify;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cnebula.kefu.server.tools.ServletUtils;
import com.cnebula.kefu.server.tools.StringUtils;
import com.cnebula.kefu.service.IAppService;
import com.cnebula.kefu.service.IGeneralizationRuleService;
import com.cnebula.kefu.service.model.App;
import com.cnebula.kefu.service.model.GeneralizationRule;
@Controller
public class RecommendServlet{
	private static final long serialVersionUID = 1L;
	Logger log=Logger.getLogger(this.getClass());
	@Autowired
	private IGeneralizationRuleService generalizationRuleService;
	@Autowired
	private IAppService appService;
	/**
	 * terminalType:机型
	 * imeiNum:IMEI号
	 * province:省/直辖市名称
	 * city: 地级市名称
	 */
	@RequestMapping(value={"/kefu/recommend"})
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try
		{
			request.setCharacterEncoding(ServletUtils.CHARSET);
			log.debug("requestUrl="+ServletUtils.buildURL(request));
			String terminalType=checkNotNull("terminalType", request.getParameter("terminalType"));
			String imeiNum=checkNotNull("imeiNum",request.getParameter("imeiNum"));
			String province=request.getParameter("province");
			String city=request.getParameter("city");
			GeneralizationRule source=new GeneralizationRule();
			source.setImeiNum(imeiNum);
			source.setTerminalType(terminalType);
			String region=(province==null||province.trim().length()==0)?null:province.trim();
			if(region!=null)
			{
				region=(city==null||city.trim().length()==0)?region:region+"/"+city.trim();
			}
			source.setRegionNum(region);
			List<GeneralizationRule> rules=generalizationRuleService.recommend(source);
			if(rules==null||rules.size()==0)
			{
				log.warn("Don't find available app for:{terminalType:\""+modify(terminalType)+"\",imeiNum:\""+modify(imeiNum)+"\",province:\""+modify(province)+"\",city:\""+modify(city)+"\"}");
				response.sendError(404, "Don't find available app.");
				return;
			}
			else
			{
				Map<String,App> apps=new HashMap<String,App>();
				for(GeneralizationRule rule:rules)
				{
					if(StringUtils.isEmpty(rule.getApps()))
						continue;
					String[] appIds=rule.getApps().trim().split(",");
					for(String appId:appIds)
					{
						App app=null;
						if((app=apps.get(appId))!=null)
						{
							if(compareOperationLevel(app.operation, rule.getOperation())>=0)
								continue;
						}
						app=appService.find(Integer.parseInt(appId));
						if(app!=null)
						{
							apps.remove(String.valueOf(appId));
							app.operation=rule.getOperation();
							apps.put(String.valueOf(appId), app);
						}
					}
				}
				List<App> selectedApps=new ArrayList<App>(apps.values());
				if(selectedApps==null||selectedApps.size()==0)
				{
					log.warn("Don't find available app for:{terminalType:\""+modify(terminalType)+"\",imeiNum:\""+modify(imeiNum)+"\",province:\""+modify(province)+"\",city:\""+modify(city)+"\"}");
					response.sendError(404, "Don't find available app.");
					return;
				}
				String localAddr=request.getLocalAddr();
				response.setStatus(200);
				StringBuilder json=new StringBuilder();
				json.append("{apps:[");
				for(int i=0;i<selectedApps.size();i++)
				{
					App app=selectedApps.get(i);
					if(i>0)
						json.append(",");
					json.append("{name:\"").append(modify(app.getName()))
					.append("\",pkgName:\"").append(modify(app.getPkgName()))
					.append("\",installName:\"").append(modify(app.getInstallName()))
					.append("\",downUrl:\"http://").append(localAddr).append("/kefu/download/").append(modify(app.getPath()))
					.append("\",operation:\"").append(modify(app.operation))
					.append("\",description:\"").append(modify(app.getMessage()))
					.append("\"}");
				}
				json.append("]}");
				ServletUtils.writeText(response, json.toString());
			}
		}catch(Exception e)
		{
			log.error(e.getMessage(),e);
			response.sendError(400, e.getMessage());
		}
	}
	private int compareOperationLevel(String source,String target)
	{
		if(source.equals(target))
			return 0;
		if(source.equals(GeneralizationRule.OPERATION_AUTOINSTALL))
			return 1;
		if(target.equals(GeneralizationRule.OPERATION_AUTOINSTALL))
			return -1;
		if(source.equals(GeneralizationRule.OPERATION_PROMPT))
			return 1;
		if(target.equals(GeneralizationRule.OPERATION_PROMPT))
			return -1;
		return 0;
	}
}
