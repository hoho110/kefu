package com.cnebula.kefu.server;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.core.io.Resource;

import com.cnebula.kefu.service.IDistrictService;
import com.cnebula.kefu.service.model.District;

public class DistrictServiceImpl implements IDistrictService {
	private Logger log=Logger.getLogger(DistrictServiceImpl.class);
	private Resource cityLocation;
	private List<District> districts=new ArrayList<District>();
	public Resource getCityLocation() {
		return cityLocation;
	}

	public void setCityLocation(Resource cityLocation) {
		this.cityLocation = cityLocation;
	}

	@Override
	public List<District> findAll() {
		return districts;
	}
	@PostConstruct
	protected void init() throws IOException {
		File file=cityLocation.getFile();
        BufferedReader br=null;
        InputStreamReader isr=null;
        try
        {
        	isr= new InputStreamReader(new FileInputStream(file), "UTF-8"); 
        	br=new BufferedReader(isr);
        	 String line=null;
        	 while ((line=br.readLine())!=null) {
        		 if(line.trim().length()==0)
        			 continue;
        		 District district=new District();
        		 district.setCode(line.substring(0, 6));
        		 district.setName(line.substring(7).trim());
        		 districts.add(district);
        		 log.info("加载:"+district);
             }
        	 log.info("加载省市信息完毕");
        }catch(Exception e)
        {
        	log.error(e.getMessage(),e);
        }
        finally
        {
        	if(br!=null)
				try {br.close();} catch (IOException e) {}
			if(isr!=null)
				try {isr.close();} catch (IOException e) {}
        }
	}
}
