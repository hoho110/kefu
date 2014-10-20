package com.cnebula.kefu.server.servlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cnebula.kefu.server.KefuConfig;
import com.cnebula.kefu.server.tools.ServletUtils;
import com.cnebula.kefu.server.tools.StringUtils;
import com.cnebula.kefu.server.tools.VerifyException;
@Controller
public class XmlDownloadServlet{
	private static File xmlDir=null;
	Logger log=Logger.getLogger(this.getClass());
	private File getXmlDir()
	{
		if(xmlDir!=null)
			return xmlDir;
		xmlDir=new File(KefuConfig.kefuConfig.getDataLocation(),"xml");
		if(!xmlDir.exists()){
			xmlDir.mkdirs();
		}
		return xmlDir;
	}
	@RequestMapping(value={"/kefu/xdownload","/kefu/xdownload/{version}","/kefu/xVersion"})
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding(ServletUtils.CHARSET);
		String uri=request.getRequestURI();
		if(uri.indexOf("/kefu/xVersion")>-1)
		{
			try{
				log.debug("requestUrl="+ServletUtils.buildURL(request));
				String versionStr =request.getParameter("version");
				int sourceVersion=StringUtils.convertToInt(versionStr);
				boolean updatelist=false;
				int targetVerion=0;
				File[] files=getXmlDir().listFiles();
				for(File file:files)
				{
					String filename=file.getName();
					filename=filename.substring(0, filename.lastIndexOf("."));
					int fileVersion=StringUtils.convertToInt(filename);
					if(targetVerion<fileVersion)
						targetVerion=fileVersion;
				}
				if(sourceVersion<targetVerion)
					updatelist=true;
				String localAddr=request.getLocalAddr();
				response.setStatus(200);
				StringBuilder json=new StringBuilder();
				json.append("{updatelist:").append(updatelist);
				if(updatelist)
					json.append(",version:").append(targetVerion).append(",downUrl:\"http://").append(localAddr).append("/kefu/xdownload/").append(targetVerion).append("\"");
				String newIP=KefuConfig.kefuConfig.getNewIP();
				if(!StringUtils.isEmpty(newIP))
					json.append(",newurl:\"http://"+newIP+"\"");
				json.append("}");
				ServletUtils.writeText(response, json.toString());
			}catch(VerifyException e)
			{
				log.error(e.getMessage(),e);
				response.sendError(400,e.getMessage());
			}
		}
		else
		{
			try
			{
				String versionStr = uri.substring("/kefu/xdownload".length());
				StringUtils.checkNotNull("version", versionStr);
				File appFile=new File(getXmlDir(),versionStr+".xml");
				if(!appFile.exists())
				{
					log.warn("文件不存在,uri:"+uri);
					response.sendError(404, "文件不存在");
				}
				else
				{
					response.setStatus(200);
					writeFile(request,response,appFile);
				}
			}catch(VerifyException e)
			{
				log.error(e.getMessage(),e);
				response.sendError(400,e.getMessage());
			}
		}
	}
	private void writeFile(HttpServletRequest request,HttpServletResponse response,File file)
	{
		OutputStream outputStream=null;
		InputStream inputStream=null;
		try
		  {
	         response.setContentType(request.getContentType());
	         response.setHeader("Content-Disposition", "attachment; filename=" + file.getName());
	         response.addHeader("Content-Length", String.valueOf(file.length()));
	         outputStream = response.getOutputStream();
	         inputStream = new FileInputStream(file);
	         byte[] buffer = new byte[1024];
	         int i = -1;
	         while ((i = inputStream.read(buffer)) != -1) {
	          outputStream.write(buffer, 0, i);
	         }
	         outputStream.flush();
		  }
		  catch(Exception e)
		  {
		   log.error(e.getMessage(),e);
		  }
		finally
		{
			try {
				if(inputStream!=null)
				inputStream.close();
			} catch (IOException e) {
			}
			try {
				if(outputStream!=null)
					outputStream.close();
			} catch (IOException e) {
			}
		}
	}
}
