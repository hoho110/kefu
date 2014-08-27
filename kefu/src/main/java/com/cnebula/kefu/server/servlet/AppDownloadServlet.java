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
import org.springframework.web.bind.annotation.RequestMapping;

import com.cnebula.kefu.server.KefuConfig;
import com.cnebula.kefu.server.tools.ServletUtils;
import com.cnebula.kefu.server.tools.StringUtils;
import com.cnebula.kefu.server.tools.VerifyException;
@Controller
public class AppDownloadServlet{
	private static File appDir=null;
	private static File xmlDir=null;
	Logger log=Logger.getLogger(this.getClass());
	private File getAppDir()
	{
		if(appDir!=null)
			return appDir;
		appDir=new File(KefuConfig.kefuConfig.getDataLocation(),"app");
		if(!appDir.exists()){
			appDir.mkdirs();
		}
		return appDir;
	}
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
	@RequestMapping(value={"/kefu/download/{filename}","/kefu/download/xml/{filename}"})
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding(ServletUtils.CHARSET);
		response.setCharacterEncoding(ServletUtils.CHARSET);
		String uri=request.getRequestURI();
		String filename = uri.substring(uri.lastIndexOf("/")+1);
		try
		{
			StringUtils.checkNotNull("filename", filename);
		    File storeDir=null;
			if(uri.lastIndexOf("xml")>=0)
			{
				storeDir=getXmlDir();
			}
			else
			{
				storeDir=getAppDir();
			}
			File appFile=new File(storeDir,filename);
			if(!appFile.exists())
			{
				response.sendError(404, "文件不存在");
			}
			else
			{
				response.setStatus(200);
				writeFile(request,response,appFile);
			}
		}catch(VerifyException e)
		{
			response.sendError(400,e.getMessage());
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
