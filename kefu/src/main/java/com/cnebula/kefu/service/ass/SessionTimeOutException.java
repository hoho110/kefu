package com.cnebula.kefu.service.ass;


public class SessionTimeOutException extends Exception {
	private static final long serialVersionUID = 1L;

	public SessionTimeOutException() {
		super();
	}

	public SessionTimeOutException(String message) {
		super(message);
	}

	public SessionTimeOutException(String message, Exception e) {
		super(message, e);
	}

	@Override
	public String toString() {
		return this.getMessage();
	}
}
