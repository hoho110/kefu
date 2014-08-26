package com.cnebula.kefu.server.servlet;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cnebula.kefu.server.KefuConfig;
import com.cnebula.kefu.server.tools.ServletUtils;

@Controller
public class AppUploadServlet{
	private static File appDir=null;
	private static File xmlDir=null;
	private static File tempDir=null;
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
	private File getTempDir()
	{
		if(tempDir!=null)
			return tempDir;
		tempDir=new File(KefuConfig.kefuConfig.getDataLocation(),"temp");
		if(!tempDir.exists()){
			tempDir.mkdirs();
		}
		return tempDir;
	}
	@RequestMapping(value={"/kefu/upload"})
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	    // 解析 request，判断是否有上传文件  
	    boolean isMultipart = ServletFileUpload.isMultipartContent(request);  
	    if(!isMultipart){
	    	response.sendError(400, "非法的multipart配置");
	    }
	    String uri=request.getRequestURI();
	    File storeDir=null;
		if(uri.lastIndexOf("xml")>=0)
		{
			storeDir=getXmlDir();
		}
		else
		{
			storeDir=getAppDir();
		}
	    FileItemFactory factory=new DiskFileItemFactory(2048,getTempDir());
        ServletFileUpload upload = new ServletFileUpload(factory);  
         // 设置路径、文件名的字符集  
        upload.setHeaderEncoding("UTF-8");  
        // 设置允许用户上传文件大小,单位:字节  
        upload.setSizeMax(1024*1024*1024);  //最大限制1G
        // 得到所有的表单域，它们目前都被当作FileItem  
         List<FileItem> fileItems;
		try {
			fileItems = upload.parseRequest(request);
			if(fileItems==null||fileItems.size()==0)
				throw new Exception("fileItems项为空");
			for (FileItem item : fileItems) {
				if (item.isFormField())
					continue;
				// 如果item是文件上传表单域
				// 获得文件名及路径
				String fileName = item.getName();
				if (fileName== null) 
					continue;
				String version=fileName.substring(0,fileName.lastIndexOf("."));
				if(!version.matches("[0-9]+"))
				{
					response.sendError(902, "文件名必须为数字");
					return ;
				}
				// 如果文件不存在则上传
				File uploadFile=new File(storeDir,fileName);
				if(uploadFile.exists())
				{
					response.sendError(901, "文件:"+fileName+"已存在");
					return ;
				}
				uploadFile.createNewFile();
				item.write(uploadFile);
				System.out.println("文件" + uploadFile.getName()+ "上传成功");
			}
			response.setStatus(200);
			ServletUtils.writeText(response, "上传成功");
		} catch (Exception e) {
			log.error(e.getMessage(),e);
			response.sendError(403, e.getMessage());
		}  
	}
}
