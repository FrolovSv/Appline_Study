Action()
{
	int flightId_Count = 0;
	lr_start_transaction("02_Search_itinerary");
	
	lr_start_transaction("Load_start_Page");
	
			/*Correlation comment - Do not change!  Original value='129182.290643985zzttiVtpAHfDQizipiittf' Name ='userSession' Type ='ResponseBased'*/
			web_reg_save_param_attrib(
				"ParamName=userSession",
				"TagName=input",
				"Extract=value",
				"Name=userSession",
				"Type=hidden",
				SEARCH_FILTERS,
				"IgnoreRedirections=No",
				"RequestUrl=*/nav.pl*",
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
			
		//ѕроверка соответсви€ на корректность загрузки страницы
		web_reg_find("Text=User password was correct", LAST);
	
		lr_start_transaction("login user");		
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
			web_set_sockets_option("SSL_VERSION", "AUTO");	
		lr_end_transaction("login user",LR_AUTO);
	
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
		lr_think_time(26);
	
		lr_start_transaction("Entry_Data_Flight");
		
			//ѕроверка соответсви€ на корректность загрузки страницы
			web_reg_find("Text=Flight departing from <B>{depart}</B> to <B>{arrive}</B>",
				LAST);
			if (lr_eval_string("{roundtrip}")=="on"){
				web_reg_find("Text=Flight departing from <B>{arrive}</B> to <B>{depart}</B>",
					LAST);
		    }
			
			web_submit_data("reservations.pl", 
				"Action=http://localhost:1080/cgi-bin/reservations.pl", 
				"Method=POST", 
				"TargetFrame=", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/reservations.pl?page=welcome", 
				"Snapshot=t13.inf", 
				"Mode=HTML", 
				ITEMDATA, 
				"Name=advanceDiscount", "Value=0", ENDITEM, 
				"Name=depart", "Value={depart}", ENDITEM, 
				"Name=departDate", "Value={departDate}", ENDITEM, 
				"Name=arrive", "Value={arrive}", ENDITEM, 
				"Name=returnDate", "Value={returnDate}", ENDITEM, 
				"Name=numPassengers", "Value={numPassengers}", ENDITEM, 
				"Name=roundtrip", "Value={roundtrip}", ENDITEM, 
				"Name=seatPref", "Value={seatPref}", ENDITEM, 
				"Name=seatType", "Value={seatType}", ENDITEM, 
				"Name=.cgifields", "Value=roundtrip", ENDITEM, 
				"Name=.cgifields", "Value=seatType", ENDITEM, 
				"Name=.cgifields", "Value=seatPref", ENDITEM, 
				"Name=findFlights.x", "Value=52", ENDITEM, 
				"Name=findFlights.y", "Value=10", ENDITEM, 
				LAST);
				
		lr_end_transaction("Entry_Data_Flight",LR_AUTO);
		
		//SLA 15 секунд ожидание действий пользовател€
		lr_think_time(15);
	
		lr_start_transaction("goto_Itinerary");	

			//ѕроверка соответсви€ на корректность загрузки страницы
			web_reg_find("Fail=Found",
				"Text=No flights have been reserved",
				"SaveCount=erroMess",
				LAST);
						
			web_reg_save_param_ex(
				"ParamName=flightId",
				"LB=name=\"flightID\" value=\"",
				"RB=\"  />",
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
		lr_think_time(10);

		
		if (atoi(lr_eval_string("{flightId_count}")) == 0){
			lr_error_message("No flight to delete");		
		}else {
			
			lr_start_transaction("Delete_first");
		
				//lr_output_message("Flight to delete");
			    
				web_reg_find("Search=Body",
			        "SaveCount=Count_Flights",
			        "Text=A Coach class ticket for ",
			        LAST);
				
				web_submit_form("itinerary.pl",
			        "Snapshot=t10.inf", 
			        ITEMDATA, 
			        "Name=1", "Value=on", ENDITEM,         
			        "Name=removeFlights.x", "Value=73", ENDITEM, 
			        "Name=removeFlights.y", "Value=15", ENDITEM, 
			        LAST);
				
				if (atoi(lr_eval_string("{Count_Flights}")) < atoi(lr_eval_string("{flightId_count}"))){
					lr_output_message("Delete first flight  was successful");
				}else{
					lr_error_message("flight ticket did not retire");					
				}
			
			lr_end_transaction("Delete_first", LR_AUTO);
			
		}
		
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
		
		
		
		lr_start_transaction("Logout");
		
		//ѕроверка соответсви€ на корректность загрузки страницы
		web_reg_find("Text=To make reservations,please enter your account information to the left.",
			LAST);
		
			web_url("welcome.pl",
				"URL=http://localhost:1080/cgi-bin/welcome.pl?signOff=1", 
				"TargetFrame=", 
				"Resource=0", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/nav.pl?page=menu&in=home", 
				"Snapshot=t9.inf", 
				"Mode=HTML", 
				LAST);
		lr_end_transaction("Logout", LR_AUTO);
		
	lr_end_transaction("02_Search_itinerary", LR_AUTO);


	return 0;
}