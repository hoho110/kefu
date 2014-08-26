package com.cnebula.kefu.server.db;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.cnebula.kefu.server.KefuConfig;
import com.cnebula.kefu.server.tools.StringUtils;
import com.cnebula.kefu.service.db.IDataSource;
public class DerbyDataSourceImpl implements	IDataSource{
	public static String DB_DRIVER = "org.apache.derby.jdbc.EmbeddedDriver";
	public static String DB_NAME = "localdb";
	private static Connection conn = null;
	private static String dbPath = null;
	private static Logger log = Logger.getLogger(DerbyDataSourceImpl.class);
	private String dataLocation="";
	private String newIP="";
	private Resource initSQLLocation;//权限配置文件路径
	public Resource getInitSQLLocation() {
		return initSQLLocation;
	}
	public void setInitSQLLocation(Resource initSQLLocation) {
		this.initSQLLocation = initSQLLocation;
	}
	public String getDataLocation() {
		return dataLocation;
	}
	public void setDataLocation(String dataLocation) {
		this.dataLocation = dataLocation;
	}
	public String getNewIP() {
		return newIP;
	}
	public void setNewIP(String newIP) {
		this.newIP = newIP;
	}
	/**
	 * 得到数据库连接
	 * @param dbDir: dir of the db
	 * @return
	 * @throws ClassNotFoundException 
	 * @throws SQLException
	 */
	private synchronized static Connection getConn() throws ClassNotFoundException, SQLException 
    {
		if(conn==null){
			Class.forName(DB_DRIVER);
			conn = DriverManager.getConnection("jdbc:derby:"+dbPath);
			conn.setAutoCommit(false);
		}
        return conn;
    }
	@PostConstruct
	protected  void init() throws IOException
	{
		KefuConfig.kefuConfig=new KefuConfig();
		KefuConfig.kefuConfig.setDataLocation(dataLocation);
		KefuConfig.kefuConfig.setNewIP(newIP);
		//初始化路径
		String appdir =KefuConfig.kefuConfig.getDataLocation();
		dbPath = appdir+File.separator+DB_NAME;
		File dbDir=new File(dbPath);
		if(!dbDir.exists())
		{
			//初始化数据库脚本
//			dbDir.mkdirs();
			File initSQLFile = initSQLLocation.getFile();
			log.info("开始执行数据库初始化脚本");
			BufferedReader reader = null;
			try {
				conn = DriverManager.getConnection("jdbc:derby:"+dbPath+";create=true");
				conn.setAutoCommit(false);
				Statement s = conn.createStatement();
				reader =new BufferedReader(new FileReader(initSQLFile));
				String line;
				  while ((line = reader.readLine()) != null) {
					  log.info(line);
					  s.execute(line);
				  }
				conn.commit();
			} catch (Throwable e)
			{
				log.error("初始化数据库脚本失败");
				log.error(e.getMessage(),e);
				System.exit(-1);
				dbDir.delete();
			}
			finally
			{
				if(reader!=null)
					try {
						reader.close();
					} catch (IOException e) {
					}
			}
		}
	}
	@Override
	public void create(Object obj) throws Exception {
		StringBuilder header=new StringBuilder();
		StringBuilder tailer=new StringBuilder();
		Method[] methods = obj.getClass().getDeclaredMethods();
		List<Object> params=new ArrayList<Object>();
		for (Method m : methods) {
			if (m.getName().startsWith("get")&&!m.getName().equals("getId")) {
				String fieldName = m.getName().substring(3);
				if(header.length()!=0)
					header.append(",");
				header.append(fieldName);
				if(tailer.length()!=0)
					tailer.append(",");
				Object value=m.invoke(obj, null);
				params.add(value);
				tailer.append("?");
			}
		}
		String sql="insert into "+obj.getClass().getSimpleName()+"("+header.toString()+") values ("+tailer.toString()+")";
		PreparedStatement stmt = null;
		try
		{
			stmt = getConn().prepareStatement(sql);
			for(int i=0;i<params.size();i++)
			{
				Object value=params.get(i);
				if (String.class.equals(value.getClass()) ) {
					stmt.setString(i+1, String.valueOf(value));
				}else if (int.class.equals(value.getClass())) {
					stmt.setInt(i+1, (Integer)value);
				}else if(Long.class.equals(value.getClass()))
				{
					stmt.setDate(i+1,new java.sql.Date((Long)value));
				}
				else
				{
					stmt.setObject(i+1, value);
				}
			}
			stmt.execute();
			conn.commit();
		}finally
		{
			close(stmt);
		}
	}
	@Override
	public void update(Object obj,int id) throws Exception {
		StringBuilder sql=new StringBuilder();
		Method[] methods = obj.getClass().getDeclaredMethods();
		List<Object> params=new ArrayList<Object>();
		for (Method m : methods) {
			if (m.getName().startsWith("get")&&!m.getName().equals("getId")) {
				String fieldName = m.getName().substring(3);
				if(sql.length()!=0)
					sql.append(",");
				sql.append(fieldName).append("=");
				Object value=m.invoke(obj, null);
				params.add(value);
				sql.append("?");
			}
		}
		PreparedStatement stmt = null;
		try
		{
			stmt = getConn().prepareStatement("update "+obj.getClass().getSimpleName()+" set "+sql.toString()+" where id="+id);
			for(int i=0;i<params.size();i++)
			{
				Object value=params.get(i);
				if (String.class.equals(value.getClass()) ) {
					stmt.setString(i+1, String.valueOf(value));
				}else if (int.class.equals(value.getClass())) {
					stmt.setInt(i+1, (Integer)value);
				}else if(Long.class.equals(value.getClass()))
				{
					stmt.setDate(i+1,new java.sql.Date((Long)value));
				}
				else
				{
					stmt.setObject(i+1, value);
				}
			}
			stmt.execute();
			conn.commit();
		}finally
		{
			close(stmt);
		}
	}
	@Override
	public void delete(Class cls, int id) throws Exception {
		Statement stmt = null;
		try
		{
			stmt = getConn().createStatement();
			String sql="delete from "+cls.getSimpleName()+" where id="+id;
			stmt.executeUpdate(sql);
			conn.commit();
		}finally
		{
			close(stmt);
		}
	}
	@Override
	public <T> List<T> findAll(Class<T> cls) throws Exception {
		return find(null,cls);
	}
	@Override
	public <T> T find(int id, Class<T> cls) throws Exception {
		Statement stmt = null;
		ResultSet rs = null;
		T obj = null;
		try {
			stmt = getConn().createStatement();
			String sql = "select * from " + cls.getSimpleName() + " where id=" + id;
			rs = stmt.executeQuery(sql);
			while (rs.next()) {
				obj = cls.newInstance();
				Method[] methods = cls.getMethods();
				for (Method m : methods) {
					if (m.getName().startsWith("set")) {
						String fieldName = m.getName().substring(3);
						Class para = m.getParameterTypes()[0];
						if (String.class.equals(para)) {
							m.invoke(obj, rs.getString(fieldName));
						} else if (Date.class.equals(para)) {
							m.invoke(obj, rs.getDate(fieldName));
						} else if (boolean.class.equals(para)) {
							if ("true".equals(rs.getString(fieldName))) {
								m.invoke(obj, true);
							} else if ("false".equals(rs.getString(fieldName))) {
								m.invoke(obj, false);
							}
						} else if (long.class.equals(para)) {
							m.invoke(obj, rs.getDate(fieldName).getTime());
						} else if (int.class.equals(para)) {
							m.invoke(obj, rs.getInt(fieldName));
						} else if (byte[].class.equals(para)) {
							m.invoke(obj, rs.getBytes(fieldName));
						}
					}
				}
			}
		} finally {
			close(rs);
			close(stmt);
		}
		return obj;
	}
	
	private void close(Statement stmt)
	{
		try {
			if(stmt!=null)
			stmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	private void close(ResultSet rs)
	{
		try {
			if(rs!=null)
				rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	@Override
	public <T> List<T> find(String queryStr, Class<T> cls) throws Exception {
		String sql="select * from "+cls.getSimpleName();
		if(queryStr!=null&&queryStr.trim().length()>0)
			sql+=" where "+queryStr;
		Statement stmt = null;
		ResultSet rs = null;
		List<T> objs = new ArrayList<T>();
		try {
			stmt = getConn().createStatement();
			rs = stmt.executeQuery(sql);
			while (rs.next()) {
				T obj = cls.newInstance();
				Method[] methods = cls.getDeclaredMethods();
				for (Method m : methods) {
					if (m.getName().startsWith("set")) {
						String fieldName = m.getName().substring(3);
						Class para = m.getParameterTypes()[0];
						if (String.class.equals(para)) {
							m.invoke(obj, rs.getString(fieldName));
						} else if (Date.class.equals(para)) {
							m.invoke(obj, rs.getDate(fieldName));
						} else if (boolean.class.equals(para)) {
							if ("true".equals(rs.getString(fieldName))) {
								m.invoke(obj, true);
							} else if ("false".equals(rs.getString(fieldName))) {
								m.invoke(obj, false);
							}
						} else if (long.class.equals(para)) {
							m.invoke(obj, rs.getDate(fieldName).getTime());
						} else if (int.class.equals(para)) {
							m.invoke(obj, rs.getInt(fieldName));
						} else if (byte[].class.equals(para)) {
							m.invoke(obj, rs.getBytes(fieldName));
						}
					}
				}
				objs.add(obj);
			}
		} finally {
			close(rs);
			close(stmt);
		}
		return objs;
	}
	@Override
	public <T> int count(Class<T> cls) throws Exception {
		return count(cls, null);
	}
	@Override
	public Connection getDataSource() throws Exception {
		return getConn();
	}
	@Override
	public <T> int count(Class<T> cls, String queryStr) throws Exception {
		Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = getConn().createStatement();
			String sql = "select count(*) from " + cls.getSimpleName();
			if(!StringUtils.isEmpty(queryStr))
				sql+=" where "+queryStr;
			rs = stmt.executeQuery(sql);
			while (rs.next()) {
				return rs.getInt(1);
			}
		} finally {
			close(rs);
			close(stmt);
		}
		return 0;
	}
	@Override
	public <T> void delete(String queryStr, Class<T> cls) throws Exception {
		Statement stmt = null;
		try {
			stmt = getConn().createStatement();
			String sql = "delete from " + cls.getSimpleName();
			if(!StringUtils.isEmpty(queryStr))
				sql+=" where "+queryStr;
			stmt.executeUpdate(sql);
			conn.commit();
		} finally {
			close(stmt);
		}
	}
}
