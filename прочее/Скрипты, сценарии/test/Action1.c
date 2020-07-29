Action1()
{
int flightId_Count = 0;
int flightId_afterDelete_count = 0;
/*Correlation comment - Do not change!  Original value='129207.744511948zztzVcDpDfiDDDDDDQiHzpHtAVf' Name ='userSession' Type ='ResponseBased'*/
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

	web_url("WebTours", 
		"URL=http://localhost:1080/WebTours/", 
		"TargetFrame=", 
		"Resource=0", 
		"RecContentType=text/html", 
		"Referer=", 
		"Snapshot=t1.inf", 
		"Mode=HTML", 
		LAST);

	lr_think_time(7);

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
		"Name=username", "Value=jojo", ENDITEM,
		"Name=password", "Value=bean", ENDITEM,
		"Name=JSFormSubmit", "Value=off", ENDITEM,
		"Name=login.x", "Value=0", ENDITEM,
		"Name=login.y", "Value=0", ENDITEM,
		LAST);

	//Проверка соответсвия на корректность загрузки страницы
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
	
	lr_output_message(lr_eval_string("{flightId_count}"));
	flightId_Count = atoi(lr_eval_string("{flightId_count}"));
	if (flightId_Count = 0){
		lr_error_message("No flight to delete");				
	}else {
		
		//Проверка соответсвия на корректность загрузки страницы
		web_reg_save_param_ex(
			"ParamName=flightId_afterDelete",
			"LB=name=\"flightID\" value=\"",
			"RB=\"  />",
			"Ordinal=ALL",
			SEARCH_FILTERS,
			LAST);
					
			web_submit_data("itinerary.pl_2", 
				"Action=http://localhost:1080/cgi-bin/itinerary.pl", 
				"Method=POST", 
				"TargetFrame=", 
				"RecContentType=text/html", 
				"Referer=http://localhost:1080/cgi-bin/itinerary.pl", 
				"Snapshot=t12.inf", 
				"Mode=HTML", 
				ITEMDATA, 
				"Name=1", "Value=on", ENDITEM, 
				"Name=flightID", "Value={flightId_1}", ENDITEM, 
				"Name=.cgifields", "Value=1", ENDITEM, 
				"Name=removeFlights.x", "Value=44", ENDITEM, 
				"Name=removeFlights.y", "Value=6", ENDITEM, 
				LAST);
		
		lr_output_message(lr_eval_string("{flightId_afterDelete_count}"));
		
		flightId_afterDelete_count = atoi(lr_eval_string("{flightId_afterDelete_count}"));
		
		if (flightId_afterDelete_count >= flightId_Count){
			lr_error_message("Flight don`t delete");				
		}else {
			lr_output_message("First flight delete");			
		}
			
	}

	

	return 0;
}