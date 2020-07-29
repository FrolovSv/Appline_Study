Action()
{
	//int flightId_Count = 0;
	lr_start_transaction("03_Search_itinerary_delete");
	
		lr_start_transaction("Load_start_Page");
	
			web_reg_save_param_ex(
				"ParamName=userSession",
				"LB=name=\"userSession\" value=\"",
				"RB=\"/>",
				"Ordinal=1",
					SEARCH_FILTERS,
				LAST);	
		
			//ѕроверка соответсви€ на корректность загрузки страницы
			web_reg_find("Text=Welcome to the Web Tours site", LAST);
			
			web_url("WebTours",
				"URL=http://localhost:1080/WebTours/", 
				"TargetFrame=", 
				"Resource=0", 
				"RecContentType=text/html", 
				"Referer=", 
				"Snapshot=t1.inf", 
				"Mode=HTML", 
				LAST);
					
		lr_end_transaction("Load_start_Page", LR_AUTO);
		
		//ожидание от пользовател€ ввода login pass	
		lr_think_time(5);
					
	
		lr_start_transaction("login_user");			
			//ѕроверка соответсви€ на корректность загрузки страницы
			web_reg_find("Text=User password was correct", LAST);
			
			web_submit_data("login.pl",
				"Action=http://localhost:1080/cgi-bin/login.pl",
				"Method=POST",
				"TargetFrame=body",
				"RecContentType=text/html",
				"Referer=http://localhost:1080/cgi-bin/nav.pl?in=home",
				"Snapshot=t2.inf",
				"Mode=HTML",
				ITEMDATA,
				"Name=userSession", "Value={userSession}", ENDITEM,
				"Name=username", "Value={User_Login}", ENDITEM,
				"Name=password", "Value={User_Pass}", ENDITEM,
				"Name=JSFormSubmit", "Value=off", ENDITEM,
				"Name=login.x", "Value=60", ENDITEM,
				"Name=login.y", "Value=9", ENDITEM,
				LAST);			
		lr_end_transaction("login_user",LR_AUTO);
	
		//SLA 5 секунд ожидание действи€ пользовател€
		lr_think_time(5);			
			
		lr_start_transaction("goto_Flight");		
			
			//ѕроверка соответсви€ на корректность загрузки страницы
			web_reg_find("Text=Find Flight",
			LAST);
			
			web_url("welcome.pl", 
				"URL=http://localhost:1080/cgi-bin/welcome.pl?page=search", 
				"TargetFrame=", 
				"Resource=0", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home", 
				"Snapshot=t12.inf", 
				"Mode=HTML", 
				LAST);
			
		lr_end_transaction("goto_Flight",LR_AUTO);
		
		//SLA 26 секунд на ввод всех данных в форму на странице
		lr_think_time(5);
	
		lr_start_transaction("goto_Itinerary");	

			//ѕроверка соответсви€ на корректность загрузки страницы
			web_reg_find("Fail=Found",
				"Text=No flights have been reserved",
				"SaveCount=erroMess",
				LAST);
						
			web_reg_save_param_ex(
				"ParamName=flightId",
				"LB=name=\"flightID\" value=\"",
				"RB=-",
				"Ordinal=ALL",
				SEARCH_FILTERS,
				LAST);		
			
			web_url("Itinerary Button", 
				"URL=http://localhost:1080/cgi-bin/welcome.pl?page=itinerary", 
				"TargetFrame=body", 
				"Resource=0", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home", 
				"Snapshot=t3.inf", 
				"Mode=HTML", 
				LAST);			
						
		lr_end_transaction("goto_Itinerary", LR_AUTO);	
					
		//SLA 15 секунд ожидание действий пользовател€
		lr_think_time(5);
		
		lr_start_transaction("Delete_first");
		
			if (atoi(lr_eval_string("{flightId_count}")) == 0){
				lr_error_message("No flight to delete");		
			}else {			
		
				lr_save_string(lr_eval_string("{flightId_1}"),
	    			"cancelflight");
				
				web_reg_find("Text={cancelflight}",
			             "SaveCount=cancelflight_Count",
					LAST);														
					
				if(atoi(lr_eval_string("{cancelflight_Count}")) > 0){
														
					lr_error_message(lr_eval_string("User - {User_Login}; "
				                                "cancelflight_Count - {cancelflight_Count}; "
				                                "flightId_count - {flightId_count};"));
				}
			
				web_submit_form("itinerary.pl",
			        "Snapshot=t10.inf", 
			        ITEMDATA, 
			        "Name=1", "Value=on", ENDITEM,         
			        "Name=removeFlights.x", "Value=73", ENDITEM, 
			        "Name=removeFlights.y", "Value=15", ENDITEM, 
			        LAST);			
			}
		lr_end_transaction("Delete_first", LR_AUTO);	
		
		//SLA 15 секунд ожидание действий пользовател€
		lr_think_time(5);
		
		lr_start_transaction("goto_home");
			//ѕроверка соответсви€ на корректность загрузки страницы
			web_reg_find("Text=Welcome, <b>{User_Login}</b>, to the Web Tours reservation pages.",
				LAST);	
			
			web_url("welcome.pl", 
				"URL=http://localhost:1080/cgi-bin/welcome.pl?page=menus", 
				"TargetFrame=", 
				"Resource=0", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home", 
				"Snapshot=t16.inf", 
				"Mode=HTML", 
				LAST);
		
		lr_end_transaction("goto_home",LR_AUTO);
				
		//SLA 15 секунд ожидание действий пользовател€
		lr_think_time(7);
		
	lr_end_transaction("03_Search_itinerary_delete", LR_AUTO);


	return 0;
}