package com.cnebula.kefu.server.tools;

public class StringUtils {
	public static String checkNotNull(String name,String value) throws VerifyException
	{
		if(value==null||value.trim().length()==0)
			throw new VerifyException(name+" must not be null");
		return value.trim();
	}
	public static String modify(String value)
	{
		if(value==null)
			return "";
		return value.trim();
	}
	public static boolean isEmpty(String value)
	{
		if(value==null||value.trim().length()==0)
			return true;
		return false;
	}
	public static int convertToInt(String value) throws VerifyException
	{
		try{
			return Integer.parseInt(value);
		}catch(Throwable e)
		{
			throw new VerifyException(e.getMessage());
		}
	}
}
