package com.easyservice;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.easyservice.exception.PermissionException;
import com.easyservice.exception.ProtocolParseException;
import com.easyservice.security.IAuthorityValidateService;
import com.easyservice.service.IProtocolBinding;
import com.easyservice.service.IRemoteServiceRegister;
import com.easyservice.support.EasyServiceConstant;
import com.easyservice.support.HttpParse;
import com.easyservice.support.MangleClassInfo;
import com.easyservice.support.MangleClassInfoPool;
import com.easyservice.support.MethodDescriptor;
import com.easyservice.support.ParamDescriptor;
import com.easyservice.support.ParamList;
import com.easyservice.support.ServiceRequest;
import com.easyservice.support.ServiceResponse;
import com.easyservice.support.ServiceResponse.ExceptionType;
import com.easyservice.utils.ApplicationContextUtil;

@Controller
public class HttpTransport {
	private static Logger logger = Logger.getLogger(HttpTransport.class);
	@Autowired
	IAuthorityValidateService authorityValidateService;
	@Autowired
	IRemoteServiceRegister register;
	protected static final String HEADER_IFMODSINCE = "If-Modified-Since";
	protected static final String HEADER_IFNONEMATCH = "If-None-Match";
	protected static final String HEADER_LASTMOD = "Last-Modified";
	Map<String, MethodDescriptor[]> caches = new ConcurrentHashMap<String, MethodDescriptor[]>();
	MangleClassInfoPool mangleClassInfoPool = MangleClassInfoPool.getDefault();

	@RequestMapping(value={"/easyservice/{interface}","/easyservice/{interface}/{method}"})
	public void service(HttpServletRequest req, HttpServletResponse resp) {

		// 处理阶段
		// 1.请求解析生成请求描述，根据requestURI以及参数（包括header）解析出->a.请求协议;b.请求服务/请求Sdl;c.请求服务接口

		// 2.根据请求协议调取协议绑定服务，输入请求描述->请求服务描述

		// 3.根据服务描述调用服务方法执行，然后生成服务响应描述

		// 4.根据请求协议调用协议绑定服务，输入服务响应描述，写回结果
		ServiceRequest serviceRequest = null;
		ServiceResponse serviceResponse = new ServiceResponse();
		try {
			HttpParse parse = new HttpParse(req, resp);
			IProtocolBinding protocolBinding = register.lookupBinding(parse.getBindingProtocol());
			if (protocolBinding == null) {
				if (protocolBinding == null) {
//					serviceResponse.setExceptionType(ExceptionType.ET_SE_PROTOCOL_NOT_SUPPORT);
//					serviceResponse.setException(new UnsupportedOperationException("can not find provider for protocol : " + parse.getBindingProtocol()));
					logger.warn(ExceptionType.ET_SE_BINDING_NOT_SUPPORT + "", new UnsupportedOperationException("can not find binding for protocol : " + parse.getBindingProtocol()));
					return;
				}
			}
			try {
				 HttpSession session=req.getSession();
				 Object	 user=session.getAttribute(EasyServiceConstant.SESSION_ATTRIBUTENAME_USER);
				if (parse.isFetchSdl()) {
					if(authorityValidateService==null)
					{
						logger.warn(parse.getInterfaceName()+"'sdl is requested.IAuthorityValidateService is null,authorityValidate is disabled.");
					}
					else
					{
						if(!authorityValidateService.checkPermission(user, true, parse.getInterfaceName(), null))
						{
							serviceResponse.setException(new PermissionException());
							serviceResponse.setExceptionType(ExceptionType.ET_SE_NO_PERMISSION);
							protocolBinding.replyResponse(parse, serviceResponse);
							return;
						}
					}
					long ifModifiedSince = req.getDateHeader(HEADER_IFMODSINCE);
					Class clz;
					try {
						clz = protocolBinding.getInterfaceClass(parse.getInterfaceName());
					} catch (ClassNotFoundException e) {
						resp.sendError(HttpServletResponse.SC_NOT_FOUND);
						return;
					}
					long lastModified = clz.getResource(clz.getSimpleName() + ".class").openConnection().getLastModified();
					// for purposes of comparison we add 999 to ifModifiedSince
					// since the fidelity
					// of the IMS header generally doesn't include milli-seconds
					if (ifModifiedSince > -1 && lastModified > 0 && lastModified <= (ifModifiedSince + 999)) {
						resp.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
						return;
					}
					if (lastModified > 0) {
						resp.setDateHeader(HEADER_LASTMOD, lastModified);
					}
					if (req.getQueryString().indexOf("&v") > 0) {
						resp.setDateHeader("Expires", System.currentTimeMillis() + 3650L * 24 * 60 * 60 * 1000);
					}
					parse.setAttribute("requestId", parse.getRequestURL().getTransportUrl());
					parse.setAttribute("callback", "EasyServiceClient._remoteProxyRegisterFromServer");
					MethodDescriptor[] mds = queryMethodDescriptors(null, clz);
					serviceResponse.setResult(mds);
					protocolBinding.replyResponse(parse, serviceResponse);
					return;
				}
				serviceRequest = protocolBinding.getRequest(parse);
				if(authorityValidateService==null)
				{
					logger.warn(parse.getInterfaceName()+"."+serviceRequest.getMethod().getName()+" is requested.IAuthorityValidateService is null,authorityValidate is disabled.");
				}
				else
				{
					if(!authorityValidateService.checkPermission(user, false, parse.getInterfaceName(), serviceRequest.getMethod().getName()))
					{
						serviceResponse.setException(new PermissionException());
						serviceResponse.setExceptionType(ExceptionType.ET_SE_NO_PERMISSION);
						protocolBinding.replyResponse(parse, serviceResponse);
						return;
					}
				}
				// req.setHttpRequest(RequestContext.getRequest());
				// RequestContext.setRequest(req);
				serviceResponse = innerInvoke(serviceRequest, serviceResponse);
				
			} catch (ProtocolParseException e) {
				serviceResponse.setException(e);
				serviceResponse.setExceptionType(e.getType());
			} catch (Throwable e) {
				serviceResponse.setException(e);
				serviceResponse.setExceptionType(ExceptionType.UNKNOWN);
			}
			if(serviceResponse.getException()!=null)
				logger.error(serviceResponse.getException());
			protocolBinding.replyResponse(parse, serviceResponse);
		} catch (Throwable e) {
			logger.error(e.getMessage(), e);
		}
	}

	private MethodDescriptor[] queryMethodDescriptors(String name, Class requiredType) {

		MethodDescriptor[] rt = caches.get(requiredType.getName());
		if (rt == null) {
			Object s = ApplicationContextUtil.getBean(name, requiredType);
			if (s == null) {
				return null;
			}
			try {
				MangleClassInfo classInfo = mangleClassInfoPool.getMangleClassInfo(requiredType.getName());
				ArrayList<MethodDescriptor> tmplist = new ArrayList<MethodDescriptor>();
				for (Method m : classInfo.getMethods()) {
					MethodDescriptor md = new MethodDescriptor();
					md.setName(m.getName());
					md.setReturnType(m.getReturnType().getName());
					ParamList pl = m.getAnnotation(ParamList.class);
					ParamDescriptor[] pdl = new ParamDescriptor[m.getParameterTypes().length];
					String[] pn = null;
					if (pl != null) {
						pn = pl.value();
					} else {
						pn = new String[m.getParameterTypes().length];
						for (int i = 0; i < pn.length; i++) {
							pn[i] = "" + i;
						}
					}
					for (int i = 0; i < pn.length; i++) {
						ParamDescriptor pd = new ParamDescriptor();
						pd.setName(pn[i]);
						pd.setType(m.getParameterTypes()[i].getName());
						pdl[i] = pd;
					}
					md.setParams(pdl);
					tmplist.add(md);
				}
				rt = new MethodDescriptor[tmplist.size()];
				tmplist.toArray(rt);
				caches.put(requiredType.getName(), rt);
			} catch (ClassNotFoundException e) {
				return null;
			}
		}
		return rt;
	}

	private <Q, R> ServiceResponse<R> innerInvoke(final ServiceRequest<Q> req, ServiceResponse<R> rt) {
		try {
			// 异步
			// if(req.getInterfaceClass().equals(ICometService.class)&&
			// req.getMehtodName().equals("subscribe")){
			// return new AsynSubscribeResponse();
			// }
			Q service = (Q) (ApplicationContextUtil.getBean(req.getTarget(), req.getInterfacClass()));
			if (service == null) {
				rt.setExceptionType(ExceptionType.ET_SE_SERVICE_NOT_FOUND);
				rt.setException(new RuntimeException("can not find service: " + req.getInterfacClass().getName() + " with target=" + req.getTarget()));
			} else {
				rt.setResult((R) req.getMethod().invoke(service, req.getArgs()));
			}
		} catch (Throwable e) {
			if (e instanceof InvocationTargetException) {
				e = ((InvocationTargetException) e).getTargetException();
				rt.setExceptionType(ExceptionType.ET_SE_METHOD_NORMAL_EXCEPTION);
			} else {
				rt.setExceptionType(ExceptionType.ET_SE_INNER_ERROR);
			}
			rt.setException(e);
		}
		return rt;
	}
}
