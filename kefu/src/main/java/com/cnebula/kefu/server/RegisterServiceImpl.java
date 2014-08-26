package com.cnebula.kefu.server;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cnebula.kefu.service.IRegisterService;
import com.cnebula.kefu.service.db.IDataSource;
import com.cnebula.kefu.service.model.Register;
@Service
public class RegisterServiceImpl implements IRegisterService{
	@Autowired
	IDataSource dataSource;
	private Logger log=Logger.getLogger(this.getClass());
	@Override
	public void create(Register register) throws Exception {
		String queryStr="terminalType='"+register.getTerminalType()+"' and imeiNum='"+register.getImeiNum()+"'";
		List<Register> l=dataSource.find(queryStr, Register.class);
		if(l!=null&&l.size()>0)
			return;
		dataSource.create(register);
	}
	@Override
	public int count(long startTime,long endTime) throws Exception {
		Connection conn=dataSource.getDataSource();
		StringBuilder sql=new StringBuilder();
		sql.append("select count(*) from "+Register.class.getSimpleName());
		StringBuilder conditions=new StringBuilder();
		if(startTime!=-1)
		{
			if(conditions.length()!=0)
				conditions.append(" and ");
			conditions.append("createTime>=").append("?");
		}
		if(endTime!=-1)
		{
			if(conditions.length()!=0)
				conditions.append(" and ");
			conditions.append("createTime<=").append("?");
		}
		if(conditions.length()!=0)
			sql.append(" where ").append(conditions);
		PreparedStatement stmt=null;
		ResultSet rs=null;
		try
		{
			stmt = conn.prepareStatement(sql.toString());
			if(startTime!=-1)
				stmt.setDate(1, new java.sql.Date(startTime));
			if(endTime!=-1)
			{
				if(startTime!=-1)
					stmt.setDate(2, new java.sql.Date(endTime));
				else
					stmt.setDate(1, new java.sql.Date(endTime));
			}
			rs = stmt.executeQuery();
			while (rs.next()) {
				return rs.getInt(1);
			}
		}catch(Exception e)
		{
			log.error(e.getMessage(),e);
		}finally
		{
			try {
				if(rs!=null)
					rs.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			try {
				if(stmt!=null)
				stmt.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return 0;
	}
}
