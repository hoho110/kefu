package com.easyservice.test;

import java.util.List;

public interface IUserService {
	public User find(String id);
	public List<User> findAll();
	public void create(User user);
}
