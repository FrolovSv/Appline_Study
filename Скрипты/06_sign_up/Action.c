Action()
{

	// Запускать скрипт для создания новой базы пользователей. Старые даныне не затираются!!!!
	
	web_url("WebTours", 
		"URL=http://localhost:1080/WebTours/", 
		"TargetFrame=", 
		"Resource=0", 
		"RecContentType=text/html", 
		"Referer=", 
		"Snapshot=t1.inf", 
		"Mode=HTML", 
		LAST);

	web_set_sockets_option("SSL_VERSION", "AUTO");

	lr_think_time(94);

	web_url("sign up now", 
		"URL=http://localhost:1080/cgi-bin/login.pl?username=&password=&getInfo=true", 
		"TargetFrame=body", 
		"Resource=0", 
		"RecContentType=text/html", 
		"Referer=http://localhost:1080/WebTours/home.html", 
		"Snapshot=t2.inf", 
		"Mode=HTML", 
		LAST);

	lr_think_time(57);

	
	//Проверка соответсвия на корректности загрузки страницы
			web_reg_find("Text=for registering and welcome to the Web Tours family",
				LAST);
	web_submit_data("login.pl", 
		"Action=http://localhost:1080/cgi-bin/login.pl", 
		"Method=POST", 
		"TargetFrame=info", 
		"RecContentType=text/html", 
		"Referer=http://localhost:1080/cgi-bin/login.pl?username=&password=&getInfo=true", 
		"Snapshot=t3.inf", 
		"Mode=HTML", 
		ITEMDATA, 
		"Name=username", "Value={User_Login}", ENDITEM, 
		"Name=password", "Value={User_Pass}", ENDITEM, 
		"Name=passwordConfirm", "Value={User_Pass}", ENDITEM, 
		"Name=firstName", "Value={User_FirstName}", ENDITEM, 
		"Name=lastName", "Value={User_Name}", ENDITEM, 
		"Name=address1", "Value={User_Street}", ENDITEM, 
		"Name=address2", "Value={User_Sity}", ENDITEM, 
		"Name=register.x", "Value=41", ENDITEM, 
		"Name=register.y", "Value=5", ENDITEM, 
		LAST);

	web_url("button_next.gif", 
		"URL=http://localhost:1080/cgi-bin/welcome.pl?page=menus", 
		"TargetFrame=body", 
		"Resource=0", 
		"RecContentType=text/html", 
		"Referer=http://localhost:1080/cgi-bin/login.pl", 
		"Snapshot=t4.inf", 
		"Mode=HTML", 
		LAST);

	lr_think_time(5);

	web_url("SignOff Button", 
		"URL=http://localhost:1080/cgi-bin/welcome.pl?signOff=1", 
		"TargetFrame=body", 
		"Resource=0", 
		"RecContentType=text/html", 
		"Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home", 
		"Snapshot=t5.inf", 
		"Mode=HTML", 
		LAST);

	return 0;
}