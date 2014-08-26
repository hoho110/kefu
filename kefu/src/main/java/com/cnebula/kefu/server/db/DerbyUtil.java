package com.cnebula.kefu.server.db;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;


public class DerbyUtil {
	public static String DB_DRIVER = "org.apache.derby.jdbc.EmbeddedDriver";
	public static String DB_NAME = "localdb";
	static Connection conn = null;
	static String dbDir = null;
	static String sqlDir =null;
	private static Logger log=Logger.getLogger(DerbyUtil.class);
	/**
	 * 得到数据库连接
	 * @param dbDir: dir of the db
	 * @return
	 * @throws ClassNotFoundException 
	 * @throws SQLException
	 */
	private synchronized static Connection getConn() throws ClassNotFoundException, SQLException 
    {
		Class.forName(DB_DRIVER);
		if(conn==null){
			conn = DriverManager.getConnection("jdbc:derby:"+dbDir);
			conn.setAutoCommit(false);
		}
        return conn;
    }

	/**
	 * 查询数据库，返回结果集
	 * @param sql：查询语句
	 * @param cls：记录对应的实体类型
	 * @param dbDir: dir of the db
	 * @return
	 * @throws SQLException
	 * @throws ClassNotFoundException
	 */
	public static  List query(String sql, Class cls) throws SQLException, ClassNotFoundException{
		List result = new ArrayList();
		Statement stmt = null;
		try {
			stmt = DerbyUtil.getConn().createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			int count = rs.getMetaData().getColumnCount();
			String columnName;
			while(rs.next()){
				Object obj = cls.newInstance();
				Method[] methods = obj.getClass().getMethods();
				for(int i=1;i<count+1;i++){
					ResultSetMetaData rsm = rs.getMetaData();
					columnName = rs.getMetaData().getColumnName(i);
					for (Method m : methods) {
						if (m.getName().equalsIgnoreCase("set" + columnName)) {
							Class para = m.getParameterTypes()[0];
							if (String.class.equals(para)) {
								m.invoke(obj, rs.getString(i));
							} else if (Date.class.equals(para)) {
								m.invoke(obj, rs.getDate(i));
							} else if (boolean.class.equals(para)) {
								if("true".equals(rs.getString(i))){
									m.invoke(obj, true);
								}else if("false".equals(rs.getString(i))){
									m.invoke(obj, false);
								}
							} else if (long.class.equals(para)) {
								m.invoke(obj, rs.getLong(i));
							} else if (int.class.equals(para)) {
								m.invoke(obj, rs.getInt(i));
							}else if(byte[].class.equals(para)){
								m.invoke(obj, rs.getBytes(i));
							}
							break;
						}
					}
				}
				//System.out.println(((UserBean)obj).getId()+"---"+((UserBean)obj).getName()+"---"+((UserBean)obj).getD());
				result.add(obj);
			}
			rs.close();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		} catch (InstantiationException e) {
			e.printStackTrace();
		}	
		stmt.close();
		return result;
	}

	/**
	 * 删改方法
	 * @param sql
	 * @param dbDir: dir of the db
	 */
	public static boolean update(String sql){
		Statement stmt = null;
		boolean b = true;
		try {
			stmt = DerbyUtil.getConn().createStatement();			
			stmt.executeUpdate(sql);
			conn.commit();
			stmt.close();
		} catch (SQLException e) {
			b = false;
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			b = false;
			e.printStackTrace();
		}
		return b;
	}
	
	/**
	 * 批量删改方法
	 * @param sql
	 * @param dbDir: dir of the db
	 */
	public static boolean update(List<String> sqls){
		Statement stmt = null;
		boolean b = true;
		try {
			stmt = DerbyUtil.getConn().createStatement();
			for(String sql:sqls){
				stmt.executeUpdate(sql);
			}
			conn.commit();
			stmt.close();
		} catch (SQLException e) {
			b = false;
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			b = false;
			e.printStackTrace();
		}
		return b;
	}
	
	/**
	 * 增加方法
	 * @param sql
	 * @param cls
	 * @param idName：如果id不是自动生成，则传入null参数
	 * @param dbDir: dir of the db
	 * @return
	 */
	public static String insert(String sql, Class cls, String idName){
		Statement stmt = null;
		ResultSet rs = null;
		String rt = "";
		String tab = cls.getSimpleName();
		try {
			stmt = DerbyUtil.getConn().createStatement();
			stmt.executeUpdate(sql);
			conn.commit();
			if(idName!=null){
				String sql2 = "select a."+idName+" from "+tab+" a order by a."+idName+" desc";
				rs = stmt.executeQuery(sql2);
				while(rs.next()){
					rt = rs.getString(idName);
					break;
				}
			}
			stmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return rt;
	}
	
	/**
	 * 批量插入时调用
	 * @param sqls: 批量执行的sql语句
	 * 
	 */
	public static void insert(List<String> sqls){
		Statement stmt = null;
		try {
			stmt = DerbyUtil.getConn().createStatement();
			for(String sql:sqls){
				stmt.executeUpdate(sql);
			}
			conn.commit();
			stmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 初始化数据库
	 * @param initSQLFile 初始化文件
	 */
	public static void initDB(File initSQLFile){
		initDir();
		File dbFolder = new File(dbDir);
		if(!dbFolder.exists()){ //数据库不存在，则执行初始化工作
			System.out.println("开始执行数据库初始化脚本");
			try {
				conn = DriverManager.getConnection("jdbc:derby:"+dbDir+";create=true");
				conn.setAutoCommit(false);
				Statement s = conn.createStatement();
				File sqlFile = new File(sqlDir);
				BufferedReader reader = null;
				reader =new BufferedReader(new FileReader(sqlFile));
				String line;
				  while ((line = reader.readLine()) != null) {
					  log.info(line);
					  s.execute(line);
				  }
				conn.commit();
			} catch (SQLException e) {
				e.printStackTrace();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}	
	}	
	
	public static void initDir(){
		String appdir =System.getProperty("user.dir");
		dbDir = appdir+File.separator+"meta"+File.separator+DB_NAME;
		if(!new File(appdir+File.separator+"meta").exists()){
			new File(appdir+File.separator+"meta").mkdirs();
		}
		sqlDir = appdir+File.separator+"conf"+File.separator+"create.sql";
		
	}

}
