package com.cnebula.kefu.server.servlet;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
@Controller
public class RedirectServlet {
	@RequestMapping(value={"/admin"})
	protected void service(HttpServletRequest request, HttpServletResponse response)
	{
		try {
			response.sendRedirect("/view/login.html");
		} catch (IOException e) {
			e.printStackTrace();
		} 
	}
}
