package com.cnebula.kefu.server.tools;

import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ServletUtils {
	public static final  String CHARSET="UTF-8";
	public static void writeText(HttpServletResponse response,String text)
	{
		response.setContentType("text/html");
		response.setCharacterEncoding(CHARSET);
		PrintWriter writer=null;
		try
		{
			response.getWriter();
			response.getWriter().write(text);
		}catch(Exception e)
		{
			e.printStackTrace();
		}finally
		{
			if(writer!=null)
				writer.close();
		}
	}
	public static String buildURL(HttpServletRequest request)
	{
		StringBuilder sb=new StringBuilder();
		sb.append(request.getRequestURL().toString()).append("?");
		Map<Object,Object[]> params=request.getParameterMap();
		if(params==null||params.isEmpty())
			return sb.toString();
		for(Object key:params.keySet())
		{
			sb.append(key).append("=").append((params.get(key))[0]).append("&");
		}
		return sb.toString();
	}
}
