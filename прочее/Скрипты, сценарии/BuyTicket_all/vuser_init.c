vuser_init()
{
//	
//	/*Correlation comment - Do not change!  Original value='129182.290643985zzttiVtpAHfDQizipiittf' Name ='userSession' Type ='ResponseBased'*/
//		web_reg_save_param_attrib(
//			"ParamName=userSession",
//			"TagName=input",
//			"Extract=value",
//			"Name=userSession",
//			"Type=hidden",
//			SEARCH_FILTERS,
//			"IgnoreRedirections=No",
//			"RequestUrl=*/nav.pl*",
//			LAST);
//
//		//Проверка соответсвия на корректности загрузки страницы
//		web_reg_find("Text=Welcome to the Web Tours site", LAST);
//		
//		web_url("WebTours",
//			"URL=http://localhost:1080/WebTours/", 
//			"TargetFrame=", 
//			"Resource=0", 
//			"RecContentType=text/html", 
//			"Referer=", 
//			"Snapshot=t1.inf", 
//			"Mode=HTML", 
//			LAST);		
//
//			//Проверка соответсвия на корректности загрузки страницы
//			web_reg_find("Text=User password was correct", LAST);
//			
//			web_submit_data("login.pl",
//				"Action=http://localhost:1080/cgi-bin/login.pl",
//				"Method=POST",
//				"TargetFrame=body",
//				"RecContentType=text/html",
//				"Referer=http://localhost:1080/cgi-bin/nav.pl?in=home",
//				"Snapshot=t2.inf",
//				"Mode=HTML",
//				ITEMDATA,
//				"Name=userSession", "Value={userSession}", ENDITEM,
//				"Name=username", "Value={User_Login}", ENDITEM,
//				"Name=password", "Value={User_Pass}", ENDITEM,
//				"Name=JSFormSubmit", "Value=off", ENDITEM,
//				"Name=login.x", "Value=60", ENDITEM,
//				"Name=login.y", "Value=9", ENDITEM,
//				LAST);		
//			web_set_sockets_option("SSL_VERSION", "AUTO");	
//
//			lr_save_string(lr_eval_string("{User_Login}"), "user");
//			lr_save_string(lr_eval_string("{User_Pass}"), "pass");
//			lr_save_string(lr_eval_string("{User_Name}"), "Name");
//			lr_save_string(lr_eval_string("{User_FirstName}"), "FirstName");
//			lr_save_string(lr_eval_string("{User_Sity}"), "Sity");
//			lr_save_string(lr_eval_string("{User_Street}"), "Street");
//
//			lr_output_message(lr_eval_string("{User_Login}"));
//	
	return 0;
}
